# -*- coding: utf-8 -*-
"""2026-10-21 日更补丁：阿尔伯塔口径纠错 + 麦吉尔学籍分轨节点 + 多大(IRCC PAL 时点) + UNSW(ATEC)"""
import io, sys, re

P = 'public/js/data.js'
s = io.open(P, encoding='utf-8').read()
orig = s
hits = 0
miss = []

def replace_once(old, new, tag):
    global s, hits
    if old not in s:
        miss.append(tag)
        return
    assert old in s and s.count(old) == 1, 'ambiguous: ' + tag
    s = s.replace(old, new, 1)
    hits += 1

# ---------- 1. 阿尔伯塔：两处 TOEFL 纠错 + 直录单项 5.5 ----------
replace_once("TOEFL iBT 40(单项≥12)", "TOEFL iBT 65(单项≥16)", "AB-BP1-toefl")
replace_once("TOEFL iBT 53(单项≥14)", "TOEFL iBT 70(单项≥17)", "AB-BP2-toefl")
replace_once("直录口径复核:IELTS 6.5(每项≥6.0)", "直录口径复核:IELTS 6.5(每项≥5.5)", "AB-direct-band")

AB_ADD = (
    "🆕2026-10-21（`calendar.ualberta.ca` 官方 University Calendar 全文实抓，核对日 2026-10-21）："
    "🔧**纠错 2 处 + 直录门槛校正 1 处** —— ①**Bridging Stage 1 的 TOEFL iBT 应为 65（各单项≥16）**、"
    "**Stage 2 为 70（各单项≥17）**（此前误记 40(12)/53(14)，与官方不符，已改）；"
    "②**直录 IELTS 官方为 6.5「各单项不低于 5.5」**，并非 6.0 —— 与表内 programs 行既有的 6.5(5.5) 终于统一"
    "（正文长期写 6.0、表格写 5.5，自相矛盾，本轮以官方页为准统一为 5.5）；"
    "③直录 **TOEFL iBT 90（各单项≥21）**；"
    "④BP Stage 1 = **IELTS 5.0（各单项≥4.5）** 复核不变 ⇒ **你的 5.0 且四项均≥4.5 恰好踩线**，"
    "但仅限 **ALES／Arts／Kinesiology, Sport & Recreation／Native Studies／Science／Augustana** 六院，"
    "**工程不在内**；**CS 属 Faculty of Science，可走此通道**；须「superior academic standing」由招生办个案判定。"
)

# ---------- 2. 麦吉尔：学籍分轨节点 ----------
MG_ADD = (
    "🆕2026-10-21（`mcgill.ca/undergraduate-admissions/apply/requirements/ontario` 与 `/us` 两页官方实抓，核对日 2026-10-21）："
    "📅**材料截止按学籍分轨，并非全校统一 3/1** —— ①**安省高中申请者**：申请 **2027-02-01**、"
    "**材料 2027-05-04**、**Major Entrance Scholarship 2027-02-07**、"
    "自报成绩 **2027-02-01–03-01（第一轮，可选）+ 2027-04-01–05-15（第二轮，强制）**；音乐与宗教研究 **1/15**；"
    "②**海外／美国学制申请者**：申请 **2027-01-15**、**材料 2027-03-01**、**Major Entrance Scholarship 2027-01-21**、"
    "美国境内高中自报成绩 **2026-11-15–2027-03-01**；"
    "③⚠️**你属海外学制 ⇒ 适用 1/15 + 3/1 + 1/21 一组**，安省的 2/1 + 5/4 + 2/7 不适用于你；"
    "④材料齐备者优先——**项目满位时未完成档案可能被直接取消且不退费**；英语成绩由考试机构直送，"
    "官方并提示部分雅思考点出分慢，须在 3/1 前留出余量。"
)

