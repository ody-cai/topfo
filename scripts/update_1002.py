#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""2026-10-02 日更补丁：data.js + master HTML + admission.html
覆盖 9/25–10/2 窗口。院校门槛零变动；实质新增 = 澳洲学签 10/2 诚信改革 +
OUAC 2026-27 官方日程全量 + McGill Fall 2027 已开放 + PAL 2027 配额陷阱 + Pearson 三源复核。
"""
import io, os, sys

MASTER = "/Users/odycai/WorkBuddy/2026-06-16-17-01-52/加拿大大学录取要求对照表_2026.html"
DATAJS = "/Users/odycai/WorkBuddy/升学/public/js/data.js"
ADMISSION = "/Users/odycai/WorkBuddy/升学/public/pages/admission.html"

# ---------- 共享院校行补丁（data.js 与 master HTML 同串，同一 old/new 可命中两者）----------
SHARED = []

# 1) 多大·圣乔治 deadline —— 追加 OUAC 2026-2027 官方日程 + Pearson 三源复核
SHARED.append((
    "🎓Lester B. Pearson国际奖学金2027:校提名10/9(noon EST)、OUAC入学申请10/16、奖学金材料11/6'",
    "🎓Lester B. Pearson国际奖学金2027(2026-10-02 第三来源复核一致):校提名10/9 12:00 EST、OUAC入学申请10/16、奖学金材料11/6(约37人/年,四年全额学费+住宿+书本+杂费,单份>CAD 20万;每所中学每年仅提名1人);"
    "🆕OUAC 2026-2027 官方日程(go2.ouac.on.ca/resources/schedule-of-dates,2026-04-27 更新,全量实抓):申请2026-09-17开放;2026-11-05 高中电子数据文件截止;2026-11-19 期中/期末4U/M成绩截止;2026-11-26 大学收到成绩目标日;"
    "**Group A 申请截止2027-01-15**;2027-01-21 大学收到数据目标日;2027-02-11 期末4U/M成绩截止;2027-04-22 高中报告期中成绩;2027-05-03 大学收到目标日;"
    "**最晚回复日2027-05-28**、**最早可要求答复日2027-06-01**;🆕**AIS(补录信息服务)2027-06-03开放**;2027-07-08 期末成绩截止;2027-07-15 剩余成绩送达目标日;"
    "🆕**OUAC 申请费:C$159(前3个志愿) + C$51/每增1个志愿**(无单独国际生服务费);Group B 无统一截止,由各校自定'"
))

# 2) 麦吉尔 deadline —— Fall 2027 已开放 + Desautels BCom 更高门槛 + 成绩须考试机构直送
SHARED.append((
    "deadline:'2027季(第三方交叉核实,官网页待终核):申请开放2026-10-01;海外/美国学制申请者主截止2027-01-15;材料截止2027-03-01;申请费C$140.16;国际本科学费C$35,561–65,168/年(按专业定,录取后学制内不涨)'",
    "deadline:'2027季(**2026-10-02 多来源确认,Fall 2027 申请已于 2026-10-01 正式开放**):"
    "**申请开放2026-10-01(Fall 2027 网申已上线)**;海外/美国学制申请者主截止**2027-01-15**;材料截止**2027-03-01**;申请费C$140.16(不退);国际本科学费C$35,561–65,168/年(按专业定,录取后学制内不涨);"
    "🆕**滚动录取(rolling)**:麦吉尔持续放榜,上轮国际生决定集中在 11 月中—5 月中——**10 月递交的档案有可能在圣诞节前出结果,1/14 递交的往往拖到春季**;入学奖学金截止通常在申请截止后约 1 周 → 越早递越有时间做奖学金;"
    "🆕**语言成绩须由考试机构直送**(McGill 不接受申请人自行上传的成绩单);"
    "⚠️**Desautels 商学院门槛更高**:Bachelor of Commerce 要求 **TOEFL iBT 100 / Duolingo 130**(其余专业为 90 / 125);IELTS 通用最低 6.5(各项 ≥6.0);"
    "部分情况可豁免(连续 4 年英语授课、IB English A ≥5、A-Level English ≥C);⚠️**你 5.0 距 6.5 差 1.5,且麦吉尔几乎无语言双录 → 现行条件下不可申**'"
))

# 3) 昆士兰 deadline —— 追加澳洲学生签证 10/2 诚信改革
SHARED.append((
    "布里斯班年均生活成本约A$2.1–3万(比悉尼/墨尔本低15–20%)'",
    "布里斯班年均生活成本约A$2.1–3万(比悉尼/墨尔本低15–20%);"
    "🆕**2026-10-02 澳洲学生签证诚信改革生效**(澳教育部+内政部官方;Migration Amendment (Student Visa Reform) Regulations 2026 等 4 份法规 2026-10-01 登记、**2026-10-02 起施行**):"
    "①**限制境内(onshore)学签申请**——17 类临时签证持有人(含 485 毕业生、482 技能、417/462 打工度假、600 访客等)不得在澳境内申请学生签证;②现有学签持有人续签原则上也须**在境外申请、且获批时人须在境外**"
    "(6 类豁免:课程进阶至更高 AQF 级别 / 完成学业需 ≤12 个月 / 博士 / 中小学课程 / 机构倒闭 / DFAT·国防资助);③**多数学生不能再携带配偶子女**(仅博士、太平洋与东盟护照、政府资助、已在澳家属豁免);"
    "④转学限制由 6 个月延长至 **12 个月**(过渡至 2027-06-30);⑤**2027-07-01 起新增「学生签证转学 stream」**——转学须先拿到新签证才能在新校开课,且只能同级或升级,**禁止高等教育(HE)转 VET**;"
    "⑥2026-10-02 前已递交的申请按旧规审理。**对你的实际影响**:你属中国境外直接申请预科/本科,**不受 onshore 限制**;但澳洲整体审核趋严,且预科(ELICOS/Foundation)→本科属「课程进阶」豁免范围可境内续签,路径本身仍通;请勿中途转去 VET'"
))

# 4) 阿德莱德 deadline —— 同样追加澳洲签证改革摘要
SHARED.append((
    "学生公寓 A$290–650/周'",
    "学生公寓 A$290–650/周;"
    "🆕**2026-10-02 澳洲学生签证诚信改革生效**(详见昆士兰条目):限制境内学签申请(17 类临时签证)、现有学签续签须境外申请、多数学生不得携家属、转学限制 6→12 个月(至 2027-06-30)、2027-07-01 起新增转学 stream 且禁止 HE→VET。"
    "**你是境外直接申请,不受 onshore 限制**;预科→本科属课程进阶豁免范围'"
))

# ---------- 文件头部标记 ----------
def patch_markers(path, pairs):
    s = io.open(path, encoding="utf-8").read()
    miss = []
    for old, new in pairs:
        if old not in s:
            miss.append(old[:70])
        else:
            s = s.replace(old, new, 1)
    io.open(path, "w", encoding="utf-8").write(s)
    return miss

NEW_NOTE = """// ▲本次更新(2026-10-02,覆盖 9/25–10/2 窗口): 今日**无院校录取 GPA/雅思门槛变动**;实质新增 = 澳洲学签诚信改革生效 + OUAC 官方日程全量 + McGill 已开放 + PAL 配额陷阱
//   ①🇦🇺**澳洲学生签证诚信改革 2026-10-02 生效**(澳教育部部长新闻稿 + Migration Amendment (Student Visa Reform) Regulations 2026,4 份法规 10-01 登记):
//      境内学签申请受限(17 类临时签证持有人不得在澳境内申请,含 485/482/417/462/600);现有学签续签原则上须境外申请且获批时人在境外(6 类豁免);
//      多数学生不得携配偶子女(5 类豁免);转学限制 6→12 个月(过渡至 2027-06-30);2027-07-01 起新设「学生签证转学 stream」,须先获新签方能开课、仅同级或升级、禁止 HE→VET。
//      → 对「境外直接申请」的蔡奇均**不受 onshore 限制**;预科(ELICOS/Foundation)→本科属课程进阶豁免,境内可续签;但整体审核趋严。
//   ②📅**OUAC 2026-2027 官方日程全量实抓**(go2.ouac.on.ca,2026-04-27 更新):09-17 开放;11-05 高中数据文件截止;11-19 期中/期末 4U/M 成绩截止;11-26 大学收成绩目标日;
//      **01-15 Group A 申请截止**;01-21 大学收数据目标日;02-11 期末 4U/M 成绩截止;04-22 高中报期中;05-03 大学收目标日;**05-28 最晚回复日**;**06-01 最早可要求答复日**;
//      🆕**06-03 AIS 补录信息服务开放**;07-08 期末成绩截止;07-15 剩余成绩送达。🆕**OUAC 申请费 C$159(前 3 志愿) + C$51/每增 1 志愿**(无单独国际生服务费)。
//   ③🎓**McGill Fall 2027 已于 2026-10-01 正式开放**:海外/美国学制主截止 2027-01-15、材料 2027-03-01、申请费 C$140.16;
//      **滚动录取**——10月递交可能圣诞节前出结果,1/14 递交常拖到春季;入学奖通常在申请截止后约 1 周;
//      ⚠️语言成绩须**考试机构直送**(不接受上传);⚠️**Desautels BCom 门槛更高**:TOEFL 100 / Duolingo 130(其余 90/125)。
//      → 你 5.0 距 6.5 差 1.5 且麦吉尔几乎无语言双录,现行不可申。
//   ④⚠️**PAL 2027 配额陷阱(重要行动项)**:2026 配额年签发的 PAL **有效期至 2026-12-31**;2027 年 9 月入学属 **2027 配额年**,
//      须待 IRCC 于 2026 年秋公布 2027 配额与省分配后,再申请 **2027 版 PAL**。多数本科/文凭/研文仍需 PAL,公立硕博自 2026-01-01 起免 PAL。
//      PAL 由学校在办学省办理(不是直接向省申请),处理约 2–6 周;接受 offer 后**书面向学校确认如何申请**——最常见的错误是以为 PAL 随 offer 自动发放。
//   ⑤📊IRCC Immigration Levels Plan 2027-2029「即将公布」:当前 2027 新入境国际学生目标 **150,000**(2026 为 155,000)、临时居民总目标 370,000(2027);
//      2026 学签签发上限 408,000(PAL 类 180,000/申请席位 309,670)。公布后须回填省配额。
//   ⑥🎓多大 **Pearson 国际奖学金**第三独立来源复核一致:校提名 10/9 12:00 EST、OUAC 入学申请 10/16、奖学金材料 11/6;约 37 人/年。
//   ⑦📈**uniscope.ca 实测录取数据(学生匿名上报,更新至 2026-09-05)首次纳入**:多大电气工程 23% / TrackOne 25%;Western Medical Sciences 42% / Ivey AEO 8%;
//      皇后 Health Sciences 7% / Smith 计算机工程 22%;UBC 工程物理 15% / Business+CS 组合 15%;麦马 Life Sciences Gateway 10% / iBioMed 14%;
//      麦吉尔建筑 10% / 生物工程 15%;卡尔加里整体 15%(工程 common first year 20%)、UVic 64%、Windsor 65%、Carleton BA Honours 竞争均分约 75%、录取中位 90%。
//      ⚠️此为「竞争度参照」,非门槛变更,不写入结论字段,仅作选校难度比对。
//   ⑧复核无变化(官方):多大 2027 三张表、UBC 2027 全量节点、麦吉尔 1/15、UBC/U of T 主截止 1/15、IRCC 生活费 **CAD 23,448**(2026-09-01 起)、SDS 已于 2024-11-08 关闭、
//      **9 个专业方向 GPA/雅思门槛零变动**、各校语言门槛与双录通道全数无放宽无收窄。
//   ⑨⚠️持续不采纳(连续 9 日):新东方系「多大文理网申 2/2、材料 2/16」(官网为 1/15+2/1);立思辰「SFU 商科/CS 实操全员雅思 7.0」
"""

marker_pairs_datajs = [
    ("// delpoy_rev_91924b\n// 最后更新: 2026-09-24\n",
     "// delpoy_rev_10102\n// 最后更新: 2026-10-02\n" + NEW_NOTE),
]

marker_pairs_master = [
    ("const DATA_UPDATED = '2026-09-24';", "const DATA_UPDATED = '2026-10-02';"),
]

marker_pairs_admission = [
    ("最后更新：2026-09-24", "最后更新：2026-10-02"),
    ("delpoy_rev_91924b", "delpoy_rev_10102"),
]

# ---------- 执行 ----------
def apply_shared(path, pairs):
    s = io.open(path, encoding="utf-8").read()
    hits, miss = [], []
    for old, new in pairs:
        n = s.count(old)
        if n == 0:
            miss.append(old[:60])
        else:
            s = s.replace(old, new)
            hits.append((old[:40], n))
    io.open(path, "w", encoding="utf-8").write(s)
    return hits, miss

print("=== shared patches: data.js ===")
h, m = apply_shared(DATAJS, SHARED)
for x in h: print("  HIT x%d  %s..." % (x[1], x[0]))
for x in m: print("  MISS     %s..." % x)

print("=== shared patches: master HTML ===")
h, m = apply_shared(MASTER, SHARED)
for x in h: print("  HIT x%d  %s..." % (x[1], x[0]))
for x in m: print("  MISS     %s..." % x)

print("=== markers ===")
for path, pairs, label in [
    (DATAJS, marker_pairs_datajs, "data.js"),
    (MASTER, marker_pairs_master, "master HTML"),
    (ADMISSION, marker_pairs_admission, "admission.html"),
]:
    miss = patch_markers(path, pairs)
    print("  %-16s %s" % (label, "OK" if not miss else "MISS: " + str(miss)))
