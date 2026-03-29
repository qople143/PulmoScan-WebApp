# Framework for Chest X-Ray Analysis for Pulmonic Ailments

> A full-stack web application for chest X-ray classification using a convolutional neural network trained on clinical images from the MIMIC-CXR dataset.

**Live Demo:** [pulmoscanwebapp.vercel.app](https://pulmoscanwebapp.vercel.app)

---

## Research Origins

This project is built upon the foundational research presented in the paper "Framework for Chest X-Ray Analysis for Pulmonic Ailments". 
* **Authors:** Sadiya Fathima N, Sinchana L, and Mohammed Siddiq Romazan.
* **Institution:** Atria Institute of Technology, Bengaluru, Karnataka, India.
* **Core Study:** The original research developed an automated diagnosis system for pulmonary diseases based on machine learning, utilizing the MIMIC-CXR and NIH datasets.

---

## Overview

PulmoScan focuses on the detection of five key pulmonary diseases:

| Condition | Description |
|---|---|
| **COVID-19** | Manifests as bilateral ground-glass opacities, peripheral distribution, and patchy consolidations. |
| **Pneumonia** | Characterized by localized or diffuse opacities indicating lung infection. |
| **Tuberculosis** | Typically presents as cavitary lesions, consolidations, or nodular opacities, predominantly in the upper lung zones. |
| **Pneumothorax** | Identified by the presence of air in the pleural space, leading to lung collapse. |
| **Pulmonary Edema** | Exhibits diffuse haziness and increased vascular markings due to fluid buildup. |

---

## Results

The underlying diagnostic framework demonstrated outstanding performance in the detection of pulmonary diseases:

| Metric | Value |
|---|---|
| Accuracy | **92%** |
| Sensitivity | **94%** |
| Specificity | **91%** |
| Dataset Size | 12,396 chest X-rays |

---

## Architecture

### Model (CNN)
```text
Input (256×256×3)
  → Conv2D 16 filters, 3×3, ReLU → MaxPooling
  → Conv2D 32 filters, 3×3, ReLU → MaxPooling
  → Conv2D 64 filters, 3×3, ReLU → MaxPooling
  → Flatten → Dense 128, ReLU 
  → Output: 5 units, Softmax 
```

### Stack
- **ML:** TensorFlow 2.16 · Keras · NumPy
- **Backend:** FastAPI · Uvicorn · Python
- **Frontend:** React 18 · Vite · Framer Motion
- **Deployment:** Render (backend) · Vercel (frontend)
- **Model Storage:** Git LFS

---

## Project Structure

```text
PulmoScan-WebApp/
├── backend/
│   ├── main.py                  # FastAPI app — /predict endpoint
│   ├── requirements.txt
│   ├── render.yaml              # Render deployment config
│   └── models/
│       └── image_classifier.h5  # Trained model (Git LFS)
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── pages/
│       │   ├── Home.jsx         # Upload + prediction UI
│       │   └── About.jsx        # Model info + research stats
│       └── components/
│           └── Nav.jsx
```

---

## ML Pipeline

### Phase 1 — Data Acquisition
Downloads chest X-ray datasets:
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

***
