import React, { useEffect, useState } from 'react';
import { apiService } from '../api/client';
import type { AnalysisDetail, PointCloudData } from '../types';
import { Scene3DViewer } from '../components/visualizers/Scene3DViewer';
import { Box, ArrowLeft } from 'lucide-react';

interface View3DPageProps {
  analysisId: string;
  onNavigate: (tab: string, id?: string) => void;
}

export const View3DPage: React.FC<View3DPageProps> = ({ analysisId, onNavigate }) => {
  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [pointCloud, setPointCloud] = useState<PointCloudData | null>(null);
  const [selectedDetectionId, setSelectedDetectionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!analysisId) return;

    Promise.all([
      apiService.getAnalysisDetail(analysisId),
      apiService.getPointCloud(analysisId).catch(() => null),
    ]).then(([det, pc]) => {
      setAnalysis(det);
      setPointCloud(pc);
      setLoading(false);
    });
  }, [analysisId]);

  if (loading || !analysis) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xs font-mono text-slate-400">Loading 3D Point Cloud Scene...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('results', analysisId)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Box className="w-5 h-5 text-cyan-400" />
              <span>Full-Screen 3D Reconstructed Scene</span>
            </h1>
            <div className="text-xs font-mono text-slate-400">
              Analysis #{analysis.id.slice(0, 8)} • {analysis.person_count} Detected People
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden border border-slate-800">
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
    </div>
  );
};
