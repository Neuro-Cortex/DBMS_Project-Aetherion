"""
Cloudinary integration for file storage
"""
import cloudinary
import cloudinary.uploader
import cloudinary.api
from typing import Optional, Dict, Any
from fastapi import UploadFile
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class CloudinaryClient:
    """Cloudinary file storage client"""
    
    def __init__(self):
        self._initialized = False
        
        if settings.CLOUDINARY_CLOUD_NAME:
            self.initialize()
    
    def initialize(self):
        """Initialize Cloudinary"""
        try:
            cloudinary.config(
                cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                api_key=settings.CLOUDINARY_API_KEY,
                api_secret=settings.CLOUDINARY_API_SECRET,
                secure=True
            )
            self._initialized = True
            logger.info("Cloudinary initialized successfully")
        except Exception as e:
            logger.error(f"Cloudinary initialization failed: {e}")
            self._initialized = False
    
    async def upload_image(
        self,
        file: UploadFile,
        folder: str,
        public_id: Optional[str] = None,
        transformation: Optional[Dict] = None
    ) -> Optional[Dict[str, Any]]:
        """Upload image to Cloudinary"""
        if not self._initialized:
            logger.warning("Cloudinary not initialized")
            return None
        
        try:
            contents = await file.read()
            
            upload_params = {
                "folder": folder,
                "resource_type": "image"
            }
            
            if public_id:
                upload_params["public_id"] = public_id
            
            if transformation:
                upload_params["transformation"] = transformation
            
            result = cloudinary.uploader.upload(
                contents,
                **upload_params
            )
            
            logger.info(f"Image uploaded to Cloudinary: {result['public_id']}")
            return result
            
        except Exception as e:
            logger.error(f"Image upload failed: {e}")
            return None
    
    async def upload_file(
        self,
        file: UploadFile,
        folder: str,
        public_id: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """Upload any file to Cloudinary"""
        if not self._initialized:
            return None
        
        try:
            contents = await file.read()
            
            upload_params = {
                "folder": folder,
                "resource_type": "auto"
            }
            
            if public_id:
                upload_params["public_id"] = public_id
            
            result = cloudinary.uploader.upload(
                contents,
                **upload_params
            )
            
            logger.info(f"File uploaded to Cloudinary: {result['public_id']}")
            return result
            
        except Exception as e:
            logger.error(f"File upload failed: {e}")
            return None
    
    async def delete_file(self, public_id: str) -> bool:
        """Delete file from Cloudinary"""
        if not self._initialized:
            return False
        
        try:
            result = cloudinary.uploader.destroy(public_id)
            logger.info(f"File deleted: {public_id}")
            return result.get('result') == 'ok'
        except Exception as e:
            logger.error(f"File deletion failed: {e}")
            return False
    
    async def get_url(
        self,
        public_id: str,
        transformation: Optional[Dict] = None
    ) -> Optional[str]:
        """Get file URL with optional transformations"""
        if not self._initialized:
            return None
        
        try:
            if transformation:
                url = cloudinary.CloudinaryImage(public_id).build_url(
                    transformation=transformation
                )
            else:
                url = cloudinary.CloudinaryImage(public_id).build_url()
            
            return url
        except Exception as e:
            logger.error(f"URL generation failed: {e}")
            return None

cloudinary_client = CloudinaryClient()