import React, { useEffect, useState } from 'react';
import { apiService } from '../api/client';
import { StatCard } from '../components/common/StatCard';
import { 
  Users, 
  Activity, 
  Layers, 
  Play, 
  BarChart2, 
  ArrowRight, 
  Box,
  Compass
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (tab: string, id?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getHistory().then((data) => {
      setHistory(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalAnalyses = history.length;
  const completedAnalyses = history.filter((h) => h.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="tech-card rounded-2xl p-6 relative overflow-hidden bg-gradient-to-r from-dark-800 via-dark-800 to-cyan-950/30 border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Stereovision Computer-Vision System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight mb-2">
            3D Crowd Analytics & Spatial Density Engine
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Synchronized stereo depth estimation, 3D person localization, physical ground-plane density analysis (people/m²), and DBSCAN spatial clustering.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => onNavigate('analyze')}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-dark-900 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-dark-900" />
              <span>Start New Analysis</span>
            </button>
            <button
              onClick={() => onNavigate('evaluation')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center gap-2 border border-slate-700"
            >
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>Run Model Evaluation</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Processed Analyses"
          value={totalAnalyses}
          subtext={`${completedAnalyses.length} Completed successfully`}
          icon={<Layers className="w-5 h-5" />}
        />
        <StatCard
          label="Stereo Calibration Rig"
          value="ZED 2i Rig"
          subtext="f = 700px, B = 0.12m"
          icon={<Compass className="w-5 h-5" />}
          badge={{ text: 'Metric', variant: 'info' }}
          tooltipText="Metric depth calibration parameters applied."
        />
        <StatCard
          label="YOLO Object Detector"
          value="YOLOv8n"
          subtext="Class 0 Person Filtering"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          label="Stereo Matching Engine"
          value="StereoSGBM"
          subtext="Sub-pixel Disparity & Z Depth"
          icon={<Box className="w-5 h-5" />}
        />
      </div>

      <div className="tech-card rounded-xl p-5 border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Recent Analyses</h2>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-400 text-xs font-mono">Loading analyses...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <div className="text-slate-400 text-sm">No analysis runs recorded yet.</div>
            <button
              onClick={() => onNavigate('analyze')}
              className="px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/20"
            >
              Run First Analysis
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase font-mono bg-dark-900/60 border-b border-slate-800">
                <tr>
                  <th className="p-3">Analysis Title / ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono font-medium text-slate-200">{item.id.slice(0, 18)}...</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${
                        item.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : item.status === 'processing'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 animate-pulse'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-400">{new Date(item.created_at).toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onNavigate('results', item.id)}
                        className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-xs border border-slate-700"
                      >
                        View Results
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
