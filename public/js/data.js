// 个人 GPA/IELTS 数据存储于服务端，登录后通过 POST /api/login + GET /api/me/data 获取
// 前端不含任何个人敏感数据
const PROGRAMS = {
  eng:"工程", cs:"计算机", math:"数学", psych:"心理学",
  biz:"商科", health:"健康科学", sci:"理科综合", social:"社会科学"
};

const TIERS = [
  {key:"t1",label:"极难申",badge:"t1",title:"第一梯队 — CS/工程顶级，无双录或门槛高"},
  {key:"t2",label:"现实目标",badge:"t2",title:"第二梯队 — 有双录取路径，GPA够或接近"},
  {key:"t3",label:"保底校",badge:"t3",title:"第三梯队 — 双录门槛低，GPA绰绰有余"},
  {key:"au",label:"澳洲保底",badge:"au",title:"预科路径"}
];

const SCHOOLS = {
  t1:[
    {name:'多大·圣乔治',city:'多伦多',prov:'安省',deadline:'2027季:申请1/15(推荐早申11/7);材料:工程/音乐1/15,其余2/1;补充:工程(OSP)/音乐1/15,其余2/1;✅截止口径冲突已结案(9/20实抓 future.utoronto.ca/deadlines 2027 三张表):材料截止=工程1/15、音乐1/15,建筑/A&S–Rotman/A&S–其余/iSchool/运动机能/UTM/UTSC=2/1;补充申请=工程OSP1/15、音乐问卷1/15,建筑(One Idea)/Rotman/CS/运动机能/UTSC=2/1;该页已不再出现「2/16」(此前IFP子页表述判定为笔误/过期)→最终按申请1/15(推荐早申11/7)·材料2/1执行;🎓Lester B. Pearson国际奖学金2027(2026-10-02 第三来源复核一致):校提名10/9 12:00 EST、OUAC入学申请10/16、奖学金材料11/6(约37人/年,四年全额学费+住宿+书本+杂费,单份>CAD 20万;每所中学每年仅提名1人);🆕OUAC 2026-2027 官方日程(go2.ouac.on.ca/resources/schedule-of-dates,2026-04-27 更新,全量实抓):申请2026-09-17开放;2026-11-05 高中电子数据文件截止;2026-11-19 期中/期末4U/M成绩截止;2026-11-26 大学收到成绩目标日;**Group A 申请截止2027-01-15**;2027-01-21 大学收到数据目标日;2027-02-11 期末4U/M成绩截止;2027-04-22 高中报告期中成绩;2027-05-03 大学收到目标日;**最晚回复日2027-05-28**、**最早可要求答复日2027-06-01**;🆕**AIS(补录信息服务)2027-06-03开放**;2027-07-08 期末成绩截止;2027-07-15 剩余成绩送达目标日;🆕**OUAC 申请费:C$159(前3个志愿) + C$51/每增1个志愿**(无单独国际生服务费);Group B 无统一截止,由各校自定;🆕2026-10-04(官网实抓):多大工程本科申请路径**只剩 Core 8 与 Engineering Science 两条,「Track One」已取消**;工程补充申请费 C$45.00;宿舍保证需 3/31 前完成住宿申请、6/1 前接受 offer',tuition:'42,000-62,000',tuitionRMB:'21-34万',programs:{
      eng:{gpa:'92-95%',label:'hard',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'PEY Co-op',note:'⚠️2027起仅两条路径:Core 8 或 EngSci;无IFP双录',note_detail:'⚠️2026-27/2027-28 IFP官网仅覆盖Arts&Science/建筑景观设计/音乐，不含工程(须直录6.5(6.0));🆕**2026-10-04 官网实抓确认(discover.engineering.utoronto.ca/programs)**:多大工程本科**只剩两条申请路径——① Core 8 核心专业 ② Engineering Science(EngSci)**;**「Track One」未再出现于官网项目页,判定 2027 季已取消**(此前可先申 Track One、大一读工程基础课、之后再定方向);⇒ Core 8 = Chemical/Civil/Computer/Electrical/Industrial/Materials/Mechanical/Mineral(**一个校区仅可报 1 个**);EngSci 为直入,前两年 Foundation Years + 后两年 9 大主修之一;▲另一新增:工程学院**新增辅修网络安全证书**、扩展海外交换;▲工程**补充申请费 C$45.00**(随 OUAC 申请一并缴纳);先修 5 门(ENG4U/MCV4U/SCH4U/SPH4U/MHF4U)各≥70% 且以这 5 门计均分;Engineering Supplemental Application 截止 12/1(争 2 月首轮),材料 1/15,官网建议 11/7 前递 OUAC;宿舍保证:3/31 前完成住宿申请 + 6/1 前接受 offer;⚠️OUInfo 仍列示 IFP-Engineering 旧条目(TUH),2027-28 是否实际招生仍需向工程学院确认'},
      cs:{gpa:'93%(comp)/97.2%(median)',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP(Arts&Sci/Arch/Music)',dual_thr:'5.0-6.5(写作5.5/单项≥5.0)',coop:'yes',coop_note:'PEY Co-op',note:'CS竞争均分93%但录取中位97.2%;IFP覆盖Arts&Sci含CS',note_detail:'🆕已确认(2026-09-11):多大已完成校内审批,自2027-09-01起推出新的四年制荣誉学位BCS(Bachelor of Computer Science),覆盖三校区CS相关项目——UTSG:CS专修/主修、数据科学专修、生物信息学与计算生物学专修;2026-27 IFP覆盖Arts&Science(含CS/数学/心理)、建筑景观设计、音乐；新门槛单项≥5.0你听力/阅读4.5未达标;🆕2026-10-04:多大**新增量子工程本科(Quantum Engineering)**——隶属应用科学与工程学院,**2027 秋季首届招生、为加拿大首个量子工程本科**;前两年数理与工程基础,后两年分量子计算硬件/量子传感/量子通信三方向;设专项奖学金、国际生同等参评;⚠️中介口径(新东方),官网项目页暂未列出,**待官网核实**'},
      math:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP(Arts&Sci/Arch/Music)',dual_thr:'5.0-6.5(写作5.5/单项≥5.0)',coop:'yes',coop_note:'',note:'IFP含Arts&Sci数学;门槛单项≥5.0你不够',note_detail:'2026-27 IFP覆盖Arts&Science(含数学)、建筑景观设计、音乐；新门槛单项≥5.0你听力/阅读4.5未达标'},
      psych:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP(Arts&Sci/Arch/Music)',dual_thr:'5.0-6.5(写作5.5/单项≥5.0)',coop:'no',coop_note:'',note:'IFP含Arts&Sci心理;门槛单项≥5.0你不够',note_detail:'2026-27 IFP覆盖Arts&Science(含心理)、建筑景观设计、音乐；新门槛单项≥5.0你听力/阅读4.5未达标'},
      biz:{gpa:'92-95%',label:'hard',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'Rotman Commerce',note:'Rotman极难;不含IFP(排除)',note_detail:'Rotman需补充申请且均分93%+；IFP Arts&Sci不含Rotman Commerce'},
      health:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP(Arts&Sci/Arch/Music)',dual_thr:'5.0-6.5(写作5.5/单项≥5.0)',coop:'no',coop_note:'',note:'IFP含Arts&Sci;门槛单项≥5.0你不够',note_detail:'2026-27 IFP覆盖Arts&Science、建筑景观设计、音乐；新门槛单项≥5.0你听力/阅读4.5未达标'},
      sci:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP(Arts&Sci/Arch/Music)',dual_thr:'5.0-6.5(写作5.5/单项≥5.0)',coop:'no',coop_note:'',note:'IFP含Arts&Sci理科;门槛单项≥5.0你不够',note_detail:'2026-27 IFP覆盖Arts&Science、建筑景观设计、音乐；新门槛单项≥5.0你听力/阅读4.5未达标'},
      social:{gpa:'80-85%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP(Arts&Sci/Arch/Music)',dual_thr:'5.0-6.5(写作5.5/单项≥5.0)',coop:'no',coop_note:'',note:'IFP含Arts&Sci社科;门槛单项≥5.0你不够',note_detail:'2026-27 IFP覆盖Arts&Science、建筑景观设计、音乐；新门槛单项≥5.0你听力/阅读4.5未达标'}
    }},
    {name:'UBC·温哥华',city:'温哥华',prov:'BC省',deadline:'2027季(官网you.ubc.ca 9/18核实):10月初开放申请(2027冬季学期+2027夏季学期5-8月同期开放);申请截止1/15(PT23:59);ELAS语言材料2/15;国际生奖学金轮11/15(2026-11-15);🆕境外高中申请者材料截止2027-03-15(官网Dates&Deadlines新增节点);🆕2026-09-20(DET官方口径复核):本科直录接受 Duolingo(总分125/阅读115/听力115/写作120/口语120),温哥华与奥卡纳根两校区同口径;2027年5月/9月入学起研究生录取亦开始接受 DET(同分项口径,个别院系可更高)。⚠️不构成降门槛:Vantage 仍为 5.5(听说5.0/读写5.5);🆕2026-09-23(官网 you.ubc.ca/dates-deadlines 实抓全量复核)补全节点:国际学者计划(ISP)申请者须在2027-01-31前满足 ELAS 或 Vantage 语言要求并交齐材料;2027-02-15 加拿大大学在读申请者中期成绩单(含12月结课成绩+1-4月在读课程);🆕加拿大高中(BC/安省以外)春季成绩单上载窗口2027-03-01~03-15;境外高中申请者材料截止2027-03-15(与9/20已记节点一致);🆕境外大学申请者材料截止2027-05-31(美国大学申请者2027-03-15);🆕加拿大高中申请者须于2027-06-30前完成全部课程(含网课/远程学习);🆕助学金申请截止2027-09-15;🆕接受offer截止:2027-05-01 或 2027-06-01(以录取信注明为准)',tuition:'40,000-48,000',tuitionRMB:'20-25万',programs:{
      eng:{gpa:'90-94%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'Vantage(One Engineering)',dual_thr:'5.5(听说5.0/读写5.5)',coop:'yes',coop_note:'Engineering Co-op',note:'Vantage需5.5未达标;CAP 6.0',note_detail:'⚠️2026-27官方Vantage最低雅思5.5(听说≥5.0/读写≥5.5)，你5.0未达标;Vantage One现仅剩Engineering/Science两轨(Management无限期暂停);另有CAP条件录取需6.0(单项≥5.5)'},
      cs:{gpa:'92-95%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'Vantage(One Science可修CS)',dual_thr:'5.5(听说5.0/读写5.5)',coop:'yes',coop_note:'CS Co-op',note:'Vantage需5.5未达标',note_detail:'⚠️Vantage官方最低雅思5.5(听说≥5.0/读写≥5.5)，你5.0未达标;CS可经Vantage One Science衔接或直入Science后进CS;CAP需6.0(单项≥5.5)'},
      math:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'Vantage(One Science)',dual_thr:'5.5(听说5.0/读写5.5)',coop:'yes',coop_note:'',note:'Vantage需5.5未达标',note_detail:'⚠️Vantage官方最低雅思5.5(听说≥5.0/读写≥5.5)，你5.0未达标;建议先冲雅思总分5.5且读写5.5'},
      psych:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:'UBC心理学无Vantage双录'},
      biz:{gpa:'90-94%',label:'hard',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'Sauder Co-op',note:'Sauder极难+补充申请',note_detail:'需Personal Profile+面试'},
      health:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:''},
      sci:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'Vantage(One Science)',dual_thr:'5.5(听说5.0/读写5.5)',coop:'yes',coop_note:'',note:'Vantage需5.5未达标',note_detail:'⚠️Vantage官方最低雅思5.5(听说≥5.0/读写≥5.5)，你5.0未达标;Science轨内可选CS/数学等;CAP需6.0(单项≥5.5)'},
      social:{gpa:'80-85%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:''}
    }},
    {name:'麦吉尔',city:'蒙特利尔',prov:'魁省',deadline:'2027季(**2026-10-02 多来源确认,Fall 2027 申请已于 2026-10-01 正式开放**):**申请开放2026-10-01(Fall 2027 网申已上线)**;海外/美国学制申请者主截止**2027-01-15**;材料截止**2027-03-01**;申请费C$140.16(不退);国际本科学费C$35,561–65,168/年(按专业定,录取后学制内不涨);🆕**滚动录取(rolling)**:麦吉尔持续放榜,上轮国际生决定集中在 11 月中—5 月中——**10 月递交的档案有可能在圣诞节前出结果,1/14 递交的往往拖到春季**;入学奖学金截止通常在申请截止后约 1 周 → 越早递越有时间做奖学金;🆕**语言成绩须由考试机构直送**(McGill 不接受申请人自行上传的成绩单);⚠️**Desautels 商学院门槛更高**:Bachelor of Commerce 要求 **TOEFL iBT 100 / Duolingo 130**(其余专业为 90 / 125);IELTS 通用最低 6.5(各项 ≥6.0);部分情况可豁免(连续 4 年英语授课、IB English A ≥5、A-Level English ≥C);⚠️**你 5.0 距 6.5 差 1.5,且麦吉尔几乎无语言双录 → 现行条件下不可申**',tuition:'34,000-45,000',tuitionRMB:'17-23万',programs:{
      eng:{gpa:'88-92%',label:'hard',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'Engineering Co-op',note:'几乎无双录',note_detail:''},
      cs:{gpa:'93-95%',label:'hard',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'',note:'几乎无双录',note_detail:''},
      math:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:''},
      psych:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:''},
      biz:{gpa:'90-94%',label:'hard',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'',note:'Desautels极难',note_detail:'92%+需要补充申请'},
      health:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:''},
      sci:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:''},
      social:{gpa:'80-85%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:''}
    }},
    {name:'滑铁卢',city:'滑铁卢',prov:'安省',deadline:'2027季:工程申请1/15(材料2/1);其余专业申请2/1(材料2/15);🆕语言成绩有效期(官网9/18核实):仅接受2025-05-01及之后考出的成绩,更早的作废;另IELTS总分7.0且各项≥6.0亦可满足直录;🆕2026-09-23(官网 deadlines 页 + OUAC 指南实抓全量):2027冬季学期申请截止2026-10-30(材料2026-11-27;post-degree 2026-11-13/材料12-04)、2027春季学期申请截止2027-02-26(材料2027-03-26;post-degree 2027-03-12/材料04-02);药学院(Pharmacy)申请2027-01-06/材料2027-01-20 14:00ET;视光学(Optometry)2026-11-12(详见院系页);🎓重大利好:2027年9月入学的全日制一年级国际自费生自动获 CAD 10,000 首年学费奖学金,无需另行申请;数学系竞赛报名节点:CSMC 2026-10-22、CCC 2027-02-11、Euclid 2027-03-11、Olympiad/Global/National 奖学金 2027-03-05(注:竞赛非录取必需,但影响数学院奖学金决定);🆕2026-09-24(官网 Guidance counsellors 页 uwaterloo.ca/future-students 实抓,2027-09 入学适用):①新增双学位——Renison University College 开设「社会发展研究 + 社会工作学士」双学位(Social Development Studies and Bachelor of Social Work Double Degree);②Honours Arts 与 Honours Arts and Business 加拿大本土生录取均分调整为 high 70s;③电气工程(Electrical Engineering)录取区间上调至 low-to-mid 90s;④萨省学生英语要求放宽为 1 门 English Language Arts(level 30)(原需 A30+B30);⑤复核确认:2027 工程全部申请者须线上视频面试+AIF、重修取最高分不扣分、非日校课程不加罚、建筑 12 年级英语≥78% 且取消 précis、仅需 1 门 12 年级数学、地理与航空/科学与航空停用 AIF',tuition:'40,000-48,000',tuitionRMB:'20-25万',programs:{
      eng:{gpa:'90-95%',label:'hard',ielts:'6.5(写作口语6.5/其余6.0)',dual:'limit',dual_type:'BASE仅工程',dual_thr:'5.5(写作5.5)',coop:'yes',coop_note:'全球最强Co-op体系',note:'BASE仅工程方向',note_detail:'BASE不含建筑/生物医学/系统设计;🆕中介口径(待官网核实):2027季工程全部申请者须线上视频面试+AIF,重修课程取最高一次成绩不扣分,新增数据科学主修/生物医学科学可直接申请'},
      cs:{gpa:'97-98%',label:'hard',ielts:'6.5(写作口语6.5/其余6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'全球最强Co-op体系',note:'CS几乎最难进',note_detail:''},
      math:{gpa:'85-90%',label:'close',ielts:'6.5(写作口语6.5/其余6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'',note:'须直录+高雅思',note_detail:'写作口语6.5是高门槛'},
      psych:{gpa:'80-85%',label:'ok',ielts:'6.5(写作口语6.5/其余6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:''},
      biz:{gpa:'88-92%',label:'hard',ielts:'6.5(写作口语6.5/其余6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'AFM Co-op',note:'AFM需补充申请',note_detail:''},
      health:{gpa:'80-85%',label:'ok',ielts:'6.5(写作口语6.5/其余6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:''},
      sci:{gpa:'80-85%',label:'ok',ielts:'6.5(写作口语6.5/其余6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'',note:'须直录',note_detail:''},
      social:{gpa:'75-80%',label:'ok',ielts:'6.5(写作口语6.5/其余6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:''}
    }}
  ],
  t2:[
    {name:'多大·士嘉堡(UTSC)',city:'多伦多(东)',prov:'安省',deadline:'2027季:申请1/15(推荐早申11/7);材料2/1;补充(部分专业)2/1',tuition:'67,700',tuitionRMB:'34万',programs:{
      eng:{gpa:'—',label:'na',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'无传统工程',note_detail:'UTSC无Engineering本科'},
      cs:{gpa:'Low 90s(非Co-op)/High 90s(Co-op)',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'CS Co-op(3×4月)',note:'非Co-op踩线!Co-op差远',note_detail:'UTSC CS非Co-op版low 90s你89.6踩线;Co-op版要high 90s几乎不可能;不需补充申请;🆕2026-09起CS分流扩为5个方向(综合/信息系统/软件工程/创业/AI与机器学习),新增"人工智能与机器学习方向"含Co-op;须先申UTSC大一CS入学类别,再达标选方向,创业方向需额外补充申请'},
      math:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'统计Co-op',note:'踩线',note_detail:'UTSC Applied Statistics high 80s'},
      psych:{gpa:'Mid-high 70s(非Co-op)/Low 80s(Co-op)',label:'ok',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'心理Co-op',note:'GPA绰绰有余!心理有Co-op',note_detail:'UTSC心理学非Co-op mid-high 70s你89.6远超;Co-op版low 80s你也够;北美少数本科有临床心理方向'},
      biz:{gpa:'80-85%(Management)',label:'ok',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'MIT Co-op',note:'Management踩线',note_detail:'UTSC Management & IT有Co-op'},
      health:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'健康科学Co-op',note:'GPA够',note_detail:''},
      sci:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'Mid 70s',label:'ok',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'GPA绰绰有余',note_detail:''}
    }},
    {name:'多大·密西沙加(UTM)',city:'密西沙加',prov:'安省',deadline:'2027季(官网utm.utoronto.ca核实):申请1/15(推荐早申11/7);材料2/1;CS补充申请2/1;Theatre&Drama试镜2026年11月开放登记;桥接通道(Bridging)/难民通道(Refugee)2027年3月初开放',tuition:'67,700',tuitionRMB:'34万',programs:{
      eng:{gpa:'—',label:'na',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'无工程专业',note_detail:'UTM无Engineering本科'},
      cs:{gpa:'Mid-high 80s(85-88%)',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP@UTM(2027-09首开)',dual_thr:'待公布(参照UTSG IFP:5.0-6.5/写作5.5/单项≥5.0)',coop:'yes',coop_note:'CS Co-op',note:'踩线但新增双录通道!',note_detail:'UTM CS 85-88%你踩线;需要supplementary application;有Co-op选项;🆕已确认(2026-09-14,多大国际项目官网):IFP(International Foundation Program)将于2027年9月首开于UTM,提供"入学即有条件录取U of T+学分课程",覆盖Arts/Science/Business共180+专业(不含工程,UTM本身无工程);具体雅思门槛与申请截止待官网公布,2026-27参照UTSG IFP为总分5.0-6.5(写作≥5.5/单项≥5.0)——你听力/阅读4.5仍差0.5'},
      math:{gpa:'Mid-high 80s',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP@UTM(2027-09首开)',dual_thr:'待公布(参照UTSG IFP:5.0-6.5/写作5.5/单项≥5.0)',coop:'no',coop_note:'',note:'踩线;新增双录通道',note_detail:'UTM Math & Computational Sciences mid-high 80s;🆕IFP@UTM 2027-09首开,覆盖Science方向;门槛待官网公布,参照UTSG IFP 5.0-6.5(写作5.5/单项≥5.0),你单项4.5未达标'},
      psych:{gpa:'Mid 70s',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP@UTM(2027-09首开)',dual_thr:'待公布(参照UTSG IFP:5.0-6.5/写作5.5/单项≥5.0)',coop:'no',coop_note:'',note:'GPA绰绰有余+新增双录',note_detail:'GPA绰绰有余;🆕IFP@UTM 2027-09首开覆盖Science;门槛待公布,参照UTSG IFP 5.0-6.5(写作5.5/单项≥5.0),你单项4.5未达标'},
      biz:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP@UTM(2027-09首开)',dual_thr:'待公布(参照UTSG IFP:5.0-6.5/写作5.5/单项≥5.0)',coop:'yes',coop_note:'',note:'新增双录通道',note_detail:'🆕IFP@UTM 2027-09首开,官网明确覆盖Business;门槛待公布,参照UTSG IFP 5.0-6.5(写作5.5/单项≥5.0),你单项4.5未达标'},
      health:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP@UTM(2027-09首开)',dual_thr:'待公布(参照UTSG IFP:5.0-6.5/写作5.5/单项≥5.0)',coop:'no',coop_note:'',note:'新增双录通道',note_detail:'🆕IFP@UTM 2027-09首开覆盖Science;门槛待公布,参照UTSG IFP 5.0-6.5(写作5.5/单项≥5.0),你单项4.5未达标'},
      sci:{gpa:'Mid-high 80s',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP@UTM(2027-09首开)',dual_thr:'待公布(参照UTSG IFP:5.0-6.5/写作5.5/单项≥5.0)',coop:'no',coop_note:'',note:'Physical/Mathematical Sciences;新增双录',note_detail:'Physical/Mathematical Sciences mid-high 80s;🆕IFP@UTM 2027-09首开覆盖Science;门槛待公布,参照UTSG IFP 5.0-6.5(写作5.5/单项≥5.0),你单项4.5未达标'},
      social:{gpa:'Mid 70s',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP@UTM(2027-09首开)',dual_thr:'待公布(参照UTSG IFP:5.0-6.5/写作5.5/单项≥5.0)',coop:'no',coop_note:'',note:'GPA绰绰有余+新增双录',note_detail:'GPA绰绰有余;🆕IFP@UTM 2027-09首开覆盖Arts/Science;门槛待公布,参照UTSG IFP 5.0-6.5(写作5.5/单项≥5.0),你单项4.5未达标'}
    }},
    {name:'UBC·Okanagan',city:'基洛纳',prov:'BC省',deadline:'1月15日',tuition:'30,000-38,000',tuitionRMB:'15-19万',programs:{
      eng:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'EFP英语预科',dual_thr:'未达标即可申',coop:'yes',coop_note:'Engineering Co-op',note:'比温哥华校区低10分!',note_detail:'UBC Okanagan工程80-85%你完全够;有English Foundation Program双录路径'},
      cs:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'EFP英语预科',dual_thr:'未达标即可申',coop:'no',coop_note:'',note:'比温哥华校区低10分!',note_detail:''},
      math:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'EFP英语预科',dual_thr:'未达标即可申',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'EFP英语预科',dual_thr:'未达标即可申',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'80-85%(Management)',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'EFP英语预科',dual_thr:'未达标即可申',coop:'yes',coop_note:'Management Co-op',note:'',note_detail:''},
      health:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'EFP英语预科',dual_thr:'未达标即可申',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'EFP英语预科',dual_thr:'未达标即可申',coop:'no',coop_note:'',note:'',note_detail:''},
      social:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'EFP英语预科',dual_thr:'未达标即可申',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'阿尔伯塔',city:'埃德蒙顿',prov:'阿省',deadline:'2027季(官网 ualberta.ca 实抓):Launchpad 开放2026-10-01;多数专业(含国际生)申请截止2027-03-01;入学奖申请截止2027-01-10;材料截止——高中申请者2027-08-01、有专上学历者2027-06-15;自报成绩4/30;🆕申请费:C$150(首次申请) / C$100(在读或曾就读本校);🆕奖学金:每年约C$5,200万本科奖,国际生自动参与评审无需单独申请,入学奖约C$5,000、校长专项国际生奖可达C$12,000/年,均分85%+的中国学生年均约C$3,000–8,000',tuition:'28,000-35,000',tuitionRMB:'14-18万',programs:{
      eng:{gpa:'85-88%',label:'close',ielts:'6.5(5.5)',dual:'limit',dual_type:'EAP不含工程',dual_thr:'5.0(单项4.5)',coop:'yes',coop_note:'Engineering Co-op',note:'本校EAP不含工程',note_detail:'可通过CCEL双录但竞争激烈;🆕Alberta Year One Foundation平行大一(1/5/9月三季入学,高中均分70-75%,直录IELTS6.0(5.5),未达标配EAP)2026年起开放工程方向,读完直升大二'},
      cs:{gpa:'82-88%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'yes',coop_note:'CS Co-op',note:'你雅思5.0已达标双录!',note_detail:'EAP读完免雅思，CS录取82-88%你在范围内'},
      math:{gpa:'85-90%',label:'close',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'yes',coop_note:'',note:'你雅思5.0已达标双录',note_detail:''},
      psych:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'no',coop_note:'',note:'你雅思5.0已达标双录',note_detail:'心理GPA75%你89.6远超'},
      biz:{gpa:'80-85%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'yes',coop_note:'',note:'商科比CS好进',note_detail:''},
      health:{gpa:'80-85%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'70-75%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'渥太华',city:'渥太华',prov:'安省',deadline:'2027季:开放9/17;推荐截止1/15;材料2/15;🆕2026-09-24(官方奖学金页+第三方交叉):①International English Admission Scholarship 为自动评审、无需单独申请——C$7,500/学期、4年最高C$60,000;②叠加 International English Academic Excellence Scholarship C$10,000 → 合计最高 C$70,000;③门槛:入学均分≥80%(Academic Excellence 需≥95%);④2027冬季(1月)入学:申请截止2026-10-17、材料与语言成绩2026-11-01,冬季可选专业有限;⑤Fall 2027 国际生多数专业最终截止5月,校方明确建议勿等1/15后才递;🆕2026-10-04(官方口径复核):EIP 密集英语项目**有条件录取下限为 IELTS 4.5**(此前本表记「4.0+」不够精确);**任一单项 <4.0 则申请直接不受理**;IELTS 6.0 → 入读本科正课 + 大一少量 ESL 选修;Duolingo 85+ 可匹配不同阶段 EIP;语言成绩 2 年有效、仅认考试中心官方电子送分、不接受自行上传',tuition:'32,000-40,000',tuitionRMB:'16-20万',programs:{
      eng:{gpa:'80-87%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.5+(单项<4.0不受理)',coop:'yes',coop_note:'Engineering Co-op',note:'你雅思5.0已达标!',note_detail:'EIP雅思4.0+即可，你5.0完全够'},
      cs:{gpa:'80-87%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.5+(单项<4.0不受理)',coop:'yes',coop_note:'CS Co-op',note:'你雅思5.0已达标!',note_detail:'渥太华CS Co-op就业好'},
      math:{gpa:'75-80%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.5+(单项<4.0不受理)',coop:'yes',coop_note:'',note:'你雅思5.0已达标!',note_detail:''},
      psych:{gpa:'约70%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.5+(单项<4.0不受理)',coop:'no',coop_note:'',note:'最推荐!GPA绰绰有余',note_detail:'渥太华心理录取约70%，你89.6远超'},
      biz:{gpa:'85%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.5+(单项<4.0不受理)',coop:'yes',coop_note:'Telfer Co-op',note:'你雅思5.0已达标!',note_detail:'Telfer商学院85%你89.6远超'},
      health:{gpa:'89%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.5+(单项<4.0不受理)',coop:'no',coop_note:'',note:'GPA踩线!你雅思5.0已达标EIP',note_detail:'渥太华健康科学89%你89.6刚好踩线'},
      sci:{gpa:'75-80%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.5+(单项<4.0不受理)',coop:'yes',coop_note:'',note:'你雅思5.0已达标!',note_detail:''},
      social:{gpa:'80-85%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.5+(单项<4.0不受理)',coop:'no',coop_note:'',note:'你雅思5.0已达标!',note_detail:''}
    }},
    {name:'韦士敦',city:'伦敦',prov:'安省',deadline:'2027-01-15平等考虑;🆕2026-09-20(Ivey官方×第三方交叉核实):Ivey AEO 补充申请与本科网申同日 2027-01-15 截止,含奖项栏+2篇500词活动文书+至多5项活动+Kira视频面试,申请费$200;AEO学术线:Top6均分 low 90s(含ENG4U)+1门12年级U数学(MHF4U/MCV4U/MDM4U,无偏好);⚠️OUAC勾选AEO仅表示意向、不等于完成申请,须另在Ivey官网建号提交;Western录取与Ivey AEO录取分两次发出、须分别接受(过期不可恢复)',tuition:'32,000-38,000',tuitionRMB:'16-19万',programs:{
      eng:{gpa:'91%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'yes',coop_note:'Engineering Co-op',note:'你听力阅读4.5不够Boost',note_detail:'Boost9周读完免雅思，但你听力4.5<门槛5.0'},
      cs:{gpa:'84%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'yes',coop_note:'',note:'GPA够但Boost门槛不够',note_detail:''},
      math:{gpa:'mid 70s',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'mid-high 70s',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'85%(MOS)/94%(Ivey)',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'yes',coop_note:'Ivey AEO',note:'MOS GPA够,Ivey极难',note_detail:'Ivey AEO 94%极难，MOS 85%你89.6远超'},
      health:{gpa:'91%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'麦克马斯特',city:'哈密尔顿',prov:'安省',deadline:'2027季(官方9/18核实):推荐截止1/15;🆕补充申请截止逐项:CS/工程/B.Tech/iBioMed=2027-01-28 23:59ET(Kira Talent,同院多专业只填一次)、Arts&Science/IBH/WCLCS=2/1、Integrated Science=2/2、Health Sciences≈2月中、Nursing以CASPer考期为准;入学奖(AwardSpring)截止2027-02-19 23:59 ET,卓越奖最高CAD 20万;🆕2026-09-23(官网+OUAC实抓):所有本科申请截止1/15,补充/支持材料最晚2027-04-01前补齐;Group A 录取两轮——第一轮2027年2月底~3月初(需≥3门4U/M最终成绩,或6门中期成绩+剩余必修在读;首轮按学科开放,部分专业首轮不发offer)、第二轮2027年4月底~5月初(基于第二学期中期成绩);⚠️by-selection 专业(Arts&Science、Honours Health Sciences、Honours Integrated Science、Nursing、Midwifery)不在第一轮发offer,统一于第二轮结合补充申请评审;Midwifery 于2027-02-01审查OUAC最终成绩;全部offer基于2027-05-15前经OUAC收到的官方成绩',tuition:'34,000-42,000',tuitionRMB:'17-21万',programs:{
      eng:{gpa:'92%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'MELD+STEP',dual_thr:'MELD:5.0/STEP:6.5(读写6.0听说5.5)',coop:'yes',coop_note:'全部工程Co-op',note:'工程GPA差2.4分;你雅思5.0已达标MELD!',note_detail:'麦马工程92%你差2.4分；MELD(1年)门槛5.0你达标!🆕2026Fall起完成MELD可获12本科学分(4门课不再白读);STEP(7周夏)门槛6.5你不够；⚠️中加学籍学生必须提交雅思成绩;🆕已确认(2026-09-11):2027Fall起工程/iBioMed改双路径——Discovery Track(大一通识后按志愿+GPA+名额选拔,保证大二工程席位但不保证第一志愿)/Direct Program Track(高中申请即锁定具体工程方向,大一保持成绩即提前锁定);申请时同一项目内可按顺序填最多2个路径、优先审第一选择;另新增本科核工程(2027年9月起:核工程学士/核工程与社会4年/核工程与管理5年,均含Co-op)'},
      cs:{gpa:'94%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'MELD+STEP',dual_thr:'MELD:5.0/STEP:6.5(读写6.0听说5.5)',coop:'yes',coop_note:'',note:'CS差5分;你雅思5.0已达标MELD!',note_detail:'🆕2026Fall起完成MELD可获12本科学分(4门课不再白读);⚠️中加学籍学生必须提交雅思成绩'},
      math:{gpa:'85%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'MELD+STEP',dual_thr:'MELD:5.0/STEP:6.5(读写6.0听说5.5)',coop:'yes',coop_note:'',note:'你踩线!MELD门槛5.0你达标',note_detail:'麦马数学85%你刚好踩线；MELD(1年)门槛5.0你达标；🆕2026Fall起完成MELD可获12本科学分(4门课不再白读)；⚠️中加学籍学生必须提交雅思成绩'},
      psych:{gpa:'85%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'MELD+STEP',dual_thr:'MELD:5.0/STEP:6.5(读写6.0听说5.5)',coop:'no',coop_note:'',note:'你踩线!MELD门槛5.0你达标',note_detail:'🆕2026Fall起完成MELD可获12本科学分(4门课不再白读);⚠️中加学籍学生必须提交雅思成绩'},
      biz:{gpa:'88%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'MELD+STEP',dual_thr:'MELD:5.0/STEP:6.5(读写6.0听说5.5)',coop:'yes',coop_note:'DeGroote Co-op',note:'商科GPA够!超1.6分;MELD门槛5.0你达标',note_detail:'DeGroote 88%你89.6超1.6分；🆕2026Fall起完成MELD可获12本科学分(4门课不再白读)；⚠️中加学籍学生必须提交雅思成绩'},
      health:{gpa:'96%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'MELD+STEP',dual_thr:'MELD:5.0/STEP:6.5(读写6.0听说5.5)',coop:'no',coop_note:'',note:'BHSc极难(3%录取率)',note_detail:'🆕2026Fall起完成MELD可获12本科学分(4门课不再白读);⚠️中加学籍学生必须提交雅思成绩'},
      sci:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'MELD+STEP',dual_thr:'MELD:5.0/STEP:6.5(读写6.0听说5.5)',coop:'yes',coop_note:'',note:'MELD门槛5.0你达标',note_detail:'🆕2026Fall起完成MELD可获12本科学分(4门课不再白读);⚠️中加学籍学生必须提交雅思成绩'},
      social:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'MELD+STEP',dual_thr:'MELD:5.0/STEP:6.5(读写6.0听说5.5)',coop:'no',coop_note:'',note:'MELD门槛5.0你达标',note_detail:'🆕2026Fall起完成MELD可获12本科学分(4门课不再白读);⚠️中加学籍学生必须提交雅思成绩'}
    }},
    {name:'皇后',city:'金斯顿',prov:'安省',deadline:'2027季(官网 queensu.ca/admission + Smith 商学院页实抓;⚠️更正:此前只记「2/1」,实为分档):10/1开放申请;🆕商科(Commerce)/健康科学/护理 申请截止2027-02-01、强制补充申请2027-02-15(逾期不受理);🆕其余全部一年级专业申请截止2027-03-01;🆕全部材料(含成绩单与英语成绩)截止2027-03-31;护理 AST 材料2027-03-15;Major Admission Award:建议2026-11-20前递OUAC、2026-12-08 SOLUS截止;早期offer回复截止2027-05-01(非安省高中生);全部决定2027-05-21前在SOLUS公布;Group A/最终offer回复 + 住宿申请与押金 2027-06-01(16:00 ET);最终成绩单:安省7/15、非安省8/1、GCE/CAPE 9/1;QBridge 下一轮申请2026-10开放',tuition:'34,000-42,000',tuitionRMB:'17-21万',programs:{
      eng:{gpa:'88%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Q-Bridge',dual_thr:'5.5(EAP)/6.0(Accel)',coop:'yes',coop_note:'',note:'GPA够!超1.6分;EAP 5.5/Accel 6.0',note_detail:'2026 Q-Bridge分EAP(5.5)和Accelerated(6.0)两轨；你雅思5.0未达标；📊2026Fall录取实况(女王官网Gazette)：共64,400份申请(+8%创纪录)，录取新生平均高中均分92.3%——竞争度明显上移'},
      cs:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'Q-Bridge',dual_thr:'5.5(EAP)/6.0(Accel)',coop:'no',coop_note:'',note:'EAP 5.5/Accel 6.0',note_detail:'2026 Q-Bridge分EAP(5.5)和Accelerated(6.0)两轨；你雅思5.0未达标；📊2026Fall录取实况(女王官网Gazette)：共64,400份申请(+8%创纪录)，录取新生平均高中均分92.3%——竞争度明显上移'},
      math:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Q-Bridge',dual_thr:'5.5(EAP)/6.0(Accel)',coop:'no',coop_note:'',note:'EAP 5.5/Accel 6.0',note_detail:'2026 Q-Bridge分EAP(5.5)和Accelerated(6.0)两轨；你雅思5.0未达标；📊2026Fall录取实况(女王官网Gazette)：共64,400份申请(+8%创纪录)，录取新生平均高中均分92.3%——竞争度明显上移'},
      psych:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Q-Bridge',dual_thr:'5.5(EAP)/6.0(Accel)',coop:'no',coop_note:'',note:'EAP 5.5/Accel 6.0',note_detail:'2026 Q-Bridge分EAP(5.5)和Accelerated(6.0)两轨；你雅思5.0未达标；📊2026Fall录取实况(女王官网Gazette)：共64,400份申请(+8%创纪录)，录取新生平均高中均分92.3%——竞争度明显上移'},
      biz:{gpa:'94%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'Q-Bridge',dual_thr:'5.5(EAP)/6.0(Accel)',coop:'yes',coop_note:'Smith Commerce',note:'Smith Commerce极难',note_detail:'需要补充申请；2026 Q-Bridge分EAP(5.5)和Accelerated(6.0)两轨；📊2026Fall录取实况(女王官网Gazette)：共64,400份申请(+8%创纪录)，录取新生平均高中均分92.3%——竞争度明显上移'},
      health:{gpa:'94%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'Q-Bridge',dual_thr:'5.5(EAP)/6.0(Accel)',coop:'no',coop_note:'',note:'极难(7%录取率)',note_detail:'2026 Q-Bridge分EAP(5.5)和Accelerated(6.0)两轨；📊2026Fall录取实况(女王官网Gazette)：共64,400份申请(+8%创纪录)，录取新生平均高中均分92.3%——竞争度明显上移'},
      sci:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'Q-Bridge',dual_thr:'5.5(EAP)/6.0(Accel)',coop:'no',coop_note:'',note:'EAP 5.5/Accel 6.0',note_detail:'2026 Q-Bridge分EAP(5.5)和Accelerated(6.0)两轨；你雅思5.0未达标；📊2026Fall录取实况(女王官网Gazette)：共64,400份申请(+8%创纪录)，录取新生平均高中均分92.3%——竞争度明显上移'},
      social:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Q-Bridge',dual_thr:'5.5(EAP)/6.0(Accel)',coop:'no',coop_note:'',note:'EAP 5.5/Accel 6.0',note_detail:'2026 Q-Bridge分EAP(5.5)和Accelerated(6.0)两轨；你雅思5.0未达标；📊2026Fall录取实况(女王官网Gazette)：共64,400份申请(+8%创纪录)，录取新生平均高中均分92.3%——竞争度明显上移'}
    }},
    {name:'TMU(原Ryerson)',city:'多伦多',prov:'安省',deadline:'3月31日',tuition:'28,000-36,000',tuitionRMB:'14-18万',programs:{
      eng:{gpa:'88%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'全部工程Co-op',note:'工程GPA够!超1.6分',note_detail:'TMU工程88%你89.6超1.6分，CS更好进'},
      cs:{gpa:'82%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'CS Co-op',note:'你雅思5.0已达标!CS好进',note_detail:'TMU CS录取82%你完全够，地理位置极佳'},
      math:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'88%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'商科GPA够!超1.6分',note_detail:''},
      health:{gpa:'92%(Nursing)',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'Nursing极难',note_detail:''},
      sci:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'Guelph',city:'圭尔夫',prov:'安省',deadline:'3月31日',tuition:'26,000-34,000',tuitionRMB:'13-17万',programs:{
      eng:{gpa:'88%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'全部工程Co-op',note:'工程GPA够!超1.6分',note_detail:'Guelph工程88%你89.6超1.6分'},
      cs:{gpa:'89%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'CS Co-op',note:'CS GPA踩线!89.6 vs 89%',note_detail:'Guelph CS 89%你89.6踩线'},
      math:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'Commerce Co-op',note:'',note_detail:''},
      health:{gpa:'85-90%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'GPA在范围内',note_detail:''},
      sci:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:'Guelph理科强(农业/环境/生物)'},
      social:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''}
    }}
  ],
  t3:[
    {name:'卡尔加里',city:'卡尔加里',prov:'阿省',deadline:'常设:国际生开放8/15;申请截止3/1;材料3/15;4/1前offer须5/1接受;🆕2026-09-24(官方口径复核):申请费C$125(加方学历)/C$145(国际学历);高中课程须2027-06-30前完成、最终材料2027-08-01截止;4/1之后发出的offer给30天接受期;可填2个专业志愿,若先录第二志愿,新成绩到达后自动重新考虑第一志愿、无需重新申请',tuition:'26,000-32,000',tuitionRMB:'13-16万',programs:{
      eng:{gpa:'85-90%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'GPA在范围内',note_detail:''},
      cs:{gpa:'80-85%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      math:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'80-85%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      health:{gpa:'80-85%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:'🆕护理BScN(主校区)自2026Fall起:均分≥82%者进入抽签制而非纯拼分(官方日历);本行健康科学为通用口径,护理为独立申请通道'},
      sci:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      social:{gpa:'70-75%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'SFU',city:'温哥华',prov:'BC省',deadline:'2月28日;🆕2026-09-20(官方参议院文件S.26-55,2026-03-06决议/Fall 2026起生效):本科英语要求认可考试更新——①新增认可 LanguageCert Academic(总分≥70、单项≥65);②Duolingo 由疫情期间「临时认可」改为「永久认可」(总分125);③TOEFL 更新为新制6分制(总分4.5、单项≥4.0);⚠️对新门槛无影响:Duolingo 125≈雅思6.5,5.0仍须走 FIC 桥梁(5.0+)。⚠️持续不采纳(中介口径):商科/CS「隐性语言门槛雅思7.0(单项6.5)」,与SFU官网明示6.5(单项6.0)不符;🆕2026-09-24双录通道明细(官方口径复核):①校内 ESL 语言中心——共8级、每级8周、滚动开班,按分级测试入学,完成 Level 8 且总评≥B+ 即可直接进入本科正课(无需重考雅思、无需重新申请);②FIC(菲莎国际学院)校内桥梁——位于本拿比主校区,共享图书馆/实验室/学生卡等全部校园资源。你雅思5.0低于校内语言中心最高级直升标准,可逐级升读或走 FIC',tuition:'26,000-34,000',tuitionRMB:'13-17万',programs:{
      eng:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'FIC桥梁',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'你雅思5.0已达标!',note_detail:'FIC桥梁课程→SFU，温哥华地理位置好'},
      cs:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'FIC桥梁',dual_thr:'5.0+',coop:'yes',coop_note:'CS Co-op',note:'你雅思5.0已达标!',note_detail:''},
      math:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'FIC桥梁',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'FIC桥梁',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'FIC桥梁',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      health:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'FIC桥梁',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'FIC桥梁',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'FIC桥梁',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'维多利亚',city:'维多利亚',prov:'BC省',deadline:'9月入学1/31;冬季9/30;夏季3/31',tuition:'26,000-32,000',tuitionRMB:'13-16万',programs:{
      eng:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'UAP:6.0(5.5)/桥梁:5.5(5.0)',coop:'yes',coop_note:'',note:'',note_detail:''},
      cs:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'UAP:6.0(5.5)/桥梁:5.5(5.0)',coop:'yes',coop_note:'CS Co-op',note:'',note_detail:''},
      math:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'UAP:6.0(5.5)/桥梁:5.5(5.0)',coop:'yes',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'UAP:6.0(5.5)/桥梁:5.5(5.0)',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'UAP:6.0(5.5)/桥梁:5.5(5.0)',coop:'yes',coop_note:'',note:'',note_detail:''},
      health:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'UAP:6.0(5.5)/桥梁:5.5(5.0)',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'UAP:6.0(5.5)/桥梁:5.5(5.0)',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'UAP:6.0(5.5)/桥梁:5.5(5.0)',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'卡尔顿',city:'渥太华',prov:'安省',deadline:'2027季(官网 admissions.carleton.ca 实抓;⚠️更正:此前「常规3/31、夏季3/1」有误):🆕国际生(成绩单来自加/美以外)秋季主截止2027-04-01(加/美成绩单者2027-06-01);🆕2027冬季(1月):国际生(成绩单境外)2026-10-15、加/美成绩单者2026-11-15(仅部分专业开放冬季);安省高中生OUAC网申2027-01-15;🆕专业单独截止2027-03-01 + 补充材料2027-03-05(建筑研究/工业设计/音乐/护理/社会工作);Prestige奖学金2027-03-01;Leadership入学助学金2027-05-01;住宿接受与RAP 2027-06-07;入学助学金2027-06-30;🆕2026-10-04(官方两档英语门槛实抓):**ESLR(带语言条件录取)IELTS 5.0(各项≥4.5)** vs 直录 6.5(各项≥6.0);ESLR 修 ESLA 1300/1500/1900 + 学位课,最长 3 学期、学分计入学位;ESLR 不适用:IT/国际商务/Journalism and Humanities/Media Production and Design/Public Affairs/post-bacc 文凭(CS·工程·理科不受限);2027 秋国际生主截止 **2027-04-01**、材料补交同;Prestige 奖 3/1;作品集/补充表类 3/5;🆕2026-09-20(官网项目页英语要求核实):认可考试口径——IELTS 6.5(各项≥6.0)、TOEFL 新制4.5(各项≥4.0)、Duolingo 120(写/读/说110、听105)、CAEL 70(各项60)、PTE 55(沟通技能47)、Cambridge 176(各项169);亦可凭 AP英语(≥4) 或 IB英语A(HL/SL≥4) 满足',tuition:'26,000-34,000',tuitionRMB:'13-17万',programs:{
      eng:{gpa:'78-84%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0(各项≥4.5)',coop:'yes',coop_note:'',note:'与渥太华同城;✅你 5.0(各项≥4.5)达标 ESLR',note_detail:'🆕**2026-10-04 官方两档英语门槛实抓确认(经 StudyU 逐项对照 Carleton 官方页,2026-10-02 核对)**——**表1 直录(无附加英语要求)**:IELTS 6.5(各项≥6.0)、TOEFL 新制 4.5(各项≥4.0)、Duolingo 120(写/读/说 110、听 105)、PTE 55(各 47)、CAEL 70(各 60)、Cambridge 176(各 169);**表2 带语言条件录取 ESLR**:IELTS **5.0(各项≥4.5)**、TOEFL 新制 3.0、Duolingo 80、PTE 31、CAEL 40、Cambridge 154。ESLR 首学期修学术英语 ESLA 1300/1500/1900 + 少量学位课(0.5–1.5 学分),**最长 3 学期,且所修学分计入学位**;⚠️**ESLR 不适用于**:信息技术(IT)、国际商务(International Business)、Journalism and Humanities、Media Production and Design、Public Affairs and Policy Management、post-baccalaureate 文凭 → **CS/工程/理科/数学/心理/社科均不受限**;⚠️学校开具的英文授课证明信**不被接受**;✅**对你的判定:你 IELTS 5.0(W5.5/R4.5/L4.5/S5.0),各项均≥4.5 → 卡尔顿 ESLR 通道达标**(CS/理科/工程方向均可走);⚠️注意与中介「读写听三科平均≥5.0」口径不同(该口径下你 4.83 不达标),**以官方「各项≥4.5」为准**;学费冻结至 2028/29(CAD 39,000/45,000/55,000);自动奖(无需申请):入学奖 CAD 1,000–3,000/年 + 国际生首年 President’s Welcome Award CAD 2,000–5,000(可叠加)'},
      cs:{gpa:'78-84%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0(各项≥4.5)',coop:'yes',coop_note:'CS Co-op',note:'',note_detail:'🆕**2026-10-04 官方两档英语门槛实抓确认(经 StudyU 逐项对照 Carleton 官方页,2026-10-02 核对)**——**表1 直录(无附加英语要求)**:IELTS 6.5(各项≥6.0)、TOEFL 新制 4.5(各项≥4.0)、Duolingo 120(写/读/说 110、听 105)、PTE 55(各 47)、CAEL 70(各 60)、Cambridge 176(各 169);**表2 带语言条件录取 ESLR**:IELTS **5.0(各项≥4.5)**、TOEFL 新制 3.0、Duolingo 80、PTE 31、CAEL 40、Cambridge 154。ESLR 首学期修学术英语 ESLA 1300/1500/1900 + 少量学位课(0.5–1.5 学分),**最长 3 学期,且所修学分计入学位**;⚠️**ESLR 不适用于**:信息技术(IT)、国际商务(International Business)、Journalism and Humanities、Media Production and Design、Public Affairs and Policy Management、post-baccalaureate 文凭 → **CS/工程/理科/数学/心理/社科均不受限**;⚠️学校开具的英文授课证明信**不被接受**;✅**对你的判定:你 IELTS 5.0(W5.5/R4.5/L4.5/S5.0),各项均≥4.5 → 卡尔顿 ESLR 通道达标**(CS/理科/工程方向均可走);⚠️注意与中介「读写听三科平均≥5.0」口径不同(该口径下你 4.83 不达标),**以官方「各项≥4.5」为准**;学费冻结至 2028/29(CAD 39,000/45,000/55,000);自动奖(无需申请):入学奖 CAD 1,000–3,000/年 + 国际生首年 President’s Welcome Award CAD 2,000–5,000(可叠加)'},
      math:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0(各项≥4.5)',coop:'no',coop_note:'',note:'',note_detail:'🆕**2026-10-04 官方两档英语门槛实抓确认(经 StudyU 逐项对照 Carleton 官方页,2026-10-02 核对)**——**表1 直录(无附加英语要求)**:IELTS 6.5(各项≥6.0)、TOEFL 新制 4.5(各项≥4.0)、Duolingo 120(写/读/说 110、听 105)、PTE 55(各 47)、CAEL 70(各 60)、Cambridge 176(各 169);**表2 带语言条件录取 ESLR**:IELTS **5.0(各项≥4.5)**、TOEFL 新制 3.0、Duolingo 80、PTE 31、CAEL 40、Cambridge 154。ESLR 首学期修学术英语 ESLA 1300/1500/1900 + 少量学位课(0.5–1.5 学分),**最长 3 学期,且所修学分计入学位**;⚠️**ESLR 不适用于**:信息技术(IT)、国际商务(International Business)、Journalism and Humanities、Media Production and Design、Public Affairs and Policy Management、post-baccalaureate 文凭 → **CS/工程/理科/数学/心理/社科均不受限**;⚠️学校开具的英文授课证明信**不被接受**;✅**对你的判定:你 IELTS 5.0(W5.5/R4.5/L4.5/S5.0),各项均≥4.5 → 卡尔顿 ESLR 通道达标**(CS/理科/工程方向均可走);⚠️注意与中介「读写听三科平均≥5.0」口径不同(该口径下你 4.83 不达标),**以官方「各项≥4.5」为准**;学费冻结至 2028/29(CAD 39,000/45,000/55,000);自动奖(无需申请):入学奖 CAD 1,000–3,000/年 + 国际生首年 President’s Welcome Award CAD 2,000–5,000(可叠加)'},
      psych:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0(各项≥4.5)',coop:'no',coop_note:'',note:'',note_detail:'🆕**2026-10-04 官方两档英语门槛实抓确认(经 StudyU 逐项对照 Carleton 官方页,2026-10-02 核对)**——**表1 直录(无附加英语要求)**:IELTS 6.5(各项≥6.0)、TOEFL 新制 4.5(各项≥4.0)、Duolingo 120(写/读/说 110、听 105)、PTE 55(各 47)、CAEL 70(各 60)、Cambridge 176(各 169);**表2 带语言条件录取 ESLR**:IELTS **5.0(各项≥4.5)**、TOEFL 新制 3.0、Duolingo 80、PTE 31、CAEL 40、Cambridge 154。ESLR 首学期修学术英语 ESLA 1300/1500/1900 + 少量学位课(0.5–1.5 学分),**最长 3 学期,且所修学分计入学位**;⚠️**ESLR 不适用于**:信息技术(IT)、国际商务(International Business)、Journalism and Humanities、Media Production and Design、Public Affairs and Policy Management、post-baccalaureate 文凭 → **CS/工程/理科/数学/心理/社科均不受限**;⚠️学校开具的英文授课证明信**不被接受**;✅**对你的判定:你 IELTS 5.0(W5.5/R4.5/L4.5/S5.0),各项均≥4.5 → 卡尔顿 ESLR 通道达标**(CS/理科/工程方向均可走);⚠️注意与中介「读写听三科平均≥5.0」口径不同(该口径下你 4.83 不达标),**以官方「各项≥4.5」为准**;学费冻结至 2028/29(CAD 39,000/45,000/55,000);自动奖(无需申请):入学奖 CAD 1,000–3,000/年 + 国际生首年 President’s Welcome Award CAD 2,000–5,000(可叠加)'},
      biz:{gpa:'78-84%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0(各项≥4.5)',coop:'yes',coop_note:'Sprott Co-op',note:'Sprott商学院;⚠️国际商务(International Business)不开放 ESLR',note_detail:'🆕**2026-10-04 官方两档英语门槛实抓确认(经 StudyU 逐项对照 Carleton 官方页,2026-10-02 核对)**——**表1 直录(无附加英语要求)**:IELTS 6.5(各项≥6.0)、TOEFL 新制 4.5(各项≥4.0)、Duolingo 120(写/读/说 110、听 105)、PTE 55(各 47)、CAEL 70(各 60)、Cambridge 176(各 169);**表2 带语言条件录取 ESLR**:IELTS **5.0(各项≥4.5)**、TOEFL 新制 3.0、Duolingo 80、PTE 31、CAEL 40、Cambridge 154。ESLR 首学期修学术英语 ESLA 1300/1500/1900 + 少量学位课(0.5–1.5 学分),**最长 3 学期,且所修学分计入学位**;⚠️**ESLR 不适用于**:信息技术(IT)、国际商务(International Business)、Journalism and Humanities、Media Production and Design、Public Affairs and Policy Management、post-baccalaureate 文凭 → **CS/工程/理科/数学/心理/社科均不受限**;⚠️学校开具的英文授课证明信**不被接受**;✅**对你的判定:你 IELTS 5.0(W5.5/R4.5/L4.5/S5.0),各项均≥4.5 → 卡尔顿 ESLR 通道达标**(CS/理科/工程方向均可走);⚠️注意与中介「读写听三科平均≥5.0」口径不同(该口径下你 4.83 不达标),**以官方「各项≥4.5」为准**;学费冻结至 2028/29(CAD 39,000/45,000/55,000);自动奖(无需申请):入学奖 CAD 1,000–3,000/年 + 国际生首年 President’s Welcome Award CAD 2,000–5,000(可叠加)'},
      health:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0(各项≥4.5)',coop:'no',coop_note:'',note:'',note_detail:'🆕**2026-10-04 官方两档英语门槛实抓确认(经 StudyU 逐项对照 Carleton 官方页,2026-10-02 核对)**——**表1 直录(无附加英语要求)**:IELTS 6.5(各项≥6.0)、TOEFL 新制 4.5(各项≥4.0)、Duolingo 120(写/读/说 110、听 105)、PTE 55(各 47)、CAEL 70(各 60)、Cambridge 176(各 169);**表2 带语言条件录取 ESLR**:IELTS **5.0(各项≥4.5)**、TOEFL 新制 3.0、Duolingo 80、PTE 31、CAEL 40、Cambridge 154。ESLR 首学期修学术英语 ESLA 1300/1500/1900 + 少量学位课(0.5–1.5 学分),**最长 3 学期,且所修学分计入学位**;⚠️**ESLR 不适用于**:信息技术(IT)、国际商务(International Business)、Journalism and Humanities、Media Production and Design、Public Affairs and Policy Management、post-baccalaureate 文凭 → **CS/工程/理科/数学/心理/社科均不受限**;⚠️学校开具的英文授课证明信**不被接受**;✅**对你的判定:你 IELTS 5.0(W5.5/R4.5/L4.5/S5.0),各项均≥4.5 → 卡尔顿 ESLR 通道达标**(CS/理科/工程方向均可走);⚠️注意与中介「读写听三科平均≥5.0」口径不同(该口径下你 4.83 不达标),**以官方「各项≥4.5」为准**;学费冻结至 2028/29(CAD 39,000/45,000/55,000);自动奖(无需申请):入学奖 CAD 1,000–3,000/年 + 国际生首年 President’s Welcome Award CAD 2,000–5,000(可叠加)'},
      sci:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0(各项≥4.5)',coop:'yes',coop_note:'',note:'',note_detail:'🆕**2026-10-04 官方两档英语门槛实抓确认(经 StudyU 逐项对照 Carleton 官方页,2026-10-02 核对)**——**表1 直录(无附加英语要求)**:IELTS 6.5(各项≥6.0)、TOEFL 新制 4.5(各项≥4.0)、Duolingo 120(写/读/说 110、听 105)、PTE 55(各 47)、CAEL 70(各 60)、Cambridge 176(各 169);**表2 带语言条件录取 ESLR**:IELTS **5.0(各项≥4.5)**、TOEFL 新制 3.0、Duolingo 80、PTE 31、CAEL 40、Cambridge 154。ESLR 首学期修学术英语 ESLA 1300/1500/1900 + 少量学位课(0.5–1.5 学分),**最长 3 学期,且所修学分计入学位**;⚠️**ESLR 不适用于**:信息技术(IT)、国际商务(International Business)、Journalism and Humanities、Media Production and Design、Public Affairs and Policy Management、post-baccalaureate 文凭 → **CS/工程/理科/数学/心理/社科均不受限**;⚠️学校开具的英文授课证明信**不被接受**;✅**对你的判定:你 IELTS 5.0(W5.5/R4.5/L4.5/S5.0),各项均≥4.5 → 卡尔顿 ESLR 通道达标**(CS/理科/工程方向均可走);⚠️注意与中介「读写听三科平均≥5.0」口径不同(该口径下你 4.83 不达标),**以官方「各项≥4.5」为准**;学费冻结至 2028/29(CAD 39,000/45,000/55,000);自动奖(无需申请):入学奖 CAD 1,000–3,000/年 + 国际生首年 President’s Welcome Award CAD 2,000–5,000(可叠加)'},
      social:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0(各项≥4.5)',coop:'no',coop_note:'',note:'',note_detail:'🆕**2026-10-04 官方两档英语门槛实抓确认(经 StudyU 逐项对照 Carleton 官方页,2026-10-02 核对)**——**表1 直录(无附加英语要求)**:IELTS 6.5(各项≥6.0)、TOEFL 新制 4.5(各项≥4.0)、Duolingo 120(写/读/说 110、听 105)、PTE 55(各 47)、CAEL 70(各 60)、Cambridge 176(各 169);**表2 带语言条件录取 ESLR**:IELTS **5.0(各项≥4.5)**、TOEFL 新制 3.0、Duolingo 80、PTE 31、CAEL 40、Cambridge 154。ESLR 首学期修学术英语 ESLA 1300/1500/1900 + 少量学位课(0.5–1.5 学分),**最长 3 学期,且所修学分计入学位**;⚠️**ESLR 不适用于**:信息技术(IT)、国际商务(International Business)、Journalism and Humanities、Media Production and Design、Public Affairs and Policy Management、post-baccalaureate 文凭 → **CS/工程/理科/数学/心理/社科均不受限**;⚠️学校开具的英文授课证明信**不被接受**;✅**对你的判定:你 IELTS 5.0(W5.5/R4.5/L4.5/S5.0),各项均≥4.5 → 卡尔顿 ESLR 通道达标**(CS/理科/工程方向均可走);⚠️注意与中介「读写听三科平均≥5.0」口径不同(该口径下你 4.83 不达标),**以官方「各项≥4.5」为准**;学费冻结至 2028/29(CAD 39,000/45,000/55,000);自动奖(无需申请):入学奖 CAD 1,000–3,000/年 + 国际生首年 President’s Welcome Award CAD 2,000–5,000(可叠加)'}
    }},
    {name:'约克',city:'多伦多',prov:'安省',deadline:'滚动;2027国际生入学奖11/1-1/27;Winter 2027申请截止11/18;✅2026-09-23升级为多来源一致:Fall 2027国际生截止3/24(第三独立来源复核;各专业实际截止以 yorku.ca 逐专业页为准,建议提前一个月递交)',tuition:'26,000-34,000',tuitionRMB:'13-17万',programs:{
      eng:{gpa:'雅思7.5不双录!',label:'na',ielts:'7.5!',dual:'limit',dual_type:'YUELI不含工程CS',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'工程雅思7.5不双录!',note_detail:'约克工程要求雅思7.5且不接受双录取！'},
      cs:{gpa:'雅思7.5不双录!',label:'na',ielts:'7.5!',dual:'limit',dual_type:'YUELI不含工程CS',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'CS同工程限制',note_detail:''},
      math:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'YUELI',dual_thr:'5.0+',coop:'no',coop_note:'',note:'理学院可双录',note_detail:''},
      psych:{gpa:'65-70%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'YUELI',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'YUELI',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'Schulich难进',note_detail:'🆕2026-10-04(官网 schulich.yorku.ca 实抓):Schulich BBA Fall 2027 **双轮制**——①早轮(可选)OUAC 2026-11-06 + 补充申请 2026-11-23 23:59 ET;②常规 OUAC 2027-01-15 + 补充申请 2027-02-01 23:59 ET(**全部 Fall 2027 BBA 申请人同一截止**);校方明确**不递早轮不构成劣势**,早轮只影响审阅时点、不影响评审方式;补充申请 2026-11 开放;Delayed Entry(大二入学)2027-03-03'},
      health:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'YUELI',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:'🆕护理(Fall 2027)仅对加公民/PR/受保护人士,及目前在安省高中就读的国际生(<21岁,OUAC A)开放;最低均分high 80s'},
      sci:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'YUELI',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      social:{gpa:'65-70%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'YUELI',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'Laurier',city:'滑铁卢',prov:'安省',deadline:'常规3/31;冬季截止11/22;春季截止3/15',tuition:'24,000-30,000',tuitionRMB:'12-15万',programs:{
      eng:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'与滑铁卢同城',note_detail:'Laurier小校但性价比高'},
      cs:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      math:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'Lazaridis Co-op',note:'Lazaridis商学院',note_detail:''},
      health:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'65-70%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'Brock',city:'圣凯瑟琳',prov:'安省',deadline:'滚动录取',tuition:'24,000-28,000',tuitionRMB:'12-14万',programs:{
      eng:{gpa:'—',label:'na',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'无工程专业',note_detail:''},
      cs:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      math:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'心理学较强',note_detail:''},
      biz:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      health:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'65-70%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'温莎',city:'温莎',prov:'安省',deadline:'滚动;冬季国际生12/1截止;春季国际生4/1',tuition:'22,000-28,000',tuitionRMB:'11-14万',programs:{
      eng:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ELIP',dual_thr:'4.5+',coop:'yes',coop_note:'',note:'最稳保底',note_detail:''},
      cs:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ELIP',dual_thr:'4.5+',coop:'yes',coop_note:'',note:'',note_detail:''},
      math:{gpa:'70-75%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ELIP',dual_thr:'4.5+',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'65-70%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ELIP',dual_thr:'4.5+',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ELIP',dual_thr:'4.5+',coop:'yes',coop_note:'',note:'',note_detail:''},
      health:{gpa:'70-75%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ELIP',dual_thr:'4.5+',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'70-75%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ELIP',dual_thr:'4.5+',coop:'no',coop_note:'',note:'',note_detail:''},
      social:{gpa:'65-70%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ELIP',dual_thr:'4.5+',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'曼尼托巴',city:'温尼伯',prov:'曼省',deadline:'2027季:秋季直入(University 1 / 直接入系)申请截止2027-03-01;2027冬季10/01、2027春季02/01;🆕2026-09-24(官网 umanitoba.ca 实抓):(1)全新设立 International Excellence Entrance Scholarship(2027-28学年首届)——1名C$25,000 + 2名C$10,000,需单独提交申请,申请/材料/推荐人截止2026-12-01,⚠️推荐人不得为家庭成员,3月中公布,不可续期,可与校内其他奖叠加(需领导力与持续社区参与);(2)国际生自动入学奖(无需申请):五门高三课程均分95%+→C$3,000、90%+→C$2,000、85%+→C$1,000,须秋季+冬季均全日制(≥24学分);(3)⚠️更正英语门槛:IELTS 6.5(听力/阅读/写作/口语每项≥6.0,此前表内误记5.5);TOEFL新制4.5(每项4.0)、CAEL 60、PTE 58、Duolingo 120(每项105)、Cambridge 180;雅思成绩2年有效且须在入学学期开始时仍有效,接受 IELTS One Skill Retake;双录:ELC 的 IAEP 读至 Level 5 即有条件录取(约C$4,800/学期,EAPUCE)或走 ICM;(4)明确不要求会考或高考成绩',tuition:'18,000-24,000',tuitionRMB:'9-12万',programs:{
      eng:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ELSP',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'性价比极高',note_detail:'曼省学费最低+移民政策友好'},
      cs:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ELSP',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      math:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ELSP',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'65-70%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ELSP',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ELSP',dual_thr:'5.0+',coop:'yes',coop_note:'Asper Co-op',note:'Asper商学院',note_detail:''},
      health:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ELSP',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ELSP',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'65-70%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ELSP',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'戴尔豪斯',city:'哈利法克斯',prov:'新斯科舍省',deadline:'4月1日',tuition:'20,000-26,000',tuitionRMB:'10-13万',programs:{
      eng:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.5+',coop:'yes',coop_note:'',note:'东海岸',note_detail:''},
      cs:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.5+',coop:'yes',coop_note:'',note:'',note_detail:''},
      math:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.5+',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.5+',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.5+',coop:'yes',coop_note:'',note:'',note_detail:''},
      health:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.5+',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.5+',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'65-70%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.5+',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'萨省',city:'萨斯卡通',prov:'萨省',deadline:'3月1日',tuition:'18,000-22,000',tuitionRMB:'9-11万',programs:{
      eng:{gpa:'70-78%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      cs:{gpa:'70-78%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      math:{gpa:'70-75%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'65-70%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'70-78%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'Edwards Co-op',note:'Edwards商学院',note_detail:''},
      health:{gpa:'70-75%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'70-75%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'65-70%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'纽芬兰纪念',city:'圣约翰斯',prov:'纽省',deadline:'3月1日(滚动)',tuition:'12,000-18,000',tuitionRMB:'6-9万',programs:{
      eng:{gpa:'70-75%',label:'ok',ielts:'6.5(读写6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'学费全国最低!',note_detail:'2026起直录雅思要求读写单项≥6.0'},
      cs:{gpa:'70-75%',label:'ok',ielts:'6.5(读写6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:'2026起直录雅思要求读写单项≥6.0'},
      math:{gpa:'70-75%',label:'ok',ielts:'6.5(读写6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:'2026起直录雅思要求读写单项≥6.0'},
      psych:{gpa:'65-70%',label:'ok',ielts:'6.5(读写6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:'2026起直录雅思要求读写单项≥6.0'},
      biz:{gpa:'70-75%',label:'ok',ielts:'6.5(读写6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:'2026起直录雅思要求读写单项≥6.0'},
      health:{gpa:'70-75%',label:'ok',ielts:'6.5(读写6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:'2026起直录雅思要求读写单项≥6.0'},
      sci:{gpa:'70-75%',label:'ok',ielts:'6.5(读写6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:'2026起直录雅思要求读写单项≥6.0'},
      social:{gpa:'65-70%',label:'ok',ielts:'6.5(读写6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:'2026起直录雅思要求读写单项≥6.0'}
    }},
    {name:'康考迪亚',city:'蒙特利尔',prov:'魁省',deadline:'常设:秋季3/1(美/国际生建议2/1);冬季11/1(美/国际生建议8/1);自建系统(不走OUAC),最多填3个志愿(至多1个BComm);🆕英语成绩须<2年有效且收到校方通知后3周内提交(9/18核实);申请类入学奖2026-10重新开放;⚠️Grey Nuns宿舍2027-28不开放,2027住宿申请尚未公布',tuition:'22,000-28,000',tuitionRMB:'11-14万',programs:{
      eng:{gpa:'75-80%',label:'ok',ielts:'6.0(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'蒙特利尔',note_detail:'🆕2026-27官网确认:本科直录IELTS 6.0(单项≥5.5)；未达标者可能被录取但需入学修ESL课程'},
      cs:{gpa:'75-80%',label:'ok',ielts:'6.0(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'CS Co-op',note:'',note_detail:'🆕2026-27官网确认:本科直录IELTS 6.0(单项≥5.5)；未达标者可能被录取但需入学修ESL课程'},
      math:{gpa:'70-75%',label:'ok',ielts:'6.0(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:'🆕2026-27官网确认:本科直录IELTS 6.0(单项≥5.5)；未达标者可能被录取但需入学修ESL课程'},
      psych:{gpa:'70-75%',label:'ok',ielts:'6.0(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:'🆕2026-27官网确认:本科直录IELTS 6.0(单项≥5.5)；未达标者可能被录取但需入学修ESL课程'},
      biz:{gpa:'75-80%',label:'ok',ielts:'6.0(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'JMSB Co-op',note:'JMSB商学院',note_detail:'🆕2026-27官网确认:本科直录IELTS 6.0(单项≥5.5)；未达标者可能被录取但需入学修ESL课程'},
      health:{gpa:'70-75%',label:'ok',ielts:'6.0(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:'🆕2026-27官网确认:本科直录IELTS 6.0(单项≥5.5)；未达标者可能被录取但需入学修ESL课程'},
      sci:{gpa:'70-75%',label:'ok',ielts:'6.0(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:'🆕2026-27官网确认:本科直录IELTS 6.0(单项≥5.5)；未达标者可能被录取但需入学修ESL课程'},
      social:{gpa:'65-70%',label:'ok',ielts:'6.0(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:'🆕2026-27官网确认:本科直录IELTS 6.0(单项≥5.5)；未达标者可能被录取但需入学修ESL课程'}
    }}
  ],
  au:[
    {name:'UNSW',city:'悉尼',prov:'澳洲',deadline:'滚动;🆕2026-09-24(UNSW College 三类课程 2027 学费,中介口径待官网终核):Transition Program(16周,4月/8月)=A$29,980(2026: A$29,200);Standard Foundation(9个月,4月/10月)=A$43,650(2026: A$42,700);Standard Plus(12个月,1月/7月)=A$48,750(2026: A$47,800)。⚠️与 CRICOS 登记口径(Standard Plus 约A$47,000含非学费)存在差异,已列入待官网核实项。⚠️入学门槛由低到高为 Standard Plus → Standard → Transition,时长顺序相反;语言成绩是选类的关键变量',tuition:'43,650(2027)',tuitionRMB:'约21万',isFoundation:true,programs:{
      eng:{gpa:'预科GPA7.5/9.0',label:'ok',ielts:'Extended:5.0(4.5)|Standard Plus:5.5(5.0)|Standard理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended(15月)/Standard Plus(12月)',dual_thr:'5.0(4.5)Extended / 5.5(5.0)Standard Plus',coop:'yes',coop_note:'',note:'你雅思5.0走Extended达标!',note_detail:'UNSW Extended预科15个月IELTS5.0(4.5)你达标;🆕2026起新增Standard Plus 12个月(IELTS5.5/5.0);标准预科分轨:理科/文科IELTS5.5(写作5.5/其他≥5.0)你总分差0.5;商科IELTS6.0(写作5.5/其他≥5.5)你差1.0;升学率91%;🆕2026-09-14复核(CRICOS登记数据):Standard Plus(47周)学费A$46,000+非学费A$1,000=A$47,000;✅2026-09-23三来源一致(新东方/搜狐独立确认):UNSW国际大一(Diploma)2027年入学取消5月批次、仅保留1月与8月两批次;商科方向高考总分67%或高三均分94%、IELTS6.5(写作6.0);理科方向高三均分85%+数学90%、IELTS6.0(写作6.0);🆕国内预科口径(宏信教育 UNSW College 预科2027春招,预计2027-03下旬开学):高二/高三均分≥75% 或 高考≥50% 或 A-Level 2门≥3分;理科方向 IELTS 5.5(写作5.5/单项≥5.0)、商科方向 IELTS 6.0(写作5.5/单项≥5.0)'},
      cs:{gpa:'预科GPA7.5/9.0',label:'ok',ielts:'Extended:5.0(4.5)|Standard Plus:5.5(5.0)|Standard理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended(15月)/Standard Plus(12月)',dual_thr:'5.0(4.5)Extended / 5.5(5.0)Standard Plus',coop:'yes',coop_note:'',note:'你雅思5.0走Extended达标!',note_detail:'UNSW Extended预科15个月IELTS5.0(4.5)你达标;🆕2026起新增Standard Plus 12个月(IELTS5.5/5.0);标准预科理科IELTS5.5(写作5.5/其他≥5.0)你总分差0.5;🆕2026-09-14复核(CRICOS登记数据):Standard Plus(47周)学费A$46,000+非学费A$1,000合计A$47,000;✅2026-09-23三来源一致(新东方/搜狐独立确认):UNSW国际大一(Diploma)2027年入学取消5月批次、仅保留1月与8月两批次;商科方向高考总分67%或高三均分94%、IELTS6.5(写作6.0);理科方向高三均分85%+数学90%、IELTS6.0(写作6.0);🆕国内预科口径(宏信教育 UNSW College 预科2027春招,预计2027-03下旬开学):高二/高三均分≥75% 或 高考≥50% 或 A-Level 2门≥3分;理科方向 IELTS 5.5(写作5.5/单项≥5.0)、商科方向 IELTS 6.0(写作5.5/单项≥5.0)'},
      math:{gpa:'预科GPA7.0/9.0',label:'ok',ielts:'Extended:5.0(4.5)|Standard Plus:5.5(5.0)|Standard理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended(15月)/Standard Plus(12月)',dual_thr:'5.0(4.5)Extended / 5.5(5.0)Standard Plus',coop:'no',coop_note:'',note:'',note_detail:'🆕2026起新增Standard Plus 12个月(IELTS5.5/5.0);标准预科理科IELTS5.5(写作5.5/其他≥5.0)'},
      psych:{gpa:'预科GPA6.5/9.0',label:'ok',ielts:'Extended:5.0(4.5)|Standard Plus:5.5(5.0)|Standard理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended(15月)/Standard Plus(12月)',dual_thr:'5.0(4.5)Extended / 5.5(5.0)Standard Plus',coop:'no',coop_note:'',note:'',note_detail:'🆕2026起新增Standard Plus 12个月(IELTS5.5/5.0);标准预科理科IELTS5.5(写作5.5/其他≥5.0)'},
      biz:{gpa:'预科GPA7.0/9.0',label:'ok',ielts:'Extended:5.0(4.5)|Standard Plus:5.5(5.0)|Standard商科:6.0(写作5.5其他5.5)',dual:'yes',dual_type:'Extended(15月)/Standard Plus(12月)',dual_thr:'5.0(4.5)Extended / 5.5(5.0)Standard Plus',coop:'yes',coop_note:'',note:'标准商科IELTS6.0你差1.0;走Extended可行',note_detail:'🆕2026起新增Standard Plus 12个月(IELTS5.5/5.0);标准预科商科IELTS6.0(写作5.5/其他≥5.5)你差1.0;Extended预科IELTS5.0(4.5)你达标'},
      health:{gpa:'预科GPA7.0/9.0',label:'ok',ielts:'Extended:5.0(4.5)|Standard Plus:5.5(5.0)|Standard理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended(15月)/Standard Plus(12月)',dual_thr:'5.0(4.5)Extended / 5.5(5.0)Standard Plus',coop:'no',coop_note:'',note:'',note_detail:'🆕2026起新增Standard Plus 12个月(IELTS5.5/5.0);标准预科理科IELTS5.5(写作5.5/其他≥5.0)'},
      sci:{gpa:'预科GPA7.0/9.0',label:'ok',ielts:'Extended:5.0(4.5)|Standard Plus:5.5(5.0)|Standard理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended(15月)/Standard Plus(12月)',dual_thr:'5.0(4.5)Extended / 5.5(5.0)Standard Plus',coop:'no',coop_note:'',note:'',note_detail:'🆕2026起新增Standard Plus 12个月(IELTS5.5/5.0);标准预科理科IELTS5.5(写作5.5/其他≥5.0)'},
      social:{gpa:'预科GPA6.5/9.0',label:'ok',ielts:'Extended:5.0(4.5)|Standard Plus:5.5(5.0)|Standard理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended(15月)/Standard Plus(12月)',dual_thr:'5.0(4.5)Extended / 5.5(5.0)Standard Plus',coop:'no',coop_note:'',note:'',note_detail:'🆕2026起新增Standard Plus 12个月(IELTS5.5/5.0);标准预科理科IELTS5.5(写作5.5/其他≥5.0)'}
    }},
    {name:'昆士兰',city:'布里斯班',prov:'澳洲',deadline:'滚动;🆕2026-09-23(QTAC+UQ College口径复核):2027 S1 通过 QTAC 提交,申请通道2026-08-04开放、主要录取轮次截止2026-12-07、2026-10~2027-02发offer、2027-02-22开学;未达直录可走 UQ College 预科——标准预科10个月(高二/高三均分≥70%,IELTS 5.5(单项≥5.0))、快捷预科4个月(高三均分≥80%,IELTS 6.0(写作6.0));预科设高成就者奖学金可减免约20%学费;🆕2026-09-24(UQ 2027 S1 时间线,官方口径复核):2027年2月(S1)入学——仍接受无语言成绩的有条件录取申请;完整申请材料提交截止约2026-10月底;补交合格语言成绩最晚约2026-11月底;确认录取并缴纳学费押金截止约2027-01中旬;布里斯班年均生活成本约A$2.1–3万(比悉尼/墨尔本低15–20%);🆕**2026-10-02 澳洲学生签证诚信改革生效**(澳教育部+内政部官方;Migration Amendment (Student Visa Reform) Regulations 2026 等 4 份法规 2026-10-01 登记、**2026-10-02 起施行**):①**限制境内(onshore)学签申请**——17 类临时签证持有人(含 485 毕业生、482 技能、417/462 打工度假、600 访客等)不得在澳境内申请学生签证;②现有学签持有人续签原则上也须**在境外申请、且获批时人须在境外**(6 类豁免:课程进阶至更高 AQF 级别 / 完成学业需 ≤12 个月 / 博士 / 中小学课程 / 机构倒闭 / DFAT·国防资助);③**多数学生不能再携带配偶子女**(仅博士、太平洋与东盟护照、政府资助、已在澳家属豁免);④转学限制由 6 个月延长至 **12 个月**(过渡至 2027-06-30);⑤**2027-07-01 起新增「学生签证转学 stream」**——转学须先拿到新签证才能在新校开课,且只能同级或升级,**禁止高等教育(HE)转 VET**;⑥2026-10-02 前已递交的申请按旧规审理。**对你的实际影响**:你属中国境外直接申请预科/本科,**不受 onshore 限制**;但澳洲整体审核趋严,且预科(ELICOS/Foundation)→本科属「课程进阶」豁免范围可境内续签,路径本身仍通;请勿中途转去 VET',tuition:'36,280(2027预科)',tuitionRMB:'约18万',isFoundation:true,programs:{
      eng:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|IE打包:5.0(5.0)',dual:'yes',dual_type:'标准预科(10月)/IE+预科打包',dual_thr:'5.5(5.0)标准 / 5.0(5.0)+IE打包',coop:'yes',coop_note:'',note:'标准预科差0.5;IE打包你总分够但单项需5.0',note_detail:'🆕2026-27 UQ College官方:标准预科IELTS 5.5(单项≥5.0,10个月);打包Integrated English+预科IELTS 5.0(单项≥5.0);加速预科4个月IELTS 6.0(W6.0/其他≥5.5)。你听力/阅读4.5未达标标准预科，可走IE打包或先读语言'},
      cs:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|IE打包:5.0(5.0)',dual:'yes',dual_type:'标准预科(10月)/IE+预科打包',dual_thr:'5.5(5.0)标准 / 5.0(5.0)+IE打包',coop:'no',coop_note:'',note:'标准预科差0.5;IE打包你总分够但单项需5.0',note_detail:'🆕2026-27 UQ College官方:标准预科IELTS 5.5(单项≥5.0,10个月);打包Integrated English+预科IELTS 5.0(单项≥5.0);加速预科4个月IELTS 6.0(W6.0/其他≥5.5)。你听力/阅读4.5未达标标准预科，可走IE打包或先读语言'},
      math:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|IE打包:5.0(5.0)',dual:'yes',dual_type:'标准预科(10月)/IE+预科打包',dual_thr:'5.5(5.0)标准 / 5.0(5.0)+IE打包',coop:'no',coop_note:'',note:'标准预科差0.5;IE打包你总分够但单项需5.0',note_detail:'🆕2026-27 UQ College官方:标准预科IELTS 5.5(单项≥5.0,10个月);打包Integrated English+预科IELTS 5.0(单项≥5.0);加速预科4个月IELTS 6.0(W6.0/其他≥5.5)。你听力/阅读4.5未达标标准预科，可走IE打包或先读语言'},
      psych:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|IE打包:5.0(5.0)',dual:'yes',dual_type:'标准预科(10月)/IE+预科打包',dual_thr:'5.5(5.0)标准 / 5.0(5.0)+IE打包',coop:'no',coop_note:'',note:'标准预科差0.5;IE打包你总分够但单项需5.0',note_detail:'🆕2026-27 UQ College官方:标准预科IELTS 5.5(单项≥5.0,10个月);打包Integrated English+预科IELTS 5.0(单项≥5.0);加速预科4个月IELTS 6.0(W6.0/其他≥5.5)。你听力/阅读4.5未达标标准预科，可走IE打包或先读语言'},
      biz:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|IE打包:5.0(5.0)',dual:'yes',dual_type:'标准预科(10月)/IE+预科打包',dual_thr:'5.5(5.0)标准 / 5.0(5.0)+IE打包',coop:'no',coop_note:'',note:'标准预科差0.5;IE打包你总分够但单项需5.0',note_detail:'🆕2026-27 UQ College官方:标准预科IELTS 5.5(单项≥5.0,10个月);打包Integrated English+预科IELTS 5.0(单项≥5.0);加速预科4个月IELTS 6.0(W6.0/其他≥5.5)。你听力/阅读4.5未达标标准预科，可走IE打包或先读语言'},
      health:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|IE打包:5.0(5.0)',dual:'yes',dual_type:'标准预科(10月)/IE+预科打包',dual_thr:'5.5(5.0)标准 / 5.0(5.0)+IE打包',coop:'no',coop_note:'',note:'标准预科差0.5;IE打包你总分够但单项需5.0',note_detail:'🆕2026-27 UQ College官方:标准预科IELTS 5.5(单项≥5.0,10个月);打包Integrated English+预科IELTS 5.0(单项≥5.0);加速预科4个月IELTS 6.0(W6.0/其他≥5.5)。你听力/阅读4.5未达标标准预科，可走IE打包或先读语言'},
      sci:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|IE打包:5.0(5.0)',dual:'yes',dual_type:'标准预科(10月)/IE+预科打包',dual_thr:'5.5(5.0)标准 / 5.0(5.0)+IE打包',coop:'no',coop_note:'',note:'标准预科差0.5;IE打包你总分够但单项需5.0',note_detail:'🆕2026-27 UQ College官方:标准预科IELTS 5.5(单项≥5.0,10个月);打包Integrated English+预科IELTS 5.0(单项≥5.0);加速预科4个月IELTS 6.0(W6.0/其他≥5.5)。你听力/阅读4.5未达标标准预科，可走IE打包或先读语言'},
      social:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|IE打包:5.0(5.0)',dual:'yes',dual_type:'标准预科(10月)/IE+预科打包',dual_thr:'5.5(5.0)标准 / 5.0(5.0)+IE打包',coop:'no',coop_note:'',note:'标准预科差0.5;IE打包你总分够但单项需5.0',note_detail:'🆕2026-27 UQ College官方:标准预科IELTS 5.5(单项≥5.0,10个月);打包Integrated English+预科IELTS 5.0(单项≥5.0);加速预科4个月IELTS 6.0(W6.0/其他≥5.5)。你听力/阅读4.5未达标标准预科，可走IE打包或先读语言'}
    }},
    {name:'阿德莱德',city:'阿德莱德',prov:'澳洲',deadline:'滚动;🆕2026-09-24(Eynesbury 官网 fees 页实抓):①预科 Foundation Studies 2027 = A$36,200(8或12个月,Feb/June/Oct,CRICOS 074931M),IELTS 5.5(无单项<5.0),须完成澳洲 Year 11 或等效;②文凭(Diploma)路径 2027 学费——Stage 1 各专业均为 A$34,000(每模块 A$4,250);Stage 2:Arts A$36,200、Business A$41,400、Computing & IT A$42,400、Engineering A$45,000、Health Science A$41,900;③ELICOS 语言班 A$400/周(EGP/EAP Prep/EAP 同价);④一次性注册费 A$225、OSHC 约 A$838/年、住宿:Adelaide Student Lodge A$392.50/周、Homestay A$350/周(含餐)/A$260/周(自理)、学生公寓 A$290–650/周;🆕**2026-10-02 澳洲学生签证诚信改革生效**(详见昆士兰条目):限制境内学签申请(17 类临时签证)、现有学签续签须境外申请、多数学生不得携家属、转学限制 6→12 个月(至 2027-06-30)、2027-07-01 起新增转学 stream 且禁止 HE→VET。**你是境外直接申请,不受 onshore 限制**;预科→本科属课程进阶豁免范围',tuition:'预科 36,200(2027)',tuitionRMB:'约17.5万',isFoundation:true,programs:{
      eng:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|延伸:5.0(5.0)',dual:'yes',dual_type:'标准/延伸预科',dual_thr:'5.5(5.0)标准 / 5.0(5.0)延伸',coop:'yes',coop_note:'',note:'标准预科差0.5;延伸你总分够但单项需5.0',note_detail:'🆕2026-27 Adelaide College官方:标准/强化预科IELTS 5.5(单项≥5.0,9-12个月);延伸预科IELTS 5.0(单项≥5.0);加速预科IELTS 6.0(5.5)。你听力/阅读4.5未达标，需先读语言或考出5.0单项;✅2026-09-23 Eynesbury官网二次实抓复核一致:International Fees 2027 = A$36,200(2026 Guide 为 A$35,120)、IELTS 5.5(无单项低于5.0)、须完成澳洲 Year 11 或等效、8或12个月、Feb/June/Oct 三批入学、CRICOS 074931M;⚠️部分学位预科入学语言要求更高(如 Law(Juris Doctor 路径) 标注 IELTS 6.5(6.5)、个别学位需 IELTS 7.0(7.0) 方可由预科进入 Adelaide University),选校时须逐学位核对'},
      cs:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|延伸:5.0(5.0)',dual:'yes',dual_type:'标准/延伸预科',dual_thr:'5.5(5.0)标准 / 5.0(5.0)延伸',coop:'no',coop_note:'',note:'标准预科差0.5;延伸你总分够但单项需5.0',note_detail:'🆕2026-27 Adelaide College官方:标准/强化预科IELTS 5.5(单项≥5.0,9-12个月);延伸预科IELTS 5.0(单项≥5.0);加速预科IELTS 6.0(5.5)。你听力/阅读4.5未达标，需先读语言或考出5.0单项;✅2026-09-23 Eynesbury官网二次实抓复核一致:International Fees 2027 = A$36,200(2026 Guide 为 A$35,120)、IELTS 5.5(无单项低于5.0)、须完成澳洲 Year 11 或等效、8或12个月、Feb/June/Oct 三批入学、CRICOS 074931M;⚠️部分学位预科入学语言要求更高(如 Law(Juris Doctor 路径) 标注 IELTS 6.5(6.5)、个别学位需 IELTS 7.0(7.0) 方可由预科进入 Adelaide University),选校时须逐学位核对'},
      math:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|延伸:5.0(5.0)',dual:'yes',dual_type:'标准/延伸预科',dual_thr:'5.5(5.0)标准 / 5.0(5.0)延伸',coop:'no',coop_note:'',note:'标准预科差0.5;延伸你总分够但单项需5.0',note_detail:'🆕2026-27 Adelaide College官方:标准/强化预科IELTS 5.5(单项≥5.0,9-12个月);延伸预科IELTS 5.0(单项≥5.0);加速预科IELTS 6.0(5.5)。你听力/阅读4.5未达标，需先读语言或考出5.0单项;✅2026-09-23 Eynesbury官网二次实抓复核一致:International Fees 2027 = A$36,200(2026 Guide 为 A$35,120)、IELTS 5.5(无单项低于5.0)、须完成澳洲 Year 11 或等效、8或12个月、Feb/June/Oct 三批入学、CRICOS 074931M;⚠️部分学位预科入学语言要求更高(如 Law(Juris Doctor 路径) 标注 IELTS 6.5(6.5)、个别学位需 IELTS 7.0(7.0) 方可由预科进入 Adelaide University),选校时须逐学位核对'},
      psych:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|延伸:5.0(5.0)',dual:'yes',dual_type:'标准/延伸预科',dual_thr:'5.5(5.0)标准 / 5.0(5.0)延伸',coop:'no',coop_note:'',note:'标准预科差0.5;延伸你总分够但单项需5.0',note_detail:'🆕2026-27 Adelaide College官方:标准/强化预科IELTS 5.5(单项≥5.0,9-12个月);延伸预科IELTS 5.0(单项≥5.0);加速预科IELTS 6.0(5.5)。你听力/阅读4.5未达标，需先读语言或考出5.0单项;✅2026-09-23 Eynesbury官网二次实抓复核一致:International Fees 2027 = A$36,200(2026 Guide 为 A$35,120)、IELTS 5.5(无单项低于5.0)、须完成澳洲 Year 11 或等效、8或12个月、Feb/June/Oct 三批入学、CRICOS 074931M;⚠️部分学位预科入学语言要求更高(如 Law(Juris Doctor 路径) 标注 IELTS 6.5(6.5)、个别学位需 IELTS 7.0(7.0) 方可由预科进入 Adelaide University),选校时须逐学位核对'},
      biz:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|延伸:5.0(5.0)',dual:'yes',dual_type:'标准/延伸预科',dual_thr:'5.5(5.0)标准 / 5.0(5.0)延伸',coop:'no',coop_note:'',note:'标准预科差0.5;延伸你总分够但单项需5.0',note_detail:'🆕2026-27 Adelaide College官方:标准/强化预科IELTS 5.5(单项≥5.0,9-12个月);延伸预科IELTS 5.0(单项≥5.0);加速预科IELTS 6.0(5.5)。你听力/阅读4.5未达标，需先读语言或考出5.0单项;✅2026-09-23 Eynesbury官网二次实抓复核一致:International Fees 2027 = A$36,200(2026 Guide 为 A$35,120)、IELTS 5.5(无单项低于5.0)、须完成澳洲 Year 11 或等效、8或12个月、Feb/June/Oct 三批入学、CRICOS 074931M;⚠️部分学位预科入学语言要求更高(如 Law(Juris Doctor 路径) 标注 IELTS 6.5(6.5)、个别学位需 IELTS 7.0(7.0) 方可由预科进入 Adelaide University),选校时须逐学位核对'},
      health:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|延伸:5.0(5.0)',dual:'yes',dual_type:'标准/延伸预科',dual_thr:'5.5(5.0)标准 / 5.0(5.0)延伸',coop:'no',coop_note:'',note:'标准预科差0.5;延伸你总分够但单项需5.0',note_detail:'🆕2026-27 Adelaide College官方:标准/强化预科IELTS 5.5(单项≥5.0,9-12个月);延伸预科IELTS 5.0(单项≥5.0);加速预科IELTS 6.0(5.5)。你听力/阅读4.5未达标，需先读语言或考出5.0单项;✅2026-09-23 Eynesbury官网二次实抓复核一致:International Fees 2027 = A$36,200(2026 Guide 为 A$35,120)、IELTS 5.5(无单项低于5.0)、须完成澳洲 Year 11 或等效、8或12个月、Feb/June/Oct 三批入学、CRICOS 074931M;⚠️部分学位预科入学语言要求更高(如 Law(Juris Doctor 路径) 标注 IELTS 6.5(6.5)、个别学位需 IELTS 7.0(7.0) 方可由预科进入 Adelaide University),选校时须逐学位核对'},
      sci:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|延伸:5.0(5.0)',dual:'yes',dual_type:'标准/延伸预科',dual_thr:'5.5(5.0)标准 / 5.0(5.0)延伸',coop:'no',coop_note:'',note:'标准预科差0.5;延伸你总分够但单项需5.0',note_detail:'🆕2026-27 Adelaide College官方:标准/强化预科IELTS 5.5(单项≥5.0,9-12个月);延伸预科IELTS 5.0(单项≥5.0);加速预科IELTS 6.0(5.5)。你听力/阅读4.5未达标，需先读语言或考出5.0单项;✅2026-09-23 Eynesbury官网二次实抓复核一致:International Fees 2027 = A$36,200(2026 Guide 为 A$35,120)、IELTS 5.5(无单项低于5.0)、须完成澳洲 Year 11 或等效、8或12个月、Feb/June/Oct 三批入学、CRICOS 074931M;⚠️部分学位预科入学语言要求更高(如 Law(Juris Doctor 路径) 标注 IELTS 6.5(6.5)、个别学位需 IELTS 7.0(7.0) 方可由预科进入 Adelaide University),选校时须逐学位核对'},
      social:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|延伸:5.0(5.0)',dual:'yes',dual_type:'标准/延伸预科',dual_thr:'5.5(5.0)标准 / 5.0(5.0)延伸',coop:'no',coop_note:'',note:'标准预科差0.5;延伸你总分够但单项需5.0',note_detail:'🆕2026-27 Adelaide College官方:标准/强化预科IELTS 5.5(单项≥5.0,9-12个月);延伸预科IELTS 5.0(单项≥5.0);加速预科IELTS 6.0(5.5)。你听力/阅读4.5未达标，需先读语言或考出5.0单项;✅2026-09-23 Eynesbury官网二次实抓复核一致:International Fees 2027 = A$36,200(2026 Guide 为 A$35,120)、IELTS 5.5(无单项低于5.0)、须完成澳洲 Year 11 或等效、8或12个月、Feb/June/Oct 三批入学、CRICOS 074931M;⚠️部分学位预科入学语言要求更高(如 Law(Juris Doctor 路径) 标注 IELTS 6.5(6.5)、个别学位需 IELTS 7.0(7.0) 方可由预科进入 Adelaide University),选校时须逐学位核对'}
    }}
  ]
};

// delpoy_rev_10104
// 最后更新: 2026-10-04
// ▲本次更新(2026-10-04,覆盖 10/3–10/4 窗口): 今日**无院校录取 GPA/雅思门槛变动**;实质新增 = 多大工程「Track One」取消(官网确认) + 卡尔顿 ESLR 门槛精确化到单项并判定用户达标 + 量子工程新专业
//   ①🎓**多大工程 2027 重大变更(官网 discover.engineering.utoronto.ca/programs 实抓确认)**：本科申请路径**只剩 Core 8 与 Engineering Science 两条**，**「Track One」已被取消**(官网项目页不再出现)。Core 8 = Chemical/Civil/Computer/Electrical/Industrial/Materials/Mechanical/Mineral(一校区仅可报 1 个)；EngSci 直入、前两年 Foundation + 后两年 9 大主修。
//      另:工程学院新增辅修网络安全证书；工程**补充申请费 C$45.00**；补充申请 12/1(争 2 月首轮)、材料 1/15、建议 11/7 递 OUAC；宿舍保证 3/31 + 6/1。
//   ②✅**卡尔顿 ESLR 门槛精确化(对本用户直接利好)**：官方两档＝直录 IELTS 6.5(各项≥6.0) / **ESLR 带语言条件录取 IELTS 5.0(各项≥4.5)**。ESLR 修 ESLA 1300/1500/1900 + 学位课(0.5–1.5 学分)，最长 3 学期、**学分计入学位**；**不适用** IT/国际商务/Journalism and Humanities/Media Production and Design/Public Affairs/post-bacc → **CS·工程·理科不受限**。⇒ 你 5.0(W5.5/R4.5/L4.5/S5.0)**各项均≥4.5，ESLR 达标**。⚠️中介「读写听三科平均≥5.0」口径下你 4.83 不达标——以官方口径为准。
//   ③🆕**多大新增量子工程本科(Quantum Engineering)**：应用科学与工程学院，2027 秋首届、加拿大首个；⚠️中介口径，官网项目页暂未列出，待核实。
//   ④🆕**渥太华 EIP 下限精确化**：有条件录取下限 **IELTS 4.5**(原表记 4.0+ 不精确)；**任一单项 <4.0 直接不受理**；IELTS 6.0 可正课 + 大一 ESL 选修。
//   ⑤🆕**约克 Schulich BBA Fall 2027 双轮制**：早轮 OUAC 11/6 + 补充 11/23 23:59ET；常规 OUAC 1/15 + 补充 2/1 23:59ET；不递早轮不构成劣势；Delayed Entry 3/3。
//   ⑥📊**10 校英语门槛 9/30 复核一致**(Stellar 逐校对照官方页)：多大/UBC/麦吉尔/滑铁卢/Western/麦马/皇后/约克/渥太华/TMU 均维持 IELTS 6.5 体系，无变动。
//   ⑦⚠️**IRCC 2027–2029 Levels Plan 确认须于 2026-11-01 前提交议会**(预计 11 月初公布)：2027 学签新入境 150,000 仍为 notional；非永久居民占比目标 2027 底降至 <5%。
//   ⑧📌**临期行动项**：多大 Pearson 提名 **10/9**(距今 5 天)、OUAC 入学申请 10/16、奖学金材料 11/6；UBC 国际学者 11/15；uOttawa 冬季 10/17。
//   ⑨🇦🇺澳洲口径补充：UNSW Foundation 2027 Transition A$29,980 / Standard A$43,650 / Standard Plus A$48,750(入学 4&8 / 4&10 / 1&7 月)；UNSW College 学术英语 10 周 A$6,950；UQ College 2027 入学 2/15 与 9/6、标准预科 A$36,280、加速 A$27,490。
//   ⑩📚中外合办增补(三·补七)：华东政法×西澳大学 2+2 等，详见 MD。
// ▲本次更新(2026-10-02,覆盖 9/25–10/2 窗口): 今日**无院校录取 GPA/雅思门槛变动**;实质新增 = 澳洲学签诚信改革生效 + OUAC 官方日程全量 + McGill 已开放 + PAL 配额陷阱
//   ①🇦🇺**澳洲学生签证诚信改革 2026-10-02 生效**(澳教育部部长新闻稿 + Migration Amendment (Student Visa Reform) Regulations 2026,4 份法规 10-01 登记):
//      境内学签申请受限(17 类临时签证持有人不得在澳境内申请,含 485/482/417/462/600);现有学签续签原则上须境外申请且获批时人在境外(6 类豁免);
//      多数学生不得携配偶子女(5 类豁免);转学限制 6→12 个月(过渡至 2027-06-30);2027-07-01 起新设「学生签证转学 stream」,须先获新签方能开课、仅同级或升级、禁止 HE→VET。
//      → 对「境外直接申请」的蔡奇均**不受 onshore 限制**;预科(ELICOS/Foundation)→本科属课程进阶豁免,境内可续签;但整体审核趋严。
//   ②📅**OUAC 2026-2027 官方日程全量实抓**(go2.ouac.on.ca,2026-04-27 更新):09-17 开放;11-05 高中数据文件截止;11-19 期中/期末 4U/M 成绩截止;11-26 大学收成绩目标日;
//      **01-15 Group A 申请截止**;01-21 大学收数据目标日;02-11 期末 4U/M 成绩截止;04-22 高中报期中;05-03 大学收目标日;**05-28 最晚回复日**;**06-01 最早可要求答复日**;
//      🆕**06-03 AIS 补录信息服务开放**;07-08 期末成绩截止;07-15 剩余成绩送达。🆕**OUAC 申请费 C$159(前 3 志愿) + C$51/每增 1 志愿**(无单独国际生服务费)。
//   ③🎓**McGill Fall 2027 已于 2026-10-01 正式开放**:海外/美国学制主截止 2027-01-15、材料 2027-03-01、申请费 C$140.16;
//      **滚动录取**——10月递交可能圣诞节前出结果,1/14 递交常拖到春季;入学奖通常在申请截止后约 1 周;
//      ⚠️语言成绩须**考试机构直送**(不接受上传);⚠️**Desautels BCom 门槛更高**:TOEFL 100 / Duolingo 130(其余 90/125)。
//      → 你 5.0 距 6.5 差 1.5 且麦吉尔几乎无语言双录,现行不可申。
//   ④⚠️**PAL 2027 配额陷阱(重要行动项)**:2026 配额年签发的 PAL **有效期至 2026-12-31**;2027 年 9 月入学属 **2027 配额年**,
//      须待 IRCC 于 2026 年秋公布 2027 配额与省分配后,再申请 **2027 版 PAL**。多数本科/文凭/研文仍需 PAL,公立硕博自 2026-01-01 起免 PAL。
//      PAL 由学校在办学省办理(不是直接向省申请),处理约 2–6 周;接受 offer 后**书面向学校确认如何申请**——最常见的错误是以为 PAL 随 offer 自动发放。
//   ⑤📊IRCC Immigration Levels Plan 2027-2029「即将公布」:当前 2027 新入境国际学生目标 **150,000**(2026 为 155,000)、临时居民总目标 370,000(2027);
//      2026 学签签发上限 408,000(PAL 类 180,000/申请席位 309,670)。公布后须回填省配额。
//   ⑥🎓多大 **Pearson 国际奖学金**第三独立来源复核一致:校提名 10/9 12:00 EST、OUAC 入学申请 10/16、奖学金材料 11/6;约 37 人/年。
//   ⑦📈**uniscope.ca 实测录取数据(学生匿名上报,更新至 2026-09-05)首次纳入**:多大电气工程 23% / TrackOne 25%;Western Medical Sciences 42% / Ivey AEO 8%;
//      皇后 Health Sciences 7% / Smith 计算机工程 22%;UBC 工程物理 15% / Business+CS 组合 15%;麦马 Life Sciences Gateway 10% / iBioMed 14%;
//      麦吉尔建筑 10% / 生物工程 15%;卡尔加里整体 15%(工程 common first year 20%)、UVic 64%、Windsor 65%、Carleton BA Honours 竞争均分约 75%、录取中位 90%。
//      ⚠️此为「竞争度参照」,非门槛变更,不写入结论字段,仅作选校难度比对。
//   ⑧复核无变化(官方):多大 2027 三张表、UBC 2027 全量节点、麦吉尔 1/15、UBC/U of T 主截止 1/15、IRCC 生活费 **CAD 23,448**(2026-09-01 起)、SDS 已于 2024-11-08 关闭、
//      **9 个专业方向 GPA/雅思门槛零变动**、各校语言门槛与双录通道全数无放宽无收窄。
//   ⑨⚠️持续不采纳(连续 9 日):新东方系「多大文理网申 2/2、材料 2/16」(官网为 1/15+2/1);立思辰「SFU 商科/CS 实操全员雅思 7.0」
// ▲本次更新(2026-09-16): 今日**无院校录取门槛变化**;实质新增 = IRCC 规则细节确认 + 3 项"多来源一致"升级 + 中外合办按地区增补
//   ①✅IRCC 校外工作时长官方确认 **24 小时/周**(canada.ca "Work off campus" 页,2026-09-10 修订版):学期内上限 24h;学校排定的连续≥7天假期可无限制小时;
//      即使学签旧条件印的是"may work 20 hours per week off campus",仍可按 24 小时执行(IRCC 明文)。两个上限:连续假期>150天只能工作前150天;全年假期无限制工时总天数≤180天。
//      ⚠️关键约束:ESL/FSL 语言课在读期间**不得校外打工** → "先读语言班再进正课"的第一年为零打工收入。
//   ②📊2026 学签配额结构展开:总目标 **408,000**(新入境 155,000 + 境内延期 253,000;较 2025 的 437,000 降 7%);PAL/TAL 类签发目标 **180,000**、配套申请席位 **309,670**。
//      省份配额(签发目标/申请席位):安省 70,074/104,780(38.9%)、魁省 39,474/93,069(21.9%)、BC 24,786/32,596(13.8%)、阿省 21,582/32,271(12.0%)、
//      曼省 6,534/11,196、萨省 5,436/11,349、新斯科舍 4,680/8,480、新不伦瑞克 3,726/8,004、纽芬兰 2,358/5,507、PEI 774/1,376。
//      → 安省+魁省占约 2/3 席位;曼省/萨省/大西洋省份竞争面更窄 → 第三梯队保底校(曼尼托巴/萨省/戴尔豪斯/纽芬兰纪念)的 PAL 环节压力反而更小。
//      📉规模背景:2025 年新入境国际学生较 2024 减少约 61%(-177,595);在加国际学生总数同比降 29%(约 72.5 万);2025 学签拒签率 59%(2024 为 52%)。
//   ③🏠康考迪亚补充确认(2026-09-16 第二来源 Stellar Advisers):**Grey Nuns 宿舍 2027-28 不开放**(2027 住宿申请尚未公布,勿套用 Fall 2026 日期);
//      自建系统不走 OUAC、最多 3 志愿(至多 1 个 BComm);秋 3/1(国际生建议 2/1)、冬 11/1(国际生建议 8/1)与现表一致;
//      门槛参考(加拿大高中口径):BCompSc = 总体 B + 数学 B+;BEng = 总体 B+ + 数学 A− + 物理 A−;心理学 = CEGEP 27.5 / 高中 B。
//   ④📅约克 Winter 2027 截止 **11/18** 升级为"多来源一致"(4S Study Abroad 独立复核);Fall 2027 国际生约 3/24 仍待官网核实。
//   ⑤🇦🇺UNSW 国际大一(Diploma)2027 取消 5 月批次 → 多来源一致(仅保留 1 月与 8 月);方向门槛(未入结论字段):商科高考总分67%或高三均分94%、IELTS6.5(写作6.0);理科高三均分85%+数学90%、IELTS6.0(写作6.0)。
//      Eynesbury College(阿德莱德通道)官网复核:2027 学费 A$36,200、IELTS 5.5(单项≥5.0)、须完成澳洲 Year 11 或等效 → 与现表一致,你 5.0(听力/阅读4.5)不达标。
//   ⑥复核无变化(官方):UBC 2027 全量节点、多大 2027 三张表、UTM IFP 官网页(Sept 2027 首开;门槛与截止仍未公布)、OUAC Group A 本科截止 2027-01-15、
//      麦马申请轮次与学术日历 2026-2027、IRCC 学签资金 23,448 —— 9 个专业方向 GPA/雅思门槛零变动,各校语言门槛与双录通道无放宽无收窄。
//   ⑦⚠️持续不采纳(连续 6 日):新东方系"多大文理网申 2/2、材料 2/16"(官网汇总页 future.utoronto.ca 为 1/15+2/1;该说法源自 uoft.ca 官方子域 IFP 页,
//      口径冲突已记录于 UTSG 字段);同一新文称"运动机能学、护理 1/15 截止"亦与官方(材料 2/1)不符。
//   ⑧📚中外合办按地区增补(深圳/广州/上海/江苏/宁波):新增可确认门槛 = **南京理工 2+2 雅思≥5.0 免笔试**;
//      **上海外国语、上海财经 1.5+2/2+2 要求雅思 5.0–5.5 + 面试**(你 5.0 处门槛下沿);累计对雅思 5.0 开放的国际本科项目已达 8 条线。
// ▲本次更新(2026-09-15): ⚠️多大 Arts&Science 截止口径出现官方子域冲突 + 🎓Pearson 奖学金节点补全 + UTM 官方页面细化
//   ①⚠️**多大 Arts&Science 截止口径冲突升级(今日最需要你决策的一条)**:多大国际项目官网 IFP 专页(internationalprograms.utoronto.ca)明确写
//      "Application deadlines have been extended for the following programs in the Faculty of Arts and Science — New Deadline: **February 1, 2027**",
//      列出 Computer Science / Humanities / Life Sciences / Social Science / Mathematical and Physical Science 五类;其 Document Deadline Extension 写 "February 16, 2026"(年份疑为笔误)。
//      但未来学生官方汇总页(future.utoronto.ca/deadlines)2027 三张表仍为 **网申 1/15 / 材料 2/1 / 补充 2/1**。
//      → 判定:以官方汇总页(1/15+2/1)为准执行;但**该"延至2/1、材料2/16"说法确实出自 uoft.ca 官方子域**,故不再简单归为"中介错报"——
//        此前连续 5 日判错的"新东方系 2/2、2/16"口径,来源即此页。已在 UTSG 的 deadline 字段加注冲突提示。
//        ⚠️实操建议:仍按 **1/15 递交**;若 1/15 后该页仍显示延期,可作为补交窗口的备选依据,但不要依赖延期。
//   ②🎓**多大 Lester B. Pearson 国际奖学金 2027 关键节点(官方)**:学校提名截止 **2026-10-09 12:00 EST**、
//      OUAC 入学申请截止 **2026-10-16**、奖学金申请+材料截止 **2026-11-06**。每年约 37 人,覆盖四年全额学费+住宿+书本+杂费(单份价值超 CAD 20 万,全校年投入超 CAD 1200 万)。
//      每个中学每年仅可提名 **1 人** → 若考虑此通道,须**立刻**联系学校指导老师争取校内提名。
//   ③🆕**UTM 官方 Dates & Deadlines 页面核实(Fall 2027)**:网申 2027-01-15、早申推荐 11/7、材料 2027-02-01、
//      **CS 补充申请 2027-02-01**、Theatre & Drama Studies 试镜 2026 年 11 月开放登记、
//      **Bridging Pathway(桥接通道)与 Refugee Pathway(难民通道)2027 年 3 月初开放申请**、非学位/春季课程按项目单独截止。
//      → 已写入 UTM 的 deadline 字段(此前仅记 1/15 申请 + 2/1 材料)。UTM 的 Arts/Science/Business 各类材料统一 2/1。
//   ④📊**麦克马斯特 2027 复核**:推荐申请截止 2027-01-15;入学奖学金(AwardSpring)截止 **2027-02-19 23:59 ET**(与现表一致);
//      卓越奖学金额度可达 **CAD 20 万**(已补入 deadline 字段);MELD(8 个月)门槛 IELTS 5.0+/DET 75+、STEP(7 周夏)IELTS 6.5(读写 6.0/听说 5.5) —— 门槛**无变化**。
//   ⑤复核无变化(官方):UBC 2027 全量节点(10 月初开放 / 申请 1/15 / ELAS 材料 2/15 / 国际生奖学金轮 11/15 / 本国生奖学金轮 12/1 / 国际学者材料 1/31)、
//      滑铁卢 AIF(工程 2027-02-01、工程+数学 2027-02-01、其他 2027-02-15、Pharmacy 2027-01-20)、
//      UNSW College 2027 学费 **A$43,650**(2026 为 A$42,700;Standard 9 个月,4 月/10 月两次入学)、
//      UNSW 预科入口 IELTS 5.5、商科方向 6.0(单项 5.5)、IRCC 学签资金 **CAD 23,448**(2026-09-01 起)、
//      **9 个专业方向 GPA/雅思门槛零变动**、各校语言门槛与双录通道全数无放宽无收窄。
//   ⑥IRCC 背景(未影响本科申请门槛):2027-2028 学年新入境目标约 **15 万**(2026 为 155,000);2026-01~06 硕博占新学签 21%(2025 同期 12%);
//      博士学签 2 周加急;自 2026-09-04 起持有效工签者可在无需学签情况下修读 ≤6 个月课程(至 2027-12-31,与本科新生无关);
//      2026 年内 PGWP 专业清单不增不减;PGWP 本科及以上学位毕业生豁免 field-of-study 限制。
// ▲上次更新(2026-09-14): 🆕UTM 新增 IFP 双录通道(多大国际项目官网原文确认)——这是本月对"你"最实质的一条。
//   ①IFP(International Foundation Program)将于 2027年9月 首次开设于 UTM 校区(Mississauga)。
//     官方表述:"Enter U of T Mississauga conditionally as an undergraduate from day one—earning degree credits while building academic fluency",
//     即"入学即有条件录取U of T + 计入毕业学分",覆盖 Arts / Science / Business 共 180+ 专业、90 个学科领域(含CCIT、法证科学、环境科学等);
//     官方仅确认首开时间与覆盖范围,雅思门槛与申请截止尚未公布 → 表中 dual 字段由 no 改为 yes,门槛标"待公布(参照UTSG IFP:5.0-6.5/写作5.5/单项≥5.0)"。
//     ⚠️UTM 本身不设工程本科,故工程一栏维持 na;此前"UTSC/UTM 均无语言班"的判断对 UTM 已不成立(UTSC 仍无)。
//   ②皇后:📊2026Fall 录取实况(女王官网 Gazette):共 64,400 份申请(+8%,创校史纪录),录取新生平均高中均分 92.3% → 已写入各专业 note_detail。
//   ③UNSW:CRICOS 登记数据复核,Standard Plus(47周)学费 A$46,000 + 非学费 A$1,000 = A$47,000(与现表一致);
//     ⚠️中介口径待官网核实:UNSW 国际大一(Diploma)2027 取消 5 月批次、仅保留 1 月与 8 月;商科方向高考总分67%或高三均分94%、IELTS6.5(写作6.0);理科方向高三均分85%+数学90%、IELTS6.0(写作6.0)。
//   ④约克:⚠️待官网核实(中介口径)Fall 2027 国际生截止约 3/24、Winter 2027 约 11/18;皇后:冬季入学面向国际生(9/30网申/10/15材料)亦为中介口径。
//   ⑤澳洲 2027 名额与门槛(背景,均为院校层面或硕士口径,未写入本科结论字段):2027 国际新生国家规划名额维持 29.5 万,八大名额同比 +9%~18%;
//     悉尼大学取消合作办学 MOI 英文豁免、部分限额热门专业雅思提至 7.0(单项6.0);澳国立/悉尼/UNSW/UQ 授课型硕士双非均分下调(硕士口径,与本科申请无关)。
//   ⑥复核无变化(官方):UBC 2027(10月初开放/申请1/15/ELAS材料2/15/国际生奖学金轮11/15,冬季与夏季学期同期开放)、多大 2027 三张表、IRCC 学签资金 23,448(2026-09-01起)、
//     UTM/UTSC deadline 字段、各校语言门槛与双录通道、9 个专业方向录取 GPA/雅思门槛 —— 全数零变动,无放宽无收窄。
//   ⚠️反复出现但仍未采纳的中介口径(与官网不符):新东方系"多大文理/Rotman/建筑 网申 2/2、材料 2/16"(官网为 2/1,已连续 5 日不采纳);
//     SFU 商科/CS"隐性语言门槛 7.0";Concordia Grey Nuns 宿舍 2027-28 不开放。
//   ✅已结案(2026-09-24):用户本人确认 GPA = 89.6。此前任务书模板里的「86」为误写,不作数;全链路(网站/应用版/MD/USER.md)统一按 89.6 执行。
// ▲本次更新(2026-09-13): 🆕IRCC 学签规则集中调整(多项已生效)——直接影响语言/双录取路径。
//   ①前置课程学签有效期缩短(2026-02-19起):语言课/预科/bridging 等前置课程学签有效期=课程时长+90天(旧规为课程时长+12个月);
//     课程结束后须在加拿大境内重新申请学签才能进入正课(等待期可用 maintained status 继续就读)。
//     短于6个月的前置课程若为长课程录取的必要条件,仍须先申请学签(否则日后无法在境内转学签)。→ 双录/语言班路径须预留二次申请的时间与费用。
//   ②Co-op 工签取消(2026-04-01起):符合条件的高等教育国际生无需单独 co-op 工签,凭学签上的工作授权即可完成必需实习;
//     实习须为项目必要部分且占总时长≤50%;中学阶段仍可能需要。→ 利好(少一道手续)。
//   ③PGWP 2026 收紧:新增语言测试要求;非学位(college 文凭)课程适用 field-of-study 规则;限制公私合作(PPP)项目;网课规则收紧;
//     硕士3年PGWP保留;须在180天内在线申请;2026年内 PGWP 可申请专业清单不增不减。
//   ④2026-09起执行:学签续签"高风险"合规调查(重点筛查历史 SDS 申请人)+ LoA 集中核验正式生效——
//     DLI 须通过 IRCC Portal 在10个自然日内核验录取通知书/在读证明,超时申请退回且费用全额退还;
//     核验 no match 可能触发程序公正信(PFL),严重可认定虚假陈述。
//   ⑤规模数字(2026):新入境目标155,000;学签发放上限408,000(其中 PAL 类180,000/硕博49,000/中小学115,000/其他豁免64,000);
//     续签与境内延期不计入配额。2025年学签拒签率59%(2024年52%)。2023-06-27允许部分工签持有人免学签就读的临时政策已于2026-06-27到期。
//   ⑥UBC 2027 夏季学期(5-8月)同步开放申请(10月初开放/1/15截止)——deadline 字段已补注。
//   ⑦澳洲:UQ 2027 S1 经 QTAC 通道2026-08-04开放、主要轮次2026-12-07截止、2027-02-22开学;UQ College 标准预科(10个月)2027学费约 A$36,280,雅思5.5(单项5.0);快捷预科4个月雅思6.0(写作6.0)。
//   ⑧复核无变化(官网):多大2027官方三张表、UBC、滑铁卢、康考迪亚(秋3/1·冬11/1·国际生建议2/1)、卡尔加里(3/1·材料3/15·5/1接受)均与现表一致;
//     UNSW Standard 2027 A$43,650、Eynesbury/阿德莱德 A$36,200 与现表一致;9个专业方向录取GPA/雅思门槛零变动;各校语言门槛与双录通道全数无放宽无收窄。
//   ⚠️待官网核实(中介口径,仅备注未入结论字段):新东方"多大文理网申2/2材料2/16"(与官网2/1不符,不采纳);SFU商科/CS"隐性语言门槛7.0";Concordia Grey Nuns宿舍2027-28不开放。
// ▲本次更新(2026-09-12): ⚠️实质性规则变更——IRCC 学签资金证明门槛上调(官方,2026-09-01起生效)。
//   ①魁省外单人生活费证明由 CAD 22,895 → 23,448/年(+553);2人29,192/3人35,888/4人43,572/5人49,419/6人55,736/7人62,054,每增1人+6,318;魁省单独口径单人 CAD 24,617。
//     该金额须叠加第一年学费+往返交通费;以递交日为准(9/1前递交仍按旧表)。另自2026-07起IRCC要求所有案例均评估资金来源(不限高风险)。
//   ②澳洲485毕业生工签口径明确:本科/授课型硕士=2年、研究型硕博=3年、港/BNO=5年;年龄未满35岁;雅思总分6.5(单项≥5.5)且成绩须递交前1年内;须结课后6个月内于澳境内提交;2026-03-01起申请费上调(主申AUD4,600起,另有来源列5,750,口径不一以官网为准);2026起485/旅游签持有者不得在境内转500学签。
//   ③澳洲2027学年111门高校课程学费统一上调3.6%(UQ国际生IT/商科本科年费≈AUD60,952);2026国际生配额上调至29.5万;学签生活费证明AUD29,710/年。
//   ④复核无变化(官网):多大2027官方三张表(早申推荐11/7;材料工程1/15其余2/1;补充工程OSP1/15其余2/1)与现表完全一致——部分中介"文理网申2/2/材料2/16"口径与官网不符,不采纳;
//     UBC(10月初开放/申请1/15/ELAS材料2/15/奖学金轮11/15)、滑铁卢(2027-02-01截止;雅思6.5写6.5说6.5读6.0听6.0)、阿尔伯塔(2027-03-01)、卡尔顿(2027-03-01;IELTS6.5(6.0))均与现表一致。
//   ⑤9个专业方向录取GPA/雅思门槛:本次复核零变动;各校语言门槛与双录通道全数无放宽、无收窄。IRCC 2027境外学签配额仍约15万(规划值,待2026-11-01前2027-29计划确认),硕博免PAL、本科须PAL不变。
//   ⚠️待官网核实(中介口径,仅备注未入结论字段):女王2027年1月冬季入学面向国际生(BA/BSc/BCmp/Health Sci,网申9/30材料10/15);多大UTSC冬季仅本地生(11/7);UBC Okanagan冬季9月中旬、渥太华10月中旬、SFU直申9/15、UVic冬季9/30、约克11/18;卡尔加里商科≥82%、双录取走学术交流证书课程(B+)且护理/教育不参与双录、国际生学费工程38-48k CAD。
// ▲本次更新(2026-09-11): 三项"9-10待官网核实"中介口径今日全部升级为已确认并写入结论字段——
//   ①多大:已完成校内审批,自2027-09-01起推出四年制荣誉学位BCS(Bachelor of Computer Science),覆盖三校区CS相关项目(UTSG:CS专修/主修、数据科学专修、生物信息与计算生物学专修)。
//   ②麦马:2027Fall起工程/iBioMed改双路径——Discovery Track(大一通识后选拔,保证大二席位不保证第一志愿)/Direct Program Track(高中即锁定方向);新增本科核工程(2027-09起,学士/与社会4年/与管理5年,均含Co-op);工程·iBioMed·CS·B.Tech须工程补充申请(3视频+1书面)。
//   ③滑铁卢:2027季起工程全部申请者须线上视频面试+AIF;重修取最高一次成绩不扣分;认证夏校/夜校/网课/私校课程同等接受不加罚(全专业);数据科学主修·生物医学科学开放直接申请;建筑12年级英语门槛78%、取消English Précis、仅需1门12年级数学;地理与航空/科学与航空停用AIF。
//   ④UTSC:2026-09起CS分流扩为5个方向并新增"人工智能与机器学习方向"(含Co-op)。
//   ⑤UBC截止字段补全(官网you.ubc.ca):10月初开放申请/申请1/15/ELAS语言材料2/15/国际生奖学金轮11/15。
//   ⑥复核无变化:多大官方2027截止表(申请1/15+推荐早申11/7;材料工程·音乐1/15其余2/1;补充工程OSP·音乐1/15其余2/1)、滑铁卢截止(工程1/15/材料2/1;其余2/1/材料2/15)、麦吉尔1/15、卡尔加里常设(开放8/15或10/1·截止3/1·材料3/15)、各校语言门槛与双录通道、澳洲预科口径均与现表一致。
//   IRCC背景复核:2027境外学签配额仍约15万(2026=15.5万),硕博自2026-01-01起免PAL,本科仍须PAL。
// ▲本次更新(2026-09-10): 多大官网2027截止精化——网申(OUAC)统一1/15(医学放射科学2/1),推荐早申11/7;
//   材料:工程/音乐1/15,建筑/Rotman/文理其他/iSchool/KPE/UTM/UTSC 2/1;补充:工程(Online Student Profile)/音乐1/15,其余2/1。
//   阿尔伯塔2027官方时间线(开放10/1,多数专业截止3/1,入学奖1/10,补件8/1);Year One Foundation平行大一2026起开放工程方向。
//   滑铁卢2027公布:工程申请1/15(材料2/1),其余2/1(材料2/15);雅思直录6.5(W6.5/S6.5/R6.0/L6.0)与备考口径复核一致。
//   渥太华2027(开放9/17/推荐1/15/材料2/15);卡尔加里常设(8/15开放/3/1截止/3/15材料);康考迪亚常设(秋3/1/冬11/1)。
//   OUAC冬季/春夏官方:卡尔顿11/15+3/1、温莎国际生12/1+4/1、Laurier 11/22+3/15;UVic 9月入学1/31(UAP6.0/桥梁5.5)。
//   澳洲预科2027学费:UNSW Standard A$43,650(2026 42,700)、Eynesbury/阿德莱德 A$36,200。
//   ⚠️待官网核实(中介口径,仅以"待官网核实"标注于备注,未写入结论性字段):多大2027新增BCS学位、麦马工程Discovery/Direct双路径+核工程、滑铁卢重修不扣分/工程视频面试等。
// ▲本次更新(2026-09-09): 多大官网(future.utoronto.ca/deadlines)发布2027官方截止——工程/音乐 材料与补充1/15,
//   文理/建筑/Rotman/CS/UTM/UTSC 材料与补充2/1,早申推荐11/7(材料12/1);UTSG/UTSC/UTM deadline字段已按官方刷新;
//   麦吉尔2027海外高中申请截止1/15(官网Important Dates已标注Fall2027)、UBC 2027常规1/15(国际生奖学金轮11/15)均与现表一致;
//   IRCC背景:2027学签配额规划15万(2026=15.5万,待2026-11-01 levels plan确认),本科仍须PAL,GIC资金门槛CAD 22,895(2025-09-01起)
// ▲本次更新(2026-09-08): UBC Vantage雅思门槛修正5.0→5.5(听说≥5.0/读写≥5.5),旧'雅思5.0已达标Vantage'表述作废;
//   Vantage One Management无限期暂停(2026/27日历),现仅剩Engineering/Science两轨;新增CAP条件录取参照(6.0单项≥5.5);
//   多大UTSG工程IFP维持不含工程(OUInfo TUH旧条目待确认);韦士敦2027平等考虑截止1/15;卡尔加里BScN 82%+抽签(2026Fall起)
// 本次更新: 康考迪亚本科直录IELTS官方确认6.0(5.5)(此前误录6.5/5.5)
//         + UQ/阿德莱德标准预科IELTS修正为5.5(5.0)(延伸5.0/5.0),此前误录5.0/4.5
//         + UNSW新增Standard Plus 12个月预科轨道(IELTS5.5/5.0)
//         + 本地HTML profile GPA 86→89.6 与项目记忆保持一致
