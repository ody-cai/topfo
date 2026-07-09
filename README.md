# 🏫 TopFO · 加拿大大学升学规划平台

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
| 🔒 **多用户权限** | 学生 / 顾问 / 管理员 四角色，注册即用 |
| 📊 **三大排行榜** | QS 2027综合+专业、THE 2026综合+专业、US News综合+专业 |
| 💡 **关键发现** | 中加学籍特有洞察：数学比CS好进9分、分校区红利等 |
| 📋 **申请看板** | Trello 风格进度追踪：规划→提交→面试→录取 |
| 💬 **社区讨论** | 学长学姐分享 / 申请经验 / 问答 |
| 🎯 **AI 智能选校** | 基于 GPA/雅思的匹配度推荐 |
| 🌐 **多语言支持** | 中文 / English / Français |
| 🔔 **通知中心** | 截止日期预警 + 新回复提醒 |
| 📱 **Android App** | Liquid Glass 设计语言，Kotlin + Jetpack Compose |
| 🌏 **澳洲预科** | UNSW/UQ/Monash/Adelaide 预科录取数据 |

### 🔐 体验登录 | Demo Login

> 体验账号: `demo` / 密码: `topfo2026`  
> *体验账号仅可查看公开数据，不含个人GPA/雅思信息*

---

## 🌐 网站 | Website

**生产地址 | Production:** https://topfo.pages.dev

由 Cloudflare Pages 部署，含 Pages Functions 后端（D1 数据库 + JWT 鉴权 + 角色权限中间件）。

Hosted on Cloudflare Pages with Pages Functions backend (D1 database + JWT auth + role-based middleware).

### 页面结构 | Pages

| 路径 | 内容 | 权限 |
|------|------|------|
| `/` | 首页 — 个人统计、数据亮点、三阶段规划 | 公开 |
| `/pages/admission.html` | 录取要求对照表 | 公开（登录后解锁个人匹配） |
| `/pages/rankings.html` | 排名参考 | 公开 |
| `/pages/tracker.html` | 🔥 申请进度看板 | 需登录 |
| `/pages/community.html` | 🔥 社区讨论 | 需登录发帖 |
| `/pages/recommend.html` | 🔥 AI 智能选校 | 需登录 |
| `/pages/notifications.html` | 🔥 通知中心 | 需登录 |
| `/pages/insights.html` | 关键发现 | 需登录 |
| `/pages/files.html` | 资料文件 | 公开 |
| `/pages/download.html` | App 下载 | 公开 |

---

## 📱 Android App

