import React, { useEffect, useState } from 'react';
import { apiService } from '../api/client';
import type { EvaluationResult } from '../types';
import { StatCard } from '../components/common/StatCard';
import { BarChart2, Download, Play, ShieldCheck, Layers, Compass, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';

export const EvaluationPage: React.FC = () => {
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);
  const [activeEval, setActiveEval] = useState<EvaluationResult | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    apiService.getEvaluations().then((data) => {
      setEvaluations(data);
      if (data.length > 0) setActiveEval(data[0]);
    });
  }, []);

  const handleRunEvaluation = async () => {
    setRunning(true);
    try {
      const result = await apiService.runEvaluation('Middlebury Benchmark Run', 'Middlebury Crowd Benchmark', 0.35);
      setEvaluations([result, ...evaluations]);
      setActiveEval(result);
      setRunning(false);
    } catch (e) {
      setRunning(false);
      alert('Failed to run benchmark evaluation');
    }
  };

  const handleExportCSV = () => {
    if (!activeEval) return;
    const csvContent = `Metric,Value
Sample Count,${activeEval.sample_count}
Precision,${activeEval.precision}
Recall,${activeEval.recall}
F1 Score,${activeEval.f1_score}
mAP@50,${activeEval.map_50}
mAP@50:95,${activeEval.map_50_95}
Count MAE,${activeEval.count_mae}
Count RMSE,${activeEval.count_rmse}
Depth MAE (m),${activeEval.depth_mae || 'N/A'}
Depth RMSE (m),${activeEval.depth_rmse || 'N/A'}
Depth AbsRel,${activeEval.depth_abs_rel || 'N/A'}
`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `evaluation_${activeEval.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-cyan-400" />
            <span>Quantitative System Evaluation</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Empirical benchmark evaluation of person detection, crowd counting, and stereo depth triangulation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunEvaluation}
            disabled={running}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-dark-900 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-dark-900" />}
            <span>Run Benchmark</span>
          </button>
          {activeEval && (
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {activeEval && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard label="Precision" value={activeEval.precision.toFixed(3)} icon={<ShieldCheck className="w-4 h-4" />} />
            <StatCard label="Recall" value={activeEval.recall.toFixed(3)} icon={<ShieldCheck className="w-4 h-4" />} />
            <StatCard label="F1 Score" value={activeEval.f1_score.toFixed(3)} icon={<ShieldCheck className="w-4 h-4" />} />
            <StatCard label="mAP@50" value={activeEval.map_50.toFixed(3)} icon={<BarChart2 className="w-4 h-4" />} />
            <StatCard label="Count MAE" value={activeEval.count_mae} subtext={`RMSE: ${activeEval.count_rmse}`} icon={<Layers className="w-4 h-4" />} />
            <StatCard label="Depth MAE" value={activeEval.depth_mae ? `${activeEval.depth_mae}m` : 'N/A'} subtext={`AbsRel: ${activeEval.depth_abs_rel || 'N/A'}`} icon={<Compass className="w-4 h-4" />} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="tech-card rounded-xl p-4 border border-slate-800 flex flex-col h-[280px]">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
                Precision-Recall Curve (AP@50)
              </div>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activeEval.chart_data?.pr_curve || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="recall" stroke="#94a3b8" fontSize={11} label={{ value: 'Recall', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                    <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 1]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="precision" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#38bdf8' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="tech-card rounded-xl p-4 border border-slate-800 flex flex-col h-[280px]">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
                Predicted Count vs Ground Truth Count
              </div>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeEval.chart_data?.count_comparison || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="sample" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                    <Bar dataKey="predicted" fill="#06b6d4" name="Predicted" />
                    <Bar dataKey="ground_truth" fill="#10b981" name="Ground Truth" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
