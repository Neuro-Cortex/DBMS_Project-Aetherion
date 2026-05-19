"""
File handling utility functions
"""
from typing import Optional, List, Tuple
from fastapi import UploadFile, HTTPException, status
import magic
import os
from pathlib import Path
from app.core.config import settings
import aiofiles
import hashlib
import uuid

class FileUtils:
    """File handling utilities"""
    
    @staticmethod
    async def validate_file(
        file: UploadFile,
        allowed_types: Optional[List[str]] = None,
        max_size: Optional[int] = None
    ) -> Tuple[bool, str]:
        """Validate uploaded file"""
        
        if not allowed_types:
            allowed_types = settings.ALLOWED_EXTENSIONS
        
        if not max_size:
            max_size = settings.MAX_UPLOAD_SIZE
        
        # Check file size
        file.file.seek(0, 2)
        size = file.file.tell()
        file.file.seek(0)
        
        if size > max_size:
            max_size_mb = max_size / (1024 * 1024)
            return False, f"File too large. Maximum {max_size_mb}MB allowed"
        
        # Check file extension
        ext = Path(file.filename).suffix.lower().lstrip('.')
        if ext not in allowed_types:
            return False, f"File type not allowed. Allowed: {', '.join(allowed_types)}"
        
        # Check MIME type
        content = await file.read(2048)
        await file.seek(0)
        
        mime = magic.from_buffer(content, mime=True)
        
        return True, mime
    
    @staticmethod
    async def save_file(
        file: UploadFile,
        directory: str,
        filename: Optional[str] = None
    ) -> str:
        """Save uploaded file to disk"""
        
        if not filename:
            ext = Path(file.filename).suffix
            filename = f"{uuid.uuid4()}{ext}"
        
        file_path = Path(settings.UPLOAD_DIR) / directory / filename
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        return str(file_path)
    
    @staticmethod
    async def get_file_hash(file: UploadFile) -> str:
        """Calculate SHA-256 hash of file"""
        sha256 = hashlib.sha256()
        
        content = await file.read()
        sha256.update(content)
        await file.seek(0)
        
        return sha256.hexdigest()
    
    @staticmethod
    def delete_file(file_path: str) -> bool:
        """Delete file from disk"""
        try:
            os.remove(file_path)
            return True
        except FileNotFoundError:
            return False
        except Exception:
            return False
    
    @staticmethod
    def get_file_size(file_path: str) -> Optional[int]:
        """Get file size in bytes"""
        try:
            return os.path.getsize(file_path)
        except Exception:
            return None
    
    @staticmethod
    def get_mime_type(file_path: str) -> str:
        """Get MIME type of file"""
        return magic.from_file(file_path, mime=True)
    
    @staticmethod
    async def create_thumbnail(
        file_path: str,
        size: Tuple[int, int] = (200, 200)
    ) -> Optional[str]:
        """Create thumbnail of image"""
        try:
            from PIL import Image
            
            thumb_path = str(Path(file_path).parent / f"thumb_{Path(file_path).name}")
            
            with Image.open(file_path) as img:
                img.thumbnail(size)
                img.save(thumb_path)
            
            return thumb_path
        except Exception:
            return None
    
    @staticmethod
    def allowed_file(filename: str) -> bool:
        """Check if filename has allowed extension"""
        ext = Path(filename).suffix.lower().lstrip('.')
        return ext in settings.ALLOWED_EXTENSIONS
    
    @staticmethod
    def generate_filename(original_filename: str) -> str:
        """Generate unique filename"""
        ext = Path(original_filename).suffix
        return f"{uuid.uuid4()}{ext}"