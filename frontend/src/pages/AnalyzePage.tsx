import React, { useState, useEffect } from 'react';
import { apiService } from '../api/client';
import type { CalibrationProfile } from '../types';
import { 
  Upload, 
  Play, 
  Layers, 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles,
  Loader2 
} from 'lucide-react';

interface AnalyzePageProps {
  onNavigate: (tab: string, id?: string) => void;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ onNavigate }) => {
  const [leftFile, setLeftFile] = useState<File | null>(null);
  const [rightFile, setRightFile] = useState<File | null>(null);
  const [depthFile, setDepthFile] = useState<File | null>(null);
  
  const [useSample, setUseSample] = useState(true);
  const [samplePreset, setSamplePreset] = useState<'moderate' | 'high' | 'sparse'>('moderate');
  
  const [calibrations, setCalibrations] = useState<CalibrationProfile[]>([]);
  const [selectedCalibId, setSelectedCalibId] = useState<number | undefined>(undefined);
  
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    apiService.getCalibrations().then((data) => {
      setCalibrations(data);
      if (data.length > 0) setSelectedCalibId(data[0].id);
    });
  }, []);

  const handleStartAnalysis = async () => {
    setProcessing(true);
    setStatusMessage('Uploading stereo pair and initializing task...');

    try {
      const formData = new FormData();
      formData.append('title', useSample ? `Stereo Analysis (${samplePreset.toUpperCase()} Crowd)` : 'Custom Stereo Pair Analysis');
      
      if (selectedCalibId) {
        formData.append('calibration_id', selectedCalibId.toString());
      }

      if (useSample) {
        formData.append('use_sample_stereo', 'true');
        formData.append('sample_preset', samplePreset);
      } else {
        if (leftFile) formData.append('left_image', leftFile);
        if (rightFile) formData.append('right_image', rightFile);
        if (depthFile) formData.append('precomputed_depth', depthFile);
      }

      const createRes = await apiService.createAnalysis(formData);
      const analysisId = createRes.id;

      setStatusMessage('Executing StereoSGBM & YOLO pipeline...');
      await apiService.processAnalysis(analysisId);

      const pollInterval = setInterval(async () => {
        try {
          const detail = await apiService.getAnalysisDetail(analysisId);
          if (detail.status === 'completed') {
            clearInterval(pollInterval);
            setProcessing(false);
            onNavigate('results', analysisId);
          } else if (detail.status === 'failed') {
            clearInterval(pollInterval);
            setProcessing(false);
            alert(`Analysis Failed: ${detail.error_message}`);
          }
        } catch (e) {
          // keep polling
        }
      }, 1200);

    } catch (err: any) {
      setProcessing(false);
      alert(`Error initializing analysis: ${err.message || err}`);
    }
  };

  const activeCalib = calibrations.find((c) => c.id === selectedCalibId);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Stereo Analysis Pipeline</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Input synchronized left/right stereo pair or precomputed depth map for 3D localization & spatial crowd density.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-slate-800 pb-2">
        <button
          onClick={() => setUseSample(true)}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            useSample ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Use Synthetic Stereo Preset Dataset</span>
        </button>
        <button
          onClick={() => setUseSample(false)}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            !useSample ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Custom Stereo Pair</span>
        </button>
      </div>

      {useSample ? (
        <div className="tech-card rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Select Stereo Scene Crowd Density
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['moderate', 'high', 'sparse'] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setSamplePreset(preset)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  samplePreset === preset
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-slate-100 shadow-md shadow-cyan-500/10'
                    : 'bg-dark-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold uppercase tracking-wider text-xs text-cyan-400 mb-1">
                  {preset} Crowd
                </div>
                <div className="text-[11px] text-slate-400">
                  {preset === 'moderate' && '8 People synchronized stereo pair (700px fx, 120mm B)'}
                  {preset === 'high' && '18 People dense concourse crowd scene'}
                  {preset === 'sparse' && '3 People sparse walkway pedestrian scene'}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="tech-card rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between">
              <span>LEFT RGB IMAGE</span>
              <span className="text-cyan-400 text-[11px]">Primary View</span>
            </div>
            <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-dark-900/50 min-h-[160px]">
              <Upload className="w-6 h-6 text-cyan-400 mb-2" />
              <span className="text-xs text-slate-300 font-medium">
                {leftFile ? leftFile.name : 'Select Left RGB Image File'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setLeftFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className="tech-card rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between">
              <span>RIGHT RGB IMAGE / DEPTH</span>
              <span className="text-cyan-400 text-[11px]">Stereo Pair</span>
            </div>
            <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-dark-900/50 min-h-[160px]">
              <Upload className="w-6 h-6 text-cyan-400 mb-2" />
              <span className="text-xs text-slate-300 font-medium">
                {rightFile ? rightFile.name : depthFile ? depthFile.name : 'Select Right RGB Image or Depth Map'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setRightFile(f);
                  setDepthFile(f);
                }}
              />
            </label>
          </div>
        </div>
      )}

      <div className="tech-card rounded-xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Stereo Calibration Profile
            </span>
          </div>
          {activeCalib?.is_metric_calibrated ? (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Metric Calibration Active (f={activeCalib.focal_length_x}px, B={activeCalib.baseline_meters}m)</span>
            </span>
          ) : (
            <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Metric depth unavailable: stereo calibration required.</span>
            </span>
          )}
        </div>

        <select
          value={selectedCalibId || ''}
          onChange={(e) => setSelectedCalibId(Number(e.target.value))}
          className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
        >
          {calibrations.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} — (fx={c.focal_length_x}px, baseline={c.baseline_meters}m)
            </option>
          ))}
        </select>
      </div>

      <div className="pt-2">
        <button
          onClick={handleStartAnalysis}
          disabled={processing || (!useSample && !leftFile)}
          className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
            processing || (!useSample && !leftFile)
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : 'bg-cyan-500 hover:bg-cyan-400 text-dark-900 shadow-cyan-500/20'
          }`}
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{statusMessage}</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-dark-900" />
              <span>START STEREOVISION CROWD ANALYSIS</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
