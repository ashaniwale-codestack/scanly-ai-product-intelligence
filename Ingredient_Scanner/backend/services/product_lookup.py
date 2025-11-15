import httpx
from lingodotdev import LingoDotDevEngine


LINGO_CONFIG = {
    "api_key": "api_lkrwf42aahdp7z2cntkshtgy",
    "api_url": "https://engine.lingo.dev"
}


_engine = None

async def get_engine():
    global _engine
    if _engine is None:
        _engine = await LingoDotDevEngine(LINGO_CONFIG).__aenter__()
    return _engine

async def translate_product(obj: dict, target_locale: str):
    """
    Translate the product dictionary using Lingo.dev
    """
    engine = await get_engine()
    translated = await engine.localize_object(
        obj,
        {
            "target_locale": target_locale,
        },
        concurrent=True
    )
    return translated

async def fetch_product(barcode: str, lang: str = "en"):
    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
    
    async with httpx.AsyncClient() as client:
        r = await client.get(url)
        data = r.json()

    if data.get("status") != 1:
        error_obj = {"error": "Product not found"}
        if lang != "en":
            error_obj = await translate_product(error_obj, lang)
        return error_obj

    p = data["product"]

    product_obj = {
        "barcode": barcode,
        "name": p.get("product_name", "Unknown"),
        "ingredients": p.get("ingredients_text", "Not available"),
        "raw": p
    }

    # Translate name & ingredients dynamically
    if lang != "en":
        product_obj = await translate_product(product_obj, lang)

    return product_obj