# topfo 移动应用设计方案

> 与网站 https://topfo.pages.dev 信息完全同步 · 移动端原生布局

---

## 一、总体架构

### 1.1 技术选型

| 层级 | 技术 | 理由 |
|------|------|------|
| 框架 | Kotlin + Jetpack Compose | 原生 Android，Material Design 3，与网页 MD3 风格呼应 |
| 架构 | MVVM + Repository | 分层解耦，ViewModel 驱动 UI |
| 网络 | Retrofit + OkHttp + Kotlinx Serialization | 与网站 Cloudflare Pages Functions API 对接 |
| 本地存储 | Room (SQLite) + DataStore (Preferences) | 离线缓存 + Token 持久化 |
| 图表 | Vico (Compose-native chart lib) | 排名柱状图和对比图表 |
| 图片 | Coil | 异步图片加载 |

### 1.2 与网站信息对应关系

```
网站页面                         →   App 页面 / 功能
────────────────────────────────────────────────────────────
首页 (4卡片+个人统计)              →   HomeScreen (顶部个人仪表盘 + 模块入口)
录取对照表 (表格+筛选+匹配标签)     →   AdmissionScreen (筛选器 + 可滚动列表)
排名参考 (QS/THE/US News)         →   RankingsScreen (三级Tab + 柱状图)
关键发现 (仅登录可见)              →   InsightsScreen (登录后才渲染内容)
文件中心 (报告列表+详情解读)        →   FilesScreen + FileDetailScreen
AI 聊天                           →   ChatScreen (仅 caiqijun，从 Profile 进入)
登录/个人数据编辑                  →   LoginScreen / ProfileModal
```

### 1.3 App 页面导航

```
Bottom Navigation Bar (4 tabs):
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  🏠 首页     │  📊 排名     │  📁 文件     │  👤 我的     │
│   Home      │  Rankings   │   Files     │  Profile    │
└─────────────┴─────────────┴─────────────┴─────────────┘

首页内导航：
  HomeScreen
    ├── 个人仪表盘 (登录后显示 GPA/雅思/阶段规划)
    ├── 模块入口卡片
    │   ├── [录取对照表] → AdmissionScreen (新页面，非底部tab)
    │   ├── [排名参考]   → RankingsScreen (底部tab已有，跳转)
    │   ├── [关键发现]   → InsightsScreen (新页面)
    │   └── [文件中心]   → FilesScreen (底部tab已有，跳转)
    └── 登录提示横幅 (未登录)

我的 (ProfileScreen)：
    ├── 登录/已登录状态 + 头像
    ├── 编辑GPA/雅思 → ProfileEditSheet
    ├── AI 升学顾问 (仅 caiqijun) → ChatScreen
    ├── 退出登录
    └── 关于 topfo

文件 (FilesScreen)：
    ├── 文件列表 (卡片式)
    │   ├── [QS Future Skills 2027] → FileDetailScreen
    │   └── ... (后续添加的报告)
    └── 每项：[查看解读] / [下载PDF]
```

---

## 二、数据模型

### 2.1 前后端数据职责划分（核心原则）

```
┌─────────────────────────────────────────────────────────────┐
│                    后端 (Cloudflare Functions + D1)          │
│                      权威数据源 · 唯一写入者                    │
├─────────────────────────────────────────────────────────────┤
│  • 个人GPA/雅思 → GET/PATCH /api/me/data (AES-GCM加密)      │
│  • 聊天消息 → D1 chat_messages (3天活跃 + 自动归档)           │
│  • 登录会话 → JWT (PBKDF2-SHA256 + HMAC-SHA256)             │
│  • 文件PDF → Cloudflare Pages 静态托管                       │
├─────────────────────────────────────────────────────────────┤
│                      ▲ 仅读取 (GET)                          │
│                      │                                      │
├──────────────────────┼──────────────────────────────────────┤
│                      │                                      │
│              前端 (App Room + DataStore)                     │
│               只缓存不需要实时更新的静态数据                     │
├─────────────────────────────────────────────────────────────┤
│  • 大学录取数据 (data.js → schools.json)                    │
│  • 排名数据 (QS/THE/US News)                                │
│  • 界面偏好 (主题、语言)                                      │
│                                                             │
│  ⚠️ 前端绝不缓存以下数据：                                    │
│  • 个人GPA/雅思 → 每次从 /api/me/data 读取                   │
│  • 聊天记录 → 每次从 /api/chat GET 加载，不在 Room 建表       │
│  • 密码/Token → DataStore 存 JWT (仅用于鉴权)                │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Room 数据库表（仅静态缓存）

```kotlin
// ===== 大学录取数据 (离线缓存，从 schools.json 初始导入) =====
@Entity(tableName = "schools")
data class SchoolEntity(
    @PrimaryKey val id: String,          // e.g. "t1_utsg"
    val tier: String,                     // t1/t2/t3/au
    val name: String,
    val city: String,
    val province: String,
    val deadline: String,
    val tuition: String,
    val tuitionRMB: String,
    val updatedAt: Long                   // 数据更新时间戳
)

