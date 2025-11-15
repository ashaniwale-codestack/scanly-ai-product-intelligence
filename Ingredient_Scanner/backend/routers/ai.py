from fastapi import APIRouter
from ..services.ai_processor import analyze_ingredients
from ..services.product_lookup import fetch_product

router = APIRouter(prefix="/ai", tags=["AI"])

@router.get("/{barcode}")
async def ai_ingredient_analysis(barcode: str):
    product = await fetch_product(barcode)
    return await analyze_ingredients(product)
