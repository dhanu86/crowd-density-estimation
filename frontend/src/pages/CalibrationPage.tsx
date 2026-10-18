import React, { useEffect, useState } from 'react';
import { apiService } from '../api/client';
import type { CalibrationProfile } from '../types';
import { Camera, CheckCircle, Plus } from 'lucide-react';

export const CalibrationPage: React.FC = () => {
  const [profiles, setProfiles] = useState<CalibrationProfile[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('Custom Stereo Camera Rig');
  const [fx, setFx] = useState(700.0);
  const [fy, setFy] = useState(700.0);
  const [baseline, setBaseline] = useState(0.12);
  const [cx, setCx] = useState(640.0);
  const [cy, setCy] = useState(360.0);

  useEffect(() => {
    apiService.getCalibrations().then(setProfiles);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiService.createCalibration({
      name,
      focal_length_x: fx,
      focal_length_y: fy,
      baseline_meters: baseline,
      principal_point_x: cx,
      principal_point_y: cy,
      is_metric_calibrated: true,
      description: 'Custom user defined calibration parameters'
    });
    setShowForm(false);
    const updated = await apiService.getCalibrations();
    setProfiles(updated);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-5 h-5 text-cyan-400" />
            <span>Stereo Camera Calibration Profiles</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure focal lengths, baseline, principal point, and intrinsics for metric depth calculation.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-dark-900 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Rig Profile</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="tech-card rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">Add Stereo Calibration Profile</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Profile Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-dark-900 border border-slate-700 rounded p-2 text-slate-200"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Baseline B (meters)</label>
              <input
                type="number"
                step="0.001"
                value={baseline}
                onChange={(e) => setBaseline(Number(e.target.value))}
                className="w-full bg-dark-900 border border-slate-700 rounded p-2 text-slate-200"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Focal Length fx (pixels)</label>
              <input
                type="number"
                value={fx}
                onChange={(e) => setFx(Number(e.target.value))}
                className="w-full bg-dark-900 border border-slate-700 rounded p-2 text-slate-200"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Focal Length fy (pixels)</label>
              <input
                type="number"
                value={fy}
                onChange={(e) => setFy(Number(e.target.value))}
                className="w-full bg-dark-900 border border-slate-700 rounded p-2 text-slate-200"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Principal Point cx (px)</label>
              <input
                type="number"
                value={cx}
                onChange={(e) => setCx(Number(e.target.value))}
                className="w-full bg-dark-900 border border-slate-700 rounded p-2 text-slate-200"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Principal Point cy (px)</label>
              <input
                type="number"
                value={cy}
                onChange={(e) => setCy(Number(e.target.value))}
                className="w-full bg-dark-900 border border-slate-700 rounded p-2 text-slate-200"
                required
              />
            </div>
          </div>
          <button type="submit" className="px-4 py-2 bg-cyan-500 text-dark-900 font-bold rounded text-xs">
            Save Profile
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((p) => (
          <div key={p.id} className="tech-card rounded-xl p-4 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="font-bold text-slate-100 flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>{p.name}</span>
              </div>
              <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Calibrated</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div>Focal Length: <span className="text-cyan-400">{p.focal_length_x} px</span></div>
              <div>Baseline: <span className="text-cyan-400">{p.baseline_meters} m ({p.baseline_meters * 1000} mm)</span></div>
              <div>Principal Point: <span className="text-slate-400">({p.principal_point_x}, {p.principal_point_y})</span></div>
              <div>Status: <span className="text-emerald-400">Metric Active</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