@Entity(tableName = "programs")
data class ProgramEntity(
    @PrimaryKey val id: String,           // e.g. "t1_utsg_cs"
    val schoolId: String,
    val program: String,                  // eng/cs/math/psych/biz/health/sci/social
    val gpaRequirement: String,
    val ieltsRequirement: String,
    val dualAvailable: String,            // yes/no/limit
    val dualType: String,
    val dualThreshold: String,
    val coopAvailable: String,
    val coopNote: String,
    val note: String,
    val noteDetail: String
)

// ===== 排名数据缓存 (从 rankings.json 初始导入) =====
@Entity(tableName = "rankings")
data class RankingEntity(
    @PrimaryKey val id: String,
    val source: String,                   // qs/the/usnews
    val year: String,
    val category: String,
    val rank: Int,
    val universityName: String,
    val score: Double?,
    val country: String
)

// ⚠️ 聊天消息不在 Room 建表 — 聊天记录完全由后端 D1 管理
// App 和网页共享同一份聊天历史，通过 GET /api/chat 实时加载
```

### 2.2 API 接口对接

```kotlin
// ===== 与 Cloudflare Pages Functions 完全一致 =====
interface TopfoApi {

    // 登录
    @POST("api/login")
    suspend fun login(@Body body: LoginRequest): LoginResponse

    // 获取解密后的个人数据 (需 JWT)
    @GET("api/me/data")
    suspend fun getMeData(@Header("Authorization") token: String): MeDataResponse

    // AI 聊天 (需 JWT)
    @POST("api/chat")
    suspend fun chat(
        @Header("Authorization") token: String,
        @Body body: ChatRequest
    ): ChatResponse

    // 获取聊天历史 (需 JWT)
    @GET("api/chat")
    suspend fun getChatHistory(
        @Header("Authorization") token: String,
        @Query("archive") archive: Boolean? = null
    ): ChatHistoryResponse
}

