from fastapi import APIRouter, Depends
from services.product_lookup import fetch_product
from .auth import get_current_user

router = APIRouter(prefix="/product", tags=["Product"])

@router.get("/{barcode}")
async def get_product(barcode: str, user=Depends(get_current_user)):
    return await fetch_product(barcode)
