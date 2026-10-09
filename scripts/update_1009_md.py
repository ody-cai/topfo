#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""2026-10-09 日更补丁：Markdown 完整对照表"""
import sys, os

MD = "加拿大大学录取要求完整对照表_2026.md"

R = []

# 1. 表头日期
R.append((
    "# 最后更新：2026-10-08",
    "# 最后更新：2026-10-09",
))

# 2. UTSC 表行（❌ -> ✅ AE）
R.append((
    "| 6.5(6.0) | ❌ | — | UTSC无Engineering本科；心理学GPA绰绰有余且有Co-op |",
    "| 6.5(6.0) | **✅(AE)** | **5.5(写作5.5/单项≥5.0)** | UTSC无Engineering本科；心理学GPA绰绰有余且有Co-op。"
    "**🆕2026-10-09 重大更正（官方 `utsc.utoronto.ca/admissions/about-academic-english` 实抓）**："
    "**UTSC 有语言班 AE（Academic English）—— 此前本表记「UTSC 无双录取／无语言班」有误**。"
    "AE 为**夏季 8 周**课程（2026 年 7/2–8/21；注册截止 6/5、缴费 6/12），由 CTL 授课，面向**已获 UTSC 有条件录取**者；"
    "**完成且成绩 ≥B 即满足英语条件、当年 9 月入正课**；**邀请制（invitation only）**，须先申 UTSC 专业并由校方邀请，不能单独报名。"
    "**门槛：IELTS 5.5（写作 ≥5.5、任何单项不低于 5.0）**；TOEFL iBT 新制 3.5（写作 3.5／口语 3.0／无单项<3.0）、Duolingo 105（Production 105）、"
    "PTE 55（无项<50）、CAEL 50（各项 50）、IB English B HL 5、IGCSE/O-Level English C。"
    "**费用：国际生面授 C$8,200／线上 C$8,050**（线上档适用于 6/5 前未获学签者）；7/8 前退课可退费但扣 C$1,500 押金。"
    "⚠️**你若把听力与阅读各提 0.5（→5.0），总分 5.5 且写作已 5.5 ⇒ 恰好达标 UTSC AE** |",
))

# 3. UTM 表行 —— 双录列
R.append((
    "| 6.5(6.0) | ✅(IFP@UTM) | **待公布**（参照UTSG IFP: 5.0-6.5/写作5.5/单项≥5.0） |",
    "| 6.5(6.0) | **✅(IFP@UTM / ACE@UTM)** | **ACE@UTM：夏季 5.5(单项≥5.0)／秋冬 6.0(单项≥5.5)**；IFP@UTM 门槛待公布 |",
))
R.append((
    "**此前「UTSC/UTM 均无语言班」对 UTM 已不成立**（UTSC 仍无） |",
    "**此前「UTSC/UTM 均无语言班」对两个校区都已不成立**"
    "（UTSC 现有 AE 夏季语言班、UTM 现有 ACE@UTM，见各自条目）。"
    "**🆕2026-10-09 补全既有通道**：**UTM 除 2027-09 首开的 IFP@UTM 外，另有既有的 ACE@UTM（Academic Culture and English）** —— 两者并存，此前本表只记了 IFP。"
    "ACE@UTM **为邀请制（非申请制）**，面向已获 UTM 录取但英语未达标者；语言部分即 **Academic English Level 60**，由多大继续教育学院 ELP 师资授课。"
    "**两档**：①**Summer ACE@UTM = 8 周**（7 月初–8 月底全日制），门槛 **IELTS 5.5（无单项<5.0）**、Duolingo 105（Production 105）、PTE 45（各项 40）；"
    "②**Fall-Winter ACE@UTM = 24 周**（9 月–次年 4 月，边修 3.0 学分学位课边修语言），门槛 **IELTS 6.0（无单项<5.5）**、Duolingo 110（Production 110）、PTE 55（各项 50）。"
    "完成 Summer 档且 ≥B 即可当年 9 月全日制入学；Fall-Winter 档达 B 且学位课 CGPA ≥1.5 即解除条件，语言课获 C 或以下则 offer 被撤回。"
    "⚠️**Summer 档卡在你听/读两个 4.5 上——听读各提 0.5 即达标（写作 5.5 已够）** |",
))

