# -*- coding: utf-8 -*-
"""2026-10-11 日更补丁：data.js + master HTML（共用同一院校数据文本串）
只做院校行补丁；DATA_UPDATED / rev 另行处理。
所有英文所有格一律用弯引号 U+2019，避免 node --check 语法错误。
"""
import io, os, sys, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES = [
    os.path.join(ROOT, 'public', 'js', 'data.js'),
    os.path.join(ROOT, '加拿大大学录取要求对照表_2026.html'),
]

PATCHES = []

# R1 多大·圣乔治 —— 官方三张表第 5 次实抓复核
PATCHES.append((
    'R1 多大 deadlines 复核',
    '接受 offer 在 OUAC 完成、不早于 **2027-06-01**',
    '接受 offer 在 OUAC 完成、不早于 **2027-06-01**；'
    '🆕2026-10-11（`future.utoronto.ca/deadlines` 官方源码级第 5 次实抓复核）：「Deadlines to apply（2027）」'
    '「Deadlines to submit supporting documentation」「Deadlines to submit supplemental applications」'
    '三张表**逐项与现表零差异（连续第 5 轮）**——网申统一 **1/15**（推荐早申 11/7）；'
    '材料：工程 1/15、音乐 1/15、建筑／A&S–Rotman／A&S–其余／iSchool／运动机能／UTM／UTSC 均 **2/1**；'
    '补充：工程 ESA **1/15**、音乐问卷 **1/15**、建筑 One Idea／Rotman／CS（Join U of T 内四道不计时短答）／'
    '运动机能 Statement of Interest／UTSC SAF（部分专业必交）均 **2/1**；'
    '官方页并明确「**早申（11/7 前递交）者请于 12/1 前提交可得材料**」'
))

# R2 UBC·温哥华 —— International Scholars 细则
PATCHES.append((
    'R2 UBC ISP 细则',
    '⑦Vantage One Excellence Award 可覆盖全额学费+生活费',
    '⑦Vantage One Excellence Award 可覆盖全额学费+生活费；'
    '🆕2026-10-11（UBC International Scholars 官方页复核，第四来源）：'
    '①ISP 申请已于 **2026-10-05 开放**，**申请与奖项申请须同日于 2026-11-15 23:59 PST 前完成**；'
    '②**入学材料与英语成绩截止 2027-01-31**（与已记 ISP 语言节点一致）；'
    '③资格门槛：须为「直接自中学升入首个本科学位」、**高中须 2026 年 6 月或之后毕业**、'
    '**全 A 或同等学术水平**、须证明显著经济需求（家庭无力承担大部分费用）；'
    '④⚠️**ISP 申请人被自动排除在 IMES（国际主要入学奖）与 OIS（杰出国际生奖）之外**——两条线不可兼得；'
    '⑤不适用 ISP 的专业：两校区 Bachelor of Nursing、Dental Hygiene、Medical Laboratory Science、'
    'Bachelor+Master of Management、双学位及校际联合学位；'
    '⑥🎓**Vantage One Excellence Award 可覆盖全额学费+生活费**（走 Vantage 通道者仍须先满足 Vantage 英语门槛 5.5）；'
    '⑦免考口径：CBSE/ISC 体系学生 **Class 12 English ≥75%** 可免语言考试（中加学籍不适用）'
))

# R3 阿尔伯塔 —— 时间线第三来源复核 + 口语 7.5
PATCHES.append((
    'R3 阿尔伯塔时间线',
    '学费:国际生工程**保证 C$49,953/年**(2026 Fall 入学口径)，**2027 Fall 新入学国际生上调 5.5%**',
    '学费:国际生工程**保证 C$49,953/年**(2026 Fall 入学口径)，**2027 Fall 新入学国际生上调 5.5%**；'
    '🆕2026-10-11（官方时间线第三来源复核，**零差异**）：2026-10-01 开放（入学/奖项/住宿同开）、'
    '**2027-01-10 单一入学奖申请截止**、2027-02-19 可补第一学期成绩、**2027-03-01 多数专业申请截止**、'
    '2027-04-30 自报最终成绩+北校区宿舍优先截止、2027-05-01 接受 4/1 前发出的 offer、2027-08-01 高中申请者材料截止；'
    '⚠️**教育类与护理类专业另需口语 IELTS Speaking 7.5**（或 TOEFL 新制口语 5.0）'
))

# R4 渥太华 —— 自动入学奖档位 + 申请人入口
PATCHES.append((
    'R4 渥太华自动奖档位',
    '⑦2026/27 国际学费 **C$43,335(文／社科／理)–C$63,164(工程与 CS)／年**',
    '⑦2026/27 国际学费 **C$43,335(文／社科／理)–C$63,164(工程与 CS)／年**；'
    '🆕2026-10-11（uOttawa 官方奖学与截止口径复核）：'
    '①🎓**自动入学奖（Admission Scholarship 2027-2028）档位明确**：均分 **95–100% → C$3,000**、'
    '**90–94.9% → C$2,000**、**85–89.9% → C$1,000**——**自动评审、无需申请**；'
    '⚠️你 GPA 89.6 落在 **C$1,000 档**，距 C$2,000 档仅差 **0.4 分**；'
    '②申请人入口：加拿大本地申请 Fall 2027 截止 **2027-06-01**、材料 **2027-06-15**；**国际生 5/1 与 5/15**；'
    '③Telfer BCom co-op：申请时均分 ≥80% 可直接勾选并预留名额，大一保持 80% 即保留（co-op 费 C$896/期，国际生 C$1,125）'
))

