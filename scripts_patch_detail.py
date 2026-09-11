#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os, re

PAGES_DIR = "/Users/odycai/WorkBuddy/2026-06-16-17-01-52/public/pages"
I18N_DIR = os.path.join(PAGES_DIR, "i18n")
os.makedirs(I18N_DIR, exist_ok=True)

files = {
    "file-edu-15th-plan-2026.html": "file-edu-15th-plan-2026",
    "file-qs-skills-2027.html": "file-qs-skills-2027",
}

OPEN_TAG = '<div class="page-container" style="padding-top:20px;">'

def patch(path, token):
    with open(path, encoding="utf-8") as f:
        html = f.read()

    open_start = html.index(OPEN_TAG)
    open_end = open_start + len(OPEN_TAG)

    footer_tag = '<footer class="footer">'
    footer_start = html.index(footer_tag, open_end)
    # find the </div> that closes page-container, right before footer
    pc_close = html.rfind('</div>', open_end, footer_start)
    footer_end = html.index('</footer>', footer_start) + len('</footer>')

    fragment_inner = html[open_end:pc_close]
    footer_block = html[footer_start:footer_end]
    fragment = fragment_inner + '\n\n' + footer_block

    # write zh fragment (verbatim)
    zh_path = os.path.join(I18N_DIR, token + ".zh.html")
    with open(zh_path, "w", encoding="utf-8") as f:
        f.write(fragment.strip() + "\n")

    # replace body in page with include div
    replacement = f'<div class="page-container" style="padding-top:20px;" data-i18n-include="{token}"></div>'
    new_html = html[:open_start] + replacement + html[footer_end:]

    # ---- modal data-i18n ----
    # login title
    new_html = new_html.replace('>🔐 登录</h3>', ' data-i18n="auth.login.title">🔐 登录</h3>', 1)
    # register title
    new_html = new_html.replace('>📝 注册</h3>', ' data-i18n="auth.register.title">📝 注册</h3>', 1)
    # login username / password (appear first, in login modal)
    new_html = new_html.replace('placeholder="用户名"\n', 'placeholder="用户名" data-i18n-placeholder="auth.login.username"\n', 1)
    new_html = new_html.replace('placeholder="密码"\n', 'placeholder="密码" data-i18n-placeholder="auth.login.password"\n', 1)
    # login submit button
    new_html = new_html.replace('id="loginSubmitBtn" onclick="AUTH.handleLoginSubmit()"', 'id="loginSubmitBtn" data-i18n="auth.login.submit" onclick="AUTH.handleLoginSubmit()"', 1)
    # login noAccount link
    new_html = new_html.replace('>还没有账号？注册</a>', ' data-i18n="auth.login.noAccount">还没有账号？注册</a>', 1)
    # login demo span
    new_html = new_html.replace('<span style="cursor:pointer;">体验: demo / topfo2026</span>', '<span style="cursor:pointer;" data-i18n="auth.login.demo">体验: demo / topfo2026</span>', 1)
    # register username / password
    new_html = new_html.replace('placeholder="用户名"\n', 'placeholder="用户名" data-i18n-placeholder="auth.register.username"\n', 1)
    new_html = new_html.replace('placeholder="密码"\n', 'placeholder="密码" data-i18n-placeholder="auth.register.password"\n', 1)
    new_html = new_html.replace('placeholder="显示名称（选填）"', 'placeholder="显示名称（选填）" data-i18n-placeholder="auth.register.displayName"', 1)
    # register submit button
    new_html = new_html.replace('id="regSubmitBtn" onclick="AUTH.handleRegisterSubmit()"', 'id="regSubmitBtn" data-i18n="auth.register.submit" onclick="AUTH.handleRegisterSubmit()"', 1)
    # register hasAccount link
    new_html = new_html.replace('>已有账号？登录</a>', ' data-i18n="auth.register.hasAccount">已有账号？登录</a>', 1)

    with open(path, "w", encoding="utf-8") as f:
        f.write(new_html)

    print(f"Patched {path}")
    print(f"  -> zh fragment: {zh_path} ({len(fragment)} chars)")

for fn, token in files.items():
    patch(os.path.join(PAGES_DIR, fn), token)

print("DONE")
