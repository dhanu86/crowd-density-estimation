export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Detection {
  id: number;
  detection_idx: number;
  class_id: number;
  class_name: string;
  confidence: number;
  bbox: BoundingBox;
  center_u: number;
  center_v: number;
  depth_m: number | null;
  depth_validity_ratio: number;
  depth_status: 'VALID' | 'PARTIAL' | 'UNRELIABLE';
  X: number | null;
  Y: number | null;
  Z: number | null;
  nearest_neighbour_dist_m: number | null;
  cluster_id: number | null;
}

export interface SpatialGridCell {
  x_min: number;
  x_max: number;
  z_min: number;
  z_max: number;
  count: number;
  density_people_per_m2: number;
  category: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
}

export interface SpatialCluster {
  id: number;
  cluster_idx: number;
  people_count: number;
  centroid_X: number;
  centroid_Y: number;
  centroid_Z: number;
  spatial_spread_m: number;
  avg_depth_m: number;
}

export interface CalibrationProfile {
  id: number;
  name: string;
  focal_length_x: number;
  focal_length_y: number;
  baseline_meters: number;
  principal_point_x: number;
  principal_point_y: number;
  distortion_coeffs?: number[];
  is_metric_calibrated: boolean;
  description?: string;
}

export interface AnalysisDetail {
  id: string;
  title: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  error_message?: string | null;
  
  left_image_url: string;
  right_image_url?: string | null;
  disparity_image_url?: string | null;
  depth_map_url?: string | null;
  heatmap_url?: string | null;
  rectified_left_url?: string | null;
  rectified_right_url?: string | null;
  
  image_width?: number | null;
  image_height?: number | null;
  is_metric_calibrated: boolean;
  epipolar_alignment_verified: boolean;
  calibration_info?: any;
  
  person_count: number;
  avg_detection_confidence: number;
  depth_validity_ratio: number;
  mean_depth_m?: number | null;
  median_depth_m?: number | null;
  min_depth_m?: number | null;
  max_depth_m?: number | null;
  
  estimated_ground_area_m2?: number | null;
  spatial_density_people_per_m2?: number | null;
  crowd_status_category: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  crowd_status_reason?: string | null;
  ground_plane_params?: number[] | null;
  
  detections: Detection[];
  clusters: SpatialCluster[];
  density_grid: SpatialGridCell[];
  
  created_at: string;
  completed_at?: string | null;
}

export interface PointCloudData {
  analysis_id: string;
  point_count: number;
  points: number[][]; // [x, y, z, r, g, b]
}

export interface EvaluationResult {
  id: number;
  name: string;
  dataset_name: string;
  sample_count: number;
  precision: number;
  recall: number;
  f1_score: number;
  map_50: number;
  map_50_95: number;
  count_mae: number;
  count_rmse: number;
  count_mape?: number | null;
  depth_mae?: number | null;
  depth_rmse?: number | null;
  depth_abs_rel?: number | null;
  chart_data?: any;
  created_at: string;
}