# ---------- 3. 多大·圣乔治：IRCC PAL 时点硬规则 ----------
UT_ADD = (
    "🆕2026-10-21（IRCC 官方 operational bulletin「Study permits: Provincial or territorial attestation letters」实抓，核对日 2026-10-21）："
    "🇨🇦**PAL 的「时点」规则首次逐条入表 —— 对 2027 秋入学最要命的一组约束**："
    "①**PAL 绑定 cap year**：2026-01-01 至 2026-12-31 签发者**仅有效至 2026-12-31**，**不得用往年 cap year 的 PAL 递签**；"
    "②**递签当日 PAL 须有效，开学日不要求有效**（官方原文：must be valid when you apply, not when you start studying）"
    "⇒ **2027 年 9 月入学必须持 2027 cap year 的 PAL**；"
    "③**2025-01-22 起换校须重新申请 PAL**；④**每名申请人各需一份**（家庭同时申请亦然）；"
    "⑤**仅「自愿撤回」或「未被受理」可复用**；已获批或已拒签须重新申请；⑥**恢复身份（restoration）须新 PAL**；"
    "⑦**魁省以 CAQ 代替 PAL**；⑧**2026 年配额结构**：全国申请配额 **309,670**，其中需 PAL 者 **180,000**；"
    "安省 **104,780**、魁省 **93,069**、BC **32,596**、阿省 **32,271**；"
    "⑨**2027 年各省配额截至今日仍未公布**（上一年度为 2025-11-25 公布；2027–2029 Levels Plan 须 **2026-11-01** 前确认或调整）"
    "⇒ **距该节点仅 11 天**。📌同期按官方 Dates & Deadlines 页第 6 次实抓，三张表与现表**逐项零差异**："
    "申请统一 1/15（推荐早申 11/7）、材料 工程/音乐 1/15 其余 2/1、补充 工程 ESA/音乐问卷 1/15 其余 2/1、"
    "**早申材料 12/1**；官方页仍**不存在「2/2」「2/16」** ⇒ 新东方系「文理网申 2/2、材料 2/16、早申材料 12/2」与 "
    "shiksha「建筑 2/2、运动机能 1/15」口径**均不予采纳**。"
)

# ---------- 4. UNSW：ATEC ----------
UN_ADD = (
    "🆕2026-10-21（澳洲 2027 NPL 分配口径补全，核对日 2026-10-21）："
    "🏛️**自 2027 年起，国际生配额分配改由新设的 ATEC（Australian Tertiary Education Commission，澳洲高等教育委员会）监管**"
    "（此前由教育部直接管理）—— 属治理架构变更，**NPL 数值与 80%／超 15% 优先级分档规则不变**；"
    "⚠️提醒：NPL 是**签证审理优先级规划值，不是签证上限**；院校热门专业「满位即关」是校内席位规则，与 NPL 属两套体系。"
)

def insert_before_tuition(anchor_name, text, tag):
    global s, hits
    key = "{name:'" + anchor_name + "'"
    i = s.find(key)
    assert i >= 0, 'school not found: ' + anchor_name
    j = s.find(",tuition:'", i)
    assert j > i, 'tuition not found: ' + anchor_name
    # QUOTE 守卫：插入点前一位必须是字符串闭合单引号
    assert s[j - 1] == "'", 'QUOTE GUARD FAILED at %s (char=%r)' % (anchor_name, s[j - 1])
    ins = j - 1
    assert s[ins] == "'"
    # 二次守卫：插入点之前不得是转义反斜杠
    assert s[ins - 1] != '\\', 'ESCAPED QUOTE at %s' % anchor_name
    s = s[:ins] + text + s[ins:]
    hits += 1
    print('  OK  %s  (+%d chars)' % (tag, len(text)))

print('== text replacements ==')
insert_before_tuition('阿尔伯塔', AB_ADD, 'AB-append')
insert_before_tuition('麦吉尔', MG_ADD, 'MG-append')
insert_before_tuition('多大·圣乔治', UT_ADD, 'UT-append')
insert_before_tuition('UNSW', UN_ADD, 'UNSW-append')

print('== rev / date ==')
s = s.replace("const DATA_REV_DATE = '2026-10-20';", "const DATA_REV_DATE = '2026-10-21';", 1)
s = s.replace('// delpoy_rev_10182', '// delpoy_rev_10211', 1)
s = s.replace('// 最后更新: 2026-10-20', '// 最后更新: 2026-10-21', 1)

