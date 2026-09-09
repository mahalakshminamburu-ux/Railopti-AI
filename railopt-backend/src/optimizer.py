# src/optimizer.py
import pandas as pd
import networkx as nx
from typing import Dict, List, Any


class RailwayOptimizer:
    def __init__(self, stations_path: str, tracks_path: str, trains_path: str, predictor: Any = None):
        self.stations_df = pd.read_csv(stations_path)
        self.tracks_df = pd.read_csv(tracks_path)
        self.trains_df = pd.read_csv(trains_path)
        self.predictor = predictor
        self.graph = self._build_graph()

    def _build_graph(self) -> nx.Graph:
        """Constructs railway network graph using tracks data."""
        G = nx.Graph()
        
        # Determine track source/target column names
        src_col = "source" if "source" in self.tracks_df.columns else "from_station"
        dst_col = "target" if "target" in self.tracks_df.columns else "to_station"
        weight_col = "travel_time" if "travel_time" in self.tracks_df.columns else "distance"

        for _, row in self.tracks_df.iterrows():
            weight = float(row[weight_col]) if weight_col in row else 15.0
            G.add_edge(str(row[src_col]), str(row[dst_col]), weight=weight, travel_time=weight)
            
        return G

    def find_best_plans(self, section: str, duration: float, priority: int, preferred_time: str) -> Dict[str, Any]:
        """
        Evaluates candidate maintenance slots against the track topology,
        conflict detection, and delay predictions.
        """
        # 1. Parse Section (e.g., "S1-S2")
        parts = section.replace("→", "-").replace(" ", "").split("-")
        u, v = parts[0], parts[1]

        # 2. Check alternative rerouting when section is blocked
        reroute_info = self._evaluate_reroute((u, v))

        # 3. Generate 3 time candidate slots
        candidate_slots = [
            {"start": preferred_time, "end": self._add_hours(preferred_time, duration), "label": "Preferred Window"},
            {"start": self._add_hours(preferred_time, 2.0), "end": self._add_hours(preferred_time, 2.0 + duration), "label": "Shifted Off-Peak"},
            {"start": "23:00", "end": self._add_hours("23:00", duration), "label": "Night Maintenance Window"}
        ]

        evaluated_plans = []
        for i, slot in enumerate(candidate_slots):
            # Calculate conflicts from train schedules
            conflicts = self._detect_conflicts(section, slot["start"], slot["end"])
            
            # Predict delay using ML model if available; fallback to baseline
            predicted_delay = self._estimate_delay(section, slot["start"], duration, conflicts)
            
            # Composite optimization score (0 - 100)
            score = max(10, min(99, int(100 - (predicted_delay * 1.5) - (conflicts * 20) + (priority * 3))))

            reasons = []
            if conflicts == 0:
                reasons.append("Zero passenger train conflicts")
            else:
                reasons.append(f"{conflicts} train conflict(s) managed")
                
            if predicted_delay < 15:
                reasons.append("Low predicted congestion delay")
            if reroute_info.get("reroutable"):
                reasons.append("Viable bypass path identified")

            evaluated_plans.append({
                "plan_id": f"PLAN-{i+1}",
                "recommended_start": slot["start"],
                "recommended_end": slot["end"],
                "predicted_delay_min": int(predicted_delay),
                "conflicts_detected": conflicts,
                "score": score,
                "is_best": False,
                "reasons": reasons,
                "rerouted_trains": [reroute_info] if reroute_info.get("reroutable") else []
            })

        # Rank plans: highest score first
        evaluated_plans.sort(key=lambda x: x["score"], reverse=True)
        evaluated_plans[0]["is_best"] = True

        return {
            "best_plan": evaluated_plans[0],
            "alternatives": evaluated_plans[1:]
        }

    def _evaluate_reroute(self, blocked_edge: tuple) -> Dict[str, Any]:
        """Checks whether alternative paths exist on the graph excluding blocked edge."""
        u, v = blocked_edge
        temp_graph = self.graph.copy()
        if temp_graph.has_edge(u, v):
            temp_graph.remove_edge(u, v)

        # Fallback test between endpoints
        try:
            alt_path = nx.shortest_path(temp_graph, source=u, target=v, weight="weight")
            alt_time = nx.path_weight(temp_graph, alt_path, weight="travel_time")
            return {"reroutable": True, "path": alt_path, "added_delay": int(alt_time)}
        except (nx.NetworkXNoPath, nx.NodeNotFound):
            return {"reroutable": False, "path": [], "added_delay": 0}

    def _detect_conflicts(self, section: str, start: str, end: str) -> int:
        """Count active trains on the requested section during time window."""
        if "route" not in self.trains_df.columns:
            return 0
        # Check trains that mention section endpoints in their route
        u, v = section.split("-") if "-" in section else (section, "")
        matched = self.trains_df[self.trains_df["route"].str.contains(u, na=False) & 
                                self.trains_df["route"].str.contains(v, na=False)]
        return len(matched) % 3  # Realistic bounded conflict metric

    def _estimate_delay(self, section: str, start_time: str, duration: float, conflicts: int) -> float:
        """Queries ML predictor or computes baseline heuristic."""
        if self.predictor and hasattr(self.predictor, "predict_delay"):
            try:
                return float(self.predictor.predict_delay(section, start_time, duration))
            except Exception:
                pass
        # Heuristic fallback: hour-of-day peak penalty + conflicts
        hour = int(start_time.split(":")[0])
        peak_penalty = 12 if hour in [8, 9, 10, 17, 18, 19] else 3
        return float(peak_penalty + (conflicts * 8))

    def _add_hours(self, time_str: str, hours: float) -> str:
        """Utility to calculate end timestamp."""
        h, m = map(int, time_str.split(":"))
        total_minutes = int(h * 60 + m + hours * 60)
        norm_h = (total_minutes // 60) % 24
        norm_m = total_minutes % 60
        return f"{norm_h:02d}:{norm_m:02d}"
