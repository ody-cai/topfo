#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""2026-10-08 日更补丁：data.js + master HTML（同一锚点集）"""
import sys, os

TARGETS = [
    "public/js/data.js",
    "加拿大大学录取要求对照表_2026.html",
]

P1 = ("仅需 12 年级英语+微积分、大一末才选专业',tuition:'42,000-68,750'",
      "仅需 12 年级英语+微积分、大一末才选专业"
      ";🆕2026-10-08(future.utoronto.ca/deadlines 官方**两张表当场实抓**，本轮 3 项):①✅**「Deadlines to apply」全量表实抓确认——所有本科项目申请截止一律 2027-01-15**(工程含IFP、建筑含IFP、A&S含IFP、iSchool、运动机能、音乐、UTM、UTSC、护理、医师助理)，**唯一例外 = Medical Radiation Sciences 申请截止 2027-02-01**;②✅材料截止表与补充申请表**逐项复核与现表完全一致**(材料:工程1/15、音乐1/15,建筑/Rotman/A&S–其余/iSchool/运动机能/UTM/UTSC=2/1;补充:工程OSP1/15、音乐问卷1/15,建筑One Idea/Rotman/CS/运动机能/UTSC=2/1);「早申材料建议 12/1」原文再次确认;③⚠️中介「多大文理学院 CS/人文/生命科学/社会科学/数理科学**申请**截止已延长至 2027-02-01」——**判定为把「材料截止 2/1」误读成「申请截止」，官方两轮实抓均无此延长，连续第 14 日不采纳**;注:CS 属 A&S–其余，申请 1/15、材料与补充申请 2/1"
      "',tuition:'42,000-68,750'")

P2 = ("安省高中生 5 月中前发完)',tuition:'40,000-48,000'",
      "安省高中生 5 月中前发完)"
      ";🆕2026-10-08(StudyU 滑铁卢 2027 页 + 官方口径交叉，本轮 4 项):①📅**2027 工程节点全量**:OUAC 申请 **2027-01-15**、AIF+线上视频面试+材料+语言成绩 **2027-02-01**、放榜 **2027-01 至 05**、接受 offer **2027-06-01**、宿舍申请+押金 **2027-06-08**;⚠️**同时申工程与数学院者，须按工程的 2/1 期限交齐全部材料(逾期表格不予审阅)**;一年级**仅 9 月入学**;②💰**2026 秋入学国际生首年学费(含杂费、两学期、满课)**:工程/软件工程 **C$75,000**、计算机科学 **C$73,000**、数学(16 主修)/数学·商/数学·CPA **C$62,000**、文科/会计与财务管理 **C$58,000**、理科/健康 **C$54,000**、环境 **C$51,000**;③🎓**理学院自动奖**:参加过 Sir Isaac Newton / Chem 13 News / Euclid 竞赛的录取者自动获 **C$1,000**;④语言口径复核一致:IELTS **6.5(写作与口语 6.5、阅读与听力 6.0)**或 **7.0(各项≥6.0)**;TOEFL 新制 4.5(写/说 5.0);DET 120(Literacy 与 Production 125);成绩须 **2025-05-01 及以后**考出、由考试机构直送"
      "',tuition:'40,000-48,000'")

P3 = ("2027 冬季国际生申请 **2026-10-15** / 语言 **2026-11-03**',tuition:'28,000-36,000'",
      "2027 冬季国际生申请 **2026-10-15** / 语言 **2026-11-03**"
      ";🆕2026-10-08(**TMU 语言通道官方费用首次入表**，StudyU 逐校页 2026-10-07 核对):💰**English Language Institute 四档定价**——**English Boost**(IELTS 6.0，8 周)= **CAD 9,895**(2027 秋价);**Pre-English Boost + English Boost**(5.5，16 周)= **CAD 14,954**;**ESL Foundation**(5.0–6.0，1–2 学期)= **CAD 16,900–32,900**(含最多 3 门学位学分课);**Pre-ESL Foundation + ESL Foundation**(**4.5**，**40 周**)= **CAD 37,499**(2027 冬季价);费用已含学费/教材/杂费/医保;**通道生同样需 PAL 与学签**;申请渠道与费用:**TMU 国际生直申 CAD 150**(仅 9 月/1 月，不走 OUAC)、经 OUAC 则按 OUAC 费率(前 3 志愿)"
      "',tuition:'28,000-36,000'")

P4 = ("亦可凭 AP英语(≥4) 或 IB英语A(HL/SL≥4) 满足',tuition:'26,000-34,000'",
      "亦可凭 AP英语(≥4) 或 IB英语A(HL/SL≥4) 满足"
      ";🆕2026-10-08(StudyU 卡尔顿 2027 页复核，本轮 3 项):①⏱️**出结果节奏**:材料齐备后通常 **4–6 周**、滚动录取;**一次只对 1 个专业发 offer**(按志愿顺序)，未达第一志愿可获**相关专业备选 offer**;②💰**申请费**:直接向卡尔顿申请 **CAD 100**(含 2 个专业志愿)、经 OUAC **CAD 166**(含 3 个志愿);③💰**国际生学费三档(冻结至 2028/29)**:文/认知科学/传播/经济/**健康科学**/人文/**数学**/**理科**/音乐/社工/国际研究/新闻/公共事务 = **CAD 39,000**;会计/商/国际商务/媒体制作 = **CAD 45,000**;**计算机科学/网络安全/数据科学/工程/工业设计/信息技术 = CAD 55,000**;杂费不在冻结范围(UHIP/U-Pass/健康服务/健身房)，2028 后预计年涨 3–8%;ESLR 通道口径与不适用专业清单本轮复核一致"
      "',tuition:'26,000-34,000'")

