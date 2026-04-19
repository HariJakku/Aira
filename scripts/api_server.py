"""
AIRA Platform — Standalone Image API Server
============================================
Run this ONLY if you need the API outside of Next.js (e.g., a separate
microservice). The Next.js app already has built-in API routes at
/api/images and /api/images/[id] — those are the preferred approach.

Usage:
    pip install fastapi uvicorn
    python scripts/api_server.py --gallery public/gallery --port 8000

Endpoints:
    GET /images              → list all images (supports ?category= and ?q=)
    GET /images/{id}         → single image by id
    GET /health              → health check
"""

import argparse
import json
import re
from pathlib import Path

try:
    from fastapi import FastAPI, HTTPException, Query
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.staticfiles import StaticFiles
    import uvicorn
except ImportError:
    raise SystemExit(
        "Missing dependencies. Run:\n"
        "  pip install fastapi uvicorn python-multipart"
    )

app = FastAPI(title="AIRA Image API", version="1.0.0")

# CORS — allow Next.js dev server and production domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://aira-blush.vercel.app", "*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

MANIFEST: list[dict] = []
GALLERY_DIR = "public/gallery"


def load_manifest():
    global MANIFEST
    p = Path(GALLERY_DIR) / "manifest.json"
    if not p.exists():
        raise FileNotFoundError(f"manifest.json not found at {p}. Run process_images.py first.")
    with open(p, encoding="utf-8") as f:
        MANIFEST = json.load(f)
    print(f"✅  Loaded {len(MANIFEST)} images from manifest")


@app.on_event("startup")
def startup():
    load_manifest()


@app.get("/health")
def health():
    return {"status": "ok", "images": len(MANIFEST)}


@app.get("/images")
def list_images(
    category: str = Query(None, description="Filter by category name"),
    q:        str = Query(None, description="Full-text search across title, text, specs"),
):
    """Return all processed images with optional filtering."""
    result = MANIFEST

    if category:
        result = [x for x in result if x.get("category") == category]

    if q:
        ql = q.lower()
        def matches(item):
            return (
                ql in item.get("title", "").lower()
                or ql in item.get("text", "").lower()
                or ql in item.get("category", "").lower()
                or any(ql in str(v).lower() for v in item.get("specs", {}).values())
            )
        result = [x for x in result if matches(x)]

    categories = list(dict.fromkeys(x["category"] for x in MANIFEST))

    return {
        "images":     result,
        "total":      len(result),
        "categories": categories,
    }


@app.get("/images/{img_id}")
def get_image(img_id: str):
    """Return a single image by id (e.g. I7)."""
    item = next((x for x in MANIFEST if x["id"] == img_id), None)
    if not item:
        raise HTTPException(status_code=404, detail=f"Image '{img_id}' not found")
    return item


# ─────────────────────────────────────────────────────────────
# Static file serving (processed images)
# ─────────────────────────────────────────────────────────────
# Mount after all routes so /images route takes priority

def mount_static(gallery_dir: str):
    gallery_path = Path(gallery_dir)
    if gallery_path.exists():
        app.mount("/gallery", StaticFiles(directory=str(gallery_path)), name="gallery")
        print(f"📁  Serving static files from {gallery_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AIRA Image API Server")
    parser.add_argument("--gallery", default="public/gallery", help="Path to gallery directory with manifest.json")
    parser.add_argument("--host",    default="0.0.0.0",        help="Bind host (default: 0.0.0.0)")
    parser.add_argument("--port",    default=8000, type=int,   help="Port (default: 8000)")
    args = parser.parse_args()

    GALLERY_DIR = args.gallery
    mount_static(args.gallery)

    print(f"🚀  Starting AIRA Image API on http://{args.host}:{args.port}")
    uvicorn.run(app, host=args.host, port=args.port, reload=False)
