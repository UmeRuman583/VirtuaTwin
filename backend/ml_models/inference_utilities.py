import pandas as pd
import joblib
from pathlib import Path
from typing import Dict, Any

# Lazy loading approach
_model = None

def get_model():
    global _model
    if _model is None:
        MODEL_PATH = Path(__file__).parent / "heart_model_pipeline.joblib"
        try:
            _model = joblib.load(MODEL_PATH)
        except FileNotFoundError:
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
    return _model

def predict_from_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Take user input JSON and return health score, risks, trajectory, advice.
    """
    try:
        model = get_model()
        
        # Validate required fields
        required_fields = ['age', 'sex', 'bp_systolic', 'cholesterol', 'bmi', 
                          'smoking', 'alcohol_level', 'exercise_freq', 'sleep_hours', 'stress_score']
        
        for field in required_fields:
            if field not in payload:
                raise ValueError(f"Missing required field: {field}")

        # --- Step 1: Map JSON to ML model features ---
        ml_row = {
            "age": payload["age"],
            "sex": payload["sex"],
            "trestbps": payload["bp_systolic"],
            "chol": payload["cholesterol"]
        }
        df_row = pd.DataFrame([ml_row])

        # --- Step 2: ML model prediction (cardio baseline) ---
        cardio_prob = model.predict_proba(df_row)[0][1]

        # --- Step 3: Rule-based adjustments ---
        adj = 0.0

        # BMI adjustment
        bmi = payload["bmi"]
        if bmi >= 30:
            adj += 0.10
        elif bmi >= 25:
            adj += 0.05

        # Smoking adjustment
        if payload["smoking"] == 1:
            adj += 0.15

        # Alcohol adjustment
        if payload["alcohol_level"] == 2:
            adj += 0.07
        elif payload["alcohol_level"] == 1:
            adj += 0.03

        # FIXED: Exercise adjustment
        if payload["exercise_freq"] == 0:
            adj += 0.10
        elif payload["exercise_freq"] == 1:
            adj += 0.05
        elif payload["exercise_freq"] >= 3:  # Fixed: was == 3
            adj -= 0.05

        # Sleep adjustment
        sleep = payload["sleep_hours"]
        if sleep < 6:
            adj += 0.05
        elif sleep > 9:
            adj += 0.03

        # Stress adjustment
        stress = payload["stress_score"]
        if stress >= 7:
            adj += 0.07
        elif stress >= 4:
            adj += 0.03

        # Apply adjustment
        cardio_prob = min(max(cardio_prob + adj, 0), 1)

        # --- Step 4: Other risks ---
        mental_risk = min(1, 0.05 * payload["stress_score"] + (0.05 if sleep < 6 else 0))
        sleep_risk = min(1, 0.1 if sleep < 6 else 0.02)

        # --- Step 5: Health score (100 - weighted risks) ---
        health_score = 100 * (1 - (0.6 * cardio_prob + 0.25 * mental_risk + 0.15 * sleep_risk))

        # --- Step 6: 5-year trajectory (simple decline if risks are high) ---
        trajectory = [round(health_score - i * (cardio_prob * 5), 1) for i in range(5)]

        # --- Step 7: Advice (rule-based) ---
        advice = []
        if bmi >= 25: 
            advice.append("Maintain a healthy weight to lower heart risk.")
        if payload["smoking"] == 1: 
            advice.append("Quit smoking to reduce cardio risk.")
        if payload["exercise_freq"] < 2: 
            advice.append("Increase exercise frequency to improve health.")
        if sleep < 7: 
            advice.append("Aim for 7–8 hours of sleep for recovery.")
        if stress >= 7: 
            advice.append("Try relaxation techniques to reduce stress.")

        # --- Step 8: Return final JSON ---
        return {
            "health_score": round(health_score, 1),
            "risks": {
                "cardio": round(cardio_prob, 3),
                "mental": round(mental_risk, 3),
                "sleep": round(sleep_risk, 3)
            },
            "trajectory": trajectory,
            "advice": advice,
            "meta": {
                "base_cardio_prob": float(model.predict_proba(df_row)[0][1]),
                "rule_adjustment_sum": round(adj, 3)
            }
        }
    
    except Exception as e:
        raise ValueError(f"Prediction failed: {str(e)}")