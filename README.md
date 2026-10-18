# 🚀 Stereovision 3D Crowd Density Analytics System

A computer-vision and spatial computing analytics platform for **Stereo Depth Estimation**, **3D Person Localization**, **Spatial Crowd Density Heatmaps**, and **Benchmark Accuracy Evaluation**.

---

## 🌟 Key Features

- **Metric Stereo Depth Engine**: OpenCV `StereoSGBM` + baseline-focal triangulation ($Z = \frac{f \cdot B}{d}$).
- **YOLOv8 Person Detection**: Class-filtered object detection with HOG fallback for high-precision person counting.
- **3D Spatial Localization**: Projects 2D image coordinates $(u, v)$ to metric 3D coordinates $(X, Y, Z)$ using camera intrinsic matrix $(f_x, f_y, c_x, c_y)$.
- **RANSAC Ground Plane Estimation**: Automatic fitting of ground plane equations ($aX + bY + cZ + d = 0$) and ground physical area calculation ($m^2$).
- **Spatial Grid Density & 3D DBSCAN Clustering**: Calculates physical crowd density (people/$m^2$) and detects 3D crowd clusters.
- **Interactive 3D Point Cloud Visualizer**: Three.js 3D viewport rendering camera frustum, 3D person bounding boxes, and ground plane grid.
- **Scientific Evaluation Suite**: Measures mAP@50, MAE, RMSE, MAPE, and AbsRel Depth Error against Middlebury synthetic benchmarks.

---

## 📁 System Architecture

```
crowd_density/
├── backend/                  # FastAPI Python Backend
│   ├── app/
│   │   ├── api/              # REST Endpoints (analysis, calibration, evaluation, history)
│   │   ├── core/             # Configuration & Background Job Runner
│   │   ├── database/         # SQLite database & SQLAlchemy ORM models
│   │   ├── ml/               # Computer Vision & Machine Learning Algorithms
│   │   │   ├── stereo/       # StereoSGBM matching, Rectification & Triangulation
│   │   │   ├── detection/    # YOLOv8 Person Detector
│   │   │   ├── association/  # 3D Bounding Box Spatial Association
│   │   │   ├── density/      # RANSAC Ground Plane & Spatial Grid Density
│   │   │   ├── clustering/   # 3D DBSCAN Clustering
│   │   │   ├── reconstruction/# 3D Point Cloud Generator
│   │   │   └── evaluation/   # Benchmark Evaluation Engine
│   │   ├── schemas/          # Pydantic V2 DTO Schemas
│   │   └── utils/            # Synthetic Stereo Dataset & Calibration Generator
│   ├── tests/                # Pytest Test Suite (11 passing tests)
│   └── requirements.txt
│
└── frontend/                 # React + TypeScript + Vite + Tailwind CSS
    ├── src/
    │   ├── api/              # Axios API Client
    │   ├── components/       # UI Components & Three.js 3D Visualizers
    │   ├── pages/            # Dashboard, Analyze, Results, 3D View, History, Evaluation
    │   └── types/            # TypeScript Interfaces
    └── package.json
```

---

## ⚙️ Quick Start Guide

### 1. Backend Setup (Python FastAPI)

```bash
cd backend
# Activate virtual environment
.\venv\Scripts\activate

# Run Pytest suite
python -m pytest

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`

### 2. Frontend Setup (React + Vite)

```bash
cd frontend
# Install dependencies
npm install

# Start development server
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 📊 Verification & Tests

To execute full system verification:

```bash
# Backend pytest suite (11/11 tests pass)
cd backend && .\venv\Scripts\python -m pytest

# Frontend build check
cd frontend && npm run build
```

---

## 📜 License
MIT License - Built for Advanced Computer Vision & Spatial Analytics Research.
