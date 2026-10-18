#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
update_1018.py — 2026-10-18 日更补丁
策略：按 {name:'校名' 定位 → 在 ,tuition:' 之前一位（QUOTE 守卫）插入
说明：本文件内一律不得出现英文直撇号 (U+0027)，所有格统一用 U+2019。
"""
import io, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'public/js/data.js')
MASTER = os.path.join(ROOT, '加拿大大学录取要求对照表_2026.html')
APP_ADM = os.path.join(ROOT, 'public/pages/admission.html')
APP_TL = os.path.join(ROOT, 'public/pages/timeline.html')
APP_PLAN = os.path.join(ROOT, 'public/pages/plan.html')

OLD_DATE = '2026-10-16'
NEW_DATE = '2026-10-18'
OLD_REV = 'delpoy_rev_10161'
NEW_REV = 'delpoy_rev_10181'

PATCHES = {
'多大·圣乔治': '；🆕2026-10-18（Stellar Advisers 逐项官方对照，核对日 2026-10-13）：💰**2027-28 国际生学费计划额首次入表** —— 官方学费报告：**2026-27 已批准的国际生工程学费 $72,860**；**2027-28 计划值（INFO，非最终批准）工程 $75,770**；本地生工程 2026-27 **$14,460**；A&S 2027 入学国际生 **$68,750**（2026 入学 $66,110）不变。⚠️2027-28 属**计划值**，最终账单以录取后学费表为准。📋**工程补充申请（Online Student Profile）格式确认**：**2–4 个工程志愿排序 + 3 段限时视频作答**；**申请、补充申请与工程材料同一节点 2027-01-15**；官方明确**无独立「工程早申」截止**，早申仍为推荐 11/7 + 材料 12/1',

'UBC·温哥华': '；🆕2026-10-18（you.ubc.ca + Sauder 官方页面逐项对照，核对日 2026-10-13/10-16）：📌**2027 冬季学期全量节点补全** —— **申请 2026-10 上旬开放 → 2027-01-15 23:59 PST 截止**；**国际学者奖（International Scholars）2026-11-15**；**加拿大公民/移民奖学金轮 2026-12-01**；**ELAS 语言材料 2027-02-15**（国际学者申请者提前至 **2027-01-31**）；🆕**通用材料截止 2027-03-15**（多数申请者，此前表内未单列）；**加拿大高中课程须 2027-06-30 前完成**；放榜 **2026-11 – 2027-06**。🎓**分专业口径**：**Sauder BCom 2027W 已开放、申请 1/15，Personal Profile 含视频面试**；**Sauder–HKU 双学位补充申请与材料 2027-01-31**；**音乐 2027W：补充表+费 1/15、推荐信 1/20、录音试听 1/27、现场试听 1/30–31 与 2/6–7**；**影视制作补充 2027-02-01（明确不接受逾期）**；**SALA 设计学士 1/15 申请 + 1/31 视频/简历/补充**；**Presidential Scholars 须 12/01 前完成完整申请与缴费**。⚠️**校方明文禁止中介代写 Personal Profile 或申请任何部分**（可提供日程与流程信息，申请人自负时限与付款责任）—— 文书必须本人完成',

'滑铁卢': '；🆕2026-10-18（uwaterloo.ca 官方文件页 + Stellar 官方对照，核对日 2026-10-13/16）：⚠️**「工程 + 数学同时申请」的合并截止首次入表** —— **同时报工程学院与数学学院者，AIF、视频面试与补充表统一提前至 2027-02-01 23:59 ET**（不合并则工程 2/1、数学 2/15）；**数学学院 AIF + Supplementary Information Form（数学竞赛参与情况）2027-02-15**；**软件工程另需独立补充表（编程经历），与共用 AIF 分开提交，同为 2/1**；**Declaration of Academic Experience（DAE）所有申请者必做**，完成后申请清单才显示需补哪些材料。🎓奖学金与宿舍：**Schulich Leader 校内提名 2027-01-27**；**数学奥林匹克／国家与全球奖申请 2027-03-05**；**环境学院两项奖 2027-04-01**；**接受 offer 2027-06-01**；**宿舍保证表 + C$500 押金 2027-06-08 23:55 ET**',

'皇后': '；🆕2026-10-18（Stellar 官方逐项对照 + Queen’sUBound，核对日 2026-10-13/16）：🎓**Major Admission Award**：申请 **2026-12-08**、官方**建议 2026-11-20 前递交 OUAC**（**SOLUS 权限开通需 4–6 个工作日**）；⚠️同页出现 **Chancellor’s nomination 11/15 与 11/20 两个口径**，以校内提名通知为准。📅**Smith 商学院 2027 全流程**：申请 **2/1** → 补充 **2/15** → 材料 **3/31** → **皇后全部决定 2027-05-21 前完成**，最早 offer 自 12 月初发出。🏠**宿舍：2027-06-01 16:00 ET 前申请与押金须「已到账」**（非寄出）；非安省高中回复 **5/1**、安省 **6/1**。⚠️补充申请 rubric 仍标 2026 版，2027 版承诺 **2026-11-01** 前发布',

'UNSW': '；🆕2026-10-18（澳洲政府 2027 NPL 官宣 + 教育部与 Study Australia 转述交叉，核对日 2026-10-18）：🌏**2027 国际学生国家规划量（NPL）口径细化** —— **NPL = 295,000 个新海外学生入学（NOSC），与 2026 持平**，政府 **2026-07 官宣**；⚠️**NPL 不是签证上限**：院校达本校配额 **80%** 后，该校 500 签由 **Priority 1 降为 Priority 2**，仍可递签获批、仅审理变慢；**超配额 15% 进 Priority 3**（部长指令 **MD115**，2025-11-14 起适用）；**配额分配 = 公立大学 161,725 + 其他高教机构 38,500**，**TAFE 2027 年豁免 NPL**，**无任何在营机构 2027 配额低于 2026**；豁免另含太平洋岛国、东帝汶与澳政府奖学金获得者。⇒ **对你的含义**：UNSW 属高配额校，但**预科／Diploma 满位即关是院校自主规则，与 NPL 属两套体系**，仍须早递',
}


def patch_data():
    with io.open(DATA, encoding='utf-8') as f:
        s = f.read()
    hits, misses = [], []
    for name, text in PATCHES.items():
        anchor = "{name:'%s'" % name
        i = s.find(anchor)
        if i < 0:
            misses.append(name + ' (anchor)')
            continue
        j = s.find(",tuition:'", i)
        if j < 0:
            misses.append(name + ' (tuition)')
            continue
        if s[j - 1] != "'":
            misses.append(name + ' (QUOTE-GUARD)')
            continue
        if text[:60] in s:
            misses.append(name + ' (already patched)')
            continue
        s = s[:j - 1] + text + s[j - 1:]
        hits.append(name)
    assert s.count("const DATA_REV_DATE = '%s';" % OLD_DATE) == 1, 'DATA_REV_DATE 未命中'
    s = s.replace("const DATA_REV_DATE = '%s';" % OLD_DATE,
                  "const DATA_REV_DATE = '%s';" % NEW_DATE)
    nrev = s.count(OLD_REV)
    s = s.replace(OLD_REV, NEW_REV)
    with io.open(DATA, 'w', encoding='utf-8') as f:
        f.write(s)
    print('[data.js] HIT=%d %s' % (len(hits), hits))
    print('[data.js] MISS=%d %s' % (len(misses), misses))
    print('[data.js] DATA_REV_DATE -> %s ; rev 标记替换 %d 处' % (NEW_DATE, nrev))


def patch_pages():
    # master HTML 的 DATA_UPDATED
    with io.open(MASTER, encoding='utf-8') as f:
        m = f.read()
    assert m.count("const DATA_UPDATED = '%s';" % OLD_DATE) == 1
    m = m.replace("const DATA_UPDATED = '%s';" % OLD_DATE,
                  "const DATA_UPDATED = '%s';" % NEW_DATE)
    with io.open(MASTER, 'w', encoding='utf-8') as f:
        f.write(m)
    print('[master] DATA_UPDATED -> %s' % NEW_DATE)

    # admission.html：静态文本 + 运行时常量兜底
    with io.open(APP_ADM, encoding='utf-8') as f:
        a = f.read()
    a2 = a.replace('最后更新：%s' % OLD_DATE, '最后更新：%s' % NEW_DATE)
    a2 = a2.replace("|| '%s';" % OLD_DATE, "|| '%s';" % NEW_DATE)
    assert a2 != a
    with io.open(APP_ADM, 'w', encoding='utf-8') as f:
        f.write(a2)
    print('[admission.html] 日期替换 %d 处' % (a.count('最后更新：%s' % OLD_DATE) + a.count("|| '%s';" % OLD_DATE)))

    # timeline.html：静态文本 + 手动常量
    with io.open(APP_TL, encoding='utf-8') as f:
        t = f.read()
    t2 = t.replace('最后更新：%s' % OLD_DATE, '最后更新：%s' % NEW_DATE)
    t2 = t2.replace("const d = '%s';" % OLD_DATE, "const d = '%s';" % NEW_DATE)
    assert t2 != t
    with io.open(APP_TL, 'w', encoding='utf-8') as f:
        f.write(t2)
    print('[timeline.html] 日期替换完成')

    # plan.html：TODAY 基准日 + 页脚日期 + 新增 PAL 墙提示
    with io.open(APP_PLAN, encoding='utf-8') as f:
        p = f.read()
    assert p.count("const TODAY = '%s';" % OLD_DATE) == 1
    p = p.replace("const TODAY = '%s';" % OLD_DATE, "const TODAY = '%s';" % NEW_DATE)
    p = p.replace('（截至 %s）' % OLD_DATE, '（截至 %s）' % NEW_DATE)
    p = p.replace('<b>生成时间</b>：%s' % OLD_DATE, '<b>生成时间</b>：%s' % NEW_DATE)
    pal_note = ('<b>⚠️ 1 月入学硬墙</b>：2026 年签发的 PAL 有效期至 <b>2026-12-31</b>，'
                '跨配额年度不可复用 —— 若考虑 2027 年 1 月入学，学签申请须在 <b>2026-12-31 前</b>递交；'
                '2027 各省配额与 2027–2029 Levels Plan 尚未公布（预计 11 月初）。<br>\n    ')
    if '1 月入学硬墙' not in p:
        p = p.replace('<b>生成时间</b>：', pal_note + '<b>生成时间</b>：')
    with io.open(APP_PLAN, 'w', encoding='utf-8') as f:
        f.write(p)
    print('[plan.html] TODAY -> %s，已补 PAL 硬墙说明' % NEW_DATE)


if __name__ == '__main__':
    patch_data()
    patch_pages()
