"""
AI service for health recommendations and symptom checking
"""
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, date, timedelta
import logging
import random

logger = logging.getLogger(__name__)

class AIService:
    """AI-powered health assistant service"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def check_symptoms(self, data: Dict[str, Any]) -> Dict:
        """AI symptom checker"""
        symptoms = data.get('symptoms', [])
        duration_days = data.get('duration_days', 1)
        severity = data.get('severity', 'moderate')
        
        # Simplified symptom checking logic
        conditions = []
        urgency = "low"
        should_see_doctor = False
        
        if 'fever' in [s.lower() for s in symptoms] and duration_days > 3:
            conditions.append({
                "condition": "Possible viral infection",
                "probability": "high",
                "description": "Fever lasting more than 3 days"
            })
            urgency = "medium"
            should_see_doctor = True
        
        if 'chest pain' in [s.lower() for s in symptoms]:
            conditions.append({
                "condition": "Possible cardiac issue",
                "probability": "medium",
                "description": "Chest pain requires immediate attention"
            })
            urgency = "high"
            should_see_doctor = True
        
        if 'headache' in [s.lower() for s in symptoms] and severity == 'severe':
            conditions.append({
                "condition": "Severe headache",
                "probability": "high",
                "description": "Could be migraine or tension headache"
            })
            urgency = "medium"
        
        if len(symptoms) >= 3:
            should_see_doctor = True
            urgency = "medium"
        
        return {
            "possible_conditions": conditions or [
                {
                    "condition": "Common cold",
                    "probability": "low",
                    "description": "Symptoms may resolve on their own"
                }
            ],
            "recommendations": [
                "Get plenty of rest",
                "Stay hydrated",
                "Monitor your symptoms"
            ],
            "urgency_level": urgency,
            "should_see_doctor": should_see_doctor,
            "suggested_specialist": "General Physician" if should_see_doctor else None
        }
    
    async def get_health_recommendations(
        self, user_id: Optional[str], data: Dict[str, Any]
    ) -> Dict:
        """Get AI health recommendations"""
        current_conditions = data.get('current_conditions', [])
        health_goals = data.get('health_goals', [])
        
        recommendations = {
            "diet_recommendations": [
                "Include more fruits and vegetables in your diet",
                "Drink at least 8 glasses of water daily",
                "Choose whole grains over refined grains"
            ],
            "exercise_suggestions": [
                "30 minutes of moderate exercise daily",
                "Include both cardio and strength training",
                "Try yoga or stretching exercises"
            ],
            "lifestyle_tips": [
                "Get 7-8 hours of sleep nightly",
                "Manage stress through meditation",
                "Regular health check-ups"
            ],
            "foods_to_eat": [
                "Leafy green vegetables",
                "Lean proteins",
                "Nuts and seeds",
                "Fresh fruits"
            ],
            "foods_to_avoid": [
                "Processed foods",
                "Excessive sugar",
                "Trans fats",
                "Excessive salt"
            ]
        }
        
        # Customize based on conditions
        if 'diabetes' in [c.lower() for c in current_conditions]:
            recommendations['diet_recommendations'].insert(0, "Monitor carbohydrate intake")
            recommendations['foods_to_avoid'].append("Sugary drinks")
        
        if 'hypertension' in [c.lower() for c in current_conditions]:
            recommendations['diet_recommendations'].insert(0, "Reduce sodium intake")
            recommendations['foods_to_avoid'].append("High-sodium foods")
        
        return recommendations
    
    async def recommend_medicine(self, data: Dict[str, Any]) -> Dict:
        """AI medicine recommendation"""
        symptoms = data.get('symptoms', [])
        allergies = data.get('allergies', [])
        
        return {
            "recommended_medicines": [
                {
                    "name": "Paracetamol",
                    "type": "Analgesic",
                    "dosage": "500mg as needed",
                    "note": "For pain relief"
                }
            ],
            "warnings": [
                "Do not exceed recommended dosage",
                "Consult doctor if symptoms persist",
                "Check for allergies before taking"
            ],
            "drug_interactions": [],
            "disclaimer": "This is an AI recommendation. Always consult a healthcare professional before taking any medication."
        }
    
    async def check_drug_interactions(self, medicines: List[str]) -> Dict:
        """Check drug interactions"""
        known_interactions = {
            "paracetamol_aspirin": {
                "severity": "low",
                "description": "Generally safe to take together"
            },
            "paracetamol_alcohol": {
                "severity": "high",
                "description": "Can cause liver damage"
            }
        }
        
        return {
            "interactions": [],
            "severity": "low",
            "recommendations": [
                "Always inform your doctor about all medications you're taking",
                "Read medication labels carefully",
                "Avoid alcohol while on medication"
            ]
        }
    
    async def chatbot_response(
        self, user_id: Optional[str], data: Dict[str, Any]
    ) -> Dict:
        """AI health assistant chatbot"""
        message = data.get('message', '').lower()
        
        responses = {
            "hello": "Hello! I'm your AI health assistant. How can I help you today?",
            "headache": "For headaches, try resting in a quiet, dark room. Stay hydrated. If persistent, consider consulting a doctor.",
            "fever": "For fever, rest and drink plenty of fluids. Paracetamol can help reduce fever. See a doctor if fever exceeds 103°F (39.4°C).",
            "cold": "Common cold symptoms can be managed with rest, fluids, and over-the-counter cold medicines. See a doctor if symptoms worsen.",
            "covid": "If you suspect COVID-19, isolate yourself and get tested. Monitor your symptoms and seek emergency care for severe symptoms.",
            "diet": "A balanced diet includes fruits, vegetables, whole grains, lean proteins, and healthy fats. Avoid processed foods.",
            "exercise": "Aim for at least 150 minutes of moderate exercise per week. Include both cardio and strength training.",
            "sleep": "Adults need 7-9 hours of sleep. Maintain a consistent sleep schedule and create a relaxing bedtime routine."
        }
        
        reply = "I understand your concern. For specific medical advice, please consult a healthcare professional."
        
        for keyword, response in responses.items():
            if keyword in message:
                reply = response
                break
        
        return {
            "reply": reply,
            "suggestions": [
                "Book an appointment with a doctor",
                "Check your symptoms",
                "Find nearby pharmacy"
            ],
            "actions": [
                {
                    "type": "book_appointment",
                    "label": "Book Appointment"
                },
                {
                    "type": "check_symptoms",
                    "label": "Check Symptoms"
                }
            ],
            "confidence": 0.85
        }
    
    async def predict_recovery(
        self,
        condition: str,
        age: Optional[int] = None,
        severity: str = "moderate"
    ) -> Dict:
        """Predict recovery time"""
        recovery_times = {
            "common_cold": {"min": 7, "max": 10, "unit": "days"},
            "flu": {"min": 5, "max": 14, "unit": "days"},
            "sprain": {"min": 14, "max": 42, "unit": "days"},
            "fracture": {"min": 42, "max": 84, "unit": "days"}
        }
        
        recovery = recovery_times.get(
            condition.lower().replace(' ', '_'),
            {"min": 7, "max": 14, "unit": "days"}
        )
        
        if age and age > 60:
            recovery['max'] += int(recovery['max'] * 0.3)
        
        if severity == "severe":
            recovery['max'] += int(recovery['max'] * 0.5)
        
        return {
            "condition": condition,
            "estimated_recovery": f"{recovery['min']}-{recovery['max']} {recovery['unit']}",
            "recovery_timeline": [
                {
                    "phase": "Acute",
                    "duration": f"Day 1-{recovery['min']//3}",
                    "recommendations": "Rest and medication"
                },
                {
                    "phase": "Recovery",
                    "duration": f"Day {recovery['min']//3+1}-{recovery['min']}",
                    "recommendations": "Gradually resume activities"
                }
            ]
        }
    
    async def set_dosage_reminder(
        self,
        user_id: str,
        medicine_name: str,
        dosage: str,
        frequency: str,
        duration_days: int,
        start_date: Optional[str] = None,
        notes: Optional[str] = None
    ) -> Dict:
        """Set AI dosage reminder"""
        start = start_date or date.today().isoformat()
        
        return {
            "reminder_set": True,
            "medicine": medicine_name,
            "dosage": dosage,
            "frequency": frequency,
            "duration_days": duration_days,
            "start_date": start,
            "end_date": (date.fromisoformat(start) + timedelta(days=duration_days)).isoformat(),
            "notes": notes
        }
    
    async def get_health_tips(self, category: Optional[str] = None) -> List[Dict]:
        """Get AI-generated health tips"""
        tips = [
            {
                "category": "general",
                "tip": "Wash your hands regularly to prevent infections",
                "importance": "high"
            },
            {
                "category": "nutrition",
                "tip": "Eat a rainbow of fruits and vegetables daily",
                "importance": "medium"
            },
            {
                "category": "fitness",
                "tip": "Take the stairs instead of the elevator",
                "importance": "low"
            },
            {
                "category": "mental_health",
                "tip": "Practice mindfulness for 5 minutes daily",
                "importance": "medium"
            },
            {
                "category": "sleep",
                "tip": "Avoid screens 1 hour before bedtime",
                "importance": "high"
            }
        ]
        
        if category:
            tips = [t for t in tips if t['category'] == category]
        
        return tips
    
    async def emergency_chatbot(self, data: Dict[str, Any]) -> Dict:
        """Emergency AI support chatbot"""
        message = data.get('message', '').lower()
        
        if 'emergency' in message or 'help' in message:
            return {
                "reply": "EMERGENCY: If this is a life-threatening emergency, please call 911 or your local emergency number immediately. Do not wait for a response.",
                "suggestions": [
                    "Call 911 immediately",
                    "Share your location with emergency services",
                    "Stay calm and follow dispatcher instructions"
                ],
                "actions": [
                    {
                        "type": "call_emergency",
                        "label": "Call Emergency",
                        "number": "911"
                    },
                    {
                        "type": "share_location",
                        "label": "Share Location"
                    },
                    {
                        "type": "find_hospital",
                        "label": "Find Nearest Hospital"
                    }
                ],
                "confidence": 1.0
            }
        
        return {
            "reply": "For non-emergency medical advice, please describe your situation. If this is an emergency, type 'emergency' or 'help'.",
            "suggestions": [],
            "confidence": 0.5
        }