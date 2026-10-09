#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""2026-10-09 日更补丁：data.js + master HTML（同一锚点集）"""
import sys, os

TARGETS = [
    "public/js/data.js",
    "加拿大大学录取要求对照表_2026.html",
]

# ---------- A. UTSC deadline ----------
A_OLD = "deadline:'2027季:申请1/15(推荐早申11/7);材料2/1;补充(部分专业)2/1',tuition:'67,700'"
A_NEW = ("deadline:'2027季:申请1/15(推荐早申11/7);材料2/1;补充(部分专业)2/1"
         ";🆕2026-10-09(官方 utsc.utoronto.ca/admissions/about-academic-english 实抓，⚠️重大更正):**UTSC 有语言班 AE(Academic English)——此前本表记「UTSC 无双录取／无语言班」有误**。AE 为**夏季 8 周**课程(2026 年 7/2–8/21；注册截止 6/5、缴费 6/12)，面向**已获 UTSC 有条件录取**者，由 CTL 授课；**完成且成绩 ≥B 即满足英语条件、当年 9 月入正课**；**invitation only**(须先申 UTSC 专业、由校方发出邀请，不能单独报名)。**门槛:IELTS 5.5(写作 ≥5.5、任何单项不低于 5.0)**；TOEFL iBT 新制 3.5(写作 3.5／口语 3.0／无单项<3.0)、Duolingo 105(Production 105)、PTE 55(无项<50)、CAEL 50(各项 50)、IB English B HL 5、IGCSE/O-Level English C。**费用:国际生面授 C$8,200／线上 C$8,050**(线上档适用于 6/5 前未取得学签者)；7/8 前退课可退费但扣 C$1,500 押金。⚠️**你若把听力与阅读各提 0.5(→5.0)，总分 5.5 且写作已 5.5 ⇒ 恰好达标 UTSC AE**'"
         ",tuition:'67,700'")

# ---------- B. UTSC eng 子对象（去掉 dual:'no' 以免被后续批量替换误伤） ----------
B_OLD = "eng:{gpa:'—',label:'na',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'无传统工程',note_detail:'UTSC无Engineering本科'}"
B_NEW = "eng:{gpa:'—',label:'na',ielts:'6.5(6.0)',dual:'na',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'无传统工程',note_detail:'UTSC无Engineering本科'}"

# ---------- C. UTSC 其余 7 个专业：dual no -> yes（AE 通道，作用域内批量） ----------
C_OLD = "dual:'no',dual_type:'—',dual_thr:'—'"
C_NEW = "dual:'yes',dual_type:'AE(Academic English,夏季8周)',dual_thr:'5.5(写作5.5/单项≥5.0)'"

# ---------- D. UTM dual_type / dual_thr（全库唯一，7 处） ----------
D1_OLD = "dual_type:'IFP@UTM(2027-09首开)'"
D1_NEW = "dual_type:'IFP@UTM(2027-09首开)/ACE@UTM'"
D2_OLD = "dual_thr:'待公布(参照UTSG IFP:5.0-6.5/写作5.5/单项≥5.0)'"
D2_NEW = "dual_thr:'ACE@UTM:夏季5.5(单项≥5.0)/秋冬6.0(单项≥5.5);IFP@UTM待公布'"

# ---------- E. UTM deadline 追加 ACE 说明 ----------
E_OLD = "桥接通道(Bridging)/难民通道(Refugee)2027年3月初开放',tuition:'67,700'"
E_NEW = ("桥接通道(Bridging)/难民通道(Refugee)2027年3月初开放"
         ";🆕2026-10-09(⚠️**补全既有通道**):**UTM 除 2027-09 首开的 IFP@UTM 外，另有既有的 ACE@UTM(Academic Culture and English)** —— 两者并存，此前本表只记了 IFP。ACE@UTM **为邀请制(invitation only，非申请制)**，面向已获 UTM 录取但英语未达标者；语言部分即 Academic English Level 60，由多大继续教育学院 ELP 师资授课。**两档**:①**Summer ACE@UTM = 8 周**(7 月初–8 月底全日制)，门槛 **IELTS 5.5(无单项<5.0)**、Duolingo 105(Production 105)、PTE 45(各项 40)；②**Fall-Winter ACE@UTM = 24 周**(9 月–次年 4 月，边修 3.0 学分学位课边修语言)，门槛 **IELTS 6.0(无单项<5.5)**、Duolingo 110(Production 110)、PTE 55(各项 50)。完成 Summer 档且 ≥B 即可当年 9 月全日制入学；Fall-Winter 档达 B 且学位课 CGPA ≥1.5 即解除条件，若语言课获 C 或以下则 offer 被撤回。⚠️**Summer 档卡在你听/读两个 4.5 上——听读各提 0.5 即达标（写作 5.5 已够）**'"
         ",tuition:'67,700'")