// ===== 静态数据 (从网站 public/ 目录获取) =====
// data.js → 硬编码为 Kotlin data class + JSON 资源文件
// rankings 数据 → 同上
```

---

## 三、页面设计详情

### 3.1 HomeScreen (首页)

```
┌─────────────────────────────────────┐
│  topfo                               │  ← TopAppBar
│  加拿大大学升学数据平台               │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐│
│  │ 👤 奇均 (已登录)               ││  ← Profile Bar (未登录显示"登录查看个人数据")
│  │ GPA 89.6  ·  雅思 5.0          ││
│  │ 🟢 麦马 MELD 门槛已达标!       ││  ← 关键状态 (登录后)
│  │ [编辑数据] [AI 顾问]           ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ 📋       │  │ 📊       │        │
│  │ 录取对照表│  │ 排名参考  │        │  ← 模块入口卡片 (2x2 Grid)
│  │          │  │          │        │
│  └──────────┘  └──────────┘        │
│  ┌──────────┐  ┌──────────┐        │
│  │ 🔍       │  │ 📁       │        │
│  │ 关键发现  │  │ 文件中心  │        │
│  │          │  │          │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  ── 三阶段规划 ──                    │  ← 仅登录后显示
│  ✅ 阶段1: 雅思达6.0                 │
│  ⏳ 阶段2: 雅思达6.5                 │
│  🎯 阶段3: GPA冲刺90+               │
└─────────────────────────────────────┘
│  🏠        📊        📁        👤    │  ← Bottom Nav
└─────────────────────────────────────┘
```

### 3.2 AdmissionScreen (录取对照表)

```
┌─────────────────────────────────────┐
│  ← 录取对照表              [筛选]   │
├─────────────────────────────────────┤
│  专业: [工程][CS][数学][心理][...]   │  ← 横向滚动的专业标签
├─────────────────────────────────────┤
│  ── 第一梯队: 极难申 ──             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 多大·圣乔治          ⚠️ 差距 │   │  ← 登录后显示匹配标签
│  │ 多伦多 | 安省               │   │
│  │ CS 93-97% | IELTS 6.5(6.0) │   │
│  │ 双录: IFP(需单项≥5.0)      │   │
│  │ Co-op: PEY ✅               │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 滑铁卢                ⚠️ 差距│   │
│  │ ...                         │   │
│  └─────────────────────────────┘   │
│                                     │
│  ── 第二梯队: 现实目标 ──           │
│  ┌─────────────────────────────┐   │
│  │ 多大·士嘉堡          ⚡ 接近 │   │
│  │ ...                         │   │
│  └─────────────────────────────┘   │
│  ...                                │
└─────────────────────────────────────┘
```

### 3.3 RankingsScreen (排名参考)

```
┌─────────────────────────────────────┐
│  QS 2027  |  THE 2026  |  US News  │  ← 三级Tab
├─────────────────────────────────────┤
│  类别: [综合][CS][工程][商科][...]   │  ← 横向滚动的类别标签
├─────────────────────────────────────┤
│                                     │
│  #1  🇺🇸 麻省理工                    │
│     ━━━━━━━━━━━━━━━━━━━━ 100.0     │  ← 得分条
│                                     │
│  #2  🇺🇸 斯坦福                      │
│     ━━━━━━━━━━━━━━━━━━━━  98.7     │
│                                     │
│  ...                                │
│                                     │
│  #17 🇨🇦 多伦多大学                  │  ← 加拿大高亮
│     ━━━━━━━━━━━━━━━ 84.2           │
│                                     │
│  或切换为柱状图视图  📊              │
└─────────────────────────────────────┘
```

### 3.4 InsightsScreen (关键发现)

```
┌─────────────────────────────────────┐
│  ← 关键发现                         │
├─────────────────────────────────────┤
│                                     │
│  (未登录)                           │
│  ┌─────────────────────────────┐   │
│  │      🔒                      │   │
│  │   登录后查看                  │   │  ← 访客锁定遮罩
│  │  基于个人数据的全面分析       │   │
│  │      [去登录]                │   │
│  └─────────────────────────────┘   │
│                                     │
│  (已登录)                           │
│  ── 你的申请策略 ──                  │
│  📊 当前数据: GPA 89.6 | 雅思 5.0  │
│                                     │
│  1️⃣ 分校区红利                      │
│  UTM CS 85-88% 踩线 + 有Co-op     │
│  UTSC 心理 mid-70s 远超 + Co-op   │
│  ...                                │
│                                     │
│  2️⃣ 数学比CS好进                    │
│  ...                                │
└─────────────────────────────────────┘
```

### 3.5 FilesScreen (文件中心)

```
┌─────────────────────────────────────┐
│  文件中心                           │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🎓                           │   │
│  │ QS World Future Skills       │   │
│  │ Index 2027                   │   │
│  │ 📅 2026年  📄 64页  🌍 89国 │   │
│  │ 评估全球高等教育体系...       │   │
│  │ [📖 查看解读] [📥 下载PDF]   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📄 更多报告即将添加...       │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 3.6 ProfileScreen (我的)

