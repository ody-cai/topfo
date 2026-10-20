#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""2026-10-20 日更补丁：麦马补充申请官方全表结案 + UBC 单项重考/拼分硬限制 + IRCC Levels Plan 官方表"""
import io

P = '/Users/odycai/WorkBuddy/升学/public/js/data.js'
s = io.open(P, encoding='utf-8').read()
orig_len = len(s)
hits = []

def patch(school, text):
    global s
    anchor = "{name:'%s'" % school
    i = s.find(anchor)
    if i < 0:
        hits.append((school, 'MISS-anchor'))
        return
    j = s.find(",tuition:'", i)
    if j < 0:
        hits.append((school, 'MISS-tuition'))
        return
    # QUOTE 守卫：插入点前一位必须是 deadline 字符串的闭合单引号
    if s[j-1] != "'":
        hits.append((school, 'GUARD-FAIL:%r' % s[j-1]))
        return
    s = s[:j-1] + text + s[j-1:]
    hits.append((school, 'HIT'))

MC = ('🆕2026-10-20（future.mcmaster.ca/apply/supplementary-applications 官方 Level I 补充申请清单全文实抓，核对日 2026-10-20）：'
 '✅**iSci「2/1 vs 2/2」三方口径冲突结案** —— **官方中央清单明确 iSci 补充申请截止 2027-02-02 23:59 ET**，'
 '此前「按 2/1 前完成最安全」的保守建议作废，改按官方 2/2 执行。'
 '📌**补充申请官方全表（Fall 2027，首次逐项成表）**：'
 '**工程／计算机科学／B.Tech／iBioMed 同为 2027-01-28 23:59 ET**（Kira Talent 平台，**同院多专业只需完成一次**；'
 '费用 $50；3 段视频 + 1 段书面；**校方明令禁止 AI 工具、他人代笔与外部资料**，Kira 会监测复制与异常输入）；'
 '**Arts & Science 2027-02-01 23:59 ET**；**Wilson College（Leadership & Civic Studies）2027-02-01**；'
 '**Integrated Business & Humanities 2027-02-01**（强制 Kira 视频面试 + 2 页简历，60 人小班）；'
 '**Midwifery 2027-02-01**（Identity and Admissions Survey）；'
 '**Honours Health Sciences 官方仅给 2027 年 2 月上中旬窗口、无确切日**（**FAQ 明示错过不延期**，技术问题须在截止前联系 helpdesk）；'
 '**Business 为可选提交、2027-04-30**（用于低分区间补强与入学奖评审，**不提交不扣分**）；'
 '**Nursing 用 CASPer**（2027 周期首个考位 2026-09-22、末场 2027-03-18；**麦马与 Mohawk 多校区只需考一次**）。'
 '⚠️**工程类补充申请「早鸟 2026-11-26 / 正式截止 2027-01-28」相差两个月**，勿把早鸟日当截止日；'
 '**入学奖与助学金申请 2026-11-01 开放、主轮 2027-02-19 23:59 ET 截止**（可早于录取结果，须单独申请）。')

UBC = ('🆕2026-10-20（you.ubc.ca「English language competency」官方页全文实抓，核对日 2026-10-20）：'
 '⚠️**UBC 对「单项重考」与「跨场拼分」的两条硬限制首次逐字确认** —— '
 '①**明确不接受 IELTS One Skill Retake**（亦不接受 IELTS General、IELTS Indicator），'
 '官方表格脚注原文为「IELTS General, IELTS Indicator, and IELTS One Skill Retake are not accepted」；'
 '②**各项最低分必须同一次考试内达成，跨场次成绩不得拼接**'
 '（原文：scores across multiple instances of a test cannot be used to satisfy minimum component requirements）；'
 '③**2027/2028 冬季学期只认 2025-01-01 及以后考出的成绩**；'
 '④认可口径：**IELTS Academic 6.5（各项 ≥6.0）**、**TOEFL iBT 与 Home Edition 90（读 22／听 22／写 21／说 21）**、'
 '**DET 125（读听 115／写说 120）**、**PTE 65（各项 60）**、**CAEL 70**、**Cambridge 180**；'
 '⑤官方另设 **9 条替代路径**（含 IB／A-Level／加拿大课程体系 4 年全英文就读等）与 **ELAS 豁免申请（2/15 截止，须英语教师或校长推荐信）**。'
 '⇒ **对你的含义**：听力与阅读双 4.5 在 UBC **无法靠单项重考补齐**，只能整场重考 —— '
 '这与接受 OSR 的**滑铁卢／麦马／曼尼托巴／约克／渥太华／UVic** 形成明确分野，择校时须先分清。')

UT = ('🆕2026-10-20（canada.ca「Supplementary Information for the 2026-2028 Immigration Levels Plan」官方页实抓，'
 '页面更新日 2026-10-13；核对日 2026-10-20）：🇨🇦**IRCC Levels Plan 官方表格首次逐格核实** —— '
 '**国际学生新入境目标：2026 年 155,000、2027 年 150,000、2028 年 150,000**；'
 '**临时居民总入境 385,000（2026）／370,000（2027）／370,000（2028）**；'
 '官方脚注明文：**2027 与 2028 的名义目标与区间「将于每年 11 月 1 日前确认或调整」**'
 '（Notional targets and ranges for 2027 and 2028 will be confirmed or adjusted by November 1 of each year）'
 '⇒ **距该节点仅 12 天**，2027 各省 PAL 配额与本科端实际放量将在 11/1 前后落定；'
 '**永久居民维持 380,000/年**、**临时居民占总人口比例 2027 年底降至 5% 以下**为既定承诺（2026 年占比约 6.7%）。'
 '📌同时按 future.utoronto.ca 官方 Dates & Deadlines 页再次全文实抓（核对日 2026-10-20），三张表与现表**逐项一致**：'
 '**材料截止 = 工程 1/15、音乐 1/15，建筑／Rotman／文理其他／iSchool／运动机能／UTM／UTSC 均 2/1**；'
 '**补充申请 = 工程 ESA 1/15、音乐问卷 1/15，建筑 One Idea／Rotman／CS／KPE／UTSC SAF 2/1**；'
 '**推荐早申 11/7、对应材料 12/1**；**官方页仍不存在「2/16」** ⇒ 新东方系「文理网申 2/2、材料 2/16」口径**连续第 25 日不予采纳**。')