# R5 皇后 —— Science Gateway 四 code
PATCHES.append((
    'R5 皇后 Science Gateway',
    '⚠️**2027-06-01 当日缴的住宿押金不等于接受 offer**(接受须在 OUAC 完成，二者是两件事)',
    '⚠️**2027-06-01 当日缴的住宿押金不等于接受 offer**(接受须在 OUAC 完成，二者是两件事)；'
    '🆕2026-10-11（皇后官方 Ontario 要求表 + 理学院 gateway 页复核）：'
    '🎓**理学院已拆为四个 gateway 代码**——**QSE**（地球与环境科学）／**QSP**（物理与化学科学）／'
    '**QSB**（生物与认知科学）／**QSM**（数学与数据科学），取代原单一 QS；**四者均需 ENG4U + MCV4U**；'
    'QSE/QSB 另需生物／化学／物理中任 2 门、QSP 需化学或物理任 1 门、**QSM 无额外理科要求**；'
    '⚠️**竞争均分表仍只列旧 QS 的 low 80s，四个新 code 未单独公布区间**（以 admissions 当年口径为准）；'
    '回复日细化：**安省高中申请人 6/1**、**非安省高中申请人 5/1**（以 offer letter 为准）；'
    '**理学院 gateway 不设 Health Sciences 那种计时补充申请**'
))

# R6 TMU —— 可再生入学奖档位
PATCHES.append((
    'R6 TMU 可再生入学奖',
    '经 OUAC 则按 OUAC 费率(前 3 志愿)',
    '经 OUAC 则按 OUAC 费率(前 3 志愿)；'
    '🆕2026-10-11（TMU 官方奖学页复核）：🎓**可再生入学奖档位明确**：加拿大高中 final average '
    '**86–89.99% → C$750/年**、**90–94.99% → C$1,500/年**、**95%+ → C$3,000/年**，按 CGPA 续期；'
    '⚠️**仅限就读加拿大高中者**，中加学籍适用性须书面确认（与 10-06 记录一致）；**你 GPA 89.6 落在 C$750 档**'
))

# R7 卡尔顿 —— ESP Winter 2027 + 条件表性质说明
PATCHES.append((
    'R7 卡尔顿 ESP 与条件表',
    '⚠️**co-op 工作经历学分不计入 6 门录取课程**',
    '⚠️**co-op 工作经历学分不计入 6 门录取课程**；'
    '🆕2026-10-11（卡尔顿官方 ESP 页 + 逐校条件表复核）：'
    '①🆕**Enriched Support Program（ESP，支持型入学项目）Winter 2027 招生已开放，申请截止 2026-11-15**'
    '——与 ESLR 是**两条不同通道**（ESP 为学业支持型入学，ESLR 为语言条件录取）；'
    '②⚠️**卡尔顿 2027–2028 学年完整 requirements 表尚未发布**（官方明确），现公开的 CS 78%、工程 72–88%、'
    '健康科学 80%、公共事务与政策管理 80%、护理 78%、建筑 70%、商科 75% 等是**「保持 offer 的条件」而非录取切分线**，'
    '竞争线可能更高；③CS／网络安全／数据科学最低切分区间 **80–85%**（整体与先修均适用），无补充申请；'
    '④国际生 CS 学费冻结 **C$55,000/年** 至 2028-29'
))

# R8 约克 —— 截止三级复核
PATCHES.append((
    'R8 约克截止复核',
    '接受须在 **MyFile** 内按 offer letter 上的日期完成',
    '接受须在 **MyFile** 内按 offer letter 上的日期完成；'
    '🆕2026-10-11（第三方官方转载页复核）：✅**Fall 2027 国际生截止 2027-03-24**（与现表一致，第三来源）；'
    '**Winter 2027 = 2026-11-18**、**Summer 2027 = 2027-04-01**；校方提示「**名额满即提前关闭**」，建议提前一个月递交'
))

