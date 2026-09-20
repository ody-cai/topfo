#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
2026-09-18 每日数据更新（并补 2026-09-17 未执行的窗口）
权威源：/Users/odycai/WorkBuddy/升学/
目标文件：
  1) 加拿大大学录取要求对照表_2026.html        (master HTML)
  2) 加拿大大学录取要求完整对照表_2026.md      (MD)
  3) public/js/data.js                        (部署版数据)
  4) public/pages/admission.html              (部署版页面)
"""
import io, os, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

F_HTML = os.path.join(BASE, "加拿大大学录取要求对照表_2026.html")
F_MD   = os.path.join(BASE, "加拿大大学录取要求完整对照表_2026.md")
F_JS   = os.path.join(BASE, "public/js/data.js")
F_ADM  = os.path.join(BASE, "public/pages/admission.html")

REV_OLD = "91916"
REV_NEW = "91918"
DATE_OLD = "2026-09-16"
DATE_NEW = "2026-09-18"

# ---------------------------------------------------------------- 院校数据补丁
# (old, new, 期望命中文件标签)  —— data.js 与 master HTML 共用同一行院校文本
SCHOOL_PATCHES = [
    # R1 UBC：新增境外高中申请者材料截止 3/15（官方 you.ubc.ca）
    (
        "deadline:'2027季:10月初开放申请(2027冬季学期+2027夏季学期5-8月同期开放);申请1/15;ELAS语言材料2/15;国际生奖学金轮11/15'",
        "deadline:'2027季(官网you.ubc.ca 9/18核实):10月初开放申请(2027冬季学期+2027夏季学期5-8月同期开放);申请截止1/15(PT23:59);ELAS语言材料2/15;国际生奖学金轮11/15(2026-11-15);🆕境外高中申请者材料截止2027-03-15(官网Dates&Deadlines新增节点)'",
        "js+html",
    ),
    # R2 滑铁卢：语言成绩有效期 + 7.0 备选口径（官方 English language requirements 页）
    (
        "deadline:'2027季:工程申请1/15(材料2/1);其余专业申请2/1(材料2/15)'",
        "deadline:'2027季:工程申请1/15(材料2/1);其余专业申请2/1(材料2/15);🆕语言成绩有效期(官网9/18核实):仅接受2025-05-01及之后考出的成绩,更早的作废;另IELTS总分7.0且各项≥6.0亦可满足直录'",
        "js+html",
    ),
    # R3 麦马：补充申请截止逐项细化（官方 future.mcmaster.ca Supplementary Applications + OUAC）
    (
        "deadline:'2027季:推荐截止1/15;工程/CS/iBioMed/B.Tech须工程补充申请(3视频+1书面);入学奖(AwardSpring)截止2027-02-19 23:59 ET,卓越奖最高CAD 20万'",
        "deadline:'2027季(官方9/18核实):推荐截止1/15;🆕补充申请截止逐项:CS/工程/B.Tech/iBioMed=2027-01-28 23:59ET(Kira Talent,同院多专业只填一次)、Arts&Science/IBH/WCLCS=2/1、Integrated Science=2/2、Health Sciences≈2月中、Nursing以CASPer考期为准;入学奖(AwardSpring)截止2027-02-19 23:59 ET,卓越奖最高CAD 20万'",
        "js+html",
    ),
    # R4 康考迪亚：英语成绩 2 年有效期 + 入学奖重开（Stellar 汇总 / 官网口径）
    (
        "deadline:'常设:秋季3/1(国际生建议2/1);冬季11/1(国际生建议8/1);自建系统(不走OUAC),最多填3个志愿(至多1个BComm);⚠️Grey Nuns宿舍2027-28不开放(9/16第二来源确认),2027住宿申请尚未公布'",
        "deadline:'常设:秋季3/1(美/国际生建议2/1);冬季11/1(美/国际生建议8/1);自建系统(不走OUAC),最多填3个志愿(至多1个BComm);🆕英语成绩须<2年有效且收到校方通知后3周内提交(9/18核实);申请类入学奖2026-10重新开放;⚠️Grey Nuns宿舍2027-28不开放,2027住宿申请尚未公布'",
        "js+html",
    ),
    # R5 多大 UTSG：口径冲突复核更新（future.utoronto.ca/deadlines 今日明确材料/补充口径）
    (
        "⚠️口径冲突(9/15新增):多大国际项目官网IFP页称Arts&Sci的CS/人文/生命科学/社科/数理申请已延至2/1、材料延至2/16,但future.utoronto.ca官方汇总页仍为申请1/15/材料2/1→按1/15执行",
        "⚠️口径冲突(9/18复核):多大国际项目官网IFP页称Arts&Sci的CS/人文/生命科学/社科/数理申请已延至2/1;而future.utoronto.ca/deadlines 2027官方表明确:材料截止A&S全类别(含Rotman/CS)=2/1、工程/音乐=1/15;补充申请工程OSP/音乐=1/15,Rotman/CS/A&S其余/建筑/运动机能/UTSC=2/1。该页不支持「材料2/16」→仍按申请1/15·材料2/1执行",
        "js+html",
    ),
    # R6 SFU：中介「隐性7.0」口径持续标记为待核实
    (
        "{name:'SFU',city:'温哥华',prov:'BC省',deadline:'2月28日'",
        "{name:'SFU',city:'温哥华',prov:'BC省',deadline:'2月28日;⚠️待官网核实(中介口径,连续多日重复出现):商科/CS「隐性语言门槛雅思7.0(单项6.5)」,与SFU官网明示6.5(单项6.0)不符,不采纳'",
        "js+html",
    ),
]

# ------------------------------------------------------------------ 日期/版本
DATE_PATCHES = [
    # master HTML 数据日期常量
    ("const DATA_UPDATED = '2026-09-16';",
     "const DATA_UPDATED = '2026-09-18';", "html"),
    # data.js 版本注释
    ("// delpoy_rev_91916\n// 最后更新: 2026-09-16",
     "// delpoy_rev_91918\n// 最后更新: 2026-09-18", "js"),
    # admission.html 显示日期
    ("最后更新：2026-09-16", "最后更新：2026-09-18", "adm"),
    # admission.html JS 日期常量（此前遗留 09-15，与页面显示不一致 —— 本轮修正为同一日期）
    ("const _d = '2026-09-15';", "const _d = '2026-09-18';", "adm"),
    ("<!-- delpoy_rev_91916 -->", "<!-- delpoy_rev_91918 -->", "adm"),
]


def read(p):
    with io.open(p, "r", encoding="utf-8") as f:
        return f.read()


def write(p, s):
    with io.open(p, "w", encoding="utf-8") as f:
        f.write(s)


report = []
miss = []


def apply(path, patches, label):
    txt = read(path)
    for old, new, scope in patches:
        n = txt.count(old)
        if n == 0:
            miss.append("[%s] MISS: %s" % (label, old[:70]))
            continue
        txt = txt.replace(old, new)
        report.append("[%s] OK x%d: %s" % (label, n, old[:55]))
    write(path, txt)


apply(F_HTML, SCHOOL_PATCHES + DATE_PATCHES, "master-html")
apply(F_JS,   SCHOOL_PATCHES + DATE_PATCHES, "data.js")
apply(F_ADM,  DATE_PATCHES, "admission.html")

print("=== 命中报告 ===")
for line in report:
    print(line)
if miss:
    print("\n=== 未命中（需人工确认）===")
    for line in miss:
        print(line)
else:
    print("\n全部补丁命中，无 MISS。")
