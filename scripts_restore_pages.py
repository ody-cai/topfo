#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os, re

BASE = "/Users/odycai/WorkBuddy/2026-06-16-17-01-52"
PAGES = os.path.join(BASE, "public/pages")
I18N = os.path.join(PAGES, "i18n")

files = {
    "file-edu-15th-plan-2026.html": "zh-file-edu-15th-plan-2026.html",
    "file-qs-skills-2027.html": "zh-file-qs-skills-2027.html",
}

for page_fn, frag_zh_fn in files.items():
    page_path = os.path.join(PAGES, page_fn)
    frag_path = os.path.join(I18N, frag_zh_fn)

    # Read current page
    with open(page_path, encoding="utf-8") as f:
        html = f.read()

    # Find the include div line and replace with full body
    # Include div pattern: <div class="page-container" ... data-i18n-include="xxx"></div>
    pattern = r'<div class="page-container" style="padding-top:20px;" data-i18n-include="[^"]+"></div>'
    match = re.search(pattern, html)
    if not match:
        print(f"WARN: no include div found in {page_fn}")
        continue

    # Read zh fragment
    with open(frag_path, encoding="utf-8") as f:
        frag = f.read()

    # Build replacement: opening div + fragment
    replacement = '<div class="page-container" style="padding-top:20px;">\n' + frag

    # Replace
    new_html = html.replace(match.group(0), replacement)

    with open(page_path, "w", encoding="utf-8") as f:
        f.write(new_html)

    print(f"RESTORED {page_fn}")

print("\nDONE restoring pages")