**最新版本 | Latest:** [v1.0.2](https://topfo.pages.dev/download/TopFO-v1.0.2.apk)

| 版本 | 说明 | 下载 |
|------|------|------|
| v1.1.0 | **Liquid Glass 全面重构** | [📥 下载](https://topfo.pages.dev/download/TopFO-v1.1.0.apk) |
| v1.0.2 | 标准 Material3 | [📥 下载](https://topfo.pages.dev/download/TopFO-v1.0.2.apk) |

**技术栈 | Tech Stack:** Kotlin, Jetpack Compose, Material 3, Liquid Glass Design, Room, Retrofit, Hilt

---

## 🏗 技术架构 | Architecture

```
┌─────────────────────────────────────────────────┐
│                 前端 Frontend                     │
│  HTML + CSS + Vanilla JS (auth.js, i18n.js)     │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┐   │
│  │首页  │录取   │看板   │社区   │选校   │通知  │   │
│  └──────┴──────┴──────┴──────┴──────┴──────┘   │
├─────────────────────────────────────────────────┤
│          Cloudflare Pages Functions API          │
│  ┌────────┬────────┬──────┬────────┬────────┐   │
│  │ 认证    │ 学校    │申请   │ 社区    │ 通知   │   │
│  │ login   │ schools│ apps  │ discuss│ notif  │   │
│  │ register│ programs│       │ comments│ remind │
│  └────────┴────────┴──────┴────────┴────────┘   │
│  ┌─────────────────────────────────────────┐     │
│  │  _middleware.js (JWT + 角色验证)         │     │
│  └─────────────────────────────────────────┘     │
├─────────────────────────────────────────────────┤
│           Cloudflare D1 (SQLite) Database        │
│  11 表: users / schools / programs / rankings   │
│  applications / discussions / comments /         │
│  notifications / reminders / profiles / chats    │
├─────────────────────────────────────────────────┤
│              Cloudflare Workers AI                │
│  Llama 3.3 70B — AI 升学顾问 + 智能选校推荐      │
└─────────────────────────────────────────────────┘
```

### 安全架构 | Security

| 层 | 措施 |
|----|------|
| 密码 | per-user PBKDF2-SHA256 salt, 100,000 次迭代 |
| 令牌 | JWT HS256, 7 天过期, role 声明 |
| 密钥 | Cloudflare [vars] 环境变量, Dashboard Secrets |
| 权限 | 中间件自动验证, role-based 访问控制 |
| CORS | 限制为白名单域名 |

---

## 🔧 API 接口清单

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| POST | `/api/login` | 用户登录 | 公开 |
| POST | `/api/auth/register` | 用户注册 | 公开 |
| GET | `/api/schools` | 学校列表 | 公开 |
| GET | `/api/schools/:id` | 学校详情 | 公开 |
| GET | `/api/programs` | 专业筛选 | 公开 |
| GET | `/api/rankings` | 排名查询 | 公开 |
| GET/POST | `/api/applications` | 申请管理 | JWT |
| PUT | `/api/applications/:id` | 更新申请 | JWT |
| GET/POST | `/api/discussions` | 社区讨论 | JWT(POST) |
| GET/POST | `/api/discussions/:id/comments` | 讨论回复 | JWT(POST) |
| GET | `/api/notifications` | 通知中心 | JWT |
| GET | `/api/ai/recommend` | AI选校推荐 | JWT |
| GET/POST | `/api/reminders` | 提醒管理 | JWT |
| GET | `/api/translations/:lang` | 多语言翻译 | 公开 |

---

## 🗂️ 项目结构 | Structure

```
topfo/
├── public/                  # 🌐 网站前端 + Cloudflare Functions
│   ├── index.html           #     首页
│   ├── pages/               #     二级页面 (admission, rankings, tracker, community, ...)
│   ├── js/                  #     JavaScript (auth.js, data.js, i18n.js, rankings.js)
│   ├── css/                 #     样式 (common.css)
│   ├── functions/api/       #     Cloudflare Pages Functions REST API
│   │   ├── _middleware.js   #     JWT 验证中间件
│   │   ├── login.js         #     登录
│   │   ├── auth/register.js #     注册
│   │   ├── schools.js       #     学校列表
│   │   ├── schools/[id].js  #     学校详情
│   │   ├── programs.js      #     专业
│   │   ├── rankings.js      #     排名
│   │   ├── applications.js  #     申请 CRUD
│   │   ├── applications/[id].js
│   │   ├── discussions.js   #     社区讨论
│   │   ├── discussions/[id]/comments.js
│   │   ├── notifications.js #     通知
│   │   ├── reminders.js     #     提醒
│   │   ├── ai/recommend.js  #     AI 选校
│   │   ├── translations/[lang].js
│   │   ├── me/data.js       #     个人数据
│   │   ├── chat.js          #     AI 聊天
│   │   └── cron/reminders.js#     定时提醒
│   ├── migrations/          #     D1 数据库迁移
│   │   ├── 001_init.sql     #     聊天记录表
│   │   ├── 002_full_schema.sql #  完整数据库
│   │   └── 003_seed_data.sql    #  种子数据
│   └── download/            #     APK 下载
├── topfo-app/               # 📱 Android App 源码
│   ├── app/src/main/java/com/topfo/app/
│   │   ├── ui/              #     界面
│   │   ├── data/            #     数据层
│   │   └── theme/           #     Liquid Glass 设计系统
│   └── app/build.gradle.kts
├── .gitignore
└── README.md
```

---

## 🛠️ 本地开发 | Local Development

```bash
# 网站
cd public
npx wrangler pages dev .

# 数据库迁移
npx wrangler d1 execute topfo-chat --file=migrations/001_init.sql
npx wrangler d1 execute topfo-chat --file=migrations/002_full_schema.sql
npx wrangler d1 execute topfo-chat --file=migrations/003_seed_data.sql

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
