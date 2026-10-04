#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""2026-10-04 日更补丁：data.js + master HTML（同一院校文本，同串可同时命中）"""
import io, sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES = [
    os.path.join(ROOT, 'public', 'js', 'data.js'),
    os.path.join(ROOT, '加拿大大学录取要求对照表_2026.html'),
]

DATE_OLD = '2026-10-02'
DATE_NEW = '2026-10-04'
REV_OLD = 'delpoy_rev_10102'
REV_NEW = 'delpoy_rev_10104'


def block_span(s, school):
    """返回该院校块 [start, end) 的切片范围（到下一个 {name:' 之前）"""
    key = "name:'%s'" % school
    i = s.find(key)
    if i < 0:
        return None
    j = s.find("{name:'", i + len(key))
    if j < 0:
        j = len(s)
    return (i, j)


def patch_block(text, school, pairs, report):
    """在指定院校块内做替换"""
    span = block_span(text, school)
    if span is None:
        report.append('MISS-BLOCK  %s' % school)
        return text
    i, j = span
    seg = text[i:j]
    for old, new in pairs:
        n = seg.count(old)
        if n == 0:
            report.append('MISS  [%s] %s' % (school, old[:60]))
            continue
        seg = seg.replace(old, new)
        report.append('HIT%dx [%s] %s' % (n, school, old[:60]))
    return text[:i] + seg + text[j:]


def patch_global(text, pairs, report):
    for old, new in pairs:
        n = text.count(old)
        if n == 0:
            report.append('MISS-G %s' % old[:80])
            continue
        text = text.replace(old, new)
        report.append('HITG%dx %s' % (n, old[:80]))
    return text


# ---------------- 补丁内容 ----------------

# 1) 多大工程：Track One 取消（官网实抓确认）
UT_ENG_OLD = ("note:'工程无IFP双录!须直录雅思6.5',note_detail:'⚠️2026-27/2027-28 IFP官网仅覆盖"
              "Arts&Science/建筑景观设计/音乐，不含工程(须直录6.5(6.0));OUInfo仍列示IFP-Engineering旧条目"
              "(TUH,区间mid-80s~low90s),2027-28是否实际招生需向工程学院确认'")
UT_ENG_NEW = ("note:'⚠️2027起仅两条路径:Core 8 或 EngSci;无IFP双录',note_detail:'⚠️2026-27/2027-28 IFP官网仅覆盖"
              "Arts&Science/建筑景观设计/音乐，不含工程(须直录6.5(6.0));🆕**2026-10-04 官网实抓确认"
              "(discover.engineering.utoronto.ca/programs)**:多大工程本科**只剩两条申请路径——① Core 8 核心专业 ② "
              "Engineering Science(EngSci)**;**「Track One」未再出现于官网项目页,判定 2027 季已取消**"
              "(此前可先申 Track One、大一读工程基础课、之后再定方向);⇒ Core 8 = Chemical/Civil/Computer/Electrical/"
              "Industrial/Materials/Mechanical/Mineral(**一个校区仅可报 1 个**);EngSci 为直入,前两年 Foundation Years "
              "+ 后两年 9 大主修之一;▲另一新增:工程学院**新增辅修网络安全证书**、扩展海外交换;▲工程**补充申请费 C$45.00**"
              "(随 OUAC 申请一并缴纳);先修 5 门(ENG4U/MCV4U/SCH4U/SPH4U/MHF4U)各≥70% 且以这 5 门计均分;"
              "Engineering Supplemental Application 截止 12/1(争 2 月首轮),材料 1/15,官网建议 11/7 前递 OUAC;"
              "宿舍保证:3/31 前完成住宿申请 + 6/1 前接受 offer;⚠️OUInfo 仍列示 IFP-Engineering 旧条目(TUH),"
              "2027-28 是否实际招生仍需向工程学院确认'")

