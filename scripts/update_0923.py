#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
update_0923.py — 2026-09-23 日更批量补丁

权威源:
  public/js/data.js                        (网站数据源)
  加拿大大学录取要求对照表_2026.html        (应用版单文件, 由 sync_app_data.js 同步)
  加拿大大学录取要求完整对照表_2026.md      (Markdown)
  public/pages/admission.html              (公网页)
另同步工作区镜像:
  /Users/odycai/WorkBuddy/2026-06-16-17-01-52/public/js/data.js
  /Users/odycai/WorkBuddy/2026-06-16-17-01-52/public/pages/admission.html
"""
import io, os, sys, re

ROOT = '/Users/odycai/WorkBuddy/升学'
WS = '/Users/odycai/WorkBuddy/2026-06-16-17-01-52'

DATA_JS = os.path.join(ROOT, 'public/js/data.js')
MASTER_HTML = os.path.join(ROOT, '加拿大大学录取要求对照表_2026.html')
MD = os.path.join(ROOT, '加拿大大学录取要求完整对照表_2026.md')
ADM = os.path.join(ROOT, 'public/pages/admission.html')
TIMELINE = os.path.join(ROOT, 'public/pages/timeline.html')

miss = []
hits = []


def patch(path, old, new, label, required=True):
    if not os.path.exists(path):
        miss.append(f'[文件不存在] {label} :: {path}')
        return
    with io.open(path, encoding='utf-8') as f:
        s = f.read()
    if old not in s:
        if required:
            miss.append(f'[MISS] {label}')
        return
    n = s.count(old)
    s = s.replace(old, new)
    with io.open(path, 'w', encoding='utf-8') as f:
        f.write(s)
    hits.append(f'[HIT x{n}] {label}')


# ══════════════════════════════════════════════════════════════
# R1 — UBC（温哥华）deadline 字段：官方 Dates&Deadlines 全量节点补全
# ══════════════════════════════════════════════════════════════
R1_OLD = "⚠️不构成降门槛:Vantage 仍为 5.5(听说5.0/读写5.5)'"
R1_NEW = ("⚠️不构成降门槛:Vantage 仍为 5.5(听说5.0/读写5.5);"
          "🆕2026-09-23(官网 you.ubc.ca/dates-deadlines 实抓全量复核)补全节点:"
          "国际学者计划(ISP)申请者须在2027-01-31前满足 ELAS 或 Vantage 语言要求并交齐材料;"
          "2027-02-15 加拿大大学在读申请者中期成绩单(含12月结课成绩+1-4月在读课程);"
          "🆕加拿大高中(BC/安省以外)春季成绩单上载窗口2027-03-01~03-15;"
          "境外高中申请者材料截止2027-03-15(与9/20已记节点一致);"
          "🆕境外大学申请者材料截止2027-05-31(美国大学申请者2027-03-15);"
          "🆕加拿大高中申请者须于2027-06-30前完成全部课程(含网课/远程学习);"
          "🆕助学金申请截止2027-09-15;"
          "🆕接受offer截止:2027-05-01 或 2027-06-01(以录取信注明为准)'")

# ══════════════════════════════════════════════════════════════
# R2 — 滑铁卢 deadline 字段：官网 Deadlines + OUAC 全量 + 国际生奖学金
# ══════════════════════════════════════════════════════════════
R2_OLD = "另IELTS总分7.0且各项≥6.0亦可满足直录'"
R2_NEW = ("另IELTS总分7.0且各项≥6.0亦可满足直录;"
          "🆕2026-09-23(官网 deadlines 页 + OUAC 指南实抓全量):"
          "2027冬季学期申请截止2026-10-30(材料2026-11-27;post-degree 2026-11-13/材料12-04)、"
          "2027春季学期申请截止2027-02-26(材料2027-03-26;post-degree 2027-03-12/材料04-02);"
          "药学院(Pharmacy)申请2027-01-06/材料2027-01-20 14:00ET;视光学(Optometry)2026-11-12(详见院系页);"
          "🎓重大利好:2027年9月入学的全日制一年级国际自费生自动获 CAD 10,000 首年学费奖学金,无需另行申请;"
          "数学系竞赛报名节点:CSMC 2026-10-22、CCC 2027-02-11、Euclid 2027-03-11、"
          "Olympiad/Global/National 奖学金 2027-03-05(注:竞赛非录取必需,但影响数学院奖学金决定)'")

# ══════════════════════════════════════════════════════════════
# R3 — 麦克马斯特 deadline 字段：录取轮次 + 补充材料兜底截止
# ══════════════════════════════════════════════════════════════
R3_OLD = "入学奖(AwardSpring)截止2027-02-19 23:59 ET,卓越奖最高CAD 20万'"
R3_NEW = ("入学奖(AwardSpring)截止2027-02-19 23:59 ET,卓越奖最高CAD 20万;"
          "🆕2026-09-23(官网+OUAC实抓):所有本科申请截止1/15,补充/支持材料最晚2027-04-01前补齐;"
          "Group A 录取两轮——第一轮2027年2月底~3月初(需≥3门4U/M最终成绩,或6门中期成绩+剩余必修在读;"
          "首轮按学科开放,部分专业首轮不发offer)、第二轮2027年4月底~5月初(基于第二学期中期成绩);"
          "⚠️by-selection 专业(Arts&Science、Honours Health Sciences、Honours Integrated Science、Nursing、Midwifery)"
          "不在第一轮发offer,统一于第二轮结合补充申请评审;Midwifery 于2027-02-01审查OUAC最终成绩;"
          "全部offer基于2027-05-15前经OUAC收到的官方成绩'")

# ══════════════════════════════════════════════════════════════
# R4 — 约克 deadline：Fall 2027 国际生 3/24 升级为多来源一致
# ══════════════════════════════════════════════════════════════
R4_OLD = ("deadline:'滚动;2027国际生入学奖11/1-1/27;Winter 2027申请截止11/18(9/16第二来源独立复核一致);"
          "⚠️仍待官网核实:Fall 2027国际生约3/24'")
R4_NEW = ("deadline:'滚动;2027国际生入学奖11/1-1/27;Winter 2027申请截止11/18;"
          "✅2026-09-23升级为多来源一致:Fall 2027国际生截止3/24(第三独立来源复核;"
          "各专业实际截止以 yorku.ca 逐专业页为准,建议提前一个月递交)'")

# ══════════════════════════════════════════════════════════════
# R5 — UNSW note_detail：国际大一取消5月批次升级为三来源一致 + 宏信预科口径
# ══════════════════════════════════════════════════════════════
R5_OLD = ("🆕2026-09-16多来源一致:UNSW国际大一(Diploma)2027年入学取消5月批次、仅保留1月与8月;"
          "商科方向高考总分67%或高三均分94%、IELTS6.5(写作6.0);理科方向高三均分85%+数学90%、IELTS6.0(写作6.0)")
R5_NEW = ("✅2026-09-23三来源一致(新东方/搜狐独立确认):UNSW国际大一(Diploma)2027年入学取消5月批次、"
          "仅保留1月与8月两批次;商科方向高考总分67%或高三均分94%、IELTS6.5(写作6.0);"
          "理科方向高三均分85%+数学90%、IELTS6.0(写作6.0);"
          "🆕国内预科口径(宏信教育 UNSW College 预科2027春招,预计2027-03下旬开学):"
          "高二/高三均分≥75% 或 高考≥50% 或 A-Level 2门≥3分;"
          "理科方向 IELTS 5.5(写作5.5/单项≥5.0)、商科方向 IELTS 6.0(写作5.5/单项≥5.0)")

# ══════════════════════════════════════════════════════════════
# R6 — 昆士兰：2027 学费 + S1 时间线 + 预科门槛
# ══════════════════════════════════════════════════════════════
R6_OLD = "{name:'昆士兰',city:'布里斯班',prov:'澳洲',deadline:'滚动',tuition:'36,000',tuitionRMB:'约18万',isFoundation:true,programs:{"
R6_NEW = ("{name:'昆士兰',city:'布里斯班',prov:'澳洲',"
          "deadline:'滚动;🆕2026-09-23(QTAC+UQ College口径复核):2027 S1 通过 QTAC 提交,"
          "申请通道2026-08-04开放、主要录取轮次截止2026-12-07、2026-10~2027-02发offer、2027-02-22开学;"
          "未达直录可走 UQ College 预科——标准预科10个月(高二/高三均分≥70%,IELTS 5.5(单项≥5.0))、"
          "快捷预科4个月(高三均分≥80%,IELTS 6.0(写作6.0));预科设高成就者奖学金可减免约20%学费',"
          "tuition:'36,280(2027预科)',tuitionRMB:'约18万',isFoundation:true,programs:{")

# ══════════════════════════════════════════════════════════════
# R7 — 阿德莱德/Eynesbury note_detail：二次实抓复核 + 高语言要求学位
# ══════════════════════════════════════════════════════════════
R7_OLD = "🆕2026-09-16 Eynesbury官网复核:2027学费A$36,200、IELTS 5.5(单项≥5.0)、须完成澳洲Year 11或等效"
R7_NEW = ("✅2026-09-23 Eynesbury官网二次实抓复核一致:International Fees 2027 = A$36,200"
          "(2026 Guide 为 A$35,120)、IELTS 5.5(无单项低于5.0)、须完成澳洲 Year 11 或等效、"
          "8或12个月、Feb/June/Oct 三批入学、CRICOS 074931M;"
          "⚠️部分学位预科入学语言要求更高(如 Law(Juris Doctor 路径) 标注 IELTS 6.5(6.5)、"
          "个别学位需 IELTS 7.0(7.0) 方可由预科进入 Adelaide University),选校时须逐学位核对")

# ══════════════════════════════════════════════════════════════
# 执行：data.js + 应用版 HTML（同一行文本，同一 old/new 同时命中两者）
# ══════════════════════════════════════════════════════════════
for label, old, new in [
    ('R1 UBC deadline', R1_OLD, R1_NEW),
    ('R2 滑铁卢 deadline', R2_OLD, R2_NEW),
    ('R3 麦克马斯特 deadline', R3_OLD, R3_NEW),
    ('R4 约克 deadline', R4_OLD, R4_NEW),
    ('R5 UNSW note_detail', R5_OLD, R5_NEW),
    ('R6 昆士兰 deadline/tuition', R6_OLD, R6_NEW),
    ('R7 阿德莱德 note_detail', R7_OLD, R7_NEW),
]:
    patch(DATA_JS, old, new, label + ' @data.js')
    patch(MASTER_HTML, old, new, label + ' @master.html', required=False)

# ══════════════════════════════════════════════════════════════
# 日期 / 版本号
# ══════════════════════════════════════════════════════════════
patch(MASTER_HTML, "const DATA_UPDATED = '2026-09-20';",
      "const DATA_UPDATED = '2026-09-23';", 'DATA_UPDATED @master.html')
patch(MASTER_HTML, "<!-- delpoy_rev_91920 -->",
      "<!-- delpoy_rev_91923 -->", 'rev @master.html')
patch(DATA_JS, "// delpoy_rev_91920",
      "// delpoy_rev_91923", 'rev @data.js')
patch(ADM, "最后更新：2026-09-20", "最后更新：2026-09-23", '静态日期 @admission.html')
patch(ADM, "const _d = '2026-09-18';", "const _d = '2026-09-23';", '_d 常量 @admission.html')
patch(ADM, "<!-- delpoy_rev_91920 -->", "<!-- delpoy_rev_91923 -->", 'rev @admission.html')
patch(TIMELINE, "最后更新：2026-09-20", "最后更新：2026-09-23", '静态日期 @timeline.html', required=False)
patch(TIMELINE, "const _d = '2026-09-18';", "const _d = '2026-09-23';", '_d 常量 @timeline.html', required=False)

# ══════════════════════════════════════════════════════════════
# 工作区镜像
# ══════════════════════════════════════════════════════════════
for label, old, new in [
    ('R1 UBC deadline', R1_OLD, R1_NEW),
    ('R2 滑铁卢 deadline', R2_OLD, R2_NEW),
    ('R3 麦克马斯特 deadline', R3_OLD, R3_NEW),
    ('R4 约克 deadline', R4_OLD, R4_NEW),
    ('R5 UNSW note_detail', R5_OLD, R5_NEW),
    ('R6 昆士兰 deadline/tuition', R6_OLD, R6_NEW),
    ('R7 阿德莱德 note_detail', R7_OLD, R7_NEW),
    ('DATA_UPDATED', "const DATA_UPDATED = '2026-09-20';", "const DATA_UPDATED = '2026-09-23';"),
    ('rev@html', "<!-- delpoy_rev_91920 -->", "<!-- delpoy_rev_91923 -->"),
]:
    patch(os.path.join(WS, '加拿大大学录取要求对照表_2026.html'), old, new,
          label + ' @WS/master.html', required=False)
patch(os.path.join(WS, 'public/js/data.js'), R1_OLD, R1_NEW, 'R1 @WS/data.js', required=False)
patch(os.path.join(WS, 'public/js/data.js'), R2_OLD, R2_NEW, 'R2 @WS/data.js', required=False)
patch(os.path.join(WS, 'public/js/data.js'), R3_OLD, R3_NEW, 'R3 @WS/data.js', required=False)
patch(os.path.join(WS, 'public/js/data.js'), R4_OLD, R4_NEW, 'R4 @WS/data.js', required=False)
patch(os.path.join(WS, 'public/js/data.js'), R5_OLD, R5_NEW, 'R5 @WS/data.js', required=False)
patch(os.path.join(WS, 'public/js/data.js'), R6_OLD, R6_NEW, 'R6 @WS/data.js', required=False)
patch(os.path.join(WS, 'public/js/data.js'), R7_OLD, R7_NEW, 'R7 @WS/data.js', required=False)
patch(os.path.join(WS, 'public/js/data.js'), "// delpoy_rev_91920", "// delpoy_rev_91923",
      'rev @WS/data.js', required=False)
patch(os.path.join(WS, 'public/pages/admission.html'), "最后更新：2026-09-20",
      "最后更新：2026-09-23", 'date @WS/admission.html', required=False)
patch(os.path.join(WS, 'public/pages/admission.html'), "const _d = '2026-09-18';",
      "const _d = '2026-09-23';", '_d @WS/admission.html', required=False)
patch(os.path.join(WS, 'public/pages/admission.html'), "<!-- delpoy_rev_91920 -->",
      "<!-- delpoy_rev_91923 -->", 'rev @WS/admission.html', required=False)

print('=== HIT ===')
for h in hits:
    print(' ', h)
print('=== MISS ===')
for m in miss:
    print(' ', m)
print(f'\n合计 HIT {len(hits)} / MISS {len(miss)}')
sys.exit(0)
