# PulmoScan — AI Pulmonary Disease Detection

> A full-stack web application for chest X-ray classification using a convolutional neural network trained on 6,300+ clinical images.

**Live Demo:** [pulmoscanwebapp.vercel.app](https://pulmoscanwebapp.vercel.app)

---

## Overview

PulmoScan classifies chest X-ray images into four pulmonary conditions:

| Condition | Description |
|---|---|
| **COVID-19** | Viral pneumonia showing bilateral ground-glass opacities |
| **Pneumonia** | Bacterial/viral infection causing consolidation |
| **Tuberculosis** | Mycobacterial infection with upper-lobe infiltrates |
| **Normal** | Healthy lung fields with no visible pathology |

---

## Results

| Metric | Value |
|---|---|
| Test Accuracy | **96.5%** |
| Test Loss | 0.1293 |
| Training Images | 6,324 |
| Training Epochs | 20 |

---

## Architecture

### Model (CNN)
```
Input (256×256×3)
  → Conv2D 16 filters, 3×3, ReLU → MaxPooling
  → Conv2D 32 filters, 3×3, ReLU → MaxPooling
  → Conv2D 64 filters, 3×3, ReLU → MaxPooling
  → Flatten → Dense 256, ReLU → Dropout 0.3
  → Output: 4 units, Softmax
```

### Stack
- **ML:** TensorFlow 2.16 · Keras · NumPy
- **Backend:** FastAPI · Uvicorn · Pillow
- **Frontend:** React 18 · Vite · Framer Motion
- **Deployment:** Render (backend) · Vercel (frontend)
- **Model Storage:** Git LFS

---

## Project Structure

```
PulmoScan-WebApp/
├── backend/
│   ├── main.py                  # FastAPI app — /predict endpoint
│   ├── requirements.txt
│   ├── render.yaml              # Render deployment config
│   └── models/
│       └── image_classifier_multiclass.h5   # Trained model (Git LFS)
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── pages/
│       │   ├── Home.jsx         # Upload + prediction UI
│       │   └── About.jsx        # Model info + stats
│       └── components/
│           └── Nav.jsx
│
├── phase1_data_acquisition.py   # Kaggle dataset downloader
├── phase2_preprocessing.py      # Cleaning, normalisation, splitting
├── phase3_model.py              # CNN architecture definitions
├── phase4_training.py           # Training with GPU support
├── phase5_evaluation.py         # Evaluation + inference
├── evaluate.py                  # Standalone evaluation script
├── main.py                      # Pipeline entry point
└── requirements.txt
```

---

## ML Pipeline

### Phase 1 — Data Acquisition
Downloads chest X-ray datasets from Kaggle:
- `jtiptj/chest-xray-pneumoniacovid19tuberculosis`
- `paultimothymooney/chest-xray-pneumonia`

### Phase 2 — Pre-processing
- Removes corrupt files using OpenCV
- Loads images at **256×256**, batch size **32**
- Z-score normalisation: `I_norm = (I − μ) / σ`
- Split: **70% train / 20% validation / 10% test**

### Phase 3–4 — Training
- Optimizer: Adam
- Loss: SparseCategoricalCrossentropy
- GPU: `tf.distribute.MirroredStrategy` (falls back to CPU)
- Logging: TensorBoard → `logs/`

### Phase 5 — Evaluation
- Metrics: Accuracy, Loss
- Saved model: `models/image_classifier_multiclass.h5`

---

## Running Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# API running at http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000 in .env
npm run dev
# App running at http://localhost:5173
```

### ML Pipeline
```bash
pip install -r requirements.txt

# Download data
python phase1_data_acquisition.py

# Train models
python phase4_training.py

# Evaluate
python evaluate.py

# Run inference on a single image
python main.py --infer path/to/xray.jpg
```

---

## Deployment

| Service | Platform | Config |
|---|---|---|
| Backend API | Render | `backend/render.yaml` |
| Frontend | Vercel | `frontend/vercel.json` |
| Model weights | Git LFS | `.gitattributes` |

### Environment Variables

**Render (backend):**
```
MODEL_PATH=models/image_classifier_multiclass.h5
FRONTEND_URL=https://pulmoscanwebapp.vercel.app
```

**Vercel (frontend):**
```
VITE_API_URL=https://your-api-name.onrender.com
```

---

## API Reference

### `POST /predict`
Upload a chest X-ray image and receive a diagnosis.

**Request:** `multipart/form-data` with field `file` (JPEG, PNG, or BMP)

**Response:**
```json
{
  "predicted_class": "Pneumonia",
  "confidence": 0.9423,
  "probabilities": {
    "COVID-19": 0.0201,
    "Normal": 0.0198,
    "Pneumonia": 0.9423,
    "Tuberculosis": 0.0178
  }
}
```

### `GET /health`
```json
{ "status": "ok", "model_loaded": true }
```

---

## Dataset

Images sourced from two public Kaggle datasets under their respective licenses. Data was cleaned, normalised, and split before training. The MIMIC-CXR dataset (PhysioNet) was considered but not included due to access constraints.

---

## Disclaimer

PulmoScan is intended for **research and educational purposes only**. It is not a substitute for professional medical diagnosis. Always consult a qualified radiologist or physician for clinical decisions.