```
┌─────────────────────────────────────┐
│  我的                               │
├─────────────────────────────────────┤
│                                     │
│  (未登录)                           │
│  ┌─────────────────────────────┐   │
│  │        👤 未登录              │   │
│  │   登录后查看个人数据和AI     │   │
│  │        [立即登录]            │   │
│  └─────────────────────────────┘   │
│                                     │
│  (已登录)                           │
│  ┌─────────────────────────────┐   │
│  │  👤 奇均                     │   │
│  │  GPA 89.6  |  雅思 5.0      │   │
│  │  [✏️ 编辑数据]              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─ 功能 ──────────────────────┐   │
│  │  🤖 AI 升学顾问 (仅奇均)    │   │  ← 仅 caiqijun 可见
│  │  📊 我的申请策略            │   │
│  │  📋 录取匹配结果            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─ 设置 ──────────────────────┐   │
│  │  🔔 数据更新通知            │   │
│  │  🌙 深色模式                │   │
│  │  ℹ️ 关于 topfo              │   │
│  │  🚪 退出登录                │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 3.7 ChatScreen (AI 升学顾问)

```
┌─────────────────────────────────────────────────────────┐
│  ←  AI 升学顾问                                         │
│  基于你的 GPA 89.6 / 雅思 5.0                           │
│         💬 与网页版共享聊天记录 (同一 D1 数据库)           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🤖 你好奇均！有什么可以帮你?                      │   │  ← AI 消息 (左对齐)
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│           ┌───────────────────────────────┐            │
│           │ 我的GPA够麦马吗？               │            │  ← 用户消息 (右对齐)
│           └───────────────────────────────┘            │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🤖 你的GPA 89.6已经超过麦马商科...               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ─────────────────────────────────────────────          │
│  [输入消息...]                                [发送]    │
│                                                         │
│  ⚠️ 聊天记录完全由后端 D1 管理                          │
│  前端不建本地 chat 表，每次打开实时加载                   │
│  网页和 App 看到的聊天历史完全一致                       │
└─────────────────────────────────────────────────────────┘
```

**聊天数据流**:
```
App ChatScreen                   网页版聊天气泡
      │                               │
      │  POST /api/chat                 │  POST /api/chat
      │  GET  /api/chat                 │  GET  /api/chat
      │                               │
      └──────────┬───────────────────┘
                 │
          ┌──────▼──────┐
          │  /api/chat   │  Cloudflare Function
          │   JWT 鉴权   │
          └──────┬──────┘
                 │
          ┌──────▼──────┐
          │  D1: topfo-chat   │  同一张表
          │  chat_messages     │  同一份数据
          │  (username='caiqijun') │
          └─────────────────┘