# ---------- F. 维多利亚 deadline 追加 ----------
F_OLD = "deadline:'9月入学1/31;冬季9/30;夏季3/31',tuition:'26,000-32,000'"
F_NEW = ("deadline:'9月入学1/31;冬季9/30;夏季3/31"
         ";🆕2026-10-09(官方 uvic.ca/undergraduate/admissions/language-requirements 实抓，本轮 6 项):①⭐**UVic 接受 IELTS One Skill Retake** —— 本科官方页明确列示，**One Skill Retake 接受名单再增一所**(现为 **滑铁卢／麦马／曼尼托巴／约克／渥太华／UVic**；❌多大三校区／UBC／麦吉尔／阿尔伯塔)，同时接受 **TOEFL MyBest 拼分**；②🎯**有条件录取(conditional admission)官方口径与可申专业清单首次入表**:可条件录取的院系 = **Business／Engineering and Computer Science／Fine Arts／Humanities／Science／Social Sciences** —— **即完整覆盖你的 CS／理科方向**，注册学位课不受限，但须在 offer 邮件指定日期前满足语言要求；③**条件录取门槛 = IELTS 6.0(无单项<5.5)**／TOEFL 79(17) 或新制 4.0(3.5)／Duolingo 110(100)／CAEL 60(50)／PTE 54(50)／MET 58(53)；④**ELC 初步录取(ELC preliminary admission)**给最多 **24 个月**满足语言要求、之后**无需重新申请**即可入本科，经校内 **ELPI(密集英语)** 注册；⚠️官方页**未公布 ELPI 的雅思下限**，中介口径的 5.5(5.0) 列为待核实；⑤💰**申请费 C$184**；2027-28 国际生学费估算:多数专业约 **C$37,575**、**计算机科学 C$43,292**、**工程 C$50,058**；一年级**宿舍保证申请截止 2027-02-15**；⑥**语言豁免口径**:加拿大 12 年级英语最终 **≥86%(近三年内)**、IB HL English A ≥4、AP English ≥4、A-Level English C、O-Level English B(6)、或在全英文全日制体系读满 4 年。直录复核一致:IELTS 6.5(无单项<6.0)、TOEFL iBT 88(20) 或新制 4.5(4.0)、DET 120(110)、CAEL 70(60)、PTE 65(60)、MET 64、Cambridge 180(170)'"
         ",tuition:'26,000-32,000'")

# ---------- G. 维多利亚 dual_thr（作用域内 8 处） ----------
G_OLD = "dual_thr:'UAP:6.0(5.5)/桥梁:5.5(5.0)'"
G_NEW = "dual_thr:'UAP:6.0(无单项<5.5)/ELPI初步录取(最长24个月):5.5(5.0)中介口径待核实'"

# ---------- H. 约克 deadline 追加 ----------
H_OLD = ("deadline:'滚动;2027国际生入学奖11/1-1/27;Winter 2027申请截止11/18;✅2026-09-23升级为多来源一致:"
         "Fall 2027国际生截止3/24(第三独立来源复核;各专业实际截止以 yorku.ca 逐专业页为准,建议提前一个月递交)',"
         "tuition:'26,000-34,000'")
H_NEW = ("deadline:'滚动;2027国际生入学奖11/1-1/27;Winter 2027申请截止11/18;✅2026-09-23升级为多来源一致:"
         "Fall 2027国际生截止3/24(第三独立来源复核;各专业实际截止以 yorku.ca 逐专业页为准,建议提前一个月递交)"
         ";🆕2026-10-09(两份独立中文口径交叉，**中介口径，待官网核实**，本轮 3 项):①🏠**2027 年秋季入学的国际新生获「连续 4 年校内住宿保证」** —— 加拿大名校中罕见;**且无需录取通知书即可先申请住宿**(须在期限内提交住宿申请)；⚠️**该保证仅限 2027 秋入读学生，不可顺延至未来学期**;②🎓**President’s International Scholarship of Excellence(PISE)首次入表**:**CAD 45,000/年 × 4 年 = 总计 CAD 180,000**(总统级国际生卓越奖，可续期，须每年保持良好学业成绩)；**申请窗口 2026-11-02 → 2027-01-27**、**提名截止 2027-02-04**、结果 2027-03 发出；⚠️**每所中学每年最多提名 2 人、不可自荐**，须最终录取均分 **≥80%** 且具领导力／社区服务／艺术体育成就；申请奖学须先有 **9 位 York reference number**(建议 **2027-01-19** 前递入学申请)；⚠️**计算机科学／网络安全／工程专业不适用该卓越奖**(90%+ 自动获约克国际优秀奖)；另:普通国际生入学奖窗口 11/1–1/27(90%+ 约 $37,500／80–89.9% $25,000／75–79.9% $5,000)；③**Integrated Year One** —— 部分文理学院项目可申请，**大一期间同步修学分＋语言**，**雅思 5.5–6.0 可申请**，完成即无缝升大二(你 5.0 暂差 0.5–1.0)'"
         ",tuition:'26,000-34,000'")

