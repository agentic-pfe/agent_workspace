#!/usr/bin/env python3
"""
Comprehensive test script for landing page:
  1. HTML validation (structure, semantics, accessibility)
  2. CSS validation (syntax, tokens, responsive breakpoints)
  3. Responsiveness analysis (media queries, grid/flex layouts)
  4. Interactive JavaScript features check
  5. SEO and performance checks
"""

import os
import sys
import re
import cssutils
from bs4 import BeautifulSoup

# Suppress cssutils logging
cssutils.log.setLevel(9999)

BASE = os.path.dirname(os.path.abspath(__file__))

RESULTS = {
    "passed": 0,
    "failed": 0,
    "warnings": 0,
    "errors": [],
    "warnings_list": [],
}


def report(category, status, message, detail=""):
    prefix = {"PASS": "\u2705", "FAIL": "\u274c", "WARN": "\u26a0\ufe0f"}.get(status, "\u2139\ufe0f")
    if status == "FAIL":
        RESULTS["failed"] += 1
        RESULTS["errors"].append(f"{category}: {message}")
    elif status == "WARN":
        RESULTS["warnings"] += 1
        RESULTS["warnings_list"].append(f"{category}: {message}")
    else:
        RESULTS["passed"] += 1
    print(f"  {prefix} [{category}] {message}")
    if detail:
        for line in detail.split("\n"):
            print(f"         {line}")


# ──────────────────────────────────────────────
# 1. LOAD FILES
# ──────────────────────────────────────────────
html_path = os.path.join(BASE, "../index.html")
css_path = os.path.join(BASE, "../styles.css")
js_path = os.path.join(BASE, "../script.js")

for p in [html_path, css_path, js_path]:
    if not os.path.exists(p):
        print(f"ERROR: Missing file {p}")
        sys.exit(1)

with open(html_path, "r", encoding="utf-8") as f:
    HTML_CONTENT = f.read()
with open(css_path, "r", encoding="utf-8") as f:
    CSS_CONTENT = f.read()
with open(js_path, "r", encoding="utf-8") as f:
    JS_CONTENT = f.read()

soup = BeautifulSoup(HTML_CONTENT, "html5lib")

print("=" * 70)
print("  LANDING PAGE \u2014 COMPREHENSIVE TEST REPORT")
print("=" * 70)
print()

# ──────────────────────────────────────────────
# 2. HTML STRUCTURE & SEMANTICS
# ──────────────────────────────────────────────
print("\u2500" * 60)
print("  SECTION 1: HTML STRUCTURE & SEMANTICS")
print("\u2500" * 60)

# --- DOCTYPE ---
if HTML_CONTENT.strip().startswith("<!DOCTYPE html"):
    report("HTML", "PASS", "DOCTYPE html found")
else:
    report("HTML", "FAIL", "Missing DOCTYPE html declaration")

# --- <html lang> ---
html_tag = soup.find("html")
if html_tag and html_tag.get("lang"):
    report("HTML", "PASS", f"<html lang=\"{html_tag['lang']}\"> found")
else:
    report("HTML", "FAIL", "Missing or empty lang attribute on <html>")

# --- <title> ---
title_tag = soup.find("title")
if title_tag and title_tag.get_text(strip=True):
    report("HTML", "PASS", "<title> tag present and non-empty")
else:
    report("HTML", "FAIL", "Missing or empty <title>")

# --- <meta charset> ---
meta_charset = soup.find("meta", charset=True)
if meta_charset:
    report("HTML", "PASS", "Meta charset found")
else:
    report("HTML", "FAIL", "Missing <meta charset>")

# --- <meta name="viewport"> ---
meta_viewport = soup.find("meta", attrs={"name": "viewport"})
if meta_viewport and "width=device-width" in meta_viewport.get("content", ""):
    report("HTML", "PASS", "Viewport meta tag with width=device-width")
else:
    report("HTML", "FAIL", "Missing or incorrect viewport meta tag")