规则：
- 加载历史：GET /api/chat → 自动取最近3天活跃消息
- 归档查询：GET /api/chat?archive=true → 3天前已归档消息
- 新消息：POST /api/chat { message: "..." } → 后端组装上下文 + 调 AI + 存 D1
- App 前端只负责渲染，不建 chat 表，不缓存聊天消息
```

---

## 四、数据同步策略

### 4.1 同步架构

```
┌─────────────────────────────────────────────────┐
│           Cloudflare API (唯一权威数据源)          │
│           https://topfo.pages.dev                │
│                                                  │
│  /api/login          → JWT 鉴权                  │
│  /api/me/data        → 个人数据 (AES加密)         │
│  /api/chat           → AI聊天 + D1持久化          │
│  /files/*.pdf        → 文件下载                   │
│  /schools.json       → 录取数据 (静态)             │
│  /rankings.json      → 排名数据 (静态)             │
└──────────┬──────────────────────────────────────┘
           │
           │  网络请求
           ▼
┌─────────────────────────────────────────────────┐
│              App Repository Layer                │
│                                                  │
│  ┌──────────────┐   ┌──────────────────┐        │
│  │ RemoteSource  │   │   LocalSource     │        │
│  │ (Retrofit)   │   │  (Room + 内置JSON) │        │
│  │              │   │                    │        │
│  │ 个人数据      │   │ 学校/专业/排名      │        │
│  │ 聊天消息      │   │ (静态离线缓存)     │        │
│  │ JWT 登录     │   │                    │        │
│  └──────┬───────┘   └───────┬────────────┘        │
│         │                   │                     │
│         │    ┌──────────────┘                     │
│         │    │                                    │
│         ▼    ▼                                    │
│  ┌──────────────────────────────────────┐        │
│  │  数据路由规则:                         │        │
│  │  • 静态数据 (学校/排名) → LocalFirst  │        │
│  │  • 动态数据 (个人/聊天) → RemoteOnly  │        │
│  │  • 文件下载 → Remote + 本地文件缓存    │        │
│  └──────────────────────────────────────┘        │
└─────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│              ViewModel (StateFlow)               │
└─────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│              Composable UI                       │
└─────────────────────────────────────────────────┘

⚠️ 核心规则：
  • 前端只缓存静态数据（学校/排名），不缓存动态数据（个人/聊天）
  • 个人GPA/雅思：每次从 /api/me/data 读取，不在 DataStore 存业务数据
  • 聊天记录：App 和网页共享 D1 chat_messages 表，前端不建本地 chat 表
  • 密码/密钥：只存在于服务端，前端仅持 JWT Token 用于鉴权
```

### 4.2 各类数据同步方式

| 数据类型 | 存储位置 | 同步方式 | 刷新频率 | 离线支持 |
|---------|---------|---------|---------|---------|
| 录取数据 (data.js) | **前端缓存** (App内置 JSON + Room) | 首次安装导入 + 启动检查更新 | 每日/手动触发 | ✅ 完全离线 |
| 排名数据 | **前端缓存** (App内置 JSON + Room) | 首次安装导入 + 远程版本检查 | 排名发布后手动更新 | ✅ 完全离线 |
| 个人GPA/雅思 | **后端** (Cloudflare Functions + AES加密) | GET/PATCH /api/me/data | 登录后拉取，编辑后上传 | ❌ 需联网 |
| 聊天消息 | **后端** (D1 chat_messages，与网页共用) | GET/POST /api/chat | 打开聊天页面时加载 | ❌ 需联网 |
| 聊天归档 (>3天) | **后端** (D1 archived=1) | GET /api/chat?archive=true | 手动请求时加载 | ❌ 需联网 |
| 文件PDF | **后端** (Cloudflare Pages 静态托管) | 远程下载 | 手动下载后本地缓存 | ✅ 下载后可离线看 |
| JWT Token | **前端 DataStore** (仅鉴权用途) | 登录时写入，过期自动清理 | 每次 API 请求携带 | ✅ 离线时仍可读 |

### 4.3 初始化流程

```
App 启动
   │
   ├── 1. DataStore 读取 JWT Token
   │     ├── Token 存在 & 未过期 → 已登录状态
   │     │      ├── 异步 GET /api/me/data → 更新个人数据显示
   │     │      └── ⚠️ 不缓存到 DataStore，仅活在 ViewModel StateFlow
   │     └── Token 不存在 → 访客状态（仅公开数据可见）
   │
   ├── 2. 从 App 内置 JSON 加载 SCHOOLS + RANKINGS 到 Room
   │     （首次安装导入，后续启动读缓存）
   │
   ├── 3. 后台检查远程 JSON 版本 (ETag / Last-Modified)
   │     └── 有新版本 → 下载 → 更新 Room → 通知 UI 刷新
   │
   ├── 4. 如果是 caiqijun 登录 → 预拉取聊天历史到 ViewModel
   │     ⚠️ 聊天消息不入 Room，仅 ViewModel 持有
   │
   └── 5. 渲染首页
```

---

## 五、关键差异：网页 vs App

| 特性 | 网页版 | App版 |
|------|--------|-------|
| 录取对照表 | 大表格 (`<table>`) | 可折叠卡片列表，筛选在顶部 |
| 排名展示 | HTML 表格 | 列表+得分条，可选柱状图 |
| 导航方式 | 顶部导航栏 `nav-link` | 底部导航栏 `BottomNavigationBar` |
| 登录入口 | 右上角按钮 | Bottom Nav 第4项 "我的" |
| AI 聊天 | 浮动气泡 | 独立页面，从 Profile 进入 |
| 聊天数据 | D1 云同步 | **同一 D1，与网页共享历史** |
| 聊天本地缓存 | ❌ 无 | ❌ 无（与网页一致，不入 Room） |
| 个人数据存储 | localStorage + 后端加密 | **仅后端，前端不缓存业务数据** |
| 文件解读 | 完整 HTML 页面 | 原生页面，同样结构 |
| 离线能力 | 无 | ✅ 录取/排名数据完全离线可用 |
| 深色模式 | 不支持 | ✅ 跟随系统 |
| 隐私保护 | 访客只看公开 + 登录解锁个人 | **完全一致的权限模型** |
| 密码安全 | PBKDF2 + JWT + AES | **同一后端，同一安全标准** |

---

## 六、Material Design 3 视觉规范

### 6.1 配色方案 (与网站 `common.css` 的 CSS 变量对应)

```kotlin
// 网站 CSS 变量映射
// --c-accent: #6366f1 (Indigo)       → primary
// --c-accent-hover: #4f46e5           → primaryContainer
// --c-success: #22c55e                 → tertiary
// --c-danger: #ef4444                  → error
// --c-warning: #f59e0b                 → (custom)
// --c-surface: #ffffff                 → surface
// --c-bg: #f8fafc                     → background
// --c-text: #1e293b                    → onBackground
// --c-text-secondary: #64748b          → onSurfaceVariant
// --c-border: #e2e8f0                  → outlineVariant

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF6366F1),        // Indigo accent
    onPrimary = Color.White,
    primaryContainer = Color(0xFFE0E7FF),
    onPrimaryContainer = Color(0xFF1E1B4B),
    secondary = Color(0xFF6366F1),
    tertiary = Color(0xFF22C55E),       // Success green
    error = Color(0xFFEF4444),          // Danger red
    background = Color(0xFFF8FAFC),
    onBackground = Color(0xFF1E293B),
    surface = Color.White,
    onSurface = Color(0xFF1E293B),
    onSurfaceVariant = Color(0xFF64748B),
    outline = Color(0xFFCBD5E1),
    outlineVariant = Color(0xFFE2E8F0),
)

// 匹配标签颜色
val MatchOk = Color(0xFF22C55E)         // ✓ 够 (success)
val MatchClose = Color(0xFFF59E0B)      // ≈ 接近 (warning)
val MatchHard = Color(0xFFEF4444)       // ✗ 差距 (error)
```

### 6.2 字体与间距

```kotlin
// 与网站 8px 网格保持一致
object Dimens {
    val xs = 4.dp
    val sm = 8.dp
    val md = 16.dp
    val lg = 24.dp
    val xl = 32.dp
    val xxl = 48.dp
    val cardRadius = 16.dp
    val chipRadius = 8.dp
    val btnHeight = 48.dp         // > 48dp 触控目标
    val cardElevation = 2.dp
}
```

---

## 七、项目结构

```
topfo-app/
├── app/
│   ├── build.gradle.kts
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/topfo/app/
│       │   ├── TopfoApplication.kt
│       │   ├── MainActivity.kt
│       │   │
│       │   ├── data/
│       │   │   ├── local/
│       │   │   │   ├── AppDatabase.kt         # Room 数据库（仅静态缓存表）
│       │   │   │   ├── dao/
│       │   │   │   │   ├── SchoolDao.kt
│       │   │   │   │   ├── ProgramDao.kt
│       │   │   │   │   └── RankingDao.kt       # ⚠️ 无 ChatDao — 聊天不走本地
│       │   │   │   └── PreferencesManager.kt   # DataStore (JWT + 主题偏好)
│       │   │   ├── remote/
│       │   │   │   ├── TopfoApi.kt             # Retrofit 接口
│       │   │   │   ├── AuthInterceptor.kt      # JWT 自动注入
│       │   │   │   └── dto/                    # 请求/响应 DTO
│       │   │   ├── repository/
│       │   │   │   ├── AuthRepository.kt
│       │   │   │   ├── AdmissionRepository.kt
│       │   │   │   ├── RankingRepository.kt
│       │   │   │   └── ChatRepository.kt
│       │   │   └── model/
│       │   │       ├── School.kt
│       │   │       ├── Program.kt
│       │   │       ├── Ranking.kt
│       │   │       ├── UserProfile.kt
│       │   │       └── ChatMessage.kt
│       │   │
│       │   ├── ui/
│       │   │   ├── theme/
│       │   │   │   ├── Theme.kt
│       │   │   │   ├── Color.kt
│       │   │   │   ├── Type.kt
│       │   │   │   └── Dimens.kt
│       │   │   ├── navigation/
│       │   │   │   └── TopfoNavGraph.kt       # Navigation 路由
│       │   │   ├── home/
│       │   │   │   ├── HomeScreen.kt
│       │   │   │   └── HomeViewModel.kt
│       │   │   ├── admission/
│       │   │   │   ├── AdmissionScreen.kt
│       │   │   │   ├── AdmissionViewModel.kt
│       │   │   │   └── components/
│       │   │   │       ├── SchoolCard.kt
│       │   │   │       ├── ProgramChip.kt
│       │   │   │       └── MatchBadge.kt
│       │   │   ├── rankings/
│       │   │   │   ├── RankingsScreen.kt
│       │   │   │   ├── RankingsViewModel.kt
│       │   │   │   └── components/
│       │   │   │       ├── RankingItem.kt
│       │   │   │       └── ScoreBar.kt
│       │   │   ├── insights/
│       │   │   │   ├── InsightsScreen.kt
│       │   │   │   └── InsightsViewModel.kt
│       │   │   ├── files/
│       │   │   │   ├── FilesScreen.kt
│       │   │   │   ├── FileDetailScreen.kt
│       │   │   │   └── FilesViewModel.kt
│       │   │   ├── profile/
│       │   │   │   ├── ProfileScreen.kt
│       │   │   │   ├── ProfileViewModel.kt
│       │   │   │   └── components/
│       │   │   │       ├── ProfileEditSheet.kt
│       │   │   │       └── LoginDialog.kt
│       │   │   └── chat/
│       │   │       ├── ChatScreen.kt
│       │   │       └── ChatViewModel.kt
│       │   │
│       │   └── util/
│       │       ├── Resource.kt              # sealed class 封装状态
│       │       └── NetworkMonitor.kt        # 网络状态检测
│       │
│       ├── res/
│       │   ├── raw/
│       │   │   ├── schools.json            # 录取数据 (从 data.js 转换)
│       │   │   └── rankings.json           # 排名数据
│       │   ├── values/
│       │   │   ├── strings.xml
│       │   │   └── themes.xml
│       │   └── mipmap-*/
│       │       └── ic_launcher.webp
│       │
│       └── proguard-rules.pro
│
├── build.gradle.kts
├── settings.gradle.kts
├── gradle.properties
└── gradle/
    └── libs.versions.toml