# ---------- I. 约克 sci note_detail（Integrated Year One 落到专业行） ----------
I_SCOPE = "约克"
I_OLD = "sci:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'YUELI',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''}"
I_NEW = "sci:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'YUELI/Integrated Year One',dual_thr:'YUELI:5.0+；Integrated Year One:5.5–6.0(待官网核实)',coop:'no',coop_note:'',note:'',note_detail:'🆕2026-10-09(中介口径×2，待官网核实):**Integrated Year One** —— 理学院／文理学院部分项目可申请，大一同步修学位学分＋语言课，**雅思 5.5–6.0 可申请**，完成后无缝进入大二，无需重考雅思；你当前 5.0 差 0.5–1.0，与「听读各提 0.5」的备考动作目标一致。另:2027 秋入学国际新生获**连续 4 年校内住宿保证**(仅限 2027 秋、不可顺延，无需 offer 即可先申请)'}"

# ---------- J. 版本与日期 ----------
J_LIST = [("// delpoy_rev_10107", "// delpoy_rev_10109"),
          ("// 最后更新: 2026-10-08", "// 最后更新: 2026-10-09")]

PATCHES = [
    (None, 1, (A_OLD, A_NEW), "UTSC.deadline"),
    ("多大·士嘉堡(UTSC)", 1, (B_OLD, B_NEW), "UTSC.eng"),
    ("多大·士嘉堡(UTSC)", 7, (C_OLD, C_NEW), "UTSC.dual"),
    (None, 7, (D1_OLD, D1_NEW), "UTM.dual_type"),
    (None, 7, (D2_OLD, D2_NEW), "UTM.dual_thr"),
    (None, 1, (E_OLD, E_NEW), "UTM.deadline"),
    (None, 1, (F_OLD, F_NEW), "UVic.deadline"),
    ("维多利亚", 8, (G_OLD, G_NEW), "UVic.dual_thr"),
    (None, 1, (H_OLD, H_NEW), "York.deadline"),
    (I_SCOPE, 1, (I_OLD, I_NEW), "York.sci"),
]


def apply_scoped(text, anchor, insert, scope=None, count=None):
    """scope 非 None 时，仅在 {name:'<scope>'} 起的区间内替换；count 指定预期替换次数"""
    if scope is None:
        n = text.count(anchor)
        exp = 1 if count is None else count
        if n != exp:
            return text, "AMBIG:%d" % n
        return text.replace(anchor, insert), "HIT"
    start = text.find("{name:'" + scope)
    if start < 0:
        return text, "SCOPE-NOTFOUND"
    nxt = text.find("{name:'", start + 8)
    end = nxt if nxt > 0 else len(text)
    seg = text[start:end]
    n = seg.count(anchor)
    exp = 1 if count is None else count
    if n != exp:
        return text, "AMBIG-IN-SCOPE:%d" % n
    seg = seg.replace(anchor, insert)
    return text[:start] + seg + text[end:], "HIT"


def main():
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    total_miss = 0
    for t in TARGETS:
        if not os.path.exists(t):
            print("!! missing %s" % t)
            total_miss += 1
            continue
        s = open(t, encoding="utf-8").read()
        log = []
        for scope, cnt, (anchor, insert), label in PATCHES:
            s, st = apply_scoped(s, anchor, insert, scope=scope, count=cnt)
            log.append("%s=%s" % (label, st))
            if st != "HIT":
                total_miss += 1
        # 版本与日期
        for a, b in J_LIST:
            if a in s:
                s = s.replace(a, b)
                log.append("rev/date=HIT")
        open(t, "w", encoding="utf-8").write(s)
        print("[%s] %s" % (t, " | ".join(log)))
    print("TOTAL_MISS=%d" % total_miss)
    sys.exit(1 if total_miss else 0)


if __name__ == "__main__":
    main()
