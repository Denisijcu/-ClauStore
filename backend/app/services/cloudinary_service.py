import cloudinary
import cloudinary.uploader
from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

def upload_image(file_bytes: bytes, folder: str = "claustore", public_id: str = None) -> dict:
    """Upload image to Cloudinary and return URL + public_id"""
    result = cloudinary.uploader.upload(
        file_bytes,
        folder=folder,
        public_id=public_id,
        overwrite=True,
        resource_type="image"
    )
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"]
    }

def delete_image(public_id: str) -> bool:
    """Delete image from Cloudinary"""
    result = cloudinary.uploader.destroy(public_id)
    return result.get("result") == "ok"