# 2) 多大 CS：追加量子工程新专业
UT_CS_OLD = ("note_detail:'🆕已确认(2026-09-11):多大已完成校内审批,自2027-09-01起推出新的四年制荣誉学位BCS"
             "(Bachelor of Computer Science),覆盖三校区CS相关项目——UTSG:CS专修/主修、数据科学专修、"
             "生物信息学与计算生物学专修;2026-27 IFP覆盖Arts&Science(含CS/数学/心理)、建筑景观设计、音乐；"
             "新门槛单项≥5.0你听力/阅读4.5未达标'")
UT_CS_NEW = (UT_CS_OLD[:-1] +
             ";🆕2026-10-04:多大**新增量子工程本科(Quantum Engineering)**——隶属应用科学与工程学院,"
             "**2027 秋季首届招生、为加拿大首个量子工程本科**;前两年数理与工程基础,后两年分量子计算硬件/量子传感/"
             "量子通信三方向;设专项奖学金、国际生同等参评;⚠️中介口径(新东方),官网项目页暂未列出,**待官网核实**'")

# 3) 多大 deadline 追加工程路径变更
UT_DL_OLD = "Group B 无统一截止,由各校自定'"
UT_DL_NEW = ("Group B 无统一截止,由各校自定;🆕2026-10-04(官网实抓):多大工程本科申请路径**只剩 Core 8 与 "
             "Engineering Science 两条,「Track One」已取消**;工程补充申请费 C$45.00;宿舍保证需 3/31 前完成住宿申请、"
             "6/1 前接受 offer'")

# 4) 卡尔顿 ESLR —— 官方两档精确化（对雅思 5.0 用户直接利好）
CAR_ESLR_DETAIL = ("🆕**2026-10-04 官方两档英语门槛实抓确认(经 StudyU 逐项对照 Carleton 官方页,2026-10-02 核对)**——"
                   "**表1 直录(无附加英语要求)**:IELTS 6.5(各项≥6.0)、TOEFL 新制 4.5(各项≥4.0)、Duolingo 120"
                   "(写/读/说 110、听 105)、PTE 55(各 47)、CAEL 70(各 60)、Cambridge 176(各 169);"
                   "**表2 带语言条件录取 ESLR**:IELTS **5.0(各项≥4.5)**、TOEFL 新制 3.0、Duolingo 80、PTE 31、CAEL 40、"
                   "Cambridge 154。ESLR 首学期修学术英语 ESLA 1300/1500/1900 + 少量学位课(0.5–1.5 学分),"
                   "**最长 3 学期,且所修学分计入学位**;⚠️**ESLR 不适用于**:信息技术(IT)、国际商务(International Business)、"
                   "Journalism and Humanities、Media Production and Design、Public Affairs and Policy Management、"
                   "post-baccalaureate 文凭 → **CS/工程/理科/数学/心理/社科均不受限**;⚠️学校开具的英文授课证明信**不被接受**;"
                   "✅**对你的判定:你 IELTS 5.0(W5.5/R4.5/L4.5/S5.0),各项均≥4.5 → 卡尔顿 ESLR 通道达标**"
                   "(CS/理科/工程方向均可走);⚠️注意与中介「读写听三科平均≥5.0」口径不同(该口径下你 4.83 不达标),"
                   "**以官方「各项≥4.5」为准**;学费冻结至 2028/29(CAD 39,000/45,000/55,000);自动奖(无需申请):"
                   "入学奖 CAD 1,000–3,000/年 + 国际生首年 President’s Welcome Award CAD 2,000–5,000(可叠加)")

CAR_DL_OLD = "入学助学金2027-06-30;"
CAR_DL_NEW = ("入学助学金2027-06-30;🆕2026-10-04(官方两档英语门槛实抓):**ESLR(带语言条件录取)IELTS "
              "5.0(各项≥4.5)** vs 直录 6.5(各项≥6.0);ESLR 修 ESLA 1300/1500/1900 + 学位课,最长 3 学期、学分计入学位;"
              "ESLR 不适用:IT/国际商务/Journalism and Humanities/Media Production and Design/Public Affairs/"
              "post-bacc 文凭(CS·工程·理科不受限);2027 秋国际生主截止 **2027-04-01**、材料补交同;Prestige 奖 3/1;"
              "作品集/补充表类 3/5;")