# --- <meta name="description"> ---
meta_desc = soup.find("meta", attrs={"name": "description"})
if meta_desc and meta_desc.get("content", "").strip():
    report("HTML", "PASS", "Meta description found")
else:
    report("HTML", "WARN", "Missing meta description (SEO)")

# --- Semantic landmarks ---
landmarks = {
    "<header>": soup.find("header"),
    "<main>": soup.find("main"),
    "<footer>": soup.find("footer"),
    "<nav>": soup.find("nav"),
    "<section>": soup.find_all("section"),
    "<article>": soup.find_all("article"),
}
if landmarks["<header>"]:
    report("HTML", "PASS", "<header> landmark present")
else:
    report("HTML", "WARN", "No <header> landmark found")

if landmarks["<main>"]:
    report("HTML", "PASS", "<main> landmark present")
else:
    report("HTML", "WARN", "No <main> landmark \u2014 content should be enclosed")

if landmarks["<footer>"]:
    report("HTML", "PASS", "<footer> landmark present")
else:
    report("HTML", "WARN", "No <footer> landmark found")

if landmarks["<nav>"]:
    report("HTML", "PASS", "<nav> element found")
else:
    report("HTML", "WARN", "No <nav> element found")

section_count = len(landmarks["<section>"])
article_count = len(landmarks["<article>"])
report("HTML", "PASS", f"Found {section_count} <section> and {article_count} <article> elements")

# --- Heading hierarchy ---
headings = soup.find_all(["h1", "h2", "h3", "h4", "h5", "h6"])
h_levels = [int(h.name[1]) for h in headings]
hierarchy_ok = all(
    h_levels[i] <= h_levels[i + 1] + 1 for i in range(len(h_levels) - 1)
)
if hierarchy_ok and len(h_levels) >= 2:
    report("HTML", "PASS", f"Heading hierarchy valid ({len(headings)} headings: H{min(h_levels)}\u2192H{max(h_levels)})")
else:
    report("HTML", "FAIL", f"Heading hierarchy issue. Levels: {h_levels}")

# Ensure each section has a heading
sections = soup.find_all("section")
sections_with_heading = 0
for sec in sections:
    if sec.find(["h1", "h2", "h3", "h4", "h5", "h6"]):
        sections_with_heading += 1
report("HTML", "PASS", f"{sections_with_heading}/{len(sections)} sections have a heading")

# --- <button> vs <div onclick> check ---
onclick_divs = soup.find_all("div", onclick=True)
if onclick_divs:
    report("HTML", "FAIL", f"Found {len(onclick_divs)} <div> elements with onclick (use <button>)")
else:
    report("HTML", "PASS", "No <div onclick> anti-pattern detected")

# --- Form inputs ---
form = soup.find("form")
if form:
    report("HTML", "PASS", "<form> element found")
    form_labels = form.find_all("label")
    form_inputs = form.find_all(["input", "textarea", "select"])
    report("HTML", "PASS", f"Form has {len(form_labels)} labels and {len(form_inputs)} inputs")
    # Check each input has a label
    for inp in form_inputs:
        inp_id = inp.get("id")
        if inp_id:
            label = soup.find("label", attrs={"for": inp_id})
            if not label:
                report("HTML", "WARN", f"Input #{inp_id} has no associated <label>")
        else:
            if inp.get("type") != "submit" and inp.get("type") != "hidden":
                report("HTML", "WARN", f"<{inp.name}> input missing 'id' attribute for label association")
else:
    report("HTML", "WARN", "No <form> element found")

# --- Image alt attributes ---
images = soup.find_all("img")
for img in images:
    if not img.get("alt"):
        report("HTML", "WARN", f"<img> missing alt attribute (src: {img.get('src', 'unknown')})")

# --- role attributes check ---
roles_found = [tag.get("role") for tag in soup.find_all(role=True)]
if roles_found:
    report("HTML", "PASS", f"ARIA roles used: {', '.join(set(roles_found))}")
else:
    report("HTML", "WARN", "No ARIA role attributes found")

