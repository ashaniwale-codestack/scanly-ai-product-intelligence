import re

COMMON_ALLERGENS = [
    "peanut", "tree nut", "milk", "egg", "wheat", "soy", "fish", "shellfish", "sesame"
]

def detect_allergens(ingredients: list[str]) -> list[str]:
    found = []
    for allergen in COMMON_ALLERGENS:
        for ing in ingredients:
            if re.search(rf"\\b{allergen}\\b", ing, re.IGNORECASE):
                found.append(allergen)
    return list(set(found))

async def analyze_ingredients(product: dict):
    ingredients = product.get("ingredients", [])
    allergens = detect_allergens(ingredients)
    summary = "No major allergens detected." if not allergens else f"Contains: {', '.join(allergens)}"
    # Placeholder for advanced logic: you could call an external API/model here
    return {
        "product": product,
        "ai_summary": summary,
        "allergens": allergens
    }
