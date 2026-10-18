import React, { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Detection, SpatialGridCell, SpatialCluster } from '../../types';
import { Box, RotateCcw } from 'lucide-react';

interface Scene3DViewerProps {
  pointCloudPoints: number[][];
  detections: Detection[];
  clusters: SpatialCluster[];
  gridCells: SpatialGridCell[];
  selectedDetectionId: number | null;
  onSelectDetection: (id: number | null) => void;
  groundPlaneParams?: number[] | null;
}

const PointCloudMesh: React.FC<{ points: number[][] }> = ({ points }) => {
  const geom = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    if (points.length === 0) return geometry;

    const positions = new Float32Array(points.length * 3);
    const colors = new Float32Array(points.length * 3);

    for (let i = 0; i < points.length; i++) {
      const [x, y, z, r, g, b] = points[i];
      positions[i * 3] = x;
      positions[i * 3 + 1] = -y;
      positions[i * 3 + 2] = -z;

      colors[i * 3] = (r || 150) / 255.0;
      colors[i * 3 + 1] = (g || 150) / 255.0;
      colors[i * 3 + 2] = (b || 150) / 255.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, [points]);

  return (
    <points geometry={geom}>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.85} sizeAttenuation />
    </points>
  );
};

const Person3DMarkers: React.FC<{
  detections: Detection[];
  selectedDetectionId: number | null;
  onSelectDetection: (id: number | null) => void;
}> = ({ detections, selectedDetectionId, onSelectDetection }) => {
  return (
    <group>
      {detections.map((det) => {
        if (det.X === null || det.Y === null || det.Z === null) return null;

        const isSelected = selectedDetectionId === det.id;
        const posX = det.X;
        const posY = -det.Y;
        const posZ = -det.Z;

        let color = '#06b6d4';
        if (det.depth_status === 'VALID') color = '#10b981';
        else if (det.depth_status === 'PARTIAL') color = '#f59e0b';
        else if (det.depth_status === 'UNRELIABLE') color = '#f43f5e';

        if (isSelected) color = '#38bdf8';

        return (
          <group
            key={det.id}
            position={[posX, posY, posZ]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectDetection(isSelected ? null : det.id);
            }}
          >
            <mesh position={[0, 0.8, 0]}>
              <cylinderGeometry args={[0.2, 0.25, 1.6, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isSelected ? 0.6 : 0.2}
                transparent
                opacity={0.8}
              />
            </mesh>

            <mesh position={[0, 1.7, 0]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>

            <Html position={[0, 2.1, 0]} center distanceFactor={12}>
              <div
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap shadow-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-dark-900 border border-white scale-110'
                    : 'bg-dark-900/90 text-slate-200 border border-slate-700 hover:border-cyan-400'
                }`}
              >
                #{det.detection_idx} ({det.depth_m}m)
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

const SpatialDensityGrid: React.FC<{ gridCells: SpatialGridCell[] }> = ({ gridCells }) => {
  return (
    <group>
      {gridCells.map((cell, i) => {
        const width = cell.x_max - cell.x_min;
        const depth = cell.z_max - cell.z_min;
        const centerX = (cell.x_min + cell.x_max) / 2.0;
        const centerZ = -(cell.z_min + cell.z_max) / 2.0;

        let color = '#10b981';
        if (cell.category === 'MODERATE') color = '#f59e0b';
        else if (cell.category === 'HIGH') color = '#f97316';
        else if (cell.category === 'VERY_HIGH') color = '#ef4444';

        return (
          <group key={i} position={[centerX, -1.5, centerZ]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[width, depth]} />
              <meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} />
            </mesh>
            <lineSegments rotation={[-Math.PI / 2, 0, 0]}>
              <edgesGeometry args={[new THREE.PlaneGeometry(width, depth)]} />
              <lineBasicMaterial color={color} linewidth={2} />
            </lineSegments>
          </group>
        );
      })}
    </group>
  );
};

export const Scene3DViewer: React.FC<Scene3DViewerProps> = ({
  pointCloudPoints,
  detections,
  gridCells,
  selectedDetectionId,
  onSelectDetection,
}) => {
  const controlsRef = useRef<any>(null);

  const setCameraPreset = (view: 'perspective' | 'top' | 'front' | 'side') => {
    if (!controlsRef.current) return;

    switch (view) {
      case 'top':
        controlsRef.current.object.position.set(0, 15, 0);
        controlsRef.current.target.set(0, 0, -5);
        break;
      case 'front':
        controlsRef.current.object.position.set(0, 0, 8);
        controlsRef.current.target.set(0, 0, -5);
        break;
      case 'side':
        controlsRef.current.object.position.set(12, 0, -5);
        controlsRef.current.target.set(0, 0, -5);
        break;
      default:
        controlsRef.current.object.position.set(4, 5, 8);
        controlsRef.current.target.set(0, 0, -4);
        break;
    }
    controlsRef.current.update();
  };

  return (
    <div className="tech-card rounded-xl overflow-hidden flex flex-col h-full relative">
      <div className="p-3 bg-dark-800/80 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 z-10">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">3D Reconstructed Scene</span>
          <span className="text-xs font-mono text-slate-400">({pointCloudPoints.length} Points)</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setCameraPreset('perspective')}
            className="px-2 py-1 rounded text-slate-300 hover:text-cyan-400 font-mono text-[11px]"
          >
            Perspective
          </button>
          <button
            onClick={() => setCameraPreset('top')}
            className="px-2 py-1 rounded text-slate-300 hover:text-cyan-400 font-mono text-[11px]"
          >
            Top View
          </button>
          <button
            onClick={() => setCameraPreset('front')}
            className="px-2 py-1 rounded text-slate-300 hover:text-cyan-400 font-mono text-[11px]"
          >
            Front View
          </button>
          <button
            onClick={() => setCameraPreset('side')}
            className="px-2 py-1 rounded text-slate-300 hover:text-cyan-400 font-mono text-[11px]"
          >
            Side View
          </button>
          <button
            onClick={() => setCameraPreset('perspective')}
            className="p-1 rounded text-slate-400 hover:text-cyan-400"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-dark-900 min-h-[380px] relative">
        <Canvas camera={{ position: [4, 5, 8], fov: 55 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 15, 10]} intensity={1.2} />
          <gridHelper args={[30, 30, '#1e293b', '#0f172a']} position={[0, -1.5, -5]} />

          <mesh position={[0, 0, 0]}>
            <coneGeometry args={[0.3, 0.6, 4]} />
            <meshStandardMaterial color="#06b6d4" />
          </mesh>

          <PointCloudMesh points={pointCloudPoints} />
          <Person3DMarkers
            detections={detections}
            selectedDetectionId={selectedDetectionId}
            onSelectDetection={onSelectDetection}
          />
          <SpatialDensityGrid gridCells={gridCells} />

          <OrbitControls ref={controlsRef} target={[0, 0, -4]} makeDefault />
        </Canvas>
      </div>
    </div>
  );
};
