#!/usr/bin/env python3
"""
Generate App Store-style promotional screenshots for Sparklight Residential app.
Each image has a branded gradient background, marketing text, and an iPhone mockup frame.
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont

# ──────────────────────────────────────────────
# Canvas & layout constants
# ──────────────────────────────────────────────
CANVAS_W = 1290   # App Store 6.7" width
CANVAS_H = 2796   # App Store 6.7" height

# Brand gradient colours
GRAD_TOP    = (141, 59, 144)  # rgba(141, 59, 144, 1)
GRAD_BOTTOM = (141, 59, 144)  # rgba(141, 59, 144, 1)

# iPhone frame colour & geometry
FRAME_COLOR      = (28, 28, 30)
FRAME_RADIUS     = 90
FRAME_BORDER     = 18
DYNAMIC_ISLAND_W = 220
DYNAMIC_ISLAND_H = 48
DYNAMIC_ISLAND_R = 24

# Text colours
TEXT_LABEL    = (255, 255, 255)   # small caps label
TEXT_HEADLINE = (255, 255, 255)   # big headline
TEXT_BODY     = (210, 235, 255)   # description

# Vertical layout
LABEL_Y_FRAC    = 0.06   # label top edge as fraction of height
HEADLINE_Y_FRAC = 0.10
BODY_Y_FRAC     = 0.22
PHONE_TOP_FRAC  = 0.32   # where phone frame starts

# ──────────────────────────────────────────────
# Screen definitions
# ──────────────────────────────────────────────
SCREENS = [
    {
        "file":     "ios-home.png",
        "out":      "promo-home.png",
        "label":    "GET STARTED",
        "headline": "Everything you need\nin one place",
        "body":     "Manage billing, track services, and\nget support on the go.",
    },
    {
        "file":     "ios-billing.png",
        "out":      "promo-billing.png",
        "label":    "BILLING & PAYMENTS",
        "headline": "Payments \nmade simple",
        "body":     "Set it once and\nnever miss a due date.",
    },
    {
        "file":     "ios-services.png",
        "out":      "promo-services.png",
        "label":    "SERVICE HUB ",
        "headline": "Your services. \nAll in one",
        "body":     "Internet, data, and \nmore — all at a glance.",
    },
    {
        "file":     "ios-billing-period.png",
        "out":      "promo-billing-period.png",
        "label":    "DATA USAGE",
        "headline": "Stay on top\nof your data",
        "body":     "Monitor usage across every billing cycle\n anytime.",
    },
    {
        "file":     "ios-my-services.png",
        "out":      "promo-my-services.png",
        "label":    "HELP & SUPPORT ",
        "headline": "Answers at \nyour fingertips",
        "body":     "Search FAQs, browse topics\nor contact us anytime.",
    },
    {
        "file":     "ios-profile.png",
        "out":      "promo-profile.png",
        "label":    "YOUR PROFILE ",
        "headline": "All your \naccount details",
        "body":     "Manage settings and\npersonal info with ease.",
    },
    {
        "file":     "ios-notifications.png",
        "out":      "promo-notifications.png",
        "label":    "NOTIFICATIONS",
        "headline": "Never miss \na thing",
        "body":     "Get notified for billing,\noutages, and more. ",
    },
    {
        "file":     "ios-feedback.png",
        "out":      "promo-feedback.png",
        "label":    "FEEDBACK",
        "headline": "We want to\nhear from you",
        "body":     "Share your experience and help\nus improve our service.",
    },
    {
        "file":     "ios-data-usage.png",
        "out":      "promo-data-usage.png",
        "label":    "DATA USAGE ",
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


# HelveticaNeue TTC font indices
# 0=Regular, 1=Bold, 4=CondensedBold, 5=UltraLight, 7=Light, 10=Medium, 12=Thin
HELVETICA_NEUE = "/System/Library/Fonts/HelveticaNeue.ttc"
HN_REGULAR        = 0
HN_BOLD           = 1
HN_LIGHT          = 7
HN_MEDIUM         = 10


def load_font(size, weight="regular"):
    """Load Helvetica Neue at the requested weight; fall back to Arial if unavailable."""
    weight_map = {
        "regular": HN_REGULAR,
        "bold":    HN_BOLD,
        "light":   HN_LIGHT,
        "medium":  HN_MEDIUM,
    }
    idx = weight_map.get(weight, HN_REGULAR)
    if os.path.exists(HELVETICA_NEUE):
        try:
            return ImageFont.truetype(HELVETICA_NEUE, size, index=idx)
        except Exception:
            pass
    # Fallback
    fallback = "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if weight == "bold" \
               else "/System/Library/Fonts/Supplemental/Arial.ttf"
    if os.path.exists(fallback):
        return ImageFont.truetype(fallback, size)
    return ImageFont.load_default()


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


def draw_spaced_label(draw, text, y, font, color, canvas_w, letter_spacing=18):
    """Draw a single-line label with wide letter-spacing, centred on canvas_w."""
    chars = list(text)
    # Measure total width including spacing
    total_w = 0
    char_widths = []
    for ch in chars:
        bb = font.getbbox(ch)
        cw = bb[2] - bb[0]
        char_widths.append(cw)
        total_w += cw
    total_w += letter_spacing * (len(chars) - 1)

    x = (canvas_w - total_w) // 2
    for ch, cw in zip(chars, char_widths):
        draw.text((x, y), ch, font=font, fill=color)
        x += cw + letter_spacing

    # Return bottom y
    return y + font.getbbox("Ay")[3]


def build_phone_frame(screenshot_path, frame_w, frame_h):
    """
    Composite a screenshot inside an iPhone-shaped frame.
    Returns RGBA image of size (frame_w, frame_h).
    """
    frame = Image.new("RGBA", (frame_w, frame_h), (0, 0, 0, 0))
    draw  = ImageDraw.Draw(frame)

    # Outer shell
    draw.rounded_rectangle(
        [0, 0, frame_w - 1, frame_h - 1],
        radius=FRAME_RADIUS,
        fill=FRAME_COLOR + (255,),
    )

    # Inner screen area
    sx = FRAME_BORDER
    sy = FRAME_BORDER
    sw = frame_w  - FRAME_BORDER * 2
    sh = frame_h  - FRAME_BORDER * 2
    draw.rounded_rectangle(
        [sx, sy, sx + sw - 1, sy + sh - 1],
        radius=FRAME_RADIUS - FRAME_BORDER + 4,
        fill=(0, 0, 0, 255),
    )

    # Paste screenshot into screen area
    if os.path.exists(screenshot_path):
        shot = Image.open(screenshot_path).convert("RGBA")
        shot = shot.resize((sw, sh), Image.LANCZOS)
        screen_mask = rounded_rect_mask(sw, sh, FRAME_RADIUS - FRAME_BORDER + 4)
        frame.paste(shot, (sx, sy), screen_mask)

    # Dynamic island pill (centred at top)
    di_x = (frame_w - DYNAMIC_ISLAND_W) // 2
    di_y = sy + 18
    draw.rounded_rectangle(
        [di_x, di_y, di_x + DYNAMIC_ISLAND_W, di_y + DYNAMIC_ISLAND_H],
        radius=DYNAMIC_ISLAND_R,
        fill=FRAME_COLOR + (255,),
    )

    # Thin side buttons (right side)
    btn_x = frame_w - 6
    for by, bh in [(frame_h * 0.30, frame_h * 0.08), (frame_h * 0.42, frame_h * 0.14)]:
        draw.rounded_rectangle(
            [btn_x, int(by), btn_x + 5, int(by + bh)],
            radius=3,
            fill=(60, 60, 65, 255),
        )
    # Left side buttons
    for by, bh in [(frame_h * 0.22, frame_h * 0.06), (frame_h * 0.31, frame_h * 0.10), (frame_h * 0.44, frame_h * 0.10)]:
        draw.rounded_rectangle(
            [-5, int(by), 0, int(by + bh)],
            radius=3,
            fill=(60, 60, 65, 255),
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

    # 3. Fonts  — thin spaced label / Bold headline / Light body
    font_label    = load_font(46, weight="light")
    font_headline = load_font(118, weight="bold")
    font_body     = load_font(58, weight="light")

    # 4. Label: ALL CAPS with wide letter-spacing (matches reference style)
    label_y = int(CANVAS_H * LABEL_Y_FRAC)
    draw_spaced_label(draw, screen["label"].strip(), label_y, font_label, TEXT_LABEL, CANVAS_W, letter_spacing=18)

    # 5. Headline  — bold, mixed case, tight line spacing like reference
    headline_y = int(CANVAS_H * HEADLINE_Y_FRAC)
    body_start = draw_centered_text(draw, screen["headline"], headline_y, font_headline, TEXT_HEADLINE, CANVAS_W, 1.12)

    # 6. Body text — light weight, slightly looser
    body_y = body_start + 50
    draw_centered_text(draw, screen["body"], body_y, font_body, TEXT_BODY, CANVAS_W, 1.35)

    # 7. Phone frame
    phone_top  = int(CANVAS_H * PHONE_TOP_FRAC)
    phone_h    = CANVAS_H - phone_top - int(CANVAS_H * 0.01)
    phone_w    = int(phone_h * (393 / 852))   # iPhone 15 Pro aspect ratio
    frame_img  = build_phone_frame(src, phone_w, phone_h)

    px = (CANVAS_W - phone_w) // 2
    canvas.paste(frame_img, (px, phone_top), frame_img)

    # 8. Save
    canvas.convert("RGB").save(dest, "PNG", optimize=True)
    print(f"✓")
    return dest


if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"Generating {len(SCREENS)} promotional screenshots …\n")
    for s in SCREENS:
        generate(s, script_dir)
    print("\nDone! Files saved in:", script_dir)
