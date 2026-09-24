#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""2026-09-24 日更补丁：data.js + master HTML（共用院校行文本）"""
import os, sys, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES = ['public/js/data.js', '加拿大大学录取要求对照表_2026.html']

# ---------- 院校行级补丁（data.js 与 master HTML 共用同一段文本） ----------
PATCHES = [
    # R1 麦吉尔 deadline
    ("{name:'麦吉尔',city:'蒙特利尔',prov:'魁省',deadline:'1月15日'",
     "{name:'麦吉尔',city:'蒙特利尔',prov:'魁省',deadline:'2027季(第三方交叉核实,官网页待终核):申请开放2026-10-01;海外/美国学制申请者主截止2027-01-15;材料截止2027-03-01;申请费C$140.16;国际本科学费C$35,561–65,168/年(按专业定,录取后学制内不涨)'"),

    # R2 滑铁卢：追加 2027 招生政策新增
    ("Olympiad/Global/National 奖学金 2027-03-05(注:竞赛非录取必需,但影响数学院奖学金决定)'",
     "Olympiad/Global/National 奖学金 2027-03-05(注:竞赛非录取必需,但影响数学院奖学金决定);🆕2026-09-24(官网 Guidance counsellors 页 uwaterloo.ca/future-students 实抓,2027-09 入学适用):①新增双学位——Renison University College 开设「社会发展研究 + 社会工作学士」双学位(Social Development Studies and Bachelor of Social Work Double Degree);②Honours Arts 与 Honours Arts and Business 加拿大本土生录取均分调整为 high 70s;③电气工程(Electrical Engineering)录取区间上调至 low-to-mid 90s;④萨省学生英语要求放宽为 1 门 English Language Arts(level 30)(原需 A30+B30);⑤复核确认:2027 工程全部申请者须线上视频面试+AIF、重修取最高分不扣分、非日校课程不加罚、建筑 12 年级英语≥78% 且取消 précis、仅需 1 门 12 年级数学、地理与航空/科学与航空停用 AIF'"),

    # R3 阿尔伯塔 deadline
    ("deadline:'2027季:开放10/1;多数专业申请截止3/1;自报成绩4/30;补件8/1;入学奖1/10'",
     "deadline:'2027季(官网 ualberta.ca 实抓):Launchpad 开放2026-10-01;多数专业(含国际生)申请截止2027-03-01;入学奖申请截止2027-01-10;材料截止——高中申请者2027-08-01、有专上学历者2027-06-15;自报成绩4/30;🆕申请费:C$150(首次申请) / C$100(在读或曾就读本校);🆕奖学金:每年约C$5,200万本科奖,国际生自动参与评审无需单独申请,入学奖约C$5,000、校长专项国际生奖可达C$12,000/年,均分85%+的中国学生年均约C$3,000–8,000'"),

    # R4 渥太华 deadline
    ("deadline:'2027季:开放9/17;推荐截止1/15;材料2/15'",
     "deadline:'2027季:开放9/17;推荐截止1/15;材料2/15;🆕2026-09-24(官方奖学金页+第三方交叉):①International English Admission Scholarship 为自动评审、无需单独申请——C$7,500/学期、4年最高C$60,000;②叠加 International English Academic Excellence Scholarship C$10,000 → 合计最高 C$70,000;③门槛:入学均分≥80%(Academic Excellence 需≥95%);④2027冬季(1月)入学:申请截止2026-10-17、材料与语言成绩2026-11-01,冬季可选专业有限;⑤Fall 2027 国际生多数专业最终截止5月,校方明确建议勿等1/15后才递'"),

    # R5 皇后 deadline（更正：此前只记 2/1）
    ("deadline:'2月1日(国际生);🆕2026-09-20升级为多来源一致:2027冬季(1月)入学面向国际生开放,专业含 BA/BSc/BCmp/HealthSci,网申约9/30、材料10/15——OUAC冬季入学官方页已确认「Queen\u2019s 部分专业提供1月入学入口、仅限一年级申请者」,具体日期仍为中介口径'",
     "deadline:'2027季(官网 queensu.ca/admission + Smith 商学院页实抓;⚠️更正:此前只记「2/1」,实为分档):10/1开放申请;🆕商科(Commerce)/健康科学/护理 申请截止2027-02-01、强制补充申请2027-02-15(逾期不受理);🆕其余全部一年级专业申请截止2027-03-01;🆕全部材料(含成绩单与英语成绩)截止2027-03-31;护理 AST 材料2027-03-15;Major Admission Award:建议2026-11-20前递OUAC、2026-12-08 SOLUS截止;早期offer回复截止2027-05-01(非安省高中生);全部决定2027-05-21前在SOLUS公布;Group A/最终offer回复 + 住宿申请与押金 2027-06-01(16:00 ET);最终成绩单:安省7/15、非安省8/1、GCE/CAPE 9/1;QBridge 下一轮申请2026-10开放'"),

    # R6 卡尔顿 deadline（更正：此前「常规3/31、夏季3/1」有误）
    ("deadline:'常规3/31;冬季截止11/15;夏季截止3/1;🆕2026-09-20(官网项目页英语要求核实)",
     "deadline:'2027季(官网 admissions.carleton.ca 实抓;⚠️更正:此前「常规3/31、夏季3/1」有误):🆕国际生(成绩单来自加/美以外)秋季主截止2027-04-01(加/美成绩单者2027-06-01);🆕2027冬季(1月):国际生(成绩单境外)2026-10-15、加/美成绩单者2026-11-15(仅部分专业开放冬季);安省高中生OUAC网申2027-01-15;🆕专业单独截止2027-03-01 + 补充材料2027-03-05(建筑研究/工业设计/音乐/护理/社会工作);Prestige奖学金2027-03-01;Leadership入学助学金2027-05-01;住宿接受与RAP 2027-06-07;入学助学金2027-06-30;🆕2026-09-20(官网项目页英语要求核实)"),

    # R7 卡尔加里 deadline
    ("deadline:'常设:国际生开放8/15;申请截止3/1;材料3/15;4/1前offer须5/1接受'",
     "deadline:'常设:国际生开放8/15;申请截止3/1;材料3/15;4/1前offer须5/1接受;🆕2026-09-24(官方口径复核):申请费C$125(加方学历)/C$145(国际学历);高中课程须2027-06-30前完成、最终材料2027-08-01截止;4/1之后发出的offer给30天接受期;可填2个专业志愿,若先录第二志愿,新成绩到达后自动重新考虑第一志愿、无需重新申请'"),

    # R8 SFU deadline 追加双录明细
    ("与SFU官网明示6.5(单项6.0)不符'",
     "与SFU官网明示6.5(单项6.0)不符;🆕2026-09-24双录通道明细(官方口径复核):①校内 ESL 语言中心——共8级、每级8周、滚动开班,按分级测试入学,完成 Level 8 且总评≥B+ 即可直接进入本科正课(无需重考雅思、无需重新申请);②FIC(菲莎国际学院)校内桥梁——位于本拿比主校区,共享图书馆/实验室/学生卡等全部校园资源。你雅思5.0低于校内语言中心最高级直升标准,可逐级升读或走 FIC'"),

    # R9 曼尼托巴 deadline（新增奖学金 + 更正英语门槛）
    ("{name:'曼尼托巴',city:'温尼伯',prov:'曼省',deadline:'3月1日'",
     "{name:'曼尼托巴',city:'温尼伯',prov:'曼省',deadline:'2027季:秋季直入(University 1 / 直接入系)申请截止2027-03-01;2027冬季10/01、2027春季02/01;🆕2026-09-24(官网 umanitoba.ca 实抓):(1)全新设立 International Excellence Entrance Scholarship(2027-28学年首届)——1名C$25,000 + 2名C$10,000,需单独提交申请,申请/材料/推荐人截止2026-12-01,⚠️推荐人不得为家庭成员,3月中公布,不可续期,可与校内其他奖叠加(需领导力与持续社区参与);(2)国际生自动入学奖(无需申请):五门高三课程均分95%+→C$3,000、90%+→C$2,000、85%+→C$1,000,须秋季+冬季均全日制(≥24学分);(3)⚠️更正英语门槛:IELTS 6.5(听力/阅读/写作/口语每项≥6.0,此前表内误记5.5);TOEFL新制4.5(每项4.0)、CAEL 60、PTE 58、Duolingo 120(每项105)、Cambridge 180;雅思成绩2年有效且须在入学学期开始时仍有效,接受 IELTS One Skill Retake;双录:ELC 的 IAEP 读至 Level 5 即有条件录取(约C$4,800/学期,EAPUCE)或走 ICM;(4)明确不要求会考或高考成绩'"),

    # R10 阿德莱德预科：Eynesbury 2027 文凭/语言班学费
    ("{name:'阿德莱德',city:'阿德莱德',prov:'澳洲',deadline:'滚动',tuition:'36,200(2027)'",
     "{name:'阿德莱德',city:'阿德莱德',prov:'澳洲',deadline:'滚动;🆕2026-09-24(Eynesbury 官网 fees 页实抓):①预科 Foundation Studies 2027 = A$36,200(8或12个月,Feb/June/Oct,CRICOS 074931M),IELTS 5.5(无单项<5.0),须完成澳洲 Year 11 或等效;②文凭(Diploma)路径 2027 学费——Stage 1 各专业均为 A$34,000(每模块 A$4,250);Stage 2:Arts A$36,200、Business A$41,400、Computing & IT A$42,400、Engineering A$45,000、Health Science A$41,900;③ELICOS 语言班 A$400/周(EGP/EAP Prep/EAP 同价);④一次性注册费 A$225、OSHC 约 A$838/年、住宿:Adelaide Student Lodge A$392.50/周、Homestay A$350/周(含餐)/A$260/周(自理)、学生公寓 A$290–650/周',tuition:'预科 36,200(2027)'"),

    # R11 UNSW 预科 2027 三类课程全量学费
    ("{name:'UNSW',city:'悉尼',prov:'澳洲',deadline:'滚动'",
     "{name:'UNSW',city:'悉尼',prov:'澳洲',deadline:'滚动;🆕2026-09-24(UNSW College 三类课程 2027 学费,中介口径待官网终核):Transition Program(16周,4月/8月)=A$29,980(2026: A$29,200);Standard Foundation(9个月,4月/10月)=A$43,650(2026: A$42,700);Standard Plus(12个月,1月/7月)=A$48,750(2026: A$47,800)。⚠️与 CRICOS 登记口径(Standard Plus 约A$47,000含非学费)存在差异,已列入待官网核实项。⚠️入学门槛由低到高为 Standard Plus → Standard → Transition,时长顺序相反;语言成绩是选类的关键变量'"),

    # R12 UQ 2027 S1 时间线
    ("预科设高成就者奖学金可减免约20%学费'",
     "预科设高成就者奖学金可减免约20%学费;🆕2026-09-24(UQ 2027 S1 时间线,官方口径复核):2027年2月(S1)入学——仍接受无语言成绩的有条件录取申请;完整申请材料提交截止约2026-10月底;补交合格语言成绩最晚约2026-11月底;确认录取并缴纳学费押金截止约2027-01中旬;布里斯班年均生活成本约A$2.1–3万(比悉尼/墨尔本低15–20%)'"),
]

