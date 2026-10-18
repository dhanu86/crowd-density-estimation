import React, { useEffect, useState } from 'react';
import { apiService } from '../api/client';
import type { AnalysisDetail, PointCloudData } from '../types';
import { StatCard } from '../components/common/StatCard';
import { Image2DViewer } from '../components/visualizers/Image2DViewer';
import { Scene3DViewer } from '../components/visualizers/Scene3DViewer';
import { DepthMapViewer } from '../components/visualizers/DepthMapViewer';
import { DepthQualityPanel } from '../components/analytics/DepthQualityPanel';
import { SpatialDistributionChart } from '../components/analytics/SpatialDistributionChart';
import { 
  Users, 
  Layers, 
  Box, 
  ShieldCheck, 
  MapPin, 
  Compass
} from 'lucide-react';

interface ResultsPageProps {
  analysisId: string;
  onNavigate: (tab: string, id?: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ analysisId, onNavigate }) => {
  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [pointCloud, setPointCloud] = useState<PointCloudData | null>(null);
  const [selectedDetectionId, setSelectedDetectionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!analysisId) return;

    Promise.all([
      apiService.getAnalysisDetail(analysisId),
      apiService.getPointCloud(analysisId).catch(() => null),
    ])
      .then(([det, pc]) => {
        setAnalysis(det);
        setPointCloud(pc);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [analysisId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Loading Stereo Crowd Results...</div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-rose-400 font-mono text-sm">Analysis #{analysisId} not found.</div>
        <button onClick={() => onNavigate('dashboard')} className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg text-xs font-semibold">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const selectedDet = analysis.detections.find((d) => d.id === selectedDetectionId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
            Analysis #{analysis.id.slice(0, 8)} • {new Date(analysis.created_at).toLocaleString()}
          </div>
          <h1 className="text-2xl font-bold text-slate-100 uppercase tracking-tight">
            {analysis.title}
          </h1>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
            <span>{analysis.crowd_status_reason || 'Stereo crowd processing completed.'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
            analysis.crowd_status_category === 'LOW'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : analysis.crowd_status_category === 'MODERATE'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}>
            Crowd Density: {analysis.crowd_status_category}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          label="People Count"
          value={analysis.person_count}
          subtext="Detected People"
          icon={<Users className="w-4 h-4" />}
          tooltipText="Primary metric: total number of person class detections."
        />
        <StatCard
          label="Detector Conf."
          value={`${(analysis.avg_detection_confidence * 100).toFixed(1)}%`}
          subtext="YOLOv8 Average"
          icon={<ShieldCheck className="w-4 h-4" />}
          tooltipText="Confidence assigned by detector. Not model accuracy."
        />
        <StatCard
          label="Depth Validity"
          value={`${(analysis.depth_validity_ratio * 100).toFixed(1)}%`}
          subtext="Valid Disparity ROI"
          icon={<Layers className="w-4 h-4" />}
          tooltipText="Ratio of valid non-zero stereo disparity pixels in ROI."
        />
        <StatCard
          label="Mean Depth"
          value={analysis.mean_depth_m ? `${analysis.mean_depth_m}m` : 'N/A'}
          subtext={`Range: ${analysis.min_depth_m || 0}m - ${analysis.max_depth_m || 0}m`}
          icon={<Compass className="w-4 h-4" />}
        />
        <StatCard
          label="Spatial Density"
          value={analysis.spatial_density_people_per_m2 ? `${analysis.spatial_density_people_per_m2} / m²` : 'N/A'}
          subtext={`Area: ${analysis.estimated_ground_area_m2 || 0} m²`}
          icon={<MapPin className="w-4 h-4" />}
          tooltipText="Estimated number of detected people per unit ground area."
        />
        <StatCard
          label="3D Clusters"
          value={analysis.clusters.length}
          subtext="DBSCAN Clusters"
          icon={<Box className="w-4 h-4" />}
          tooltipText="Spatial DBSCAN clusters based on 3D coordinates."
        />
      </div>

      {selectedDet && (
        <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center">
              #{selectedDet.detection_idx}
            </div>
            <div>
              <div className="text-slate-100 font-bold">
                Person #{selectedDet.detection_idx} (Confidence: {(selectedDet.confidence * 100).toFixed(1)}%)
              </div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                Depth Z: <span className="text-cyan-400">{selectedDet.depth_m ? `${selectedDet.depth_m}m` : 'Unk'}</span> | 
                3D Position: <span className="text-slate-200">({selectedDet.X}, {selectedDet.Y}, {selectedDet.Z}) m</span> | 
                Status: <span className="text-emerald-400">{selectedDet.depth_status}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedDetectionId(null)}
            className="text-xs text-slate-400 hover:text-slate-200 underline font-mono"
          >
            Deselect
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[440px]">
        <Image2DViewer
          leftImageUrl={analysis.left_image_url}
          heatmapUrl={analysis.heatmap_url}
          depthMapUrl={analysis.depth_map_url}
          detections={analysis.detections}
          selectedDetectionId={selectedDetectionId}
          onSelectDetection={setSelectedDetectionId}
          imageWidth={analysis.image_width}
          imageHeight={analysis.image_height}
        />
        <Scene3DViewer
          pointCloudPoints={pointCloud ? pointCloud.points : []}
          detections={analysis.detections}
          clusters={analysis.clusters}
          gridCells={analysis.density_grid}
          selectedDetectionId={selectedDetectionId}
          onSelectDetection={setSelectedDetectionId}
          groundPlaneParams={analysis.ground_plane_params}
        />
      </div>

      <DepthMapViewer
        disparityUrl={analysis.disparity_image_url}
        depthUrl={analysis.depth_map_url}
        minDepth={analysis.min_depth_m}
        maxDepth={analysis.max_depth_m}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DepthQualityPanel
          detections={analysis.detections}
          avgValidityRatio={analysis.depth_validity_ratio}
        />
        <SpatialDistributionChart detections={analysis.detections} />
      </div>

      {analysis.clusters.length > 0 && (
        <div className="tech-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
            <Box className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              DBSCAN Spatial Crowd Clusters
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-slate-400 uppercase bg-dark-900/60 border-b border-slate-800">
                <tr>
                  <th className="p-2">Cluster ID</th>
                  <th className="p-2">People Count</th>
                  <th className="p-2">Centroid (X, Y, Z)</th>
                  <th className="p-2">Spatial Spread (std)</th>
                  <th className="p-2">Avg Depth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {analysis.clusters.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40">
                    <td className="p-2 text-cyan-400 font-bold">Cluster #{c.cluster_idx}</td>
                    <td className="p-2 text-slate-200">{c.people_count} People</td>
                    <td className="p-2 text-slate-300">({c.centroid_X}, {c.centroid_Y}, {c.centroid_Z}) m</td>
                    <td className="p-2 text-slate-300">±{c.spatial_spread_m} m</td>
                    <td className="p-2 text-emerald-400">{c.avg_depth_m} m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
