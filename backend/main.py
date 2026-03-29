"""
backend/main.py — Pulmonary Disease Diagnosis API
FastAPI backend that loads the trained model and serves predictions.
Deploy on Render.
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
from PIL import Image
import io
import os

app = FastAPI(title="Pulmonary Disease Diagnosis API", version="1.0.0")

# ── CORS — allow Vercel frontend ──────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",         # local Vite dev
        "https://*.vercel.app",          # Vercel preview
        os.getenv("FRONTEND_URL", "*"),  # set in Render env vars
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Model loading ─────────────────────────────────────────────────────────────
MODEL_PATH  = os.getenv("MODEL_PATH", "models/image_classifier_multiclass.h5")
CLASS_NAMES = ["COVID-19", "Normal", "Pneumonia", "Tuberculosis"]
IMAGE_SIZE  = (256, 256)

model = None

@app.on_event("startup")
def load_model():
    global model
    print(f"[API] Loading model from {MODEL_PATH}...")
    model = tf.keras.models.load_model(MODEL_PATH)
    print("[API] Model loaded.")


# ── Response schema ───────────────────────────────────────────────────────────
class PredictionResult(BaseModel):
    predicted_class: str
    confidence:      float
    probabilities:   dict[str, float]


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "message": "Pulmonary Diagnosis API is running."}


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}


@app.post("/predict", response_model=PredictionResult)
async def predict(file: UploadFile = File(...)):
    # Validate file type
    if file.content_type not in ("image/jpeg", "image/png", "image/bmp"):
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, and BMP images are supported.")

    # Read & preprocess
    contents = await file.read()
    try:
        img = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read image file.")

    img     = img.resize(IMAGE_SIZE)
    arr     = np.array(img, dtype=np.float32) / 255.0
    mean    = arr.mean()
    std     = arr.std() + 1e-7
    arr     = (arr - mean) / std
    arr     = np.expand_dims(arr, axis=0)   # (1, 256, 256, 3)

    # Inference
    preds      = model.predict(arr, verbose=0)[0]           # shape (4,)
    class_idx  = int(np.argmax(preds))
    confidence = float(preds[class_idx])

    probabilities = {CLASS_NAMES[i]: round(float(preds[i]), 4) for i in range(len(CLASS_NAMES))}

    return PredictionResult(
        predicted_class=CLASS_NAMES[class_idx],
        confidence=round(confidence, 4),
        probabilities=probabilities,
    )