def apply(path, patches):
    p = os.path.join(ROOT, path)
    s = open(p, encoding='utf-8').read()
    hits, miss = 0, []
    for old, new in patches:
        n = s.count(old)
        if n == 0:
            miss.append(old[:60])
            continue
        s = s.replace(old, new)
        hits += n
    open(p, 'w', encoding='utf-8').write(s)
    return hits, miss, len(miss)

def fix_manitoba_ielts(path):
    """块内替换曼尼托巴的 ielts 值（避免误伤温莎/萨省同名值）"""
    p = os.path.join(ROOT, path)
    s = open(p, encoding='utf-8').read()
    start = s.index("{name:'曼尼托巴'")
    end = s.index("{name:'戴尔豪斯'", start)
    block = s[start:end]
    cnt = block.count("ielts:'6.5(5.5)'")
    block2 = block.replace("ielts:'6.5(5.5)'", "ielts:'6.5(6.0)'")
    s = s[:start] + block2 + s[end:]
    open(p, 'w', encoding='utf-8').write(s)
    return cnt

if __name__ == '__main__':
    total_miss = []
    for f in FILES:
        h, m, _ = apply(f, PATCHES)
        mi = fix_manitoba_ielts(f)
        print(f'{f}: 院校行补丁命中 {h} 处 / 曼尼托巴 ielts 替换 {mi} 处')
        total_miss += [f + ' :: ' + x for x in m]
    if total_miss:
        print('\n!!! MISS !!!')
        for x in total_miss:
            print('  ', x)
        sys.exit(1)
    print('ALL HIT')