# R9 温莎 —— priority 截止 + 英语细节 + 自动奖
PATCHES.append((
    'R9 温莎优先截止与奖学金',
    "deadline:'滚动;冬季国际生12/1截止;春季国际生4/1'",
    "deadline:'2027季(校方 priority 口径):Winter 2027 **2026-11-01**;Fall 2027 **2027-01-15**;"
    "Summer 2027 **2027-03-01**;有余位则开放至 **2027-08-01**;⚠️与本表既有 OUAC 口径(冬季国际生 12/1、春季 4/1)"
    "并存——**两套截止体系不同**(校方 priority vs OUAC 志愿),以校方 offer 与官网逐页为准;"
    "🆕2026-10-11复核:①直录英语门槛细节——**IELTS 6.5,其中写作 6.5、听/读/说各项 ≥5.5**"
    "(写作 6.5 是本表各校中最严的写作单项要求之一);TOEFL iBT 83;"
    "②🎓自动入学奖(自加拿大高中直升):**均分 85% → C$1,000**、**90% → C$10,000**、**95% → C$16,000**"
    "——你 GPA 89.6 落在 **C$1,000 档**,距 C$10,000 档差 0.4 分;"
    "③入学押金 **C$4,000**,接受 offer 后 **21 天内**缴清,可抵首学期学费;"
    "④ELIP 语言通道口径维持(4.5+);⑤全校每年发放奖助 >C$1,400 万'"
))

# R10 Guelph —— 拟新开 AI 学士
PATCHES.append((
    'R10 Guelph 拟新开 AI 学士',
    "deadline:'3月31日'",
    "deadline:'2027季:Fall 2027 申请 3 月 31 日(滚动);"
    "🆕2026-10-11(官方新闻+校内委员会口径):🎓**拟于 2027 年秋季新开 Bachelor of Artificial Intelligence"
    "(人工智能学士,人本 AI 方向)**——**待安省大学理事会(Ontario Universities Council)批准,预计 2026 年 11 月中旬获批**;"
    "课程结构:四年共 **8 门 AI 课程(4 门理论 + 4 门项目制)**,近半课程设于人文社科;"
    "定位为「训练善用 AI」而非「训练造 AI」,面向社会/人文社科导向学生,**非传统 CS/工程申请人画像**;"
    "课程与具体 AI 模型解耦,强调伦理、政策、数据治理、人机交互与 AI 沟通;合作方含公共卫生与公益组织提供真实课题;"
    "⚠️获批前不影响 2027 其他项目申请流程'"
))

# R11 康考迪亚 —— 语言路径两口径 + ConCEPT
PATCHES.append((
    'R11 康考迪亚语言路径',
    '⚠️魁省学制:高中 11 年后接 CEGEP，国际高中毕业生入 **120 学分 Extended Credit Program**(比本地生多一年基础课)',
    '⚠️魁省学制:高中 11 年后接 CEGEP，国际高中毕业生入 **120 学分 Extended Credit Program**(比本地生多一年基础课)；'
    '🆕2026-10-11（第三方 StudyU + 中文中介两口径对照）：⚠️**语言路径存在两套口径**——'
    '**官方/第三方**：本科直录 IELTS **6.0（无单项 <5.5）**、DET 105；'
    '**中文中介**：「无条件直录」需 **IELTS 7.0 且单项 ≥5.5」，「条件录取（需修 ESL 学分课）」为 **6.0–6.5 且单项 ≥5.5**；'
    '两口径不完全冲突（6.0 为录取最低、7.0 为免修 ESL），但**决定你是否需要修语言课的分界线存在出入**；'
    '⚠️**所有拟修 ESL 的本科新生必须参加校内 ConCEPT 分班测试**——未按时参加将被取消 ESL 注册资格、延误入学；'
    '语言豁免条件 = 全程就读魁省英／法语授课中小学；⚠️另有第三方称「三年英语授课经历或魁省学历可豁免」（**待官网逐页确认**）'
))

# R12 卡尔加里 / SFU / 曼尼托巴 / 戴尔豪斯 / 维多利亚 / 滑铁卢 —— 复核零差异标记（合并写一条轻量标记）
PATCHES.append((
    'R12 戴尔豪斯复核标记',
    '⚠️校方明示「达到最低均分不保证录取」',
    '⚠️校方明示「达到最低均分不保证录取」；'
    '🆕2026-10-11 复核：申请 **2026-10-01 已开**（apply.dal.ca，C$70）、'
    '**General Entrance Award 2026-10-01 → 2027-02-15**、program-specific 截止**仍未公布**'
    '（2/15 与 3/1 属上一轮次规律）——**与 10-10 记录一致，零差异**'
))

def apply(paths, patches):
    results = []
    for path in paths:
        if not os.path.exists(path):
            results.append((path, 'FILE MISSING', 0, 0)); continue
        with io.open(path, encoding='utf-8') as f:
            src = f.read()
        orig = src
        hit = 0; miss = []
        for rid, old, new in patches:
            cnt = src.count(old)
            if cnt == 1:
                src = src.replace(old, new, 1); hit += 1
            else:
                miss.append((rid, cnt))
        if src != orig:
            with io.open(path, 'w', encoding='utf-8') as f:
                f.write(src)
        results.append((os.path.relpath(path, ROOT), 'OK' if not miss else 'MISS', hit, miss))
    return results

if __name__ == '__main__':
    dry = '--dry' in sys.argv
    for path, status, hit, miss in apply(FILES, PATCHES):
        print(f'{status:12} hits={hit} {path}')
        for rid, cnt in (miss if isinstance(miss, list) else []):
            print(f'   ⚠️ MISS {rid} (count={cnt})')
