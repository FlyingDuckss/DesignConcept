from fastapi import FastAPI
from routes.scan import router as scan_router
from fastapi.middleware.cors import CORSMiddleware
from db import models, database
from routes.scan_history_routes import router as scan_history_router
from routes.dataset_routes import router as dataset_router
from routes.model_admin_routes import router as model_router
from routes.retrain_route import router as retrain_router

app = FastAPI()

app.include_router(scan_router, prefix="/api/scan")
app.include_router(scan_history_router, prefix="/api/scans")
app.include_router(dataset_router, prefix="/api/datasets")
app.include_router(model_router, prefix="/api/model")
app.include_router(retrain_router, prefix="/api/model")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # <-- React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine)