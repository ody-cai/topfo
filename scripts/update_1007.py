# -*- coding: utf-8 -*-
"""2026-10-07 日更：院校数据补丁（作用于 升学/public/js/data.js + 升学/加拿大大学录取要求对照表_2026.html）
所有补丁采用「唯一长串锚点」替换，逐条报告 HIT/MISS。
"""
import sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGETS = [
    os.path.join(ROOT, 'public', 'js', 'data.js'),
    os.path.join(ROOT, '加拿大大学录取要求对照表_2026.html'),
]

# ---------- R1 渥太华 ----------
A_OTT = "语言成绩 2 年有效、仅认考试中心官方电子送分、不接受自行上传',tuition:'32,000-40,000'"
N_OTT = ("语言成绩 2 年有效、仅认考试中心官方电子送分、不接受自行上传;"
         "🆕2026-10-07(官方 eip.uottawa.ca 实抓 + 逐校对照复核，本轮 5 项):"
         "①💰**EIP(English Intensive Program)官方费用与会期首次入表**——**每期 CAD 6,985**"
         "(另计 UHIP 医保 C$316 + U-Pass C$240.67 + 申请费 C$100;10% 学费折扣后 **C$6,286.50**);"
         "轮次：Fall 2026 9/9–12/11、**Winter 2027 1/12–4/16**、Spring-Summer 2027 5/11–8/13、Fall 2027 9/8–12/10;"
         "**学费须开课首日全额缴清**;②**直录口径精确到写作**：IELTS **6.5 且写作 ≥6.5**、TOEFL 新制 4.5(写作 4.5)、"
         "Duolingo 120、PTE 60(写作 60)、CAEL 60(四项均 ≥60)、Cambridge 180;"
         "③⚠️**确认接受 IELTS One Skill Retake**(对你关键：可只补听力/阅读两科，与滑铁卢/麦马/曼尼托巴/约克同档);"
         "④**PAL 时点**：缴清不可退押金后约 **3 个工作日**发出(境外汇款最长约 14 个工作日到账)——签证链路需按此排期;"
         "⑤**国际生不能春季/夏季入学**;2027 多数专业对国际生 **5 月**关闭;"
         "2026/27 国际学费 **C$43,335(文/社科/理)–C$63,164(工程与 CS)/年**;一年级宿舍含餐 C$16,403–18,733(8 个月)")

# ---------- R2 UBC ----------
A_UBC = "接受offer截止:2027-05-01 或 2027-06-01(以录取信注明为准)',tuition:'40,000-48,000'"
N_UBC = ("接受offer截止:2027-05-01 或 2027-06-01(以录取信注明为准);"
         "🆕2026-10-07(官网 you.ubc.ca/dates-deadlines 实抓复核，新增 6 项):"
         "①**UBC International Scholars 2027 已于 2026-10-05 开放**——申请与奖项申请须**同日**于 **2026-11-15 23:59 PST** 前完成;"
         "②**2026-12-01** 加拿大公民/PR 申请截止(用于 Presidential Scholars / Centennial Scholars Entrance Award / "
         "Beyond Tomorrow Scholars Award 的评审资格);"
         "③**2027-05-01 一年级宿舍保证申请截止**——温哥华与奥卡纳根两校区**须分别**提交住宿申请;"
         "④**2027-05-15** 加拿大大学申请者最终成绩单、**2027-06-30** 美国申请者最终成绩单、**2027-08-20** A-Level 成绩截止;"
         "⑤国际生申请费 **CAD 173.25**(需学签者);"
         "⑥⚠️2027/2028 冬季学期语言成绩须为 **2025-01-01 之后**考出(更早作废);"
         "⑦Vantage One Excellence Award 可覆盖全额学费+生活费',tuition:'40,000-48,000'")

