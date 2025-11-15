from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import product, ai, auth

app = FastAPI(title="Ingredient Scanner Backend")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["*"]
)

app.include_router(product.router)
app.include_router(ai.router)
app.include_router(auth.router, prefix="/auth", tags=["auth"])

@app.get("/")
def root():
    return {"message": "Ingredient Scanner Backend Running"}
