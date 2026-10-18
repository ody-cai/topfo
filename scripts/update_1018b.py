#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""2026-10-18 二次巡检补丁：麦马 / 多大(圣乔治) / UBC·温哥华 / 阿德莱德
QUOTE 守卫：断言插入点前一位为单引号（deadline 字符串闭合引号）
"""
import io, re, sys

PATH = 'public/js/data.js'
s = io.open(PATH, encoding='utf-8').read()

PATCHES = []

PATCHES.append(('麦克马斯特', ',🆕2026-10-18 二次巡检（Stellar Advisers 依麦马官方 deadline 工具逐项核对，核对日 2026-10-13）：📌**Level I 申请截止分三档，此前表内未按专业分组** —— ①**2027-01-15**：**工程／B.Tech／计算机科学／iBioMed／健康科学 BHSc／iSci／Arts & Science／IBH／Wilson（Leadership & Civic Studies）／Midwifery** 十类「精选专业」；②**2027-04-01**：**Business 与多数 gateway**（化学与物理科学／环境与地球科学／经济学／健康与社会／Kinesiology／医学放射科学／Humanities／iArts／生命科学／数学与统计／社会科学）；③**Nursing 按申请人群**：安省高中 **2027-01-15**、其他加拿大与国际高中 **2027-02-01**，高中材料 **2027-04-01**（学院／大学转学材料 2027-02-15）。⚠️**1/15 并非全校统一截止，4/1 亦非「所有专业统一延期」** —— 两者按专业分组，报名前须在官方工具内以「申请人群 + 专业」双条件查询。⏱️**早申建议节奏**：**OUAC 2026-11-12 递交、工程类补充申请 2026-11-26 23:59 ET 前完成**（校方说明可获较早审阅，但**不承诺早 offer**）。⚠️**iSci 补充申请三方口径冲突**：官方工具 **2027-02-01**、中央补充申请清单 **2027-02-02**、院系页仍挂 **2026-02-02 noon** 旧版 ⇒ **按 2027-02-01 前完成最安全**，并以校内确认邮件为准'))

PATCHES.append(('多大·圣乔治', ',🆕2026-10-18 二次巡检（Stellar Advisers 依多大文理学院 2027 Guide 与中央 2027-28 domestic admissions bulletin 双源对照，核对日 2026-10-16）：⚠️**Arts & Science 社会科学类官方双口径并存，且两份均未印保证线** —— ①**文理学院 2027 Guide**：Social Sciences 推荐录取区间 **Mid 80s**（同页注明该值反映上一年度安省课程均分）；②**中央 2027-28 domestic bulletin**：同一类别标 **mid to high 80s**（标注为 Approximate Grade Requirement，同基于上一年度录取均分）。两份均为官方、区间不同、**均不构成 Fall 2027 保证线** ⇒ 规划取**较保守的 mid to high 80s**。📌另两条口径：①**社会科学大类不设单独英语分数下限**（学院给「推荐区间」而非硬性 floor；⚠️**不可把 UTM 的 70% 英语门槛套用到圣乔治**，三校区口径各自独立）；②**Economics 等方向须微积分预备**，属「专业内先修」而非大类统一要求。⚠️**UTSC Paramedicine（急救与辅助医疗，与 Centennial 学院联合学位）首年入学现行仅面向加拿大公民／永久居民** —— 国际生不可申；该专业另需 TSI 与书面 SAF（可能含面试），SAF 截止通常早于校区通用材料日，以 Join U of T 门户显示为准'))

PATCHES.append(('UBC·温哥华', ',🆕2026-10-18 二次巡检（sauder.ubc.ca 官方 2027W 节点页实抓）：🎓**Sauder BCom 转学（二／三年级入学）节点补全** —— **申请 2027-01-15 23:59 PST**；**加拿大大学在读者中期成绩单 2027-02-15**（须含 12 月结课最终成绩、并列出 1–4 月在读课程）；**ELAS 语言材料 2027-02-15**；**通用材料 2027-03-15**；**必修先修课须 2027-04 前完成**；**最终成绩单 2027-05-15**；**放榜 2027-04 至 2027-07**。📌**大一直接入学放榜窗口 2026-11 至 2027-06**（与滚动放榜一致）；**加拿大高中申请者须 2027-06-30 前完成全部课程**（含远程与分布式学习课程）'))

PATCHES.append(('阿德莱德', ',🆕2026-10-18 二次巡检（澳洲行业媒体两源交叉，**待 DHA 官方核实，不写入结论字段**）：**学生签证生活费担保被引为 A$29,710／年**（覆盖住宿、交通、书本等），另须覆盖首年全额学费与往返机票；⚠️该数值属 indexation 口径，**本表未取得 2026-27 年度 DHA 原文确认**，递签前须以 immi.homeaffairs.gov.au 现行页复核。📌**语言成绩联网核验**：澳洲移民局可在线核验语言成绩，**无法在线验证的成绩单不予认可**；部分院校明确不接受线上考试版本 —— 报名前须同时确认「考试类型在移民局可查可验」与「目标院校是否接受线上版本」'))

HITS = []
MISS = []

for school, content in PATCHES:
    key = "{name:'%s'" % school
    i = s.find(key)
    if i < 0:
        MISS.append(school)
        print('MISS anchor: %s' % school)
        continue
    j = s.find(",tuition:'", i)
    if j < 0:
        MISS.append(school)
        print('MISS tuition: %s' % school)
        continue
    # QUOTE 守卫
    if s[j-1] != "'":
        print('QUOTE GUARD FAIL: %s (char=%r)' % (school, s[j-1]))
        sys.exit(2)
    s = s[:j-1] + content + s[j-1:]
    HITS.append(school)

# rev 递增
old_rev = 'delpoy_rev_10181'
new_rev = 'delpoy_rev_10182'
if old_rev in s:
    s = s.replace(old_rev, new_rev, 1)
    print('rev: %s -> %s' % (old_rev, new_rev))
else:
    print('WARN rev anchor not found')

io.open(PATH, 'w', encoding='utf-8').write(s)
print('HITS=%d MISS=%d' % (len(HITS), len(MISS)))
print('HIT: ' + ', '.join(HITS))
if MISS:
    print('MISS: ' + ', '.join(MISS))