LOG = """// ▲本次更新(2026-10-21): 9 专业方向录取 GPA 与雅思门槛**连续零变动(第 26 轮)**；实质 4 项 ——
//   IRCC PAL 时点硬规则、麦吉尔材料按学籍分轨、阿尔伯塔口径纠错、澳洲 ATEC 监管变更。
//   ①🇨🇦**IRCC PAL 时点规则逐条确认(官方 operational bulletin)**：PAL **绑定 cap year**(2026 年签发者仅有效至 2026-12-31，
//     不得用往年 PAL 递签)；**递签当日须有效、开学日不要求有效** ⇒ **2027 秋入学须持 2027 cap year 的 PAL**；
//     2025-01-22 起换校须新 PAL；每申请人各一份；仅「撤回/未受理」可复用；恢复身份须新 PAL；魁省用 CAQ。
//     **2026 配额结构**：全国申请配额 309,670(其中需 PAL 者 180,000)，安省 104,780/魁省 93,069/BC 32,596/阿省 32,271；
//     **2027 各省配额仍待公布**，2027–2029 Levels Plan 须 **2026-11-01** 前确认或调整(仅剩 11 天)。
//   ②🎓**麦吉尔材料截止按学籍分轨**(官方 Ontario / US 两页实抓)：安省 = 申请 2/1、**材料 5/4**、奖学金 2/7、
//     自报 2/1–3/1(可选)+4/1–5/15(强制)；海外/美国 = 申请 1/15、材料 3/1、奖学金 1/21、自报 11/15–3/1。
//     ⇒ **你属海外学制，适用 1/15+3/1+1/21**；满位时未完成档案可能被取消且不退费。
//   ③🔧**阿尔伯塔纠错 2 处 + 直录校正 1 处**(calendar.ualberta.ca 官方)：BP Stage1 TOEFL iBT **65(≥16)**、Stage2 **70(≥17)**
//     (此前误记 40(12)/53(14))；直录 IELTS **6.5(各单项≥5.5)** 而非 6.0，与 programs 行统一；直录 TOEFL 90(21)。
//     BP Stage1 = IELTS 5.0(各≥4.5) 不变 ⇒ 你恰好踩线，但仅限 ALES/Arts/Kinesiology/Native Studies/Science/Augustana 六院，
//     **工程不在内，CS 属 Science 可走**。
//   ④🌏**澳洲**：2027 起国际生配额分配改由 **ATEC** 监管(治理变更，NPL 295,000 与 80%/超 15% 分档规则不变)。
//   ✅复核零差异：多大官方三张表(第 6 次实抓，仍无 2/2、2/16)、滑铁卢(2/1、工程 1/15、材料 2/15、无早申优势)、
//     皇后(2/1 三专业 / 3/1 其余 / 材料 3/31 / 奖 12/8 / 宿舍 6/1)、UBC Sauder 全节点、澳洲三校预科。
//   ❌本轮驳回：新东方系「多大文理网申 2/2、材料 2/16、早申材料 12/2」；shiksha「多大建筑 2/2、运动机能 1/15」；
//     eduquest 汇总矩阵(滑铁卢 2/16、韦士敦 AEO 2/15、SFU 1/31、阿省 3/15)与各校官方冲突。
//   🇨🇳中外合办 2 条(⚠️招生平台/中介口径，未取校方简章)：⭐**上外贤达 SQA-AD 3+1 / IPP 2+2 2027 春季班**——
//     免笔试：SQA 高考英语 ≥90 或 **雅思 5.0(单项≥4.5)**；IPP 英语 ≥110 或 **雅思 5.0**；专业含大数据管理与应用/会计与金融/
//     市场营销与管理/体育管理；对接 **昆士兰大学 QS40**、伯明翰(新加坡 SIM)、埃克塞特、纽卡斯尔(新加坡) 等；2+2 需 2 分钟英文自我介绍视频。
//     ⇒ **「单项≥4.5」与你听读双 4.5 精确匹配**，为累计第 9 条 5.0 通道。
//     ⭐**东华大学 2+2** 专业方向细化：商科/**工程(AI、计算机科学与技术、数据科学与大数据技术、机械、环境)**/艺术设计；
//     免笔试 = 本科线 / 高考英语 100 / **雅思 5.0** / 托福 60 / A-Level·IB·AP 符合合作校最低申请条件；含高二完成与同等学力。
"""
s = s.replace('// 最后更新: 2026-10-21\n', '// 最后更新: 2026-10-21\n' + LOG, 1)

io.open(P, 'w', encoding='utf-8').write(s)
print('\nHIT=%d  MISS=%s' % (hits, miss if miss else '0'))
print('bytes: %d -> %d' % (len(orig.encode('utf-8')), len(s.encode('utf-8'))))
if miss:
    sys.exit(1)
