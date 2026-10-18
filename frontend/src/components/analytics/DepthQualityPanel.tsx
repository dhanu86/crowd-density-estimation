import React from 'react';
import type { Detection } from '../../types';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { TooltipHelp } from '../common/TooltipHelp';

interface DepthQualityPanelProps {
  detections: Detection[];
  avgValidityRatio: number;
}

export const DepthQualityPanel: React.FC<DepthQualityPanelProps> = ({
  detections,
  avgValidityRatio,
}) => {
  const validCount = detections.filter((d) => d.depth_status === 'VALID').length;
  const partialCount = detections.filter((d) => d.depth_status === 'PARTIAL').length;
  const unreliableCount = detections.filter((d) => d.depth_status === 'UNRELIABLE').length;

  return (
    <div className="tech-card rounded-xl p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Depth Quality & Validity
            </span>
            <TooltipHelp
              title="Depth Quality"
              text="Ratio of valid stereo disparity pixels within each person ROI. Separate from ML object detection confidence."
            />
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {(avgValidityRatio * 100).toFixed(1)}% Mean Validity
          </span>
        </div>

        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex mb-4 border border-slate-700">
          <div
            className="bg-emerald-500 h-full transition-all"
            style={{ width: `${detections.length > 0 ? (validCount / detections.length) * 100 : 0}%` }}
            title={`Valid: ${validCount}`}
          />
          <div
            className="bg-amber-500 h-full transition-all"
            style={{ width: `${detections.length > 0 ? (partialCount / detections.length) * 100 : 0}%` }}
            title={`Partial: ${partialCount}`}
          />
          <div
            className="bg-rose-500 h-full transition-all"
            style={{ width: `${detections.length > 0 ? (unreliableCount / detections.length) * 100 : 0}%` }}
            title={`Unreliable: ${unreliableCount}`}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="bg-dark-900/80 p-2 rounded-lg border border-emerald-500/20">
            <div className="text-emerald-400 font-bold text-lg">{validCount}</div>
            <div className="text-[10px] text-slate-400 uppercase">Valid (&gt;40%)</div>
          </div>
          <div className="bg-dark-900/80 p-2 rounded-lg border border-amber-500/20">
            <div className="text-amber-400 font-bold text-lg">{partialCount}</div>
            <div className="text-[10px] text-slate-400 uppercase">Partial (15-40%)</div>
          </div>
          <div className="bg-dark-900/80 p-2 rounded-lg border border-rose-500/20">
            <div className="text-rose-400 font-bold text-lg">{unreliableCount}</div>
            <div className="text-[10px] text-slate-400 uppercase">Unreliable (&lt;15%)</div>
          </div>
        </div>
      </div>

      <div className="mt-3 text-[11px] text-slate-400 flex items-start gap-2 bg-slate-900/50 p-2 rounded border border-slate-800">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <span>
          Unreliable depth status indicates ROI occlusion or low stereo texture. 3D coordinates are excluded from physical spatial density calculations.
        </span>
      </div>
    </div>
  );
};
