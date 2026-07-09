# 🏫 TopFO · 学生升学数据平台

> **TopFO** — 加拿大大学升学规划一站式数据平台 | A unified data platform for Canadian university admission planning

[![Website](https://img.shields.io/badge/Website-topfo.pages.dev-2563EB?style=flat&logo=cloudflare)](https://topfo.pages.dev)
[![Download APK](https://img.shields.io/badge/Download-APK-22C55E?style=flat&logo=android)](https://topfo.pages.dev/download/TopFO-v1.0.2.apk)
[![GitHub](https://img.shields.io/badge/GitHub-ody--cai/topfo-181717?style=flat&logo=github)](https://github.com/ody-cai/topfo)

---

## 📋 项目简介 | Overview

覆盖 **26 所加拿大大学（含分校区）× 9 大专业方向**的录取要求对照表，集成 **QS / THE / US News 三大排行榜**，提供个性化的 GPA/雅思匹配分析和升学策略。

Covers **26 Canadian universities (including satellite campuses) × 9 major programs** with admission requirements comparison, integrates **QS / THE / US News rankings**, and delivers personalized GPA/IELTS matching analysis and application strategies.

### ✨ 核心功能 | Features

| 功能 | 说明 |
|------|------|
| 🎯 **录取对照表** | 9大专业 × 26院校，含Co-op/学费/截止日期 |
| 🔒 **隐私登录** | 登录后解锁个人GPA匹配、三阶段策略分析 |
| 📊 **三大排行榜** | QS 2027综合+专业、THE 2026综合+专业、US News综合+专业 |
| 💡 **关键发现** | 中加学籍特有洞察：数学比CS好进9分、分校区红利等 |
| 📱 **Android App** | Liquid Glass 设计语言，Kotlin + Jetpack Compose |
| 🌏 **澳洲预科** | UNSW/UQ/Monash/Adelaide 预科录取数据 |

### 🔐 登录信息 | Demo Login

> 账号: `caiqijun` / 密码: `20262026`

---

## 🌐 网站 | Website

**生产地址 | Production:** https://topfo.pages.dev

由 Cloudflare Pages 部署，含 Pages Functions 后端（JWT 鉴权 + AES-256-GCM 服务端加密）。

Hosted on Cloudflare Pages with Pages Functions backend (JWT auth + AES-256-GCM server-side encryption).

### 页面结构 | Pages

| 路径 | 内容 |
|------|------|
| `/` | 首页 — 个人统计、数据亮点、三阶段规划 |
| `/pages/admission.html` | 录取要求对照表 |
| `/pages/rankings.html` | 排名参考 |
| `/pages/insights.html` | 关键发现（需登录） |
| `/pages/files.html` | 资料文件 |
| `/pages/download.html` | App 下载 |

---

## 📱 Android App

**最新版本 | Latest:** [v1.0.2](https://topfo.pages.dev/download/TopFO-v1.0.2.apk)

| 版本 | 下载 |
|------|------|
| v1.0.2 | [📥 下载 APK](https://topfo.pages.dev/download/TopFO-v1.0.2.apk) |
| v1.0.1 | [📥 下载 APK](https://topfo.pages.dev/download/TopFO-v1.0.1.apk) |
| v1.0.0 | [📥 下载 APK](https://topfo.pages.dev/download/TopFO-v1.0.0.apk) |

**技术栈 | Tech Stack:** Kotlin, Jetpack Compose, Material 3, Liquid Glass Design, Room, Retrofit, Hilt

---

## 🗂️ 项目结构 | Structure

```
topfo/
├── public/                  # 🌐 网站前端 + Cloudflare Functions
│   ├── index.html           #     首页
│   ├── pages/               #     二级页面
│   ├── js/                  #     JavaScript (auth, data, rankings)
│   ├── css/                 #     样式
│   ├── functions/api/       #     Cloudflare Pages Functions 后端
│   └── download/            #     APK 下载
├── topfo-app/               # 📱 Android App 源码
│   ├── app/src/main/java/com/topfo/app/
│   │   ├── ui/              #     界面 (Home, Admission, Rankings, Chat...)
│   │   ├── data/            #     数据层 (local/remote/repository)
│   │   └── theme/           #     Liquid Glass 设计系统
│   └── app/build.gradle.kts
├── .gitignore
└── README.md
```

---

## 📊 数据来源 | Data Sources

- **QS World University Rankings** 2027 (综合) + 2025 (专业)
- **THE World University Rankings** 2026 (综合 + 专业)
- **US News Best Global Universities** 2026-2027 (综合) + 2025 (专业)
- 各大学官网公布的最新录取要求

---

## 🛠️ 本地开发 | Local Development

```bash
# 网站
cd public
npx wrangler pages dev .

# Android App (Android Studio 打开 topfo-app/ 目录)
```

### 部署网站 | Deploy

```bash
cd public
npx wrangler pages deploy . --project-name=topfo
```

---

## 📄 许可 | License

本项目仅供个人教育规划参考使用。数据来源于各大学官网及公开排行榜，如有更新请以官方网站为准。

This project is for personal education planning reference only. Data sourced from official university websites and public rankings. Always refer to official sources for the most current information.

---

*Made with ❤️ for 升学规划*
