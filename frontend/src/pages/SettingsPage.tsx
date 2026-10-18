import React, { useState } from 'react';
import { Sliders, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [confThreshold, setConfThreshold] = useState(0.35);
  const [numDisparities, setNumDisparities] = useState(64);
  const [blockSize, setBlockSize] = useState(5);
  const [cellSize, setCellSize] = useState(1.5);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>Computer Vision Pipeline Parameters</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure OpenCV StereoSGBM matching, YOLO detection thresholds, and spatial density grid parameters.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="tech-card rounded-xl p-5 border border-slate-800 space-y-6 font-mono text-xs">
        {/* YOLO settings */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1">
            YOLO Person Object Detector
          </div>
          <div>
            <label className="text-slate-300 block mb-1">
              Detection Confidence Threshold: <span className="text-cyan-400">{confThreshold}</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={confThreshold}
              onChange={(e) => setConfThreshold(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>
        </div>

        {/* OpenCV StereoSGBM settings */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1">
            OpenCV StereoSGBM Disparity Engine
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 block mb-1">numDisparities (multiple of 16)</label>
              <select
                value={numDisparities}
                onChange={(e) => setNumDisparities(Number(e.target.value))}
                className="w-full bg-dark-900 border border-slate-700 rounded p-2 text-slate-200"
              >
                <option value={32}>32 px</option>
                <option value={64}>64 px (Default)</option>
                <option value={128}>128 px</option>
                <option value={192}>192 px</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300 block mb-1">blockSize (odd window size)</label>
              <select
                value={blockSize}
                onChange={(e) => setBlockSize(Number(e.target.value))}
                className="w-full bg-dark-900 border border-slate-700 rounded p-2 text-slate-200"
              >
                <option value={3}>3 px</option>
                <option value={5}>5 px (Default)</option>
                <option value={7}>7 px</option>
                <option value={9}>9 px</option>
              </select>
            </div>
          </div>
        </div>

        {/* Spatial Density settings */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1">
            Spatial Crowd Density Grid
          </div>
          <div>
            <label className="text-slate-300 block mb-1">Spatial Grid Cell Width (meters)</label>
            <input
              type="number"
              step="0.1"
              value={cellSize}
              onChange={(e) => setCellSize(Number(e.target.value))}
              className="w-full bg-dark-900 border border-slate-700 rounded p-2 text-slate-200"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-dark-900 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved Settings</span>
            </>
          ) : (
            <span>Save Configuration</span>
          )}
        </button>
      </form>
    </div>
  );
};