# 5) 渥太华 EIP 下限精确化
UOT_DL_OLD = "⑤Fall 2027 国际生多数专业最终截止5月,校方明确建议勿等1/15后才递'"
UOT_DL_NEW = ("⑤Fall 2027 国际生多数专业最终截止5月,校方明确建议勿等1/15后才递;🆕2026-10-04(官方口径复核):"
              "EIP 密集英语项目**有条件录取下限为 IELTS 4.5**(此前本表记「4.0+」不够精确);"
              "**任一单项 <4.0 则申请直接不受理**;IELTS 6.0 → 入读本科正课 + 大一少量 ESL 选修;"
              "Duolingo 85+ 可匹配不同阶段 EIP;语言成绩 2 年有效、仅认考试中心官方电子送分、不接受自行上传'")

# 6) 约克 Schulich BBA 双轮
YORK_BIZ_OLD = "note:'Schulich难进',note_detail:''"
YORK_BIZ_NEW = ("note:'Schulich难进',note_detail:'🆕2026-10-04(官网 schulich.yorku.ca 实抓):Schulich BBA Fall 2027 "
                "**双轮制**——①早轮(可选)OUAC 2026-11-06 + 补充申请 2026-11-23 23:59 ET;②常规 OUAC 2027-01-15 + "
                "补充申请 2027-02-01 23:59 ET(**全部 Fall 2027 BBA 申请人同一截止**);校方明确**不递早轮不构成劣势**,"
                "早轮只影响审阅时点、不影响评审方式;补充申请 2026-11 开放;Delayed Entry(大二入学)2027-03-03'")

# 7) 版本头
VER_TEXT = ("// ▲本次更新(2026-10-04,覆盖 10/3–10/4 窗口): 今日**无院校录取 GPA/雅思门槛变动**;"
            "实质新增 = 多大工程「Track One」取消(官网确认) + 卡尔顿 ESLR 门槛精确化到单项并判定用户达标 + 量子工程新专业\n"
            "//   ①🎓**多大工程 2027 重大变更(官网 discover.engineering.utoronto.ca/programs 实抓确认)**：本科申请路径**只剩 Core 8 与 "
            "Engineering Science 两条**，**「Track One」已被取消**(官网项目页不再出现)。Core 8 = Chemical/Civil/Computer/Electrical/"
            "Industrial/Materials/Mechanical/Mineral(一校区仅可报 1 个)；EngSci 直入、前两年 Foundation + 后两年 9 大主修。\n"
            "//      另:工程学院新增辅修网络安全证书；工程**补充申请费 C$45.00**；补充申请 12/1(争 2 月首轮)、材料 1/15、建议 11/7 递 OUAC；宿舍保证 3/31 + 6/1。\n"
            "//   ②✅**卡尔顿 ESLR 门槛精确化(对本用户直接利好)**：官方两档＝直录 IELTS 6.5(各项≥6.0) / **ESLR 带语言条件录取 IELTS 5.0(各项≥4.5)**。"
            "ESLR 修 ESLA 1300/1500/1900 + 学位课(0.5–1.5 学分)，最长 3 学期、**学分计入学位**；"
            "**不适用** IT/国际商务/Journalism and Humanities/Media Production and Design/Public Affairs/post-bacc → **CS·工程·理科不受限**。"
            "⇒ 你 5.0(W5.5/R4.5/L4.5/S5.0)**各项均≥4.5，ESLR 达标**。⚠️中介「读写听三科平均≥5.0」口径下你 4.83 不达标——以官方口径为准。\n"
            "//   ③🆕**多大新增量子工程本科(Quantum Engineering)**：应用科学与工程学院，2027 秋首届、加拿大首个；⚠️中介口径，官网项目页暂未列出，待核实。\n"
            "//   ④🆕**渥太华 EIP 下限精确化**：有条件录取下限 **IELTS 4.5**(原表记 4.0+ 不精确)；**任一单项 <4.0 直接不受理**；IELTS 6.0 可正课 + 大一 ESL 选修。\n"
            "//   ⑤🆕**约克 Schulich BBA Fall 2027 双轮制**：早轮 OUAC 11/6 + 补充 11/23 23:59ET；常规 OUAC 1/15 + 补充 2/1 23:59ET；不递早轮不构成劣势；Delayed Entry 3/3。\n"
            "//   ⑥📊**10 校英语门槛 9/30 复核一致**(Stellar 逐校对照官方页)：多大/UBC/麦吉尔/滑铁卢/Western/麦马/皇后/约克/渥太华/TMU 均维持 IELTS 6.5 体系，无变动。\n"
            "//   ⑦⚠️**IRCC 2027–2029 Levels Plan 确认须于 2026-11-01 前提交议会**(预计 11 月初公布)：2027 学签新入境 150,000 仍为 notional；非永久居民占比目标 2027 底降至 <5%。\n"
            "//   ⑧📌**临期行动项**：多大 Pearson 提名 **10/9**(距今 5 天)、OUAC 入学申请 10/16、奖学金材料 11/6；UBC 国际学者 11/15；uOttawa 冬季 10/17。\n"
            "//   ⑨🇦🇺澳洲口径补充：UNSW Foundation 2027 Transition A$29,980 / Standard A$43,650 / Standard Plus A$48,750(入学 4&8 / 4&10 / 1&7 月)；"
            "UNSW College 学术英语 10 周 A$6,950；UQ College 2027 入学 2/15 与 9/6、标准预科 A$36,280、加速 A$27,490。\n"
            "//   ⑩📚中外合办增补(三·补七)：华东政法×西澳大学 2+2 等，详见 MD。")


