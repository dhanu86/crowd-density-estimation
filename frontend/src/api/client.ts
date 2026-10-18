import axios from 'axios';
import type { AnalysisDetail, CalibrationProfile, EvaluationResult, PointCloudData } from '../types';

const api = axios.create({
  baseURL: '/api',
});

export const apiService = {
  checkHealth: async () => {
    const res = await api.get('/health');
    return res.data;
  },

  createAnalysis: async (formData: FormData) => {
    const res = await api.post('/analysis', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  processAnalysis: async (id: string, confThreshold = 0.35, minDisp = 0, numDisp = 64) => {
    const res = await api.post(`/analysis/${id}/process?conf_threshold=${confThreshold}&min_disparity=${minDisp}&num_disparities=${numDisp}`);
    return res.data;
  },

  getAnalysisDetail: async (id: string): Promise<AnalysisDetail> => {
    const res = await api.get(`/analysis/${id}`);
    return res.data;
  },

  getPointCloud: async (id: string): Promise<PointCloudData> => {
    const res = await api.get(`/analysis/${id}/point-cloud`);
    return res.data;
  },

  getHistory: async () => {
    const res = await api.get('/history');
    return res.data;
  },

  deleteHistoryItem: async (id: string) => {
    const res = await api.delete(`/history/${id}`);
    return res.data;
  },

  getCalibrations: async (): Promise<CalibrationProfile[]> => {
    const res = await api.get('/calibration');
    return res.data;
  },

  createCalibration: async (profile: Partial<CalibrationProfile>) => {
    const res = await api.post('/calibration', profile);
    return res.data;
  },

  getEvaluations: async (): Promise<EvaluationResult[]> => {
    const res = await api.get('/evaluation');
    return res.data;
  },

  runEvaluation: async (name: string, datasetName: string, confThreshold = 0.35) => {
    const res = await api.post('/evaluation', {
      name,
      dataset_name: datasetName,
      conf_threshold: confThreshold,
    });
    return res.data;
  },
};