P5 = ("第三方口径另称 12/1 为「早申及奖学金」节点、3/1 为常规截止，与官网一致',tuition:'18,000-24,000'",
      "第三方口径另称 12/1 为「早申及奖学金」节点、3/1 为常规截止，与官网一致"
      ";🆕2026-10-08(官方奖学页面口径交叉，本轮 4 项):①💰**International Excellence Entrance Scholarship 门槛明确**——**C$25,000×1 名**需**五门认可高三课程均分≥90%** + 领导力与持续社区参与(**认可科目含数学/理科/计算机/语言/地理/历史/音乐/视觉艺术**);**C$10,000×2 名**仅需满足 University 1 或直接入系的最低录取要求;②📅**2026-12-01 是「全链路同日」节点**——奖学金申请 + 期中成绩单 + 推荐信 + **入学申请递交并缴费**均须在该日前完成;获奖 3 月中公布;③🎁**新增**:12/1 前递交并缴费的 Fall 2027 直入申请者**自动进入 C$5,000 学费抵扣抽奖**(国际生 5 名 + 本地生 5 名，随机抽取，形式为学费抵扣而非现金);④💰申请费 **C$130(国际生)/ C$100(本地)**;一般入学奖评审基准日 **2027-03-01**;英语门槛与双录口径本轮复核一致"
      "',tuition:'18,000-24,000'")

P6 = ("可填2个专业志愿,若先录第二志愿,新成绩到达后自动重新考虑第一志愿、无需重新申请',tuition:'26,000-32,000'",
      "可填2个专业志愿,若先录第二志愿,新成绩到达后自动重新考虑第一志愿、无需重新申请"
      ";🆕2026-10-08(ucalgary.ca/esl/acc 官方页实抓，本轮 3 项):📘**校内学术英语证书 ACC(Academic Communication Certificate)首次入表**——5 门课共 250 小时(EAP 220 学术写作/EAP 225 研究写作/EAP 230 批判性听力与笔记/EAP 235 口头表达/EAP 249 学术成功研讨);**准入**:完成 UCalgary ESL 6 级(ESL 100，各课≥B+)、或 IELTS **6.0(写作 6.0，其余≥5.5)**、DET **110(Production 100)**、TOEFL iBT 70(新制 4.0，写作≥20/4.0)、CAEL 60(写作 60);**2027 会期**:01-04→03-25、04-19→07-16、09-20→12-10(秋期仅开 3 门课，余课下期补);12 周以上会期含公交卡、国际生含紧急医保;⚠️ACC 为校内学术英语证书课程，**不等同于有条件录取承诺**，入学仍走常规申请通道;直录/双录口径本轮复核一致"
      "',tuition:'26,000-32,000'")

PATCHES = [("多大·圣乔治", P1), ("滑铁卢", P2), ("TMU", P3), ("卡尔顿", P4), ("曼尼托巴", P5), ("卡尔加里", P6)]

def apply_scoped(text, anchor, insert, scope=None):
    """scope 非 None 时，仅在 {name:'<scope>'} 起的区间内替换"""
    if scope is None:
        if text.count(anchor) != 1:
            return text, "AMBIG:%d" % text.count(anchor)
        return text.replace(anchor, insert), "HIT"
    start = text.find("{name:'" + scope)
    if start < 0:
        return text, "SCOPE-NOTFOUND"
    nxt = text.find("{name:'", start + 8)
    end = nxt if nxt > 0 else len(text)
    seg = text[start:end]
    if seg.count(anchor) != 1:
        return text, "AMBIG-IN-SCOPE:%d" % seg.count(anchor)
    seg = seg.replace(anchor, insert)
    return text[:start] + seg + text[end:], "HIT"

def main():
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    total_miss = 0
    for t in TARGETS:
        if not os.path.exists(t):
            print("!! missing %s" % t); total_miss += 1; continue
        s = open(t, encoding="utf-8").read()
        log = []
        for scope, (anchor, insert) in PATCHES:
            s, st = apply_scoped(s, anchor, insert, scope=scope)
            log.append("%s=%s" % (scope, st))
            if st != "HIT":
                total_miss += 1
        open(t, "w", encoding="utf-8").write(s)
        print("[%s] %s" % (t, " | ".join(log)))
    print("TOTAL_MISS=%d" % total_miss)
    sys.exit(1 if total_miss else 0)

if __name__ == "__main__":
    main()