```

---

## 八、开发阶段规划

| 阶段 | 内容 | 预计文件 |
|------|------|---------|
| **Phase 1** 骨架 | Gradle 项目初始化、主题、导航框架、空页面占位 | ~15 文件 |
| **Phase 2** 数据层 | Room 数据库、Retrofit API、Repository、JSON 导入 | ~10 文件 |
| **Phase 3** 录取对照表 | AdmissionScreen + 筛选 + 卡片列表 + 登录匹配标签 | ~8 文件 |
| **Phase 4** 排名 + 发现 | RankingsScreen / InsightsScreen | ~6 文件 |
| **Phase 5** 文件中心 | FilesScreen + FileDetailScreen | ~4 文件 |
| **Phase 6** 账户 + 聊天 | Login、Profile、ChatScreen | ~8 文件 |
| **Phase 7** 收尾 | 深色模式、错误处理、下拉刷新、性能优化 | ~5 文件 |

---

## 九、数据同步与规则检查清单 ✅

### 9.1 数据一致性

确保 App 与网站数据 100% 一致：

- [ ] 录取数据 (data.js → schools.json) — 26所院校含分校区、9大专业方向
- [ ] 排名数据 — QS 2027/2025 + THE 2026 + US News 2026-2027/2025
- [ ] 个人信息 — GPA / 雅思 / 匹配标签逻辑完全一致
- [ ] 关键发现内容 — 分校区红利、数学vs CS、心理、双录路径
- [ ] 文件中心 — QS Future Skills Index 2027 完整解读 + PDF下载
- [ ] AI 聊天 — 仅 caiqijun + D1 云同步（App和网页共用同一张表）+ 3天活跃/归档
- [ ] 登录鉴权 — 同一 JWT + 同一后端 API (/api/login)

### 9.2 隐私与安全规则（继承网站设计）

| 规则 | 描述 |
|------|------|
| 访客模式 | 未登录用户只能看到排行榜 + 通用录取数据 + 文件下载 |
| 登录保护 | 个人GPA/雅思匹配、关键发现、AI聊天必须登录 |
| 登录账号 | caiqijun / 20262026（与网页相同） |
| 密码安全 | PBKDF2-SHA256 在服务端验证，明文不存前端 |
| JWT 管理 | HMAC-SHA256 签名，DataStore 持久化，过期自动清理 |
| 数据加密 | 个人数据在后端 AES-256-GCM 加密，前端读解密后的明文 |
| AI 权限 | 仅 username=caiqijun 可调用 /api/chat，其他用户返回 403 |

### 9.3 前后端分离检查

| 数据类型 | 存储位置 | 前端能否写入 | 说明 |
|---------|---------|-------------|------|
| 学校/专业/排名 | 前端 Room 缓存 | ❌ 只读 | 从 JSON 导入，启动时远程检查更新 |
| 个人 GPA/雅思 | 后端 /api/me/data | ❌ 通过 API 更新 | 前端 DataStore 不存个人数据 |
| 聊天记录 | 后端 D1 chat_messages | ❌ 通过 /api/chat 收发 | 前端不建 chat 表 |
| JWT Token | 前端 DataStore | ✅ 登录后写入 | 仅鉴权用途，不含业务数据 |
| 主题偏好 | 前端 DataStore | ✅ | 用户 UI 偏好，与业务无关 |
