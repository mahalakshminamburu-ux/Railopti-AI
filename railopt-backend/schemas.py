from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class BlockRequest(BaseModel):
    block_id: str
    section: str                  # e.g., "S1-S2"
    department: str               # "Engineering" | "Signalling" | "OHE"
    maintenance_type: str         # "Track Repair" | "OHE Maintenance"
    date: str                     # "YYYY-MM-DD"
    preferred_time: str           # "HH:MM"
    duration_hours: float = Field(..., gt=0)
    priority: int = Field(..., ge=1, le=3)  # 3: High, 2: Medium, 1: Low


class PlanOption(BaseModel):
    plan_id: str
    recommended_start: str
    recommended_end: str
    predicted_delay_min: int
    conflicts_detected: int
    score: int
    is_best: bool = False
    reasons: List[str] = []
    rerouted_trains: List[Dict[str, Any]] = []


class OptimizeResponse(BaseModel):
    block_id: str
    section: str
    best_plan: PlanOption
    alternative_plans: List[PlanOption] = []


class BlockApproval(BaseModel):
    block_id: str
    selected_plan_id: str
    status: str                   # "APPROVED" | "REJECTED" | "MODIFIED"
    section: Optional[str] = "S1-S2"
    department: Optional[str] = "Engineering"
    time_window: Optional[str] = "12:00 - 14:00"
    day: Optional[str] = "SAT"
# In schemas.py

class LoginRequest(BaseModel):
    username: str
    password: str

class UserProfile(BaseModel):
    username: str
    full_name: str
    role: str           # "CONTROLLER" | "ENGINEER" | "ADMIN"
    department: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile
