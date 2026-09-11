# TopFO v1.1.1 — API对齐 + 排版修复

## 改动总览
修改了 16 个 Kotlin 源文件，1 个 version.json，构建并部署了新 APK。

## API-APP 数据对齐（4项关键修复）

| 问题 | 根因 | 修复 |
|------|------|------|
| 个人资料加载失败 | `MeDataResponse` 期待扁平字段，API 返回嵌套 `ielts` 对象 | 重写为 `IeltsData` 嵌套结构 + 扩展函数 |
| 排名数据不显示 | `RankingsResponse` 期待 `qs/the/usn` 列，API 返回 flat per-source entries | 重写 `transformRankings()` 直接匹配 API 格式 |
| 学校数据不显示 | `SchoolsResponse` 期待 `Map<tier, schools>`，API 返回扁平数组 | 重写为扁平 `List<ApiSchoolDto>` + 字段映射 (gpa_min/ielts_min/has_coop) |
| 登录不显示名字 | `LoginResponse` 忽略 `user` 对象 | 新增 `LoginUserDto` + `AuthRepository.displayName` |

## 排版修复
- **参数签名**：所有 Composable 的 `modifier` 改到回调之前（防止 trailing lambda 绑定错误）
- **登录对话框**：从 ProfileScreen 移除，统一由 MainScreen 管理
- **ChatScreen**：底部发送按钮改为 `FilledIconButton`
- 其他细节：AdmissionScreen chip 布局、String.format 统一

## 构建
- **v1.1.1** (versionCode=5)，2.0MB 签名 APK
- APK: https://topfo.pages.dev/download/TopFO-v1.1.1.apk
- 网页: https://topfo.pages.dev
