import React, { useEffect, useState } from 'react';
import { apiService } from '../api/client';
import { History, Trash2, ArrowRight } from 'lucide-react';

interface HistoryPageProps {
  onNavigate: (tab: string, id?: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    setLoading(true);
    apiService.getHistory().then((data) => {
      setHistory(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm(`Delete analysis record #${id}?`)) {
      await apiService.deleteHistoryItem(id);
      fetchHistory();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <span>Analysis History & Saved Runs</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete database audit log of stereovision crowd analytics runs.
          </p>
        </div>
      </div>

      <div className="tech-card rounded-xl border border-slate-800 p-4">
        {loading ? (
          <div className="text-center py-8 text-xs font-mono text-slate-400">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">No saved analysis records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-slate-400 uppercase bg-dark-900/60 border-b border-slate-800">
                <tr>
                  <th className="p-3">Analysis ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created At</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-slate-200">{item.id}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                        item.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{new Date(item.created_at).toLocaleString()}</td>
                    <td className="p-3 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => onNavigate('results', item.id)}
                        className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs border border-slate-700 flex items-center gap-1"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