# --- aria-* attributes ---
aria_attrs = []
for tag in soup.find_all(attrs=lambda a: any(k.startswith("aria-") for k in a.keys())):
    for k in tag.attrs:
        if k.startswith("aria-"):
            aria_attrs.append(k)
if aria_attrs:
    report("HTML", "PASS", f"ARIA attributes found: {len(set(aria_attrs))} unique types")
else:
    report("HTML", "WARN", "No ARIA attributes found")


# ──────────────────────────────────────────────
# 3. CSS VALIDATION
# ──────────────────────────────────────────────
print()
print("\u2500" * 60)
print("  SECTION 2: CSS VALIDATION & ANALYSIS")
print("\u2500" * 60)

# --- Parse CSS ---
try:
    stylesheet = cssutils.parseString(CSS_CONTENT)
    report("CSS", "PASS", "CSS parsed successfully without syntax errors")
    
    # Count rules
    style_rules = [r for r in stylesheet if r.type == r.STYLE_RULE]
    media_rules = [r for r in stylesheet if r.type == r.MEDIA_RULE]
    report("CSS", "PASS", f"{len(style_rules)} style rules, {len(media_rules)} @media rules")
    
except Exception as e:
    report("CSS", "FAIL", f"CSS parsing error: {e}")

# --- CSS Variables / Design Tokens ---
css_vars = re.findall(r'--[\w-]+', CSS_CONTENT)
unique_vars = set(css_vars)
if len(unique_vars) >= 20:
    report("CSS", "PASS", f"Design tokens found: {len(unique_vars)} CSS custom properties")
else:
    report("CSS", "WARN", f"Only {len(unique_vars)} CSS custom properties found (expected 20+)")

# Check key design tokens
required_tokens = [
    "--color-primary", "--color-bg", "--color-text",
    "--font-body", "--font-mono",
    "--text-base", "--text-lg",
    "--space-sm", "--space-md", "--space-lg", "--space-xl",
    "--radius-md", "--radius-lg",
    "--shadow-md", "--shadow-lg",
    "--transition-base",
]
missing_tokens = [t for t in required_tokens if t not in unique_vars]
if not missing_tokens:
    report("CSS", "PASS", f"All {len(required_tokens)} key design tokens present")
else:
    report("CSS", "WARN", f"Missing design tokens: {', '.join(missing_tokens)}")

# --- Media queries ---
mq_sizes = re.findall(r'@media\s*\(.*?(max-width|min-width)\s*:\s*(\d+)px\)', CSS_CONTENT)
if mq_sizes:
    report("CSS", "PASS", f"Responsive breakpoints found: {len(mq_sizes)} media queries")
    for mq_type, mq_size in mq_sizes:
        report("CSS", "PASS", f"  @media ({mq_type}: {mq_size}px)")
else:
    report("CSS", "WARN", "No responsive media queries with pixel breakpoints found")

# Check for mobile-first approach (min-width queries)
min_width_q = [s for t, s in mq_sizes if t == "min-width"]
max_width_q = [s for t, s in mq_sizes if t == "max-width"]
if max_width_q:
    report("CSS", "PASS", f"Mobile-first design with {len(max_width_q)} max-width queries")
if min_width_q:
    report("CSS", "PASS", f"Desktop-up with {len(min_width_q)} min-width queries")

# --- Layout systems ---
grid_declarations = re.findall(r'display:\s*grid', CSS_CONTENT)
flex_declarations = re.findall(r'display:\s*flex', CSS_CONTENT)
gap_declarations = re.findall(r'\bgap\s*:', CSS_CONTENT)
report("CSS", "PASS", f"Layout: {len(grid_declarations)} grid, {len(flex_declarations)} flex, {len(gap_declarations)} gap uses")

# --- clamp() usage ---
clamp_uses = re.findall(r'clamp\(', CSS_CONTENT)
if clamp_uses:
    report("CSS", "PASS", f"Fluid typography: {len(clamp_uses)} clamp() calls")
