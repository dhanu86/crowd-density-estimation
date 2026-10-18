import React, { useState } from 'react';
import type { Detection } from '../../types';
import { Layers, Eye, Zap, Image as ImageIcon } from 'lucide-react';

interface Image2DViewerProps {
  leftImageUrl: string;
  heatmapUrl?: string | null;
  depthMapUrl?: string | null;
  detections: Detection[];
  selectedDetectionId: number | null;
  onSelectDetection: (id: number | null) => void;
  imageWidth?: number | null;
  imageHeight?: number | null;
}

export const Image2DViewer: React.FC<Image2DViewerProps> = ({
  leftImageUrl,
  heatmapUrl,
  depthMapUrl,
  detections,
  selectedDetectionId,
  onSelectDetection,
  imageWidth = 1280,
  imageHeight = 720,
}) => {
  const [viewMode, setViewMode] = useState<'detections' | 'heatmap' | 'depth' | 'original'>('detections');
  const [showLabels, setShowLabels] = useState(true);

  const w = imageWidth || 1280;
  const h = imageHeight || 720;

  const currentImgUrl = () => {
    switch (viewMode) {
      case 'heatmap':
        return heatmapUrl || leftImageUrl;
      case 'depth':
        return depthMapUrl || leftImageUrl;
      default:
        return leftImageUrl;
    }
  };

  return (
    <div className="tech-card rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-3 bg-dark-800/80 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">2D Spatial View</span>
          <span className="text-xs font-mono text-slate-400">({detections.length} Detected)</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('detections')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
              viewMode === 'detections' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Detections</span>
          </button>
          {heatmapUrl && (
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
                viewMode === 'heatmap' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Heatmap</span>
            </button>
          )}
          {depthMapUrl && (
            <button
              onClick={() => setViewMode('depth')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
                viewMode === 'depth' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Depth Map</span>
            </button>
          )}
          <button
            onClick={() => setViewMode('original')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
              viewMode === 'original' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>RGB</span>
          </button>
        </div>
      </div>

      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[360px]">
        <img
          src={currentImgUrl()}
          alt="2D View"
          className="max-h-[500px] w-full object-contain select-none"
        />

        {viewMode === 'detections' && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {detections.map((det) => {
              const isSelected = selectedDetectionId === det.id;
              const { x1, y1, x2, y2 } = det.bbox;
              const boxW = x2 - x1;
              const boxH = y2 - y1;

              let borderColor = '#06b6d4';
              if (det.depth_status === 'VALID') borderColor = '#10b981';
              else if (det.depth_status === 'PARTIAL') borderColor = '#f59e0b';
              else if (det.depth_status === 'UNRELIABLE') borderColor = '#f43f5e';

              if (isSelected) borderColor = '#38bdf8';

              return (
                <g
                  key={det.id}
                  className="pointer-events-auto cursor-pointer group"
                  onClick={() => onSelectDetection(isSelected ? null : det.id)}
                >
                  <rect
                    x={x1}
                    y={y1}
                    width={boxW}
                    height={boxH}
                    fill={isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(6, 182, 212, 0.08)'}
                    stroke={borderColor}
                    strokeWidth={isSelected ? 3 : 2}
                    strokeDasharray={det.depth_status === 'UNRELIABLE' ? '4 2' : 'none'}
                    rx={3}
                  />

                  <circle
                    cx={det.center_u}
                    cy={det.center_v}
                    r={isSelected ? 5 : 3}
                    fill={borderColor}
                  />

                  {showLabels && (
                    <g transform={`translate(${x1}, ${Math.max(16, y1 - 4)})`}>
                      <rect
                        x={0}
                        y={-14}
                        width={Math.max(65, (det.depth_m ? `${det.depth_m}m` : 'Unk').length * 8 + 40)}
                        height={16}
                        fill="rgba(15, 23, 42, 0.85)"
                        rx={3}
                        stroke={borderColor}
                        strokeWidth={1}
                      />
                      <text
                        x={4}
                        y={-2}
                        fill="#f8fafc"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        #{det.detection_idx} {det.depth_m ? `${det.depth_m}m` : ''}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        )}
      </div>

      <div className="p-2.5 bg-dark-800/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Valid Depth</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Partial Depth</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Unreliable</span>
          </span>
        </div>
        <button
          onClick={() => setShowLabels(!showLabels)}
          className="text-xs text-slate-400 hover:text-cyan-400 underline font-mono"
        >
          {showLabels ? 'Hide Labels' : 'Show Labels'}
        </button>
      </div>
    </div>
  );
};
