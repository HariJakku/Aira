"""
AIRA Platform — AI Image Processor
===================================
Reads images from a folder (or a ZIP), runs OCR (Tesseract) to detect and
extract text, removes text via OpenCV inpainting, and writes a JSON manifest
consumed by the Next.js API routes.

Usage:
    # Directly from a folder of images (recommended)
    python scripts/process_images.py --input images/ --out public/gallery

    # Also accepts a ZIP if you need it
    python scripts/process_images.py --input path/to/images.zip --out public/gallery

Requirements:
    pip install opencv-python-headless pillow pytesseract numpy
    System: sudo apt install tesseract-ocr   (or brew install tesseract on macOS)
"""

import argparse
import json
import os
import re
import shutil
import zipfile
from pathlib import Path

import cv2
import numpy as np
import pytesseract
from PIL import Image


# ─────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────

SUPPORTED_EXT = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}

# Lines matching these patterns are captured as structured specs —
# strip them from display_text so the modal doesn't show them twice.
SPEC_LINE_PATTERNS = [
    r"(?:CODE|GODE|BODE)\s*[-—:*]?\s*[A-Z0-9\-]+",   # product code
    r"SIZE\s*[-—:]",                                    # size spec
    r"WEIGHT\s*[-—:APP. ]*",                            # weight spec
    r"PACK(?:ING)?\s*[-—:]",                            # packing spec
    r"GOLD PLATED",                                     # material labels
    r"SILVER PLATED",
    r"GERMAN SILVER",
    r"^\s*BRASS\s*$",
    r"POWDER COATED IRON",
]


def get_images(input_path: str) -> list[Path]:
    """
    Accept either a folder of images or a ZIP file.
    Returns a naturally-sorted list of image Paths ready to process.
    """
    p = Path(input_path)

    if p.is_dir():
        # ── Folder mode (recommended) ─────────────────────────
        images = sorted(
            [f for f in p.rglob("*") if f.suffix.lower() in SUPPORTED_EXT],
            key=lambda f: _natural_sort_key(f.name),
        )
        print(f"📂  Reading from folder: {p}  ({len(images)} image(s) found)")
        return images

    elif p.suffix.lower() == ".zip":
        # ── ZIP mode (still supported) ────────────────────────
        tmp = Path("/tmp/aira_images")
        if tmp.exists():
            import shutil as _sh; _sh.rmtree(tmp)
        tmp.mkdir(parents=True)
        print(f"📦  Extracting ZIP: {p} …")
        with zipfile.ZipFile(str(p), "r") as zf:
            zf.extractall(tmp)
        images = sorted(
            [f for f in tmp.rglob("*") if f.suffix.lower() in SUPPORTED_EXT],
            key=lambda f: _natural_sort_key(f.name),
        )
        print(f"    Extracted {len(images)} image(s)")
        return images

    else:
        raise ValueError(f"--input must be a folder or a .zip file, got: {input_path}")


def _natural_sort_key(s: str):
    """Sort I2 before I10."""
    return [int(c) if c.isdigit() else c.lower() for c in re.split(r"(\d+)", s)]


# ─────────────────────────────────────────────────────────────
# OCR
# ─────────────────────────────────────────────────────────────

def run_ocr(img_path: Path):
    """
    Returns:
        full_text  – cleaned extracted string
        bboxes     – list of {x,y,w,h,text,conf} dicts for confident words
    """
    pil_img = Image.open(img_path).convert("RGB")

    # Full text (PSM 3 = fully automatic page segmentation)
    full_text = pytesseract.image_to_string(pil_img, config="--psm 3").strip()

    # Per-word bounding boxes
    data = pytesseract.image_to_data(
        pil_img, config="--psm 3", output_type=pytesseract.Output.DICT
    )

    bboxes = []
    for i in range(len(data["text"])):
        word = data["text"][i].strip()
        conf = int(data["conf"][i])
        if word and conf > 40:
            bboxes.append(
                {
                    "x": int(data["left"][i]),
                    "y": int(data["top"][i]),
                    "w": int(data["width"][i]),
                    "h": int(data["height"][i]),
                    "text": word,
                    "conf": conf,
                }
            )

    return full_text, bboxes


