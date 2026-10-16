#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
update_1014.py — 2026-10-14 日更补丁（data.js 权威源 + 三个页面日期常量）
策略：按 {name:'校名' 定位 → 在 ,tuition:' 之前一位（QUOTE 守卫）插入
说明：本文件内一律不得出现英文直撇号 (U+0027)，所有格统一用 U+2019。
"""
import io, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'public/js/data.js')
MASTER = os.path.join(ROOT, '加拿大大学录取要求对照表_2026.html')
APP_ADM = os.path.join(ROOT, 'public/pages/admission.html')
APP_TL = os.path.join(ROOT, 'public/pages/timeline.html')

OLD_DATE = '2026-10-13'
NEW_DATE = '2026-10-14'
OLD_REV = 'delpoy_rev_10131'
NEW_REV = 'delpoy_rev_10141'

PATCHES = {
'多大·圣乔治': '；🆕2026-10-14（OUAC 2027 改版说明 + 本地资讯交叉核对，核对日 2026-10-13）：🔧**OUAC 系统 2027 季改版落地**——①**沿用多年的「101／105 通道」标签正式废止，统一改为 Group A／Group B**：**Group A** = 安省高中在读 + 2026 年底前未满 21 周岁 + 修 OSSD（含 6 门 4U/M）；**Group B** = 国际生、加拿大外省生、转学生、GAP 年、成年申请者。⚠️**录取标准本身未变，仅更名**，此后不必再检索「105 通道怎么填」；②🏷️**UTSG 在 OUAC 页面上统一显示为「Toronto」**（不再出现 UTSG 字样）——仅呈现方式变更，安省高中生仍用 OUAC 代码申请；③🌐**OUInfo 已于 2026-08 改版上线**，专业录取要求、宿舍与奖学金信息整合度提升，**数据仍由各校自行维护**；④💳**付款通道改为 Flywire**，**必须全额付清后申请资料才会转送大学**；**接受 offer 时 OUAC 不收费，押金直接付给大学**；⑤⚠️国际生 **PAL 仍不经 OUAC 办理**，须向目标大学招生办索取',

'UBC·温哥华': '；🆕2026-10-14（AdmissionPrep UBC 2027 指南第 3 次独立复核，更新日 2026-10-10）：**2027 入学日期四条零差异复核** —— **申请开放 = 2026 年 10 月初**；**国际学者奖（International Scholars）截止 2026-11-15**（奖学金证明文件 2027-01-31）；🆕**境内指定奖项（Presidential／Centennial／Beyond Tomorrow）考虑截止 2026-12-01**（**仅限加拿大公民与永久居民**）；**常规申请截止 2027-01-15 23:59 PST**。另补两条口径：①⚠️**International Scholars 与普通 merit 奖只能二选一申报**，不可同时计入；②**Vantage One Excellence Award 仍为「未达 ELAS 直录线者」的官方奖项通道**，但走 Vantage 者仍须先满足 Vantage 英语门槛 5.5',

'滑铁卢': '；🆕2026-10-14（`uwaterloo.ca/future-students/admissions` 官方原页「Repeated courses and non-day school courses」**逐字实抓**，核对日 2026-10-14）：**把 2026-09-11 的第三方转述升级为官方原文直接证据** —— ①官方原文：**「If you repeat a course and apply to any program at Waterloo for September 2027 entry, you will not be penalized in the application process」**，且**取该课程最高一次成绩计入录取平均分**（适用**全部专业**）；②官方原文明确**接受由所在省／地区教育部认证的以下五类课程**：**Day school／Summer school／Night school／Online／Private school**，并写明**申请 2027 年 9 月入学不会被处罚**；③⚠️**官方仍保留建议口径**：**建议在常规学年内首考完成全部必修 12 年级课程**，理由是「需要重修的学生在结构化程度高的专业中可能延后毕业进度」—— **不处罚 ≠ 无风险**；④**适用范围严格限定于 September 2027 entry**，更早或更晚轮次须重新核对',

'韦士敦': '；🆕2026-10-14（Stellar Advisers 逐校官方对照，核对日 2026-10-08）：🎯**BMOS（管理与组织研究学士）口径首次全量入表** —— ①**录取均分区间 = mid-to-high 80s**（OUAC 代码 **ED**；**Aviation 方向 low 80s，代码 EDN**）；②先修 **ENG4U + MCV4U／MHF4U／MDM4U 中任两门，且每门 ≥70%**；③**年招生规模约 950 人**；④⚠️**大一不分模块**，Finance 等方向须大一结束后再定；⑤**进阶门槛**：**Honours Specialization 须大一末三门主课均分 73% 且无任何一门低于 60%**；**BMOS Specialization 须大一累计均分 65%**（四年制非荣誉路径）；⑥💰**2026-27 安省大一：学费 $8,077、含杂费合计 $10,128.46**（校方费用表标注 draft，仍可能调整）；⑦⭐**重要结构澄清：BMOS 与 Ivey AEO 并非二选一** —— **AEO 是「身份」而非「专业」**，AEO 学生前两年可就读 Western 或其附属学院的任何专业，**可以 BMOS + AEO 同时持有**；**Ivey AEO 的参考均分为 low 90%**，高于 BMOS 区间；⚠️**Ivey 合并学位清单中不含 MOS**；⑧**除 Aviation 外 BMOS 无补充申请**，OUAC 平等考虑截止 **2027-01-15**',

'SFU': '；🆕2026-10-14（Stellar 全加拿大 2027 开放日汇总，核对日 2026-10-13）：**SFU 高中申请者 Fall 2027 通道于 2026-10-01 开启**；**其他专上／转学通道于 2027-03-01 开启**；⚠️**EducationPlannerBC 无统一开放日**（各校各专业自定），**不可把「能建账号」当作「Fall 2027 已开放」**',

'戴尔豪斯': '；🆕2026-10-14（Stellar 官方逐页对照，核对日 2026-10-13）：①**Fall 2027 于 2026-10-01 开放（apply.dal.ca）、申请费 C$70** —— 与现表一致；②🆕**2027–2028 General Entrance Award 窗口确认：2026-10-01 开放 → 2027-02-15 截止**；③⚠️**校方自身页面口径冲突（须留证）** —— **本科招生页与奖项页已切到 Fall 2027／2027–2028 周期，但中央「dates and deadlines」页仍只列 September 2026 入学序列** ⇒ **program-specific 截止仍未正式公布**，现表所列 2/15 与 3/1 **属上一轮规律，不得当作 2027 承诺**；④补录最低均分分档：**Health Promotion／Therapeutic Recreation 70%**（无数学要求）、**Management (BMgmt) 70%（须 Academic Math 12）**、**Community Design 70%**（须数学 + 1 门理科）；⑤**安省申请人可提供 OUAC 号，成绩自动转送**（戴尔豪斯非 OUAC 成员校）',

'UNSW': '；🆕2026-10-14（新东方 × UNSW College 国内预科中心官方口径与 2027 课表，核对日 2026-10-14）：⚠️**国内预科通道重大变更** —— **「VEPT 校内英语内测替代雅思」的通道自 2026 年起取消**（此前可凭内测直入预科）；**语言未达标者改走 FEEC（UNSW College 官方英语衔接课程）**，**FEEC 结业后直接衔接预科主课、无需重考雅思**；**FEEC 结课与主课开课之间仅隔 3 天** —— **F1 2027-01-04 开课／03-19 结课 → O1 2027-03-22 开课**；**F2 2027-06-14 开课／08-20 结课 → O2 2027-08-23 开课**；**预科主课入学语言门槛**：**商科 IELTS 总分 6.0（写作 5.5、各项 ≥5.5）／理科 5.5（写作 5.5、各项 ≥5.0）**；**开课当日须年满 16 周岁**且**高二或高三平时成绩平均 ≥75 分**；⚠️**此为「国内预科中心」口径，与 UNSW College 澳洲本校预科门槛并存，两者不可混用**；**国内就读较赴澳读预科约省 40% 综合成本**；⚠️**节奏提醒：距 F1 开课不足 3 个月，而评估→测试→材料→录取→缴费通常需 6–10 周，建议 11 月底前完成首轮咨询**',

'昆士兰': '；🆕2026-10-14（官方更新汇编转述，核对日 2026-10-14）：①🎓**硕士门槛调整**：**Master of Teaching（Primary）与（Secondary）最低 GPA 统一调整为 4.0／7.0**；**Master of Teaching (Secondary) 的教学领域拆分为第一／第二领域**，**第二领域对先前学习要求更低**、第一领域维持不变；②🆕**自 2027 年 2 月开学季起，Bachelor of Arts 增设两个新专业方向：Australian Studies、Gender Studies**；③🆕**新增 5 年整合课程 Bachelor of Pharmaceutics and Therapeutic Science ／ Doctor of Pharmacy**（含实习培训，毕业可申请执业药师完全注册）；④🆕**新增医学直通路径**：**2 年定制预医学 + 4 年医学博士（MD）整合双学位**，**较传统临时入学途径至少提前一年毕业**；⑤🌏**澳洲学生签证**：**2027 年年中起，留学生更换就读院校须重新申请签证，费用约 A$1,200**（为原签证费 A$2,500 的一半；澳洲学签费本身居全球最高档）—— 与既有「2027-07-01 起新增转学 stream」为同一政策的两面',
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
        # QUOTE 守卫：j-1 必须是 deadline 字段的闭合单引号，补丁须插在它「之前」（句内追加）
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


def patch_simple(path, pairs, label):
    with io.open(path, encoding='utf-8') as f:
        s = f.read()
    out = []
    for old, new in pairs:
        c = s.count(old)
        if c:
            s = s.replace(old, new)
        out.append('%s x%d' % (old[:40], c))
    with io.open(path, 'w', encoding='utf-8') as f:
        f.write(s)
    print('[%s] %s' % (label, ' | '.join(out)))


if __name__ == '__main__':
    patch_data()
    patch_simple(MASTER, [("const DATA_UPDATED = '%s';" % OLD_DATE,
                           "const DATA_UPDATED = '%s';" % NEW_DATE)], 'master HTML')
    patch_simple(APP_ADM, [("|| '%s';" % OLD_DATE, "|| '%s';" % NEW_DATE),
                           ("最后更新：%s" % OLD_DATE, "最后更新：%s" % NEW_DATE),
                           (OLD_REV, NEW_REV)], 'admission.html')
    patch_simple(APP_TL, [("const d = '%s';" % OLD_DATE, "const d = '%s';" % NEW_DATE),
                          ("最后更新：%s" % OLD_DATE, "最后更新：%s" % NEW_DATE),
                          (OLD_REV, NEW_REV)], 'timeline.html')
    print('done.')