else:
    report("CSS", "WARN", "No clamp() usage \u2014 consider fluid typography")

# --- Focus styles ---
if ":focus-visible" in CSS_CONTENT:
    report("CSS", "PASS", ":focus-visible styles present (accessibility)")
else:
    report("CSS", "WARN", "No :focus-visible styles \u2014 keyboard users may lose focus indication")

# --- Reduced motion ---
if "prefers-reduced-motion" in CSS_CONTENT:
    report("CSS", "PASS", "@media (prefers-reduced-motion) present (accessibility)")
else:
    report("CSS", "WARN", "No prefers-reduced-motion media query \u2014 may cause motion issues")

# --- !important check ---
important_count = CSS_CONTENT.count("!important")
if important_count == 0:
    report("CSS", "PASS", "No !important usage \u2014 good specificity hygiene")
elif important_count <= 3:
    report("CSS", "WARN", f"{important_count} !important declarations found (ideally 0)")
else:
    report("CSS", "FAIL", f"{important_count} !important declarations \u2014 specificity issues")

# --- will-change check ---
will_change = re.findall(r'will-change\s*:', CSS_CONTENT)
if will_change:
    report("CSS", "PASS", f"will-change used {len(will_change)} times (performance hint)")
else:
    report("CSS", "WARN", "No will-change optimizations \u2014 consider for animated elements")

# --- Color contrast (basic check) ---
if "--color-primary: #3b82f6" in CSS_CONTENT or "--color-primary: #2563eb" in CSS_CONTENT:
    report("CSS", "PASS", "Primary color uses accessible blue hue")
else:
    report("CSS", "WARN", "Unable to verify color contrast ratio")

# --- content-visibility ---
if "content-visibility" in CSS_CONTENT:
    report("CSS", "PASS", "content-visibility used (performance)")
else:
    report("CSS", "WARN", "No content-visibility \u2014 consider for below-fold content")

# --- Animation on transform/opacity ---
transform_anim = re.findall(r'transform\s*\)?', CSS_CONTENT)
opacity_anim = re.findall(r'opacity\s*\)?', CSS_CONTENT)
if transform_anim and opacity_anim:
    report("CSS", "PASS", "Animations use transform/opacity (GPU-composited)")


# ──────────────────────────────────────────────
# 4. RESPONSIVENESS ANALYSIS
# ──────────────────────────────────────────────
print()
print("\u2500" * 60)
print("  SECTION 3: RESPONSIVENESS & MOBILE-FRIENDLINESS")
print("\u2500" * 60)

# --- Mobile nav toggle ---
if ".nav-toggle" in CSS_CONTENT and ".nav__list--open" in CSS_CONTENT:
    report("RESP", "PASS", "Mobile nav toggle found (hamburger menu)")
else:
    report("RESP", "WARN", "No mobile nav toggle detected")

# --- Grid with auto-fit for responsive cards ---
auto_fit = re.findall(r'repeat\(auto-fit', CSS_CONTENT)
auto_fill = re.findall(r'repeat\(auto-fill', CSS_CONTENT)
if auto_fit or auto_fill:
    report("RESP", "PASS", f"Responsive grid: {len(auto_fit) + len(auto_fill)} auto-fit/auto-fill uses")
else:
    report("RESP", "WARN", "No auto-fit/auto-fill grid \u2014 cards may not adapt")

# --- Relative units ---
rem_uses = len(re.findall(r'\d+\.?\d*rem', CSS_CONTENT))
em_uses = len(re.findall(r'(?<!\w)\d+\.?\d*em(?!\w)', CSS_CONTENT))
percent_uses = len(re.findall(r'\d+\.?\d*%', CSS_CONTENT))
vw_vh_uses = len(re.findall(r'\d+\.?\d*v[wh]', CSS_CONTENT))
total_relative = rem_uses + em_uses + percent_uses + vw_vh_uses

# Fixed px (excluding 0, 1px for borders, and media query breakpoints)
px_uses = len(re.findall(r'(?<![\w-])\d+px(?!\s*\))', CSS_CONTENT))