# ─────────────────────────────────────────────────────────────
# TEXT REMOVAL
# ─────────────────────────────────────────────────────────────

def remove_text(img_bgr: np.ndarray, bboxes: list[dict], pad: int = 5) -> np.ndarray:
    """
    Build a binary mask from bounding boxes and inpaint over it.
    Falls back to Gaussian blur per region if inpainting fails.
    """
    if not bboxes:
        return img_bgr

    h, w = img_bgr.shape[:2]
    mask = np.zeros((h, w), dtype=np.uint8)

    for bb in bboxes:
        x1 = max(0, bb["x"] - pad)
        y1 = max(0, bb["y"] - pad)
        x2 = min(w, bb["x"] + bb["w"] + pad)
        y2 = min(h, bb["y"] + bb["h"] + pad)
        mask[y1:y2, x1:x2] = 255

    try:
        cleaned = cv2.inpaint(img_bgr, mask, inpaintRadius=5, flags=cv2.INPAINT_TELEA)
    except Exception:
        # Fallback: blur each region individually
        cleaned = img_bgr.copy()
        for bb in bboxes:
            x1 = max(0, bb["x"] - pad)
            y1 = max(0, bb["y"] - pad)
            x2 = min(w, bb["x"] + bb["w"] + pad)
            y2 = min(h, bb["y"] + bb["h"] + pad)
            roi = cleaned[y1:y2, x1:x2]
            if roi.size > 0:
                k = max(3, min(25, ((x2 - x1) // 4) | 1))  # odd kernel
                cleaned[y1:y2, x1:x2] = cv2.GaussianBlur(roi, (k, k), 0)

    return cleaned


# ─────────────────────────────────────────────────────────────
# PRODUCT PARSING
# ─────────────────────────────────────────────────────────────

CATEGORY_RULES = [
    ("🏺 Urli & Planters",          r"URLI|PLANTER"),
    ("🧺 Decorative Baskets",        r"BASKET"),
    ("🥂 Trays & Jar Sets",          r"TRAY|JAR\s*SET|JAR"),
    ("✨ Gold Plated Collection",    r"GOLD PLATED"),
    ("🪙 Silver Plated Collection",  r"SILVER PLATED|GERMAN SILVER"),
    ("🎁 Premium Gift Items",        r".*"),   # catch-all
]


def _is_spec_line(line: str) -> bool:
    """Return True if this line's content is already captured as a structured spec."""
    for pattern in SPEC_LINE_PATTERNS:
        if re.search(pattern, line, re.IGNORECASE):
            return True
    return False


def parse_product(text: str, img_id: str):
    """Parse OCR text into structured product fields."""
    code_m = re.search(r"(?:CODE|GODE|BODE)[^\w]*([A-Z0-9\-]+)", text, re.IGNORECASE)
    code = code_m.group(1).strip("-— ") if code_m else None

    materials = []
    if re.search(r"GOLD PLATED", text, re.IGNORECASE):        materials.append("Gold Plated")
    if re.search(r"SILVER PLATED", text, re.IGNORECASE):      materials.append("Silver Plated")
    if re.search(r"GERMAN SILVER", text, re.IGNORECASE):      materials.append("German Silver")
    if re.search(r"BRASS", text, re.IGNORECASE):              materials.append("Pure Brass")
    if re.search(r"POWDER COATED IRON", text, re.IGNORECASE): materials.append("Powder Coated Iron")

    ptype = "Gift Item"
    if re.search(r"URLI|PLANTER", text, re.IGNORECASE):  ptype = "Urli / Planter"
    if re.search(r"BASKET", text, re.IGNORECASE):         ptype = "Decorative Basket"
    if re.search(r"TRAY", text, re.IGNORECASE):           ptype = "Decorative Tray"
    if re.search(r"JAR", text, re.IGNORECASE):            ptype += " with Jars"

    size_m   = re.search(r"SIZE\s*[-—:]\s*([^\n]+)", text, re.IGNORECASE)
    weight_m = re.search(r"WEIGHT\s*[-—:APP. ]*([^\n]+)", text, re.IGNORECASE)
    pack_m   = re.search(r"PACK(?:ING)?\s*[-—:]\s*([^\n]+)", text, re.IGNORECASE)

    specs: dict[str, str] = {}
    if code:      specs["Code"]     = code
    if materials: specs["Material"] = " & ".join(materials)
    if size_m:    specs["Size"]     = size_m.group(1).strip()
    if weight_m:  specs["Weight"]   = weight_m.group(1).strip()
    if pack_m:    specs["Packing"]  = pack_m.group(1).strip()

    # Title
    if materials and code:
        title = f"{'  & '.join(materials)} {ptype} ({code})"
    elif materials:
        title = f"{' & '.join(materials)} {ptype}"
    elif code:
        title = f"{ptype} ({code})"
    else:
        title = f"Premium {ptype}"

    # Category
    category = "🎁 Premium Gift Items"
    for cat_name, pattern in CATEGORY_RULES:
        if re.search(pattern, text, re.IGNORECASE):
            category = cat_name
            break

    # ── FIX: Strip lines already captured as specs ──────────────
    # This prevents the modal from showing the same info twice
    # (once in the structured specs panel, once in the OCR text block).
    JUNK = {"*", "—", "·", "°", "-", "|", "~"}
    extra_lines = []
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if stripped in JUNK:
            continue
        if _is_spec_line(stripped):
            continue  # already captured in specs dict — skip
        extra_lines.append(stripped)

    display = "\n".join(extra_lines).strip()

    # Only mark hasText=True when there's genuinely extra information
    # beyond what's already in specs (e.g. a brand name, description, note)
    has_text = bool(display) and len(extra_lines) > 0

    return title, display, specs, category


# ─────────────────────────────────────────────────────────────
# MAIN PIPELINE
# ─────────────────────────────────────────────────────────────

def process(input_path: str, out_dir: str, quality: int = 88):
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)

    # Step 1 — collect images (folder or ZIP, both supported)
    images = get_images(input_path)

    results = []

    for idx, img_path in enumerate(images, start=1):
        img_id = f"I{idx}"
        print(f"\n[{idx}/{len(images)}] {img_path.name}", end="  ")

        # Step 2 — read image
        img_bgr = cv2.imread(str(img_path))
        if img_bgr is None:
            print("⚠  SKIP (unreadable)")
            continue
        h, w = img_bgr.shape[:2]

        # Step 3 — OCR
        full_text, bboxes = run_ocr(img_path)
        print(f"OCR: {len(bboxes)} word(s)", end="  ")

        # Step 4 — inpaint / remove text
        cleaned = remove_text(img_bgr, bboxes)

        # Step 5 — save cleaned image
        out_file = out / f"{img_id}.jpg"
        cv2.imwrite(str(out_file), cleaned, [cv2.IMWRITE_JPEG_QUALITY, quality])
        print(f"→  {out_file.name}", end="  ")

        # Step 6 — parse product info
        title, display_text, specs, category = parse_product(full_text, img_id)
        print(f"🏷  {title[:50]}")

        results.append(
            {
                "id":       img_id,
                "index":    idx,
                "image":    f"/gallery/{img_id}.jpg",
                "title":    title,
                # text now only contains info NOT already shown in specs
                "text":     display_text if display_text else "",
                "specs":    specs,
                "category": category,
                # hasText=True only if there's genuinely extra OCR info
                "hasText":  bool(display_text),
                "width":    w,
                "height":   h,
            }
        )

    # Step 7 — write manifest
    manifest_path = out / "manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\n\n✅  Done — {len(results)} images → {out}")
    print(f"📄  Manifest: {manifest_path}")
    return results


# ─────────────────────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AIRA AI Image Processor")
    parser.add_argument(
        "--input", required=True,
        help="Path to a folder of images OR a .zip file  (e.g. images/  or  photos.zip)"
    )
    parser.add_argument("--out",     default="public/gallery", help="Output directory (default: public/gallery)")
    parser.add_argument("--quality", default=88, type=int,     help="JPEG output quality 1-100 (default: 88)")
    args = parser.parse_args()

    process(args.input, args.out, args.quality)