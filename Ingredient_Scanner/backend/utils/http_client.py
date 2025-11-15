import httpx

async def get(url: str, params: dict | None = None, timeout: int = 10):
    async with httpx.AsyncClient(timeout=timeout) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        return r.json()