patch('麦克马斯特', MC)
patch('UBC·温哥华', UBC)
patch('多大·圣乔治', UT)

# --- 头部日期 ---
assert "const DATA_REV_DATE = '2026-10-19';" in s
s = s.replace("const DATA_REV_DATE = '2026-10-19';",
              "const DATA_REV_DATE = '2026-10-20';", 1)

# --- 尾部更新日志 ---
LOG = '''// ▲本次更新(2026-10-20): 9 专业方向录取 GPA 与雅思门槛**连续零变动**(第 25 轮)；实质 3 项 —— 麦马补充申请官方全表结案、
//   UBC 单项重考与跨场拼分硬限制、IRCC Levels Plan 官方表与 11/1 确认节点。
//   ①🎓**麦马补充申请官方清单全文实抓，iSci 冲突结案**：官方明确 **iSci 2027-02-02 23:59 ET**（此前「按 2/1 保守执行」作废）；
//     **工程／CS／B.Tech／iBioMed 2027-01-28 23:59 ET**（Kira 一次覆盖同院多专业、$50、3 视频 + 1 书面、禁 AI）；
//     **Arts & Science／Wilson／IBH／Midwifery 2027-02-01**；**BHSc 仅给 2 月上中旬窗口、错过不延期**；
//     **Business 可选、2027-04-30**；**Nursing 用 CASPer（首考 2026-09-22、末场 2027-03-18）**；
//     工程补充**早鸟 2026-11-26 与正式截止 2027-01-28 相差两个月**；入学奖 **11/01 开放、02/19 主轮截止**。
//   ②🎓**UBC 语言口径两条硬限制**：**不接受 IELTS One Skill Retake**（亦不接受 IELTS General／Indicator）；
//     **各项最低分须同场达成、跨场成绩不得拼接**；**2027/28 只认 2025-01-01 后成绩**；DET 125、TOEFL 90(22/22/21/21)、PTE 65(60)。
//     ⇒ 听读双 4.5 在 UBC 只能整场重考，与接受 OSR 的滑铁卢/麦马/曼尼托巴/约克/渥太华/UVic 分野明确。
//   ③🇨🇦**IRCC Levels Plan 官方表逐格核实(canada.ca，页更新 2026-10-13)**：学生新入境 **155,000(2026)/150,000(2027)/150,000(2028)**；
//     临时居民总入境 **385,000/370,000/370,000**；**官方脚注：2027、2028 名义目标与区间「每年 11 月 1 日前确认或调整」** ⇒ 距节点仅 12 天。
//     永久居民维持 380,000/年；临时居民占比 2027 年底降至 5% 以下。
//   ④📌**多大官方截止页第三次实抓**：材料 工程/音乐 1/15、其余 2/1；补充 工程 ESA/音乐 1/15、建筑/Rotman/CS/KPE/UTSC SAF 2/1；
//     早申 11/7 + 材料 12/1 —— **官方仍无 2/16**，新东方系「2/2、2/16」连续第 25 日不采纳。
//   ⑤🇨🇳**中外合办新增 2 条(⚠️招生平台口径，未取校方简章)**：⭐**南京信息工程大学 2+2 2027 春招**——免笔试三类：
//     本科线；**高考 ≥400 且英语 ≥90，或雅思 ≥4.5／托福 ≥55**；**国际高中/国际部/海外高中毕业者按「A-Level 等成绩符合合作校学士最低申请条件」评估**
//     （⇒ 中加学籍可走第三类）；专业含 **CS／软件工程／网络空间安全／人工智能／机器人工程／大数据**；国内约 5.8–8 万/年。
//     ⭐**江南大学 2+2／1+3 2027 春招**——免笔试 = 本科线／英语 ≥90／**雅思 ≥5.0**；招生含**高二完成、国际高中学生**。
//   ✅**复核无变化**：滑铁卢官方 webinar 页（2/1 申请、工程 1/15；**无早申优势**；重修取最高分、非日校课程不加罚；AIF 覆盖工院 + 数学，一次即可）、
//   麦吉尔（海外高中 1/15、加高 2/1、材料 3/1、申请费 $140.16 且同学期第二次申请免费）、UBC 2027W 全节点。
//   ⚠️持续不采纳(连续第 25 日)：新东方系「多大文理网申 2/2、材料 2/16」；内容农场「多大心理 14.7% / UBC 16.2% / McGill 15.8%、
//   2027 视频面试 7 校」；立思辰「SFU 隐性 7.0」。⚠️eduquest 汇总矩阵（滑铁卢 AIF 2/16、Western AEO 2/15、皇后 2/1、SFU 1/31）与各校官方冲突，维持官方。
//   ⚠️英国约克大学(University of York, UK)政策与加拿大约克大学**无关**，检索须严格区分。
'''

old_head = '// 最后更新: 2026-10-19\n'
assert old_head in s, 'LASTUPDATE anchor missing'
s = s.replace(old_head, '// 最后更新: 2026-10-20\n' + LOG, 1)

io.open(P, 'w', encoding='utf-8').write(s)
print('hits:', hits)
print('size: %d -> %d (+%d)' % (orig_len, len(s), len(s)-orig_len))
