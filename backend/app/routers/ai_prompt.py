from fastapi import APIRouter, HTTPException
from app.schemas.schemas import PromptRequest, PromptResponse
from app.core.config import settings
import httpx

router = APIRouter()

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

SYSTEM_PROMPT = """You are an expert prompt engineer specializing in AI image generation for custom sublimation products like t-shirts and merchandise.
Your job is to transform a simple user idea into a professional, detailed image generation prompt.
The prompt must be vivid, specific, and optimized for tools like Gemini Image, DALL-E, or Midjourney.
Always respond ONLY with valid JSON in this format:
{
  "prompt_en": "detailed english prompt here",
  "prompt_es": "prompt detallado en español aquí",
  "suggestion": "brief tip for the user in spanish"
}"""

@router.post("/generate-prompt", response_model=PromptResponse)
async def generate_image_prompt(request: PromptRequest):
    if not settings.GROQ_API_KEY:
        # Fallback: generate a basic template without AI
        return _fallback_prompt(request)

    user_message = f"""
Crea un prompt profesional para generar una imagen con IA basado en esta idea:
Idea: {request.idea}
Estilo: {request.style}
Producto: {request.product_type}

El diseño se usará en sublimación sobre {request.product_type}.
Hazlo vibrante, detallado y perfecto para impresión.
"""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                GROQ_URL,
                headers={
                    "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": settings.GROQ_MODEL,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_message}
                    ],
                    "temperature": 0.8,
                    "max_tokens": 500
                }
            )
            data = response.json()
            content = data["choices"][0]["message"]["content"]

            import json, re
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                parsed = json.loads(json_match.group())
                return PromptResponse(
                    prompt_en=parsed.get("prompt_en", ""),
                    prompt_es=parsed.get("prompt_es", ""),
                    suggestion=parsed.get("suggestion", "")
                )
    except Exception as e:
        pass

    return _fallback_prompt(request)

def _fallback_prompt(request: PromptRequest) -> PromptResponse:
    """Fallback when Groq is unavailable"""
    style_map = {
        "moderno": "modern minimalist",
        "vintage": "retro vintage",
        "abstracto": "abstract artistic",
        "cartoon": "cartoon illustration",
        "realista": "photorealistic"
    }
    style_en = style_map.get(request.style, "modern")

    prompt_en = (
        f"{style_en} design for {request.product_type} sublimation printing, "
        f"{request.idea}, vibrant colors, high resolution, vector art style, "
        f"white background, professional quality, centered composition, "
        f"suitable for fabric printing, sharp edges, no text"
    )
    prompt_es = (
        f"Diseño {request.style} para sublimación en {request.product_type}, "
        f"{request.idea}, colores vibrantes, alta resolución, estilo arte vectorial, "
        f"fondo blanco, calidad profesional, composición centrada, "
        f"apto para impresión en tela, bordes nítidos, sin texto"
    )
    return PromptResponse(
        prompt_en=prompt_en,
        prompt_es=prompt_es,
        suggestion="Pega este prompt en Gemini, DALL-E o cualquier generador de imágenes IA. ¡Asegúrate de descargar en alta resolución!"
    )
