#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
2026-10-06 日更补丁（覆盖 10/5–10/6 窗口）
权威源顺序：先改 升学/public/js/data.js + 升学/加拿大大学录取要求对照表_2026.html
（两者共用同一行院校数据文本，同一 old/new 串可同时命中）→ 再 sync_app_data.js → 再 cp 到工作区副本。
"""
import io, os, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_JS = os.path.join(BASE, 'public/js/data.js')
MASTER_HTML = os.path.join(BASE, '加拿大大学录取要求对照表_2026.html')

# ---------- 仅 data.js 的版本标记 ----------
JS_ONLY = [
    ("// delpoy_rev_10104", "// delpoy_rev_10106"),
    ("// 最后更新: 2026-10-04", "// 最后更新: 2026-10-06"),
    ("// ▲本次更新(2026-10-04,覆盖 10/3–10/4 窗口)",
     "// ▲本次更新(2026-10-06,覆盖 10/5–10/6 窗口)"),
]

# ---------- 仅 master HTML 的版本标记 ----------
HTML_ONLY = [
    ("const DATA_UPDATED = '2026-10-04';", "const DATA_UPDATED = '2026-10-06';"),
]

# ---------- 院校数据块（data.js 与 master HTML 共用）----------
SHARED = []

# R1 阿尔伯塔：Bridging Program 官方分级 + One Skill Retake 不接受 + 时间线细化
SHARED.append((
    "均分85%+的中国学生年均约C$3,000–8,000",
    "均分85%+的中国学生年均约C$3,000–8,000"
    ";🆕2026-10-06(官方 calendar.ualberta.ca 实抓,Bridging Program 分级明确):"
    "**Bridging Stage 1 = IELTS 5.0(单项不低于4.5)** / TOEFL iBT 40(单项≥12);"
    "**Bridging Stage 2 = IELTS 5.5(单项不低于5.0)** / TOEFL iBT 53(单项≥14);"
    "两阶段的对象是「学术成绩优秀、满足该院系其他全部要求、仅英语未达标」者 → "
    "⚠️**Stage 1 门槛正是你当前 5.0(写作5.5/阅读4.5/听力4.5/口语5.0) 的达标线(四项均≥4.5)**，"
    "但须由招生办按「superior academic standing」个案判断，且本校 EAP 不含工程(工程走 Year One Foundation)。"
    "⚠️**阿尔伯塔不接受 IELTS One Skill Retake**(对比:滑铁卢/麦马/曼尼托巴/约克接受;多大/UBC/麦吉尔不接受)。"
    "直录口径复核:IELTS 6.5(每项≥6.0)、TOEFL 新制 4.5、**DET 120(综合小分≥100,有效期至2028/29周期)**、"
    "CAEL 70(60)、PTE 61(60)、Cambridge 180(170);教育/护理类另需口语 IELTS Speaking 7.5 或 TOEFL Speaking 5.0(新制)。"
    "时间线细化:2027-02-19 可补第一学期成绩、2027-04-30 自报最终成绩(兼优先宿舍截止)、"
    "2027-05-01 接受 4/1 前发出的 offer、2027-08-01 高中申请者材料截止;滚动评估(10/1–8/31)。"
    "学费:国际生工程**保证 C$49,953/年**(2026 Fall 入学口径)，**2027 Fall 新入学国际生上调 5.5%**;申请费 C$150"
))

# R2 SFU：申请截止日更正 2/28 → 1/31 + Fall 2027 全量时间线
SHARED.append((
    "deadline:'2月28日;🆕2026-09-20(官方参议院文件S.26-55",
    "deadline:'⚠️更正:申请截止 **2027-01-31**(此前只填「2月28日」，实为**材料截止日**，非申请截止日)；"
    "🆕2026-10-06(官方 Fall 2027 时间线实抓): 2026-10-01 开放申请(EducationPlannerBC)+本科入学学者奖同步开放；"
    "2026-12-15 Undergraduate Scholars Entrance Scholarship 截止(须先取得 SFU 学号)；"
    "**2027-01-31 申请截止**；**2027-02-28 材料截止**；**2027-05-01 接受 offer**(兼住宿申请截止)；"
    "录取决定 2027-01 至 2027-04 底滚动发出；CS/Software Systems 历史录取区间 **high 80s–low 90s**(近三年，加拿大与国际生同区间)；"
    "先修:ENG4U(≥70%)+MHF4U+一门理科(SBI4U/SCH4U/SPH4U)，MCV4U 建议非必需；学费 $220.61/unit(2026-27)；"
    "🆕2026-09-20(官方参议院文件S.26-55"
))

# R3 TMU：deadline 从「3月31日」补全为 2027 Fall 全量 + 语言通道四级 + 奖学金 + 学费
SHARED.append((
    "deadline:'3月31日',tuition:'28,000-36,000'",
    "deadline:'⚠️更正(此前仅填「3月31日」，已过期):2027 Fall **平等考虑截止 2027-02-01**(此前递交按此日期同等评审，之后名额满即关闭)、"
    "**语言成绩最后期限 2027-04-01**(逾期材料不完整)；2027 冬季(1月)国际生 **2026-10-15** 申请、**2026-11-03** 语言成绩(专业列表有限)；"
    "🆕2026-10-06(官方口径复核): 校内语言通道**四级**——English Boost(雅思6.0) / Pre-English Boost+English Boost(5.5) / "
    "ESL Foundation(5.0–6.0) / **Pre-ESL Foundation + ESL Foundation(4.5)**；"
    "为 2027-09 学位入学，可选 ESL Foundation 或 Pre-English Boost+English Boost，时段 **2027-01-11 至 04-30**；"
    "⚠️走语言通道同样需要 PAL 与学习许可；"
    "国际生入学奖(AwardSpring)窗口 **2026-11-02 至 2027-02-16**(拿到学号即可先申请，不必等 offer)——"
    "International Student Leadership Award C$10,000(一次性，至多 53 名)、President’s Entrance Scholarship C$10,000/年"
    "(四年最高 C$40,000，12 名，含保证宿舍床位)；⚠️TMU 可再生入学奖 C$750–3,000/年(均分86%+)**仅限就读加拿大高中者**，"
    "中加学籍是否适用须向校方书面确认；2026/27 国际生学费:Arts C$38,706–38,731 / Science(含CS) C$38,702–38,762 / "
    "Ted Rogers 商 C$44,476–44,532 / 工程与建筑 C$44,375–44,675；工程录取区间:90%+ (Civil/Electrical/Mechanical)、"
    "85–90% (Aerospace/Biomedical/Chemical/Computer/Industrial)；CS 公布区间 75–80%(全校最低档之一)"
    "',tuition:'28,000-36,000'"
))

# R4 TMU 双录门槛 5.0+ → 4.5+（仅 TMU，8 处）
# ⚠️ 该字符串被 11 所学校共用（88 处），必须按行内作用域替换，否则会污染其它 10 校。
# 格式: (old, new, scope) —— scope 为必含于同一行的锚点
SCOPED = [
    ("dual_type:'ESL',dual_thr:'5.0+'",
     "dual_type:'ESL',dual_thr:'4.5+ (Pre-ESL+ESL Foundation 最低档)'",
     "name:'TMU(原Ryerson)'"),
]

# R5 麦克马斯特：One Skill Retake 接受 + 工程均值/费用
SHARED.append((
    "Midwifery 于2027-02-01审查OUAC最终成绩;全部offer基于2027-05-15前经OUAC收到的官方成绩",
    "Midwifery 于2027-02-01审查OUAC最终成绩;全部offer基于2027-05-15前经OUAC收到的官方成绩"
    ";🆕2026-10-06复核(官网×Stellar 10校英语门槛逐校对照表,核对日 2026-09-30):"
    "⚠️**麦马接受 IELTS One Skill Retake**（对你关键——可只重考听力/阅读两个 4.5 单项，不必全套重考）；"
    "英语门槛:IELTS 6.5(各项≥6.0)、TOEFL 新制 4.5(读4.0/写4.0/说4.0/听4.5)、DET 120(读115/写125/听110/说115)；"
    "工程最低均分 **87%**(校方 anticipated admission range)，目标班 **1,000 人**，OUAC 另加 **C$50** 专业费；"
    "招生节奏:通常 3 月中至 5 月初发 offer"
))

# R6 滑铁卢：One Skill Retake 接受 + DET/CAEL + AIF 费用 + 工程区间
SHARED.append((
    "地理与航空/科学与航空停用 AIF",
    "地理与航空/科学与航空停用 AIF"
    ";🆕2026-10-06复核(10校英语门槛逐校对照表,核对日 2026-09-30):"
    "⚠️**滑铁卢接受 IELTS One Skill Retake**（对你关键——可只重考听力/阅读两个 4.5 单项）；"
    "DET 120(Literacy 与 Production 125)；**CAEL 不在滑铁卢认可清单**；PTE 63(写/说 65)；"
    "工程 **AIF + 线上视频面试截止 2027-02-01**，OUAC 另加 **C$60** 专业费；"
    "2027 工程录取区间:多数项目 mid-to-high 80s、Biomedical/Computer/Mechanical/Mechatronics/Systems Design 高 80s–低 90s、"
    "**Electrical/Software 低-中 90s**；发 offer 节奏 2026-12 至 2027-05(工程/数学 1 月起，多数在 5 月，安省高中生 5 月中前发完)"
))

# R7 多大·圣乔治：Track One 表述精化 + 官方三张表复核 + UTM CS 费用 + One Skill Retake 不接受 + Pearson
SHARED.append((
    "宿舍保证需 3/31 前完成住宿申请、6/1 前接受 offer",
    "宿舍保证需 3/31 前完成住宿申请、6/1 前接受 offer"
    ";🆕2026-10-06: ①⚠️**「Track One」应表述为「暂停两个招生周期(2027 与 2028 秋季入学)」而非永久取消**——"
    "工程院明确暂停不缩减一年级整体招生规模、更多学生经 Core 8 / EngSci 录取；此前记「已取消」过于绝对，已精化；"
    "②官方三张表 2026-10-06 实抓复核**与现表完全一致**——材料:工程 1/15、音乐 1/15，建筑/A&S–Rotman/A&S–其余/iSchool/"
    "运动机能/UTM/UTSC 均 2/1；补充:工程 OSP 1/15、音乐问卷 1/15，建筑 One Idea/Rotman/CS/运动机能/UTSC 均 2/1；"
    "早申推荐 **11/7** + 材料 **12/1**(官方原文 “by December 1”)；"
    "③**UTSG CS 补充申请 = Join U of T 内四道不计时短答**(建议 12/1 前、**2/1 截止**)；"
    "**UTM CS 补充申请 = 一道书面作答**(2/1 截止)，**UTM 经 OUAC 另加 C$52 专业费**；UTSG CS 公布区间 Low 90s、UTSC CS Low 90s(Co-op 高 90s)、UTM CS 中-高 80s；"
    "④⚠️**多大不接受 IELTS One Skill Retake**；DET 120(Production 120)；TOEFL 新制 4.5(写作4.5/口语4.0)；"
    "⑤Pearson 官方页复核:37 人/年、2024 年发放 **>$1,200 万**、188 个国家/地区；"
    "三个节点不变(10/9 校提名 → 10/16 OUAC 入学申请 → 11/6 奖学金材料)；另有第三方口径提及 **10/30** 为奖学金表节点，**待官方确认**"
))

# R8 康考迪亚：学费/资金/CAQ/冬季状态/工程区间
SHARED.append((
    "⚠️Grey Nuns宿舍2027-28不开放,2027住宿申请尚未公布",
    "⚠️Grey Nuns宿舍2027-28不开放,2027住宿申请尚未公布"
    ";🆕2026-10-06(官方口径复核): 直录 IELTS **6.0(单项≥5.5)**、DET 105 —— 复核一致；"
    "2026/27 国际生学费:文理 **C$34,800/30学分**(每学分 C$1,160)、工程与计算机 **C$1,285/学分**、商科 30 学分约 **C$42,000**；申请费 C$100；"
    "⚠️**魁省生活费证明 C$24,617/年**(高于联邦口径 23,448)，且**须先办 CAQ(C$135)再申请学习许可**；"
    "2027 冬季:CS 与 Finance 开放、Communication Studies 关闭(校方状态页更新于 2026-08-27)，通用冬季截止 11/1、国际生建议 8/1(已过)；"
    "工程 R-score 门槛区间:Building/Civil 23/23/22 → Aerospace 29/27/27；"
    "⚠️魁省学制:高中 11 年后接 CEGEP，国际高中毕业生入 **120 学分 Extended Credit Program**(比本地生多一年基础课)"
))

# R9 曼尼托巴：冬季截止已过
SHARED.append((
    "明确不要求会考或高考成绩",
    "明确不要求会考或高考成绩"
    ";🆕2026-10-06(官方冬季入口页复核): **2027 冬季(1月)入学申请已于 2026-10-01 截止**——"
    "University 1 国际生、以及 Arts/Science/Environment/Earth & Resources 直接入系同一截止日；"
    "若考虑冬季入口须改看 2028 冬季或转 Fall 2027(3/1)；第三方口径另称 12/1 为「早申及奖学金」节点、3/1 为常规截止，与官网一致"
))

# R10 UNSW：QS 2027 澳洲第一 + T1 时间线 + 同济国内预科
SHARED.append((
    "商科方向 IELTS 6.0(写作5.5/单项≥5.0)",
    "商科方向 IELTS 6.0(写作5.5/单项≥5.0)"
    ";🆕2026-10-06: ①**QS 2027 UNSW 升至全球第 19、首次成为澳洲第一**(雇主声誉 94.3、就业成果 97.4 全澳第一、可持续 98)；"
    "②三学期制 T1(2月)/T2(5月)/T3(9月)；**2027 T1 申请 2026-08 前后已开放、预计 2026-10月底–11月底截止**，"
    "T2 预计 2027-03~04 截止、T3 预计 2027-07~08 截止；医学/法律部分专业仅 T1 且更早；审理周期 4–8 周，**语言成绩可后补**；"
    "本科直入高考要求:商科/文科/理科 总分 70–75%、工程/计算机 75–80%、法律/医学 80–85%；A-Level 最佳三门 8–13、IB 28–35(工程类≥33)；"
    "③🎯**UNSW College × 同济大学 国内预科(1+3，同济校区 1 年 → UNSW 至少 3 年本科)**："
    "学术 高二/高三均分 **≥75%**(或国际高中 75%+)；语言 **IELTS 总分 5.5、写作 5.5、其余单项不低于 5.0**"
    "(PTE 46/写50；TOEFL 65/写18；DET 100/写100)——"
    "**⚠️对你是最贴近的一条线:写作 5.5 已达标，只差总分 5.0→5.5 与听力/阅读 4.5→5.0**；"
    "成绩合格可直升 UNSW 或申请其他澳洲高校；报名流程:在线报名→校园开放日→入学考试→录取"
))

# R11 UNSW deadline：门槛顺序提示 + 语言成绩节点
SHARED.append((
    "⚠️入学门槛由低到高为 Standard Plus → Standard → Transition,时长顺序相反;语言成绩是选类的关键变量",
    "⚠️入学门槛由低到高为 Standard Plus → Standard → Transition,时长顺序相反;语言成绩是选类的关键变量"
    ";🆕2026-10-06(UNSW College 2026 官方学费口径交叉,供趋势参照):"
    "2026 Transition A$29,200 / Standard A$42,700 / Standard Plus A$47,800 → 2027 对应 A$29,980 / A$43,650 / A$48,750，"
    "年度涨幅约 2.0–2.8%，现表 2027 口径无误；UNSW College 学术英语(10周) 2027 = **A$6,950**；"
    "UNSW Diploma 2027:Business A$55,620(IELTS 6.5 写6.0) / CS·Engineering·Science A$49,440(IELTS 6.0 写6.0 其余≥5.5)"
))

# ---------- 执行 ----------

def apply(path, patches, label):
    if not os.path.exists(path):
        print(f"[MISS] 文件不存在: {path}")
        return 0, 0
    with io.open(path, 'r', encoding='utf-8') as f:
        txt = f.read()
    hit = miss = 0
    for old, new in patches:
        n = txt.count(old)
        if n == 0:
            print(f"  [MISS] {label}: {old[:70]}...")
            miss += 1
            continue
        txt = txt.replace(old, new)
        print(f"  [HIT x{n}] {label}: {old[:50]}...")
        hit += 1
    with io.open(path, 'w', encoding='utf-8') as f:
        f.write(txt)
    return hit, miss


def _school_range(lines, school_anchor):
    """返回该学校对象所在的行区间 [start, end)。end 取下一个 {name:' 或 ] 所在行。"""
    start = None
    for i, ln in enumerate(lines):
        if school_anchor in ln:
            start = i
            break
    if start is None:
        return None
    end = len(lines)
    for j in range(start + 1, len(lines)):
        if "{name:'" in lines[j] or lines[j].strip().startswith(']'):
            end = j
            break
    return (start, end)


def apply_scoped(path, scoped, label):
    """按学校对象行区间替换：仅在指定学校的数据块内替换 old。"""
    if not os.path.exists(path):
        print(f"[MISS] 文件不存在: {path}")
        return 0, 0
    with io.open(path, 'r', encoding='utf-8') as f:
        lines = f.read().split('\n')
    hit = miss = 0
    for old, new, scope in scoped:
        rng = _school_range(lines, scope)
        if rng is None:
            print(f"  [MISS] {label}(scoped): 未找到学校块 {scope}")
            miss += 1
            continue
        s, e = rng
        found = 0
        for idx in range(s, e):
            if old in lines[idx]:
                found += lines[idx].count(old)
                lines[idx] = lines[idx].replace(old, new)
        if found == 0:
            print(f"  [MISS] {label}(scoped): {old[:60]}... @ {scope}")
            miss += 1
        else:
            print(f"  [HIT x{found}] {label}(scoped@{scope}, 行{s}-{e}): {old[:40]}...")
            hit += 1
    with io.open(path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    return hit, miss


def main():
    print("=== data.js ===")
    h1a, m1a = apply(DATA_JS, JS_ONLY, "data.js")
    h1s, m1s = apply_scoped(DATA_JS, SCOPED, "data.js")
    h1b, m1b = apply(DATA_JS, SHARED, "data.js")
    print("=== master HTML ===")
    h2a, m2a = apply(MASTER_HTML, HTML_ONLY, "master.html")
    h2s, m2s = apply_scoped(MASTER_HTML, SCOPED, "master.html")
    h2b, m2b = apply(MASTER_HTML, SHARED, "master.html")
    print()
    hit = h1a + h1s + h1b + h2a + h2s + h2b
    miss = m1a + m1s + m1b + m2a + m2s + m2b
    print(f"合计 HIT={hit} MISS={miss}")
    return 0 if miss == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