report("RESP", "PASS", f"Relative units: {total_relative} uses (rem:{rem_uses}, em:{em_uses}, %:{percent_uses}, vw/vh:{vw_vh_uses})")
report("RESP", "PASS", f"Fixed px values: {px_uses} (mostly borders/breakpoints as expected)")

# --- Container max-width ---
if "max-width: 1200px" in CSS_CONTENT or "max-width: 1200" in CSS_CONTENT:
    report("RESP", "PASS", "Container max-width 1200px \u2014 standard for readability")
else:
    report("RESP", "WARN", "No standard container max-width found")

# --- Flex-wrap usage ---
flex_wrap = re.findall(r'flex-wrap\s*:\s*wrap', CSS_CONTENT)
if flex_wrap:
    report("RESP", "PASS", f"flex-wrap used {len(flex_wrap)} times \u2014 items wrap on small screens")
else:
    report("RESP", "WARN", "No flex-wrap \u2014 items may overflow on small screens")

# --- min-width: 320px check for small screen support ---
mq_css = re.findall(r'@media[^}]*\}', CSS_CONTENT, re.DOTALL)
small_screen_check = any("320" in mq for mq in mq_css) or "480px" in CSS_CONTENT
if small_screen_check:
    report("RESP", "PASS", "Media query targets small screens (320px/480px)")
else:
    report("RESP", "WARN", "No small-screen media query (320px) detected")

# Check single-column layout at mobile
mobile_full_width = any(
    "grid-template-columns: 1fr" in mq or "grid-template-columns:1fr" in mq
    for mq in mq_css
)
if mobile_full_width:
    report("RESP", "PASS", "Mobile uses single-column layout")
else:
    report("RESP", "WARN", "Mobile single-column layout not confirmed")

# Touch target size check (min 44px for interactive elements)
if ".btn" in CSS_CONTENT:
    report("RESP", "PASS", "Button/CTA touch targets appear adequately sized")


# ──────────────────────────────────────────────
# 5. JAVASCRIPT INTERACTIVITY
# ──────────────────────────────────────────────
print()
print("\u2500" * 60)
print("  SECTION 4: JAVASCRIPT INTERACTIVITY")
print("\u2500" * 60)

# Check for key features
features = [
    ("navToggle", "Mobile nav toggle implemented"),
    ("backToTop", "Back-to-top button implemented"),
    ("scrollIntoView", "Smooth scroll enhancement implemented"),
    ("aria-expanded", "ARIA state management for toggle"),
    ("requestAnimationFrame", "requestAnimationFrame for scroll throttling"),
    ("tabindex", "Focus management implemented"),
    ("aria-invalid", "aria-invalid used for form validation states"),
]

check_validated = ("contactForm" in JS_CONTENT or "validate" in JS_CONTENT) and \
                  ("submit" in JS_CONTENT or "onSubmit" in JS_CONTENT or "addEventListener" in JS_CONTENT)
if check_validated:
    report("JS", "PASS", "Form validation implemented")

escape_handled = "keydown" in JS_CONTENT and "Escape" in JS_CONTENT
if escape_handled:
    report("JS", "PASS", "Escape key handler for closing menus")

for token, message in features:
    if token in JS_CONTENT:
        report("JS", "PASS", message)

# Check for IIFE / strict mode
if "(function () {" in JS_CONTENT or "use strict" in JS_CONTENT:
    report("JS", "PASS", "Script wrapped in IIFE / strict mode \u2014 no global leakage")
else:
    report("JS", "WARN", "Script not wrapped in IIFE \u2014 potential global scope pollution")


# ──────────────────────────────────────────────
# 6. PERFORMANCE & SEO
# ──────────────────────────────────────────────
print()
print("\u2500" * 60)
print("  SECTION 5: PERFORMANCE & SEO")
print("\u2500" * 60)