def main():
    report = []
    for path in FILES:
        if not os.path.exists(path):
            report.append('NOFILE %s' % path)
            continue
        with io.open(path, encoding='utf-8') as f:
            s = f.read()
        orig = s

        # 院校块内补丁
        s = patch_block(s, '多大·圣乔治', [
            (UT_ENG_OLD, UT_ENG_NEW),
            (UT_CS_OLD, UT_CS_NEW),
            (UT_DL_OLD, UT_DL_NEW),
        ], report)

        s = patch_block(s, '卡尔顿', [
            ("dual_thr:'5.0+'", "dual_thr:'5.0(各项≥4.5)'"),
            ("note_detail:''", "note_detail:'" + CAR_ESLR_DETAIL + "'"),
            ("note:'与渥太华同城'", "note:'与渥太华同城;✅你 5.0(各项≥4.5)达标 ESLR'"),
            ("note:'Sprott商学院'", "note:'Sprott商学院;⚠️国际商务(International Business)不开放 ESLR'"),
            (CAR_DL_OLD, CAR_DL_NEW),
        ], report)

        s = patch_block(s, '渥太华', [
            ("dual_thr:'4.0+'", "dual_thr:'4.5+(单项<4.0不受理)'"),
            (UOT_DL_OLD, UOT_DL_NEW),
        ], report)

        s = patch_block(s, '约克', [
            (YORK_BIZ_OLD, YORK_BIZ_NEW),
        ], report)

        # 全局：日期 / 版本（先处理带版本摘要的注释行，再处理其余精确形式）
        s = patch_global(s, [
            ("// 最后更新: %s\n" % DATE_OLD,
             "// 最后更新: %s\n" % DATE_NEW + VER_TEXT + "\n"),
            ("最后更新：%s" % DATE_OLD, "最后更新：%s" % DATE_NEW),
            ("DATA_UPDATED = '%s'" % DATE_OLD, "DATA_UPDATED = '%s'" % DATE_NEW),
            (REV_OLD, REV_NEW),
        ], report)

        if s != orig:
            with io.open(path, 'w', encoding='utf-8') as f:
                f.write(s)
            report.append('WROTE %s' % path)
        else:
            report.append('UNCHANGED %s' % path)

    print('\n'.join(report))
    miss = [r for r in report if r.startswith('MISS')]
    print('\n== MISS COUNT: %d ==' % len(miss))
    return 0


if __name__ == '__main__':
    sys.exit(main())
