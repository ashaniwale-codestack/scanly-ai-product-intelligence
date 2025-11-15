from fastapi import APIRouter
from ..services.product_lookup import fetch_product

router = APIRouter(prefix="/product", tags=["Product"])

@router.get("/{barcode}")
async def get_product(barcode: str):
    return await fetch_product(barcode)