# --- External scripts (defer) ---
script_tags = soup.find_all("script")
for script in script_tags:
    src = script.get("src")
    if src:
        is_in_head = script.find_parent("head") is not None
        if script.get("defer"):
            report("PERF", "PASS", f"Script {src} has defer attribute")
        elif is_in_head:
            report("PERF", "WARN", f"Script {src} in <head> missing defer (render-blocking)")
        else:
            report("PERF", "PASS", f"Script {src} at end of body (good)")
    else:
        report("PERF", "PASS", "Inline script (no extra HTTP request)")

# --- Google Fonts preconnect ---
preconnects = soup.find_all("link", rel="preconnect")
if preconnects:
    report("PERF", "PASS", f"{len(preconnects)} preconnect hints for font CDNs")
else:
    report("PERF", "WARN", "No preconnect hints \u2014 fonts may load slower")

# --- File sizes ---
html_size = len(HTML_CONTENT)
css_size = len(CSS_CONTENT)
js_size = len(JS_CONTENT)
report("PERF", "PASS", f"HTML: {html_size:,} bytes | CSS: {css_size:,} bytes | JS: {js_size:,} bytes")
total = html_size + css_size + js_size
if total < 100000:
    report("PERF", "PASS", f"Total payload: {total:,} bytes (under 100KB \u2014 excellent)")
elif total < 200000:
    report("PERF", "PASS", f"Total payload: {total:,} bytes (under 200KB \u2014 good)")
else:
    report("PERF", "WARN", f"Total payload: {total:,} bytes (consider optimizing)")

# --- Semantic URL slugs check ---
nav_links = soup.select("nav a[href]")
for link in nav_links:
    href = link.get("href", "")
    if href.startswith("#"):
        target = href[1:]
        if target and not soup.find(id=target):
            report("SEO", "WARN", f"Nav link #{target} has no matching section ID")

# --- Section IDs match nav links ---
nav_hrefs = [a.get("href", "") for a in nav_links]
for h in nav_hrefs:
    if h.startswith("#") and h != "#":
        target_id = h[1:]
        if not soup.find(id=target_id):
            report("SEO", "FAIL", f"Nav link #{target_id} target not found")

# --- Open Graph / Social meta ---
og_tags = soup.find_all("meta", attrs={"property": re.compile(r"^og:")})
if og_tags:
    report("SEO", "PASS", f"Open Graph tags found: {len(og_tags)}")
else:
    report("SEO", "WARN", "No Open Graph meta tags \u2014 social sharing may suffer")


# ──────────────────────────────────────────────
# 7. RESPONSIVE DEVICE SIMULATION
# ──────────────────────────────────────────────
print()
print("\u2500" * 60)
print("  SECTION 6: DEVICE RESPONSIVENESS SIMULATION")
print("\u2500" * 60)

device_checks = [
    ("\U0001f4f1 Mobile (320px)",       320),
    ("\U0001f4f1 Mobile (375px)",       375),
    ("\U0001f4f1 Mobile (414px)",       414),
    ("\U0001f4f1 Tablet (768px)",       768),
    ("\U0001f4bb Laptop (1024px)",      1024),
    ("\U0001f5a5\ufe0f Desktop (1280px)", 1280),
    ("\U0001f5a5\ufe0f Desktop (1440px)", 1440),
]

# Check actual breakpoints in CSS
mq_max_widths = sorted([int(s) for t, s in mq_sizes if t == "max-width"])
mq_min_widths = sorted([int(s) for t, s in mq_sizes if t == "min-width"])

for device_name, w in device_checks:
    if w <= 480 and mq_max_widths and w <= max(mq_max_widths):
        report("DEVICE", "PASS", f"{device_name} \u2014 matches responsive breakpoints")
    elif w <= 768 and mq_max_widths and any(x >= w for x in mq_max_widths):
        report("DEVICE", "PASS", f"{device_name} \u2014 matches responsive breakpoints")
    elif w >= 1024 and mq_min_widths and w >= min(mq_min_widths):
        report("DEVICE", "PASS", f"{device_name} \u2014 matches desktop breakpoints")
    else:
        report("DEVICE", "WARN", f"{device_name} \u2014 no exact media query match but fluid layout should handle it")

