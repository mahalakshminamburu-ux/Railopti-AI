import os
import joblib
import pandas as pd

# Resolve paths relative to script location
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DELAY_MODEL_PATH = os.path.join(BASE_DIR, "../models/delay_model.pkl")
CONGESTION_MODEL_PATH = os.path.join(BASE_DIR, "../models/congestion_model.pkl")

# Lazy-loaded singletons
_delay_model = None
_congestion_model = None

def get_models():
    global _delay_model, _congestion_model
    if _delay_model is None and os.path.exists(DELAY_MODEL_PATH):
        _delay_model = joblib.load(DELAY_MODEL_PATH)
    if _congestion_model is None and os.path.exists(CONGESTION_MODEL_PATH):
        _congestion_model = joblib.load(CONGESTION_MODEL_PATH)
    return _delay_model, _congestion_model

def predict_delay(
    train_count: int,
    track_utilization: float,
    block_duration: float,
    time: int,
    train_priority: int = 2,
    previous_delay: float = 0.0
) -> float:
    """Predicts estimated delay in minutes for a given section block."""
    delay_model, _ = get_models()
    if delay_model is not None:
        input_df = pd.DataFrame([{
            "train_count": train_count,
            "track_utilization": track_utilization,
            "block_duration": block_duration,
            "time": time,
            "train_priority": train_priority,
            "previous_delay": previous_delay
        }])
        pred = delay_model.predict(input_df)[0]
        return float(round(pred, 2))
    
    # Fallback heuristic if pickle file is not present
    peak_penalty = 8.0 if time in [8, 9, 10, 17, 18, 19] else 2.0
    return float(round(peak_penalty + (block_duration * 1.5) + (train_count * 1.2), 2))

def predict_congestion(
    train_count: int,
    track_utilization: float,
    block_duration: float,
    time: int
) -> str:
    """Predicts congestion state: 'LOW', 'MEDIUM', or 'HIGH'."""
    _, congestion_model = get_models()
    if congestion_model is not None:
        input_df = pd.DataFrame([{
            "train_count": train_count,
            "track_utilization": track_utilization,
            "block_duration": block_duration,
            "time": time
        }])
        return str(congestion_model.predict(input_df)[0])
    
    # Fallback heuristic if pickle file is not present
    if track_utilization > 75 or train_count > 10:
        return "HIGH"
    elif track_utilization > 45 or train_count > 5:
        return "MEDIUM"
    return "LOW"

def calculate_impact(
    delay: float,
    priority: int,
    congestion: str,
    diversion_penalty: float = 0.0
) -> float:
    """
    Computes unified impact score.
    Lower score indicates a better mitigation or maintenance window.
    """
    priority_weight = {1: 1.0, 2: 1.5, 3: 2.0}
    congestion_penalty = {"LOW": 5.0, "MEDIUM": 15.0, "HIGH": 30.0}
    
    w_p = priority_weight.get(priority, 1.0)
    c_p = congestion_penalty.get(congestion.upper(), 15.0)
    
    score = (delay * w_p) + c_p + diversion_penalty
    return float(round(score, 2))

def evaluate_maintenance_block(
    train_count: int,
    track_utilization: float,
    block_duration: float,
    time: int,
    train_priority: int = 2,
    previous_delay: float = 0.0,
    diversion_penalty: float = 0.0
) -> dict:
    """Comprehensive analysis dictionary for optimization engine."""
    delay = predict_delay(
        train_count, track_utilization, block_duration, time, train_priority, previous_delay
    )
    congestion = predict_congestion(
        train_count, track_utilization, block_duration, time
    )
    impact = calculate_impact(delay, train_priority, congestion, diversion_penalty)
    
    return {
        "predicted_delay_mins": delay,
        "congestion_level": congestion,
        "impact_score": impact,
        "recommendation": "APPROVED" if impact < 65 else ("CAUTION" if impact < 110 else "REJECTED")
    }

class RailwayPredictor:
    """Class wrapper for src/__init__.py and main.py integration."""
    def __init__(self, delay_model_path: str = None, congestion_model_path: str = None):
        try:
            get_models()
        except Exception as e:
            print(f"Warning initializing models: {e}")

    def evaluate(
        self,
        train_count: int,
        track_utilization: float,
        block_duration: float,
        time_hour: int,
        priority: int = 2
    ) -> dict:
        return evaluate_maintenance_block(
            train_count=train_count,
            track_utilization=track_utilization,
            block_duration=block_duration,
            time=time_hour,
            train_priority=priority
        )
