import httpx

async def fetch_product(barcode: str):
    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
    
    async with httpx.AsyncClient() as client:
        r = await client.get(url)
        data = r.json()

    if data.get("status") != 1:
        return {"error": "Product not found"}

    p = data["product"]

    return {
        "barcode": barcode,
        "name": p.get("product_name", "Unknown"),
        "ingredients": p.get("ingredients_text", "Not available"),
        "raw": p
    }