# 4. 维多利亚 表行
R.append((
    "| **维多利亚** | 80-85% | 80-85% | 75-80% | 75-80% | 6.5(6.0) | ✅ | **UAP:6.0(5.5) / 桥梁:5.5(5.0)** | "
    "**🆕复核**: 直录6.5(单项≥6.0)；有条件录取UAP 6.0(5.5)；桥梁课程5.5(5.0)。9月入学截止**1/31**(冬季9/30、夏季3/31) |",
    "| **维多利亚** | 80-85% | 80-85% | 75-80% | 75-80% | 6.5(6.0) | ✅ | "
    "**UAP:6.0(无单项<5.5) / ELPI初步录取(最长24个月):5.5(5.0)中介口径待核实** | "
    "**🆕2026-10-09（官方 `uvic.ca/undergraduate/admissions/language-requirements` 实抓，本轮 6 项）**："
    "①⭐**UVic 接受 IELTS One Skill Retake** —— 本科官方页明确列示，**One Skill Retake 接受名单再增一所**"
    "（现为 **滑铁卢／麦马／曼尼托巴／约克／渥太华／UVic**；❌多大三校区／UBC／麦吉尔／阿尔伯塔），同时接受 **TOEFL MyBest 拼分**；"
    "②🎯**有条件录取（conditional admission）官方口径与可申专业清单首次入表**：可条件录取的院系 = **Business／Engineering and Computer Science／"
    "Fine Arts／Humanities／Science／Social Sciences** —— **即完整覆盖你的 CS／理科方向**，注册学位课不受限，但须在 offer 邮件指定日期前满足语言要求；"
    "③**条件录取门槛 = IELTS 6.0（无单项<5.5）**／TOEFL 79（17）或新制 4.0（3.5）／Duolingo 110（100）／CAEL 60（50）／PTE 54（50）／MET 58（53）；"
    "④**ELC 初步录取（ELC preliminary admission）**给最多 **24 个月**满足语言要求、之后**无需重新申请**即可入本科，经校内 **ELPI（密集英语）** 注册；"
    "⚠️官方页**未公布 ELPI 的雅思下限**，中介口径的 5.5（5.0）列为待核实；"
    "⑤💰**申请费 C$184**；2027-28 国际生学费估算：多数专业约 **C$37,575**、**计算机科学 C$43,292**、**工程 C$50,058**；"
    "一年级**宿舍保证申请截止 2027-02-15**；"
    "⑥**语言豁免口径**：加拿大 12 年级英语最终 **≥86%（近三年内）**、IB HL English A ≥4、AP English ≥4、A-Level English C、O-Level English B(6)、"
    "或在全英文全日制体系读满 4 年。直录复核一致：IELTS 6.5（无单项<6.0）、TOEFL iBT 88（20）或新制 4.5（4.0）、DET 120（110）、CAEL 70（60）、PTE 65（60）。"
    "9月入学截止**1/31**（冬季 9/30、夏季 3/31） |",
))

# 5. 约克 表行尾部追加
R.append((
    "**护理Fall 2027**仅对加公民/PR/受保护人士及目前在安省高中就读的国际生(<21岁)开放 |",
    "**护理Fall 2027**仅对加公民/PR/受保护人士及目前在安省高中就读的国际生(<21岁)开放。"
    "**🆕2026-10-09（两份独立中文口径交叉，⚠️中介口径、待官网核实，本轮 3 项）**："
    "①🏠**2027 年秋季入学的国际新生获「连续 4 年校内住宿保证」** —— 加拿大名校中罕见；**且无需录取通知书即可先申请住宿**；"
    "⚠️**该保证仅限 2027 秋入读学生，不可顺延至未来学期**；"
    "②🎓**President’s International Scholarship of Excellence（PISE）首次入表**：**CAD 45,000/年 × 4 年 = 总计 CAD 180,000**"
    "（可续期，须每年保持良好学业成绩）；**申请窗口 2026-11-02 → 2027-01-27**、**提名截止 2027-02-04**、结果 2027-03 发出；"
    "⚠️**每所中学每年最多提名 2 人、不可自荐**，须最终录取均分 **≥80%** 且具领导力／社区服务／艺术体育成就；"
    "申请奖学须先有 **9 位 York reference number**（建议 **2027-01-19** 前递入学申请）；⚠️**计算机科学／网络安全／工程专业不适用该卓越奖**"
    "（90%+ 自动获约克国际优秀奖）。另：普通国际生入学奖窗口 11/1–1/27（90%+ 约 $37,500／80–89.9% $25,000／75–79.9% $5,000）；"
    "③**Integrated Year One** —— 部分文理学院项目可申请，**大一同步修学位学分＋语言**，**雅思 5.5–6.0 可申请**，完成即无缝升大二（你 5.0 暂差 0.5–1.0） |",
))


def main():
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    s = open(MD, encoding="utf-8").read()
    miss = 0
    for i, (a, b) in enumerate(R, 1):
        n = s.count(a)
        if n != 1:
            print("  R%d MISS/AMBIG count=%d :: %s" % (i, n, a[:70]))
            miss += 1
            continue
        s = s.replace(a, b)
        print("  R%d HIT" % i)
    open(MD, "w", encoding="utf-8").write(s)
    print("MISS=%d" % miss)
    sys.exit(1 if miss else 0)


if __name__ == "__main__":
    main()
