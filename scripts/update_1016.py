#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
update_1016.py — 2026-10-16 日更补丁（data.js 权威源 + 三个页面日期常量）
策略：按 {name:'校名' 定位 → 在 ,tuition:' 之前一位（QUOTE 守卫）插入
说明：本文件内一律不得出现英文直撇号 (U+0027)，所有格统一用 U+2019。
⚠️ 本轮同时「补跑」未部署的 2026-10-14 变更（本地已应用、线上仍为 10131）。
"""
import io, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'public/js/data.js')
MASTER = os.path.join(ROOT, '加拿大大学录取要求对照表_2026.html')
APP_ADM = os.path.join(ROOT, 'public/pages/admission.html')
APP_TL = os.path.join(ROOT, 'public/pages/timeline.html')

OLD_DATE = '2026-10-14'
NEW_DATE = '2026-10-16'
OLD_REV = 'delpoy_rev_10141'
NEW_REV = 'delpoy_rev_10161'

PATCHES = {
'UBC·温哥华': '；🆕2026-10-16（`you.ubc.ca/programs` 官方项目库「New」标识逐项实抓 + Sauder 官方页面，核对日 2026-10-16）：🎓**2027/28 新增项目首次全量入表** —— ①温哥华全新独立学位 **Bachelor of Indigenous Land Stewardship（原住民土地管护学士，4 年制，与原住民学者及长老合作的土地管理与原住民生态知识）**；②温哥华新增主修：**Business and Markets（商务与市场）／Data Analytics（数据分析）→ 挂靠 BSc Food and Resource Economics（土地与食品系统学院）**；**Data Science（数据科学 BSc，理学院跨统计＋计算机，可高中直申 4 年本科）／Atmospheric Science（大气科学 BSc）**；**Conservation／Forest Management／Forest Operations／Forest Sciences／Wood Products → BSc Natural Resources 自然资源学院，替换旧体系 5 个主修**；③奥肯那根新增：**Computer Engineering（计算机工程 BASc，4 年制工程本科，国际生可申）／Commerce（商科）**，以及 **NłeɁkepmx Language Fluency／St’át’imc Language Fluency（原住民语言流利学士）—— ⚠️不可高中直申，须先完成 NVIT 学院语言文凭再转入读后两年**。④🎓**Sauder 官方页面 2027 双路径节点**：**BCom 申请截止 2027-01-15**；**Bachelor + Master of Management（B+MM）**：**大一入学申请 2027-01-15 → 补充申请 2027-01-31**；**二/三年级入学申请 2027-01-15 → 补充申请 2027-05-04**。⑤✅官方确认 **2027/28 学位项目申请已开放**（经 EducationPlannerBC 提交，myapplication.ubc.ca）',

'麦克马斯特': '；🆕2026-10-16（麦马工程学院补充申请官方页 + 校方 2026-05-08 公告 + 校方 deadlines 页，核对日 2026-10-16）：🆕**工程学院补充申请（Kira Talent）节点首次全量入表** —— 适用于**工程、iBioMed、计算机科学、四年制技术学士（B.Tech）**；**形式 = 3 道视频题 + 1 道文字题**（视频每题 10 秒准备 + 2 分钟作答；文字题官网两处口径不一致——工程页写 10 分钟、FAQ 写 7 分钟，**以进入 Kira 后显示的规则为准**）；**2026-10-01 开放 → 校方建议 2026-11-26 前完成 → 高中申请者最终截止 2027-01-28 23:59 ET**（高年级转学／第二学位 2027-04-15）；⚠️**校方明令禁止使用 AI 或他人代写**，Kira 会监测异常浏览器行为、打字速度与复制粘贴；⚠️**Mosaic 申请清单可能在截止后数周仍显示「未完成」，属正常**，以 Kira 确认邮件为准。🎓**新增本科核工程学位（官方 2026-05-08 公告，2027-09 首招）**：**B.Eng. Nuclear Engineering（4 年）／Nuclear Engineering and Society（5 年）／Nuclear Engineering and Management（5 年）**，全部提供 co-op，可使用麦马研究反应堆与实验设施；⚠️校方提示考虑学签因素，**对国际生不完全建议**。🔀**工程改为两条申请路径**：**Engineering I 共同大一 + Discovery Track（大一后按学业成绩、专业志愿与名额分流）** 与 **Direct Program Track（申请时直接锁定具体工程专业）** —— 两条路径的分流规则不同，**不可混用**。其他补充申请：**Arts & Science 五题各 1500 字符（2027-02-01 截止）／Integrated Science 2027-02-02 23:59 ET（iSci 页仍显示已关闭的 Fall 2026 版本）／IBH 独立 Kira + 简历／Business 低分区间可选书面补充（清单写 2027-04-30）／Nursing 用 Casper／Midwifery 用 Identity and Admissions Survey**。💰2025-26 **工程 Level 1 学费 C$73,515**',

'皇后': '；🆕2026-10-16（AdmissionPrep 逐项官方对照，更新日 2026-10-13）：**2027 入学节点全量复核** —— **Commerce／Health Sciences／Nursing 申请截止 2027-02-01、补充申请截止 2027-02-15**；**其余大一专业申请 2027-03-01、材料 2027-03-31**；**Nursing Advanced Standing Track 材料 2027-03-15**；**Major Admission Award 申请 2026-12-08**（⚠️须**先递交皇后申请以取得 SOLUS 权限**，官方明确「不要等到 12-08 才开始申请大学」）。⚠️**补充申请 rubric 现标注为 2026 版，2027 版官方承诺 2026-11-01 前发布** —— 在此之前一律按历史材料处理，旧版 Personal Statement of Experience 样例不可当作 2027 题目',

'韦士敦': '；🆕2026-10-16（Western 官方 deadline 页结构核对 + Ivey 高中申请页，更新日 2026-10-10）：**2027 入学节点全量入表** —— 全日制本科平等考虑 **2027-01-15**；**Ivey AEO 申请 2027-01-15 23:59 EST**；Music 试听／面试登记 2027-02-01；**National Scholarship／National Indigenous Scholarship／Scholar’s Electives 2027-02-14**；**Compressed Time Frame BScN（Regular 与 RPN Stream A）2027-02-15**；Studio Arts 作品集 2027-02-15；SASAH 申请 2027-02-28；**Commercial Aviation Management 补充材料 2027-03-01**；**🎯工程 Casper 2027-03-02**（⚠️该 Casper 日期属工程学院，**不可套用于护理**）；**Western Integrated Science 补充材料 2027-04 上旬**。⭐**Ivey AEO 竞争画像**：相关最佳 12 年级课程（含英语）**low 90s** + 一门大学预备数学；**AEO 是「身份」而非专业**，须同时在 Western 或其附属学院选读一个专业，**且大一、大二须满足进阶要求方能保留 HBA 条件录取**（非无条件）',

'滑铁卢': '；🆕2026-10-16（口径冲突记录，核对日 2026-10-16）：⚠️**中文资讯出现自相矛盾表述** —— 同一篇汇总文章的**小标题写「工程面试非强制但计分」，正文却写「所有申请滑铁卢工程学院的学生均须完成线上视频面试并提交 AIF」**。**处理结论：维持 2026-09-11／10-08 已确认的官方口径 —— 2027 季起工程所有申请者必做线上视频面试 + AIF，截止 2027-02-01**；小标题判定为编辑笔误。⚠️**该口径直接影响你**：若走滑铁卢工程路径，除语言与 GPA 外还须额外完成视频面试；**CS 无 AIF 强制要求但语言仍为 6.5（写作 6.5／口语 6.5／阅读 6.0／听力 6.0）**',

'卡尔顿': '；🆕2026-10-16（Carleton 官方招生页 + Stellar 官方对照，核对日 2026-10-08）：**2027 节点复核** —— **OUAC 截止 2027-01-15**；**部分专业另有 2027-03-01 专业截止与 2027-03-05 材料截止**；**滚动放榜，自 11 月中开始**（作品集／补充类在截止后评审）；**OSSD + 六门 4U／M**，先修须为 4U、**任何一门先修不得低于 60%**，**co-op 学分不计入这六门**。📋**保持 offer 条件线（2027–2028 版，非切分线）复核一致**：建筑 70%（**3/1 申请 + 3/5 作品集**）／商科 75%（进阶函数 70）／**CS·网安·数据科学 78%（进阶函数＋微积分合并 76）**／工程 **72%–88%（按方向，先修合并均分对齐该方向下限）**／健康科学 80%（进阶函数＋两门理科合并 75）／新闻 76%（英语 70）／PAPM 80%／**护理 78%（英语＋进阶函数＋生物＋化学合并 75，3/1 申请）**。🗓️**Carleton Fall Open House = 2026-10-24**',

'阿尔伯塔': '；🆕2026-10-16（第三方逐校对照，核对日 2026-10-16；⚠️**非官方，仅作线索**）：2027 入学**申请 2026-10-01 已开、最终截止 2027-03-01**，采用**滚动录取**；⚠️**高需求专业（计算科学、石油工程）建议 2026-12-15 前递交**，以提升录取与自动入学奖考虑机会；第三方另称材料截止 2027-03-15（⚠️**与现表 8/1 材料口径不同，待核**）。**均以校方 dates & deadlines 页为准**',

'卡尔加里': '；🆕2026-10-16（Uniscope 依据校方 2024 年 CUDO 报告推算，⚠️**为估值而非校方承诺**）：**机械工程竞争录取均分 ≈88%、录取率 ≈20%、年招生 ≈250 人**；示例学生报告均分 91.75%（2027 届申请人，1 份样本）。⇒ **与现表 CS low 80s 口径并列参考**：卡尔加里工科热门方向的**隐性竞争线明显高于官方最低线**',

'曼尼托巴': '；🆕2026-10-16（第三方问答汇总，核对日 2026-10-16；⚠️**来源可信度低，全部标注待核**）：第三方称 **2027 秋季申请系统 2026 年 11 月开放、早申截止 2027-01-15、常规截止 2027-03-01**，国际生入学奖最高 **C$40,000**（独立申请陈述 2027-01 截止），语言参考 **IELTS 6.5／TOEFL iBT 86**。⚠️**与现表既有第三方口径（2027-02-15 国际生优先截止、Winter 2027 国际生 2026-10-25、申请费 C$120 两口径）互相矛盾**，一律以校方页面为准',

'昆士兰': '；🆕2026-10-16（澳洲路径汇总，核对日 2026-10-14）：**直录门槛仍为 IELTS 6.5（单项 6.0）**；**未达标者 IES 预科入学门槛 = IELTS 总分 5.5（各单项 ≥5.0，历史口径）／配语言班约 10 周、约 A$650／周**；⚠️**雅思 6.0 在澳洲「连语言班都配不了」的专业清单**（须直接重考）：**临床医学 7.5（单项 7.0）／注册护理 7.0（单项 7.0）／教育 7.5／法学 JD 7.0／社工 7.0／验光与言语病理 7.0–7.5** —— 均为**行业注册机构规定，任何语言班不放宽**',

'阿德莱德': '；🆕2026-10-16（澳洲预科路径汇总，核对日 2026-10-14）：**阿德莱德预科（Bradford College）门槛 = IELTS 总分 5.5、各单项 ≥5.0**；开设**工程／商科／金融／生命科学／健康科学／理学／计算机科学／建筑设计／人文**；**本科直录参考 GPA ≈75%**（第三方估算，非校方承诺）；语言班约 **10 周、约 A$600／周**',
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
