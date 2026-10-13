#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
update_1013.py — 2026-10-13 日更补丁（data.js 权威源）
策略：按 {name:'校名' 定位 → 在 ,tuition:' 之前插入（16 行一次全 HIT，鲁棒）
说明：本文件内一律不得出现英文直撇号 (U+0027)，所有格统一用 U+2019。
"""
import io, sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'public/js/data.js')
MASTER = os.path.join(ROOT, '加拿大大学录取要求对照表_2026.html')
APP_ADM = os.path.join(ROOT, 'public/pages/admission.html')
APP_TL = os.path.join(ROOT, 'public/pages/timeline.html')

OLD_DATE = '2026-10-12'
NEW_DATE = '2026-10-13'
OLD_REV = 'delpoy_rev_10121'
NEW_REV = 'delpoy_rev_10131'

PATCHES = {
'戴尔豪斯': '；🆕2026-10-13（Stellar 逐校官方对照，核对日 2026-10-08）：①🎯**最低均分按专业发布、无全校统一分线**——**文理 70%／管理学 70%／工程 70%／护理 70%**、**商科 75%／理科 75%**、**医学科学 80%**；均分**按五个 12 年级学术课计算**，且**每个专业都必须含 Academic English 12**；⚠️**校方明示达到最低均分不保证录取**；②**CS 与 Applied CS 单列门槛**：**Applied CS 70%（含英语 ≥65%、数学 ≥65%）**、**CS 70%（含英语 ≥65%，且数学 ≥70% 或预备微积分 ≥65%）**，另各需 3 门大学预备课 ≥60% —— **数学单项下限独立于 70% 总均分之外、须叠加满足**；③🏠**一年级新生于 2027-05-01 前递交住宿申请即保证床位**；**Halifax 校区 2026-27 宿舍费 C$6,645–12,684**；④💼**co-op 为后置 opt-in（含工程与计算机科学两组，共五组）**，2026-27 **每 4 个月工作期 co-op 费 C$562.38**；⑤✅Fall 2027 于 2026-10-01 开放、申请费 C$70、General Entrance Award 2026-10-01 → 2027-02-15 —— **与 10-11/10-12 记录零差异**；⚠️**program-specific 截止仍未公布**（2/15 与 3/1 属上一轮规律）',

'皇后': '；🆕2026-10-13（AdmissionPrep 逐校官方对照，更新日 2026-10-10）：⚠️**补充申请评分量表存在版本时滞** —— 官方评分量表页当前展示的仍是 **2026 入学轮次**版本，**官方明示 2027 入学轮次的更新版将于 2026-11-01 前发布**；在此之前**不得把旧量表当作 2027 评分标准**，往届 Personal Statement of Experience 示例与奖学金论文亦**不适用于 2027 的 Commerce／Health Sciences／Nursing 题目**；另**Major Admission Award 申请须先取得 SOLUS 权限**，官方提示**须提前递交校方申请以取得权限，不要等到 12-08 才开始办**（官方页同时存在若干 11 月「建议日」口径差异，**建议日不等于奖学截止日**）',

'卡尔顿': '；🆕2026-10-13（Stellar 逐校官方对照，核对日 2026-10-08）：①📅**2027 入学全量日期补全**——**2027-01-15 安省高中生 OUAC 截止**／**2027-03-01 专业单独申请截止 + Prestige 奖学金截止**／**2027-03-05 补充材料截止**／**2027-04-01 境外（加、美以外）成绩单主国际截止**／**2027-05-01 Leadership Entrance Bursary**／**2027-06-01 本地／美国成绩单者常规秋季申请截止 + 安省高中生接受 offer**／🆕**2027-06-15 完成申请与所需成绩接收截止（用于自动入学奖学金评审）**／🆕**2027-06-30 Entrance Bursary 截止**；②**conditional-offer 全量档复核一致**：**建筑研究 70%／商科·会计 75%（进阶函数 ≥70%）／新闻 76%（英语 ≥70%）／CS·网安·数据科学 78%（进阶函数 + 微积分合并 ≥76%）／健康科学 80%（进阶函数 + 两门认可理科合并 ≥75%）／护理 78%（英语 + 进阶函数 + 生物 + 化学合并 ≥75%）／公共事务与政策管理 80%（无先修）／航空航天 86%（先修合并 ≥86%）／机械工程 88%（全校最高）**；③⚠️**均为「保持 offer 的条件」，非录取切分线**，**undergraduate calendar 仍标 2026–2027**，竞争切分可能高于此表；④**co-op 学分不计入六门录取课**；⑤**滚动发放 offer（自 11 月中起）**，作品集／补充申请类专业于对应截止后评审',

'渥太华': '；🆕2026-10-13（Stellar 官方统计整理，核对日 2026-10-08）：📊**录取规模与均分首次入表** —— **OUAC 口径 Fall 2026（安省高中生）：申请 35,497 份／确认 5,382 人**；**校方口径 Fall 2025：全部本科申请 77,605 份、入学 10,638 人**；⚠️**两者统计群体不同，均不可当作录取率**（OUAC 与校方均不公布 offer 数）；🎯**最有参考价值的一条：安省高中生直升的录取均分为 86.8%（Fall 2023 入学班），其中 64.7% 达 85% 以上 —— 即约三分之一入学学生均分低于 85%** ⇒ **你 GPA 89.6 高于该入学班均分 2.8 分**；⚠️该数据描述**全校入学班整体**，**各专业自身最低分与先修要求仍单独决定资格**（社科 75%／会计 80%／健康科学 85%／机械工程 84%／软件工程 87%）',

'麦克马斯特': '；🆕2026-10-13（AdmissionPrep 逐校官方对照，更新日 2026-10-10）：⚠️**Honours Health Sciences 补充申请时点澄清** —— 官方项目页列 **2026-12-01 为「问题公布日」**，但**公布不等于门户开放**：截至 2026-10-10 该页的 **portal access 及若干时点仍标注为「Coming Soon（即将公布）」**；全校总览页给出的**提交窗口为 2027 年 2 月上／中旬**，**确切日仍未确认**；⚠️**不得把 12-01 当作提交截止日**，亦**不得把工程补充申请的开放信息套用到健康科学**；**往届题目仅可参考题型，不是 2027 题目**；其余补充申请日复核一致（**工程／CS／B.Tech／iBioMed 2027-01-28 23:59 ET**、**Arts&Science 与 IBH 2027-02-01**、**Integrated Science 2027-02-02**）',

'卡尔加里': '；🆕2026-10-13（Stellar 逐校官方对照，核对日 2026-10-07）：①🎯**CS 竞争均分官方估算 = low 80s（安省与阿省高中申请人同一区间，适用 Fall 2027）**，**为估算值而非承诺切分线**；⚠️**UCalgary 按「专业相关课程」计均分，不是 Top 6**；②📚**CS（BSc）安省先修**：**ENG4U + MHF4U + 下列四门中任两门（SBI4U／SCH4U／SPH4U／MCV4U／ICS4U）+ 1 门认可课**；⚠️**ICS4U 非必需**，即**无高中编程课亦可申请**（但校方建议选修与目标专业相关课程）；③📅**2026-10-01 → 2027-03-01 申请、2027-03-15 材料、无补充申请** —— 与现表一致；④💰**国际生按学分计费：理科课程 C$3,078.21／3 学分**（2026-27 春季生效费率）',

'阿尔伯塔': '；🆕2026-10-13（Stellar 逐校官方对照，核对日 2026-10-08）：①📅**Open House 2026-10-17**（2027 轮次公布日期）；②**2027-02-15 同日三个节点**：**Program Change Request 截止** + 🆕**Discover U of A Award** + 🆕**Turtle Spirit Pathway Award** 申请截止；③复核**五个 12 年级科目模型（非六门）、ENG4U 实际必需**、公布下限 **70%**（**12 年级科目用分须 ≥50%，11 年级科目用分须 ≥60%**）；④确认时间线：**2026-10-01 开放（入学、奖学与住宿同一开放日）／多数专业 2027-03-01 截止／入学奖 2027-01-10 截止／2027-02-19 可补第一学期成绩／2027-04-30 自报最终成绩兼 North Campus 宿舍保证截止／2027-05-01 接受 4-01 前发出的 offer／2027-06-15 专上申请者最终材料**；⚠️**官方截止页表头仍写「Timeline for Fall 2024 Applicants」为模板未更新，表内日期均为 2027**',

'约克': '；🆕2026-10-13（Stellar 逐校官方对照，核对日 2026-10-08）：①🎯**逐专业当前区间与 offer 条件首次入表**——**Schulich BBA／iBBA：区间 low 90s、offer 条件 88%**（ENG4U 与 MHF4U 各 ≥70%，另需 MCV4U 或 MDM4U，**4M 课不超过 2 门**，另需领导力档案 + 视频面试 + 限时写作）；**一年级工程核心：区间 mid-80s、offer 条件 78%**（ENG4U + MHF4U + MCV4U + SCH4U + SPH4U + 1 门 4U/M，**可另选 BOOST 联申以争取工程保位**）；🎯**CS BSc：区间 low 80s、offer 条件 78%**（另需**数学均分 ≥75%，且数学先修无任何一门低于 65%**），先修 ENG4U + MHF4U +（MCV4U 或 MDM4U）+（SCH4U 或 SPH4U）+ 2 门 4U/M，**大二后可自愿申请 Lassonde co-op**；**护理（直入 BScN）：offer 条件 86%**；②⚠️**「offer 条件」是保住 offer 的最终均分，不是 Fall 2027 录取切分线**；③⚠️**Fall 2027 保障考虑表与补充申请截止仍未发布** —— 现行 **Schulich／AMPD 的 2/3 补充截止属 Fall 2026，不得改标为 2027**（**与 10-12 记录一致**）；**当前区间为规划参考，非 2027 承诺**；④日程确认：**OUAC Group A 截止 2027-01-15**（安省高中生），**国际生 Winter 2027 = 2026-11-18／Summer 2027 = 2027-04-01／Fall 2027 = 2027-03-24**；**通常在材料齐备后 6 周内出决定**',
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
        # 关键：`j-1` 必须是 deadline 字符串的闭合单引号，补丁须插在它「之前」（句内追加）
        if s[j - 1] != "'":
            misses.append(name + ' (QUOTE-GUARD)')
            continue
        # 幂等保护：已插入过则不重复
        if text[:60] in s:
            misses.append(name + ' (already patched)')
            continue
        s = s[:j - 1] + text + s[j - 1:]
        hits.append(name)
    # 日期与版本标记
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


def patch_simple(path, pairs, label):
    with io.open(path, encoding='utf-8') as f:
        s = f.read()
    out = []
    for old, new in pairs:
        c = s.count(old)
        if c:
            s = s.replace(old, new)
        out.append('%s x%d' % (old[:34], c))
    with io.open(path, 'w', encoding='utf-8') as f:
        f.write(s)
    print('[%s] %s' % (label, ' | '.join(out)))


if __name__ == '__main__':
    patch_data()
    patch_simple(MASTER, [("const DATA_UPDATED = '%s';" % OLD_DATE,
                           "const DATA_UPDATED = '%s';" % NEW_DATE)], 'master HTML')
    patch_simple(APP_ADM, [("|| '%s';" % OLD_DATE, "|| '%s';" % NEW_DATE),
                           (OLD_REV, NEW_REV)], 'admission.html')
    patch_simple(APP_TL, [("const d = '%s';" % OLD_DATE, "const d = '%s';" % NEW_DATE),
                          (OLD_REV, NEW_REV)], 'timeline.html')
    print('done.')
