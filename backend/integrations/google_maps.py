"""
Google Maps integration for location services
"""
from typing import Optional, Dict, List, Tuple
import aiohttp
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class GoogleMapsClient:
    """Google Maps API client"""
    
    BASE_URL = "https://maps.googleapis.com/maps/api"
    
    def __init__(self):
        self.api_key = settings.GOOGLE_MAPS_API_KEY
    
    async def geocode(self, address: str) -> Optional[Dict]:
        """Convert address to coordinates"""
        url = f"{self.BASE_URL}/geocode/json"
        params = {
            "address": address,
            "key": self.api_key
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                data = await response.json()
                
                if data["status"] == "OK":
                    return data["results"][0]
        
        return None
    
    async def reverse_geocode(self, lat: float, lng: float) -> Optional[str]:
        """Convert coordinates to address"""
        url = f"{self.BASE_URL}/geocode/json"
        params = {
            "latlng": f"{lat},{lng}",
            "key": self.api_key
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                data = await response.json()
                
                if data["status"] == "OK":
                    return data["results"][0]["formatted_address"]
        
        return None
    
    async def get_distance_matrix(
        self,
        origins: List[Tuple[float, float]],
        destinations: List[Tuple[float, float]],
        mode: str = "driving"
    ) -> Optional[Dict]:
        """Get distance matrix between multiple points"""
        url = f"{self.BASE_URL}/distancematrix/json"
        
        origins_str = "|".join([f"{lat},{lng}" for lat, lng in origins])
        destinations_str = "|".join([f"{lat},{lng}" for lat, lng in destinations])
        
        params = {
            "origins": origins_str,
            "destinations": destinations_str,
            "mode": mode,
            "key": self.api_key
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                data = await response.json()
                
                if data["status"] == "OK":
                    return data
        
        return None
    
    async def get_directions(
        self,
        origin: Tuple[float, float],
        destination: Tuple[float, float],
        mode: str = "driving"
    ) -> Optional[Dict]:
        """Get directions between two points"""
        url = f"{self.BASE_URL}/directions/json"
        
        params = {
            "origin": f"{origin[0]},{origin[1]}",
            "destination": f"{destination[0]},{destination[1]}",
            "mode": mode,
            "key": self.api_key
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                data = await response.json()
                
                if data["status"] == "OK":
                    return data
        
        return None
    
    async def search_places(
        self,
        query: str,
        location: Optional[Tuple[float, float]] = None,
        radius: int = 5000,
        place_type: Optional[str] = None
    ) -> List[Dict]:
        """Search for places"""
        url = f"{self.BASE_URL}/place/textsearch/json"
        
        params = {
            "query": query,
            "key": self.api_key
        }
        
        if location:
            params["location"] = f"{location[0]},{location[1]}"
            params["radius"] = radius
        
        if place_type:
            params["type"] = place_type
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                data = await response.json()
                
                if data["status"] == "OK":
                    return data["results"]
        
        return []

google_maps_client = GoogleMapsClient()