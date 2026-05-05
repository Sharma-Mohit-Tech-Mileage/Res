#!/usr/bin/env python3
"""
Generate App Store-style promotional screenshots for Sparklight Residential app.
Each image has a branded gradient background, marketing text, and an iPhone mockup frame.
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont

# ──────────────────────────────────────────────
# Canvas & layout constants  (iPhone)
# ──────────────────────────────────────────────
CANVAS_W = 1284   # App Store 6.1" width
CANVAS_H = 2778   # App Store 6.1" height

# Brand gradient colours
GRAD_TOP    = (141, 59, 144)  # rgba(141, 59, 144, 1)
GRAD_BOTTOM = (141, 59, 144)  # rgba(141, 59, 144, 1)

# iPhone frame colour & geometry
FRAME_COLOR      = (28, 28, 30)
FRAME_RADIUS     = 90
FRAME_BORDER     = 10
DYNAMIC_ISLAND_W = 220
DYNAMIC_ISLAND_H = 48
DYNAMIC_ISLAND_R = 24

# Side button protrusion beyond phone body on each side
BTN_PAD = 18

# Text colours
TEXT_LABEL    = (255, 255, 255)
TEXT_HEADLINE = (255, 255, 255)
TEXT_BODY     = (255, 255, 255)

# Vertical layout
LABEL_Y_FRAC    = 0.06   # label top edge as fraction of height
HEADLINE_Y_FRAC = 0.05
BODY_Y_FRAC     = 0.10
PHONE_TOP_FRAC  = 0.27   # where phone frame starts (moved up)

# ──────────────────────────────────────────────
# Screen definitions
# ──────────────────────────────────────────────
SCREENS = [
    {
        "file":     "ios-home.png",
        "out":      "promo-home.png",
        "headline": "Everything you need\nin one place",
        "body":     "Manage billing, track services, and\nget support on the go.",
    },
    {
        "file":     "ios-billing.png",
        "out":      "promo-billing.png",
        "headline": "Payments \nmade simple",
        "body":     "Set it once and\nnever miss a due date.",
    },
    {
        "file":     "ios-services.png",
        "out":      "promo-services.png",
        "headline": "Your services. \nAll in one",
        "body":     "Internet, data, and \nmore — all at a glance.",
    },
    {
        "file":     "ios-billing-period.png",
        "out":      "promo-billing-period.png",
        "headline": "Stay on top\nof your data",
        "body":     "Monitor usage across every billing cycle\n anytime.",
    },
    {
        "file":     "ios-my-services.png",
        "out":      "promo-my-services.png",
        "headline": "Answers at \nyour fingertips",
        "body":     "Search FAQs, browse topics\nor contact us anytime.",
    },
    {
        "file":     "ios-profile.png",
        "out":      "promo-profile.png",
        "headline": "All your \naccount details",
        "body":     "Manage settings and\npersonal info with ease.",
    },
    {
        "file":     "ios-notifications.png",
        "out":      "promo-notifications.png",
        "headline": "Never miss \na thing",
        "body":     "Get notified for billing,\noutages, and more. ",
    },
    {
        "file":     "ios-feedback.png",
        "out":      "promo-feedback.png",
        "headline": "We want to\nhear from you",
        "body":     "Share your experience and help\nus improve our service.",
    },
    {
        "file":     "ios-data-usage.png",
        "out":      "promo-data-usage.png",
        "headline": "Your current \ndata snapshot",
        "body":     "Usage, remaining data,\nand billing period — all here.",
    },
]

# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────

def make_gradient(w, h, top_rgb, bottom_rgb):
    """Create a left→right linear gradient image (same as app: start x=0→x=1)."""
    img = Image.new("RGB", (w, h))
    px  = img.load()
    for x in range(w):
        t = x / (w - 1)
        r = int(top_rgb[0] + t * (bottom_rgb[0] - top_rgb[0]))
        g = int(top_rgb[1] + t * (bottom_rgb[1] - top_rgb[1]))
        b = int(top_rgb[2] + t * (bottom_rgb[2] - top_rgb[2]))
        for y in range(h):
            px[x, y] = (r, g, b)
    return img


# Radio Canada font candidates (prefer local bundled files, then system if available)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
RADIO_CANADA_FONTS = {
    "regular": [
        os.path.join(SCRIPT_DIR, "fonts", "RadioCanada-Regular.ttf"),
        os.path.join(SCRIPT_DIR, "RadioCanada-Regular.ttf"),
        "/System/Library/Fonts/Supplemental/RadioCanada-Regular.ttf",
    ],
    "bold": [
        os.path.join(SCRIPT_DIR, "fonts", "RadioCanada-Bold.ttf"),
        os.path.join(SCRIPT_DIR, "RadioCanada-Bold.ttf"),
        "/System/Library/Fonts/Supplemental/RadioCanada-Bold.ttf",
    ],
    "light": [
        os.path.join(SCRIPT_DIR, "fonts", "RadioCanada-Light.ttf"),
        os.path.join(SCRIPT_DIR, "RadioCanada-Light.ttf"),
        "/System/Library/Fonts/Supplemental/RadioCanada-Light.ttf",
    ],
    "medium": [
        os.path.join(SCRIPT_DIR, "fonts", "RadioCanada-Medium.ttf"),
        os.path.join(SCRIPT_DIR, "RadioCanada-Medium.ttf"),
        "/System/Library/Fonts/Supplemental/RadioCanada-Medium.ttf",
    ],
}


def load_font(size, weight="regular"):
    """Load Radio Canada at the requested weight and fail fast if unavailable."""
    candidates = RADIO_CANADA_FONTS.get(weight, RADIO_CANADA_FONTS["regular"])
    for font_path in candidates:
        if os.path.exists(font_path):
            try:
                return ImageFont.truetype(font_path, size)
            except Exception:
                pass

    searched_paths = "\n".join(candidates)
    raise RuntimeError(
        f"Radio Canada font is required but not found for weight '{weight}'.\n"
        f"Checked paths:\n{searched_paths}\n"
        "Please add RadioCanada-*.ttf files to screenshots/fonts/."
    )


def rounded_rect_mask(w, h, r):
    """Return an 'L' mode mask with rounded corners."""
    mask = Image.new("L", (w, h), 0)
    d    = ImageDraw.Draw(mask)
    d.rounded_rectangle([0, 0, w - 1, h - 1], radius=r, fill=255)
    return mask


def draw_centered_text(draw, text, y, font, color, canvas_w, line_spacing=1.25):
    """Draw multiline centred text; returns bottom y."""
    lines     = text.split("\n")
    bbox_h    = font.getbbox("Ay")[3]
    line_h    = int(bbox_h * line_spacing)
    total_h   = line_h * len(lines)
    current_y = y
    for line in lines:
        bb = font.getbbox(line)
        tw = bb[2] - bb[0]
        x  = (canvas_w - tw) // 2
        draw.text((x, current_y), line, font=font, fill=color)
        current_y += line_h
    return current_y


def build_phone_frame(screenshot_path, frame_w, frame_h):
    """
    Composite a screenshot inside an iPhone-shaped frame with visible side buttons.
    Canvas is (frame_w + BTN_PAD*2) wide so buttons aren't clipped.
    Returns RGBA image of size (frame_w + BTN_PAD*2, frame_h).
    """
    total_w = frame_w + BTN_PAD * 2
    frame   = Image.new("RGBA", (total_w, frame_h), (0, 0, 0, 0))
    draw    = ImageDraw.Draw(frame)
    ox      = BTN_PAD   # horizontal offset — phone body starts here

    # ── Phone body ──
    # Outer shell
    draw.rounded_rectangle(
        [ox, 0, ox + frame_w - 1, frame_h - 1],
        radius=FRAME_RADIUS,
        fill=FRAME_COLOR + (255,),
    )

    # Inner screen area
    sx = ox + FRAME_BORDER
    sy = FRAME_BORDER
    sw = frame_w - FRAME_BORDER * 2
    sh = frame_h - FRAME_BORDER * 2
    screen_r = FRAME_RADIUS - FRAME_BORDER + 4
    draw.rounded_rectangle(
        [sx, sy, sx + sw - 1, sy + sh - 1],
        radius=screen_r,
        fill=(0, 0, 0, 255),
    )

    # Paste screenshot
    if os.path.exists(screenshot_path):
        shot = Image.open(screenshot_path).convert("RGBA")
        shot = shot.resize((sw, sh), Image.LANCZOS)
        screen_mask = rounded_rect_mask(sw, sh, screen_r)
        frame.paste(shot, (sx, sy), screen_mask)

    btn_color = FRAME_COLOR + (255,)

    # ── Left side buttons — flush against phone body ──
    # Silent / Action button (short, near top)
    draw.rounded_rectangle(
        [ox - 10, int(frame_h * 0.22), ox, int(frame_h * 0.265)],
        radius=4, fill=btn_color,
    )
    # Volume Up
    draw.rounded_rectangle(
        [ox - 10, int(frame_h * 0.31), ox, int(frame_h * 0.385)],
        radius=4, fill=btn_color,
    )
    # Volume Down
    draw.rounded_rectangle(
        [ox - 10, int(frame_h * 0.40), ox, int(frame_h * 0.475)],
        radius=4, fill=btn_color,
    )

    # ── Right side buttons — flush against phone body ──
    # Power / Side button (tall)
    draw.rounded_rectangle(
        [ox + frame_w, int(frame_h * 0.30), ox + frame_w + 10, int(frame_h * 0.42)],
        radius=4, fill=btn_color,
    )

    return frame


def build_ipad_frame(screenshot_path, frame_w, frame_h):
    """
    Composite a screenshot inside an iPad Pro-shaped frame (no notch, slim bezels).
    Returns RGBA image of size (frame_w, frame_h).
    """
    IPAD_RADIUS = 60
    IPAD_BORDER = 18
    frame = Image.new("RGBA", (frame_w, frame_h), (0, 0, 0, 0))
    draw  = ImageDraw.Draw(frame)

    # Outer shell
    draw.rounded_rectangle(
        [0, 0, frame_w - 1, frame_h - 1],
        radius=IPAD_RADIUS,
        fill=FRAME_COLOR + (255,),
    )
    # Inner screen
    sx, sy = IPAD_BORDER, IPAD_BORDER
    sw, sh = frame_w - IPAD_BORDER * 2, frame_h - IPAD_BORDER * 2
    screen_r = IPAD_RADIUS - IPAD_BORDER + 4
    draw.rounded_rectangle(
        [sx, sy, sx + sw - 1, sy + sh - 1],
        radius=screen_r,
        fill=(0, 0, 0, 255),
    )
    if os.path.exists(screenshot_path):
        shot = Image.open(screenshot_path).convert("RGBA")
        shot = shot.resize((sw, sh), Image.LANCZOS)
        screen_mask = rounded_rect_mask(sw, sh, screen_r)
        frame.paste(shot, (sx, sy), screen_mask)

    # Home-bar indicator (bottom centre)
    bar_w, bar_h = int(frame_w * 0.28), 8
    bar_x = (frame_w - bar_w) // 2
    bar_y = frame_h - IPAD_BORDER + 4
    draw.rounded_rectangle(
        [bar_x, bar_y, bar_x + bar_w, bar_y + bar_h],
        radius=4, fill=(80, 80, 85, 200),
    )
    # Power button — top edge centre-right
    pb_w, pb_h = 60, 8
    pb_x = int(frame_w * 0.65)
    draw.rounded_rectangle(
        [pb_x, -4, pb_x + pb_w, 4],
        radius=4, fill=FRAME_COLOR + (255,),
    )
    # Volume Up — right side top
    draw.rounded_rectangle(
        [frame_w - 4, int(frame_h * 0.28), frame_w + 8, int(frame_h * 0.34)],
        radius=4, fill=FRAME_COLOR + (255,),
    )
    # Volume Down — right side
    draw.rounded_rectangle(
        [frame_w - 4, int(frame_h * 0.36), frame_w + 8, int(frame_h * 0.42)],
        radius=4, fill=FRAME_COLOR + (255,),
    )
    return frame


def generate_ipad(screen, script_dir):
    src  = os.path.join(script_dir, screen["file"])
    dest = os.path.join(script_dir, screen["out"])

    print(f"  Generating {screen['out']} ...", end=" ", flush=True)

    cw, ch = IPAD_W, IPAD_H

    # Gradient background
    canvas = make_gradient(cw, ch, GRAD_TOP, GRAD_BOTTOM).convert("RGBA")
    draw   = ImageDraw.Draw(canvas)

    # Fonts — scale up for larger canvas
    font_headline = load_font(160, weight="bold")
    font_body     = load_font(78, weight="light")

    headline_y = int(ch * 0.05)
    body_start = draw_centered_text(draw, screen["headline"], headline_y, font_headline, TEXT_HEADLINE, cw, 1.12)
    body_y = body_start + 70
    draw_centered_text(draw, screen["body"], body_y, font_body, TEXT_BODY, cw, 1.35)

    # iPad frame — use phone aspect scaled to canvas
    pad = 20
    phone_top = int(ch * 0.28)
    phone_h   = ch - phone_top - int(ch * 0.04)
    phone_w   = int(phone_h * (390 / 844))   # portrait phone aspect ratio
    frame_img = build_ipad_frame(src, phone_w, phone_h)
    px = (cw - phone_w) // 2
    canvas.paste(frame_img, (px, phone_top), frame_img)

    # Rounded canvas corners
    canvas_mask = rounded_rect_mask(cw, ch, 120)
    canvas.putalpha(canvas_mask)

    canvas.save(dest, "PNG", optimize=True)
    print("✓")
    return dest


def build_android_frame(screenshot_path, frame_w, frame_h):
    """
    Pixel/Samsung-style Android device:
    - Flat aluminium sides, very slightly rounded corners
    - Punch-hole camera centred at top
    - Volume Up/Down + Power on the right side
    - Thin bottom chin
    Canvas is (frame_w + 20) wide to accommodate side buttons.
    Returns RGBA image.
    """
    AND_RADIUS  = 55    # corner radius
    AND_BORDER  = 14    # bezel thickness
    AND_BTN_PAD = 14    # how far buttons protrude
    BODY_COLOR  = (22, 22, 26, 255)          # near-black aluminium body
    RIM_COLOR   = (50, 50, 56, 255)          # subtle lighter rim
    BTN_COLOR   = (38, 38, 44, 255)          # side button colour

    total_w = frame_w + AND_BTN_PAD
    frame   = Image.new("RGBA", (total_w, frame_h), (0, 0, 0, 0))
    draw    = ImageDraw.Draw(frame)

    # Outer rim (1-px lighter band)
    draw.rounded_rectangle(
        [0, 0, frame_w - 1, frame_h - 1],
        radius=AND_RADIUS, fill=RIM_COLOR,
    )
    # Main body (inset 2px)
    draw.rounded_rectangle(
        [2, 2, frame_w - 3, frame_h - 3],
        radius=AND_RADIUS - 2, fill=BODY_COLOR,
    )

    # Screen area
    sx, sy = AND_BORDER, AND_BORDER
    sw, sh = frame_w - AND_BORDER * 2, frame_h - AND_BORDER * 2
    screen_r = AND_RADIUS - AND_BORDER + 4
    draw.rounded_rectangle(
        [sx, sy, sx + sw - 1, sy + sh - 1],
        radius=screen_r, fill=(0, 0, 0, 255),
    )

    # Paste screenshot
    if os.path.exists(screenshot_path):
        shot = Image.open(screenshot_path).convert("RGBA")
        shot = shot.resize((sw, sh), Image.LANCZOS)
        screen_mask = rounded_rect_mask(sw, sh, screen_r)
        frame.paste(shot, (sx, sy), screen_mask)

    # Punch-hole camera — centred, near top of screen
    hole_r  = 22
    hole_cx = frame_w // 2
    hole_cy = sy + 42
    draw.ellipse(
        [hole_cx - hole_r, hole_cy - hole_r, hole_cx + hole_r, hole_cy + hole_r],
        fill=(10, 10, 12, 255),
    )
    # Inner lens glint
    draw.ellipse(
        [hole_cx - 10, hole_cy - 10, hole_cx + 10, hole_cy + 10],
        fill=(20, 20, 25, 255),
    )

    # Right side buttons (protrude into AND_BTN_PAD area)
    rx0 = frame_w - 3
    rx1 = frame_w + AND_BTN_PAD - 1
    # Volume Up
    draw.rounded_rectangle(
        [rx0, int(frame_h * 0.28), rx1, int(frame_h * 0.345)],
        radius=4, fill=BTN_COLOR,
    )
    # Volume Down
    draw.rounded_rectangle(
        [rx0, int(frame_h * 0.36), rx1, int(frame_h * 0.425)],
        radius=4, fill=BTN_COLOR,
    )
    # Power button (slightly taller, offset lower)
    draw.rounded_rectangle(
        [rx0, int(frame_h * 0.48), rx1, int(frame_h * 0.57)],
        radius=4, fill=BTN_COLOR,
    )

    return frame


# ──────────────────────────────────────────────
# Main generation
# ──────────────────────────────────────────────

def generate(screen, script_dir):
    src  = os.path.join(script_dir, screen["file"])
    dest = os.path.join(script_dir, screen["out"])

    print(f"  Generating {screen['out']} ...", end=" ", flush=True)

    # 1. Gradient background
    canvas = make_gradient(CANVAS_W, CANVAS_H, GRAD_TOP, GRAD_BOTTOM).convert("RGBA")
    draw   = ImageDraw.Draw(canvas)

    # 2. Subtle wave/glow at bottom (semi-transparent ellipse)
    glow_w, glow_h = int(CANVAS_W * 1.4), int(CANVAS_H * 0.35)
    glow = Image.new("RGBA", (glow_w, glow_h), (0, 0, 0, 0))
    gd   = ImageDraw.Draw(glow)
    gd.ellipse([0, 0, glow_w - 1, glow_h - 1], fill=(0, 40, 100, 80))
    cx = (CANVAS_W - glow_w) // 2
    canvas.paste(glow, (cx, CANVAS_H - glow_h + 80), glow)

    # 3. Fonts  — Bold headline / Light body
    font_headline = load_font(118, weight="bold")
    font_body     = load_font(58, weight="light")

    # 4. Headline  — bold, mixed case, tight line spacing like reference
    headline_y = int(CANVAS_H * HEADLINE_Y_FRAC)
    body_start = draw_centered_text(draw, screen["headline"], headline_y, font_headline, TEXT_HEADLINE, CANVAS_W, 1.12)

    # 6. Body text — tightened spacing below headline
    body_y = body_start + 55
    draw_centered_text(draw, screen["body"], body_y, font_body, TEXT_BODY, CANVAS_W, 1.35)

    # 7. Phone frame
    phone_top  = int(CANVAS_H * PHONE_TOP_FRAC)
    phone_h    = CANVAS_H - phone_top - int(CANVAS_H * 0.05)
    # Slightly wider phone to increase visible screenshot width
    phone_w    = int(phone_h * (400 / 852))
    frame_img  = build_phone_frame(src, phone_w, phone_h)

    # frame_img is wider than phone_w by BTN_PAD on each side — centre on phone body
    px = (CANVAS_W - phone_w) // 2
    canvas.paste(frame_img, (px - BTN_PAD, phone_top), frame_img)

    # 8. Rounded corners on the canvas
    canvas_mask = rounded_rect_mask(CANVAS_W, CANVAS_H, 120)
    canvas.putalpha(canvas_mask)

    # 9. Save
    canvas.save(dest, "PNG", optimize=True)
    print(f"✓")
    return dest


if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))

    print(f"Generating {len(SCREENS)} iPhone promotional screenshots …\n")
    for s in SCREENS:
        generate(s, script_dir)
    print("\nDone! Files saved in:", script_dir)