# ---------- R3 多大·圣乔治 ----------
A_UTSG = "**待官方确认**',tuition:'42,000-62,000'"
N_UTSG = ("**待官方确认**;"
          "🆕2026-10-07(future.utoronto.ca/deadlines 官方实抓复核 + 学费报告第三方核校，本轮 5 项):"
          "①✅**官方明确\"早申材料截止 = December 1\"**——即 11/7 前递 OUAC 者建议 **2026-12-01** 前交齐可用材料;"
          "新东方系\"12/2\"口径**不采纳(连续第 13 日)**;"
          "②官方**文档表 + 补充申请表两张表 10-07 再次实抓，与现表逐项一致**(材料：工程 1/15、音乐 1/15，"
          "建筑/A&S–Rotman/A&S–其余/iSchool/运动机能/UTM/UTSC 均 2/1;补充：工程 OSP 1/15、音乐问卷 1/15，"
          "建筑 One Idea/Rotman/CS/运动机能/UTSC 均 2/1);"
          "③💰**2027 入学国际生 Arts&Science 学费 $68,750/年**(2026 入学 $66,110);本地生 A&S $6,220、非安省加拿大 $7,610;"
          "④🎓**自动入学奖两档首次入表**：**Scholars Program 约 900 份 × CAD 10,000/一年级生(按录取均分自动发)**、"
          "**President’s Scholars of Excellence 约 150 人 × CAD 15,000/一年级生(自动)**;"
          "⑤Life Sciences 录取区间 **中-高 80s**、OUAC 代码 **TLG**、**无补充申请**、仅需 12 年级英语+微积分、大一末才选专业',"
          "tuition:'42,000-68,750'")

# ---------- R4 TMU ----------
A_TMU = "CS 公布区间 75–80%(全校最低档之一)',tuition:'28,000-36,000'"
N_TMU = ("CS 公布区间 75–80%(全校最低档之一);"
         "🆕2026-10-07(StudyU 逐校页 + TMU 官方语言通道页复核，新增 4 项):"
         "①🎓**国际生两项大奖首次入表**：**International Student Leadership Award (ISLA) CAD 10,000 一次性、最多 53 人**;"
         "**President’s Entrance Scholarship CAD 10,000/年、4 年最高 CAD 40,000、12 人**(获此奖者**自动预留宿舍房间**，租金照付);"
         "②语言通道开班期明确：**2027-01-11 → 2027-04-30**(ESL Foundation 或 Pre-English Boost + English Boost)，"
         "可就 2027 年 9 月正课无缝衔接;通道生同样**需要 PAL 与学签**;"
         "③大学直录 IELTS **6.5(无单项最低要求**，接受 One Skill Retake 与 IELTS Online);"
         "④Fall 2027 语言成绩最后提交日 **2027-04-01**;2027 冬季国际生申请 **2026-10-15** / 语言 **2026-11-03**',"
         "tuition:'28,000-36,000'")

# ---------- R5 阿尔伯塔 OSR 名单补 渥太华 ----------
A_OSR = "(对比:滑铁卢/麦马/曼尼托巴/约克接受;多大/UBC/麦吉尔不接受)"
N_OSR = "(对比:滑铁卢/麦马/曼尼托巴/约克/渥太华接受;多大/UBC/麦吉尔不接受)"

PATCHES = [
    ("R1 渥太华 EIP/PAL/OSR", A_OTT, N_OTT),
    ("R2 UBC 全量节点补全", A_UBC, N_UBC),
    ("R3 多大 UTSG 早申材料/学费/自动奖", A_UTSG, N_UTSG),
    ("R4 TMU 奖项/语言通道/截止", A_TMU, N_TMU),
    ("R5 阿尔伯塔 OSR 名单更正", A_OSR, N_OSR),
]

def run():
    total_miss = 0
    for path in TARGETS:
        if not os.path.exists(path):
            print("!! MISSING FILE:", path); total_miss += 1; continue
        s = open(path, encoding='utf-8').read()
        print("=== " + path)
        for label, a, n in PATCHES:
            c = s.count(a)
            if c == 1:
                s = s.replace(a, n)
                print("   HIT  " + label)
            else:
                print("   MISS(%d) %s" % (c, label)); total_miss += 1
        open(path, 'w', encoding='utf-8').write(s)
    print("\nTOTAL MISS = %d" % total_miss)
    return total_miss

if __name__ == '__main__':
    sys.exit(1 if run() else 0)
