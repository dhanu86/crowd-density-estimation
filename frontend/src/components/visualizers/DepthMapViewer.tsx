import React from 'react';
import { Layers } from 'lucide-react';

interface DepthMapViewerProps {
  disparityUrl?: string | null;
  depthUrl?: string | null;
  minDepth?: number | null;
  maxDepth?: number | null;
}

export const DepthMapViewer: React.FC<DepthMapViewerProps> = ({
  disparityUrl,
  depthUrl,
  minDepth,
  maxDepth,
}) => {
  return (
    <div className="tech-card rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Stereo Disparity & Depth Estimation
          </span>
        </div>
        <div className="text-xs font-mono text-cyan-400">
          Z = (f · B) / d
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Disparity View */}
        <div className="bg-dark-900 rounded-lg p-2 border border-slate-800 flex flex-col">
          <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center justify-between">
            <span>DISPARITY MAP (SGBM)</span>
            <span className="text-cyan-400">Higher d → Closer</span>
          </div>
          <div className="flex-1 flex items-center justify-center bg-black rounded overflow-hidden min-h-[180px]">
            {disparityUrl ? (
              <img src={disparityUrl} alt="Disparity Map" className="w-full h-auto object-contain max-h-[220px]" />
            ) : (
              <span className="text-xs text-slate-500">Disparity map not available</span>
            )}
          </div>
        </div>

        {/* Depth View */}
        <div className="bg-dark-900 rounded-lg p-2 border border-slate-800 flex flex-col">
          <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center justify-between">
            <span>METRIC DEPTH MAP (VIRIDIS)</span>
            <span className="text-emerald-400">
              {minDepth && maxDepth ? `${minDepth}m - ${maxDepth}m` : 'Metric Calibrated'}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center bg-black rounded overflow-hidden min-h-[180px]">
            {depthUrl ? (
              <img src={depthUrl} alt="Metric Depth Map" className="w-full h-auto object-contain max-h-[220px]" />
            ) : (
              <span className="text-xs text-slate-500">Depth map not available</span>
            )}
          </div>
        </div>
      </div>

      {/* Colorbar Indicator */}
      <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-xs">
        <span className="text-slate-400 text-[11px] font-mono">Distance Scale:</span>
        <div className="flex-1 mx-4 h-3 rounded bg-gradient-to-r from-yellow-400 via-emerald-500 to-purple-900 border border-slate-700" />
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span className="text-yellow-400 font-bold">Near (0.5m)</span>
          <span className="text-purple-400 font-bold">Far (15.0m+)</span>
        </div>
      </div>
    </div>
  );
};