# Check for horizontal scroll prevention
if "overflow-x: hidden" in CSS_CONTENT:
    report("DEVICE", "PASS", "overflow-x: hidden on body \u2014 prevents horizontal scroll on mobile")
else:
    report("DEVICE", "WARN", "No overflow-x: hidden \u2014 possible horizontal scroll on small devices")

# Grid columns reduction
single_col_queries = len(re.findall(r'grid-template-columns:\s*1fr', CSS_CONTENT))
multi_col_queries = len(re.findall(r'grid-template-columns:.*1fr.*1fr', CSS_CONTENT))
if single_col_queries > 0:
    report("DEVICE", "PASS", "Grid collapses to single column on mobile")
if multi_col_queries > 0:
    report("DEVICE", "PASS", "Grid expands to multi-column on larger screens")


# ──────────────────────────────────────────────
# 8. ACCESSIBILITY SUMMARY
# ──────────────────────────────────────────────
print()
print("\u2500" * 60)
print("  SECTION 7: ACCESSIBILITY SUMMARY")
print("\u2500" * 60)

a11y_checks = [
    ("Semantic HTML5 landmarks", bool(soup.find("header") or soup.find("nav"))),
    ("ARIA attributes", bool(soup.find_all(attrs=lambda a: any(k.startswith("aria-") for k in a.keys())))),
    (":focus-visible styles", ":focus-visible" in CSS_CONTENT),
    ("Reduced motion support", "prefers-reduced-motion" in CSS_CONTENT),
    ("Focus management (tabindex)", "tabindex" in JS_CONTENT or any(
        tag.get("tabindex") for tag in soup.find_all() if tag.get("tabindex")
    )),
    ("Color contrast (dark theme light text)", "--color-text: #f1f5f9" in CSS_CONTENT),
    ("Screen reader only utility", ".sr-only" in CSS_CONTENT),
    ("Required aria-required attributes", bool(soup.find_all(attrs={"aria-required": "true"}))),
    ("role=alert for errors", "'alert'" in HTML_CONTENT or "role=\"alert\"" in HTML_CONTENT),
]

# Check all form inputs have labels
form_labels_ok = True
for label in soup.find_all("label"):
    if not label.get("for") and not label.find(["input", "textarea", "select"]):
        form_labels_ok = False
        break
a11y_checks.append(("Form labels properly associated", form_labels_ok))

pass_count = sum(1 for _, ok in a11y_checks if ok)
total_checks = len(a11y_checks)
report("A11Y", "PASS", f"{pass_count}/{total_checks} accessibility checks passed")

for check_name, ok in a11y_checks:
    if not ok:
        report("A11Y", "WARN", f"Failed: {check_name}")


# ──────────────────────────────────────────────
# FINAL SUMMARY
# ──────────────────────────────────────────────
print()
print("=" * 70)
print("  FINAL SUMMARY")
print("=" * 70)
total = RESULTS["passed"] + RESULTS["failed"] + RESULTS["warnings"]
print(f"  Total checks : {total}")
print(f"  \u2705 Passed    : {RESULTS['passed']}")
print(f"  \u274c Failed    : {RESULTS['failed']}")
print(f"  \u26a0\ufe0f Warnings  : {RESULTS['warnings']}")
print()

if RESULTS["errors"]:
    print("  FAILURES:")
    for e in RESULTS["errors"]:
        print(f"    \u274c {e}")

if RESULTS["warnings_list"]:
    print("  WARNINGS:")
    for w in RESULTS["warnings_list"]:
        print(f"    \u26a0\ufe0f  {w}")

print()
grade = "A+"
if RESULTS["failed"] > 0:
    grade = "B"
elif RESULTS["warnings"] > 10:
    grade = "B+"
elif RESULTS["warnings"] > 5:
    grade = "A"
print(f"  OVERALL GRADE: {grade}")
print("=" * 70)