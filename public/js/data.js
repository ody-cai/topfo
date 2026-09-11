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
    {name:'多大·圣乔治',city:'多伦多',prov:'安省',deadline:'2027季:申请1/15(推荐早申11/7);材料:工程/音乐1/15,其余2/1;补充:工程(OSP)/音乐1/15,其余2/1',tuition:'42,000-62,000',tuitionRMB:'21-34万',programs:{
      eng:{gpa:'92-95%',label:'hard',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'PEY Co-op',note:'工程无IFP双录!须直录雅思6.5',note_detail:'⚠️2026-27/2027-28 IFP官网仅覆盖Arts&Science/建筑景观设计/音乐，不含工程(须直录6.5(6.0));OUInfo仍列示IFP-Engineering旧条目(TUH,区间mid-80s~low90s),2027-28是否实际招生需向工程学院确认'},
      cs:{gpa:'93%(comp)/97.2%(median)',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP(Arts&Sci/Arch/Music)',dual_thr:'5.0-6.5(写作5.5/单项≥5.0)',coop:'yes',coop_note:'PEY Co-op',note:'CS竞争均分93%但录取中位97.2%;IFP覆盖Arts&Sci含CS',note_detail:'🆕已确认(2026-09-11):多大已完成校内审批,自2027-09-01起推出新的四年制荣誉学位BCS(Bachelor of Computer Science),覆盖三校区CS相关项目——UTSG:CS专修/主修、数据科学专修、生物信息学与计算生物学专修;2026-27 IFP覆盖Arts&Science(含CS/数学/心理)、建筑景观设计、音乐；新门槛单项≥5.0你听力/阅读4.5未达标'},
      math:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP(Arts&Sci/Arch/Music)',dual_thr:'5.0-6.5(写作5.5/单项≥5.0)',coop:'yes',coop_note:'',note:'IFP含Arts&Sci数学;门槛单项≥5.0你不够',note_detail:'2026-27 IFP覆盖Arts&Science(含数学)、建筑景观设计、音乐；新门槛单项≥5.0你听力/阅读4.5未达标'},
      psych:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP(Arts&Sci/Arch/Music)',dual_thr:'5.0-6.5(写作5.5/单项≥5.0)',coop:'no',coop_note:'',note:'IFP含Arts&Sci心理;门槛单项≥5.0你不够',note_detail:'2026-27 IFP覆盖Arts&Science(含心理)、建筑景观设计、音乐；新门槛单项≥5.0你听力/阅读4.5未达标'},
      biz:{gpa:'92-95%',label:'hard',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'Rotman Commerce',note:'Rotman极难;不含IFP(排除)',note_detail:'Rotman需补充申请且均分93%+；IFP Arts&Sci不含Rotman Commerce'},
      health:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP(Arts&Sci/Arch/Music)',dual_thr:'5.0-6.5(写作5.5/单项≥5.0)',coop:'no',coop_note:'',note:'IFP含Arts&Sci;门槛单项≥5.0你不够',note_detail:'2026-27 IFP覆盖Arts&Science、建筑景观设计、音乐；新门槛单项≥5.0你听力/阅读4.5未达标'},
      sci:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP(Arts&Sci/Arch/Music)',dual_thr:'5.0-6.5(写作5.5/单项≥5.0)',coop:'no',coop_note:'',note:'IFP含Arts&Sci理科;门槛单项≥5.0你不够',note_detail:'2026-27 IFP覆盖Arts&Science、建筑景观设计、音乐；新门槛单项≥5.0你听力/阅读4.5未达标'},
      social:{gpa:'80-85%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP(Arts&Sci/Arch/Music)',dual_thr:'5.0-6.5(写作5.5/单项≥5.0)',coop:'no',coop_note:'',note:'IFP含Arts&Sci社科;门槛单项≥5.0你不够',note_detail:'2026-27 IFP覆盖Arts&Science、建筑景观设计、音乐；新门槛单项≥5.0你听力/阅读4.5未达标'}
    }},
    {name:'UBC·温哥华',city:'温哥华',prov:'BC省',deadline:'2027季:10月初开放申请;申请1/15;ELAS语言材料2/15;国际生奖学金轮11/15',tuition:'40,000-48,000',tuitionRMB:'20-25万',programs:{
      eng:{gpa:'90-94%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'Vantage(One Engineering)',dual_thr:'5.5(听说5.0/读写5.5)',coop:'yes',coop_note:'Engineering Co-op',note:'Vantage需5.5未达标;CAP 6.0',note_detail:'⚠️2026-27官方Vantage最低雅思5.5(听说≥5.0/读写≥5.5)，你5.0未达标;Vantage One现仅剩Engineering/Science两轨(Management无限期暂停);另有CAP条件录取需6.0(单项≥5.5)'},
      cs:{gpa:'92-95%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'Vantage(One Science可修CS)',dual_thr:'5.5(听说5.0/读写5.5)',coop:'yes',coop_note:'CS Co-op',note:'Vantage需5.5未达标',note_detail:'⚠️Vantage官方最低雅思5.5(听说≥5.0/读写≥5.5)，你5.0未达标;CS可经Vantage One Science衔接或直入Science后进CS;CAP需6.0(单项≥5.5)'},
      math:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'Vantage(One Science)',dual_thr:'5.5(听说5.0/读写5.5)',coop:'yes',coop_note:'',note:'Vantage需5.5未达标',note_detail:'⚠️Vantage官方最低雅思5.5(听说≥5.0/读写≥5.5)，你5.0未达标;建议先冲雅思总分5.5且读写5.5'},
      psych:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:'UBC心理学无Vantage双录'},
      biz:{gpa:'90-94%',label:'hard',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'Sauder Co-op',note:'Sauder极难+补充申请',note_detail:'需Personal Profile+面试'},
      health:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:''},
      sci:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'Vantage(One Science)',dual_thr:'5.5(听说5.0/读写5.5)',coop:'yes',coop_note:'',note:'Vantage需5.5未达标',note_detail:'⚠️Vantage官方最低雅思5.5(听说≥5.0/读写≥5.5)，你5.0未达标;Science轨内可选CS/数学等;CAP需6.0(单项≥5.5)'},
      social:{gpa:'80-85%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:''}
    }},
    {name:'麦吉尔',city:'蒙特利尔',prov:'魁省',deadline:'1月15日',tuition:'34,000-45,000',tuitionRMB:'17-23万',programs:{
      eng:{gpa:'88-92%',label:'hard',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'Engineering Co-op',note:'几乎无双录',note_detail:''},
      cs:{gpa:'93-95%',label:'hard',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'',note:'几乎无双录',note_detail:''},
      math:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:''},
      psych:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:''},
      biz:{gpa:'90-94%',label:'hard',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'',note:'Desautels极难',note_detail:'92%+需要补充申请'},
      health:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:''},
      sci:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:''},
      social:{gpa:'80-85%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:''}
    }},
    {name:'滑铁卢',city:'滑铁卢',prov:'安省',deadline:'2027季:工程申请1/15(材料2/1);其余专业申请2/1(材料2/15)',tuition:'40,000-48,000',tuitionRMB:'20-25万',programs:{
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
    {name:'多大·密西沙加(UTM)',city:'密西沙加',prov:'安省',deadline:'2027季:申请1/15(推荐早申11/7);材料2/1',tuition:'67,700',tuitionRMB:'34万',programs:{
      eng:{gpa:'—',label:'na',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'无工程专业',note_detail:'UTM无Engineering本科'},
      cs:{gpa:'Mid-high 80s(85-88%)',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'CS Co-op',note:'你踩线!需补充申请',note_detail:'UTM CS 85-88%你刚好踩线;需要supplementary application;有Co-op选项；🆕IFP@UTM将于2027年9月上线'},
      math:{gpa:'Mid-high 80s',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'踩线',note_detail:'UTM Math & Computational Sciences mid-high 80s'},
      psych:{gpa:'Mid 70s',label:'ok',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'GPA绰绰有余',note_detail:''},
      biz:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'',note:'',note_detail:''},
      health:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'Mid-high 80s',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'Physical/Mathematical Sciences',note_detail:''},
      social:{gpa:'Mid 70s',label:'ok',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'GPA绰绰有余',note_detail:''}
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
    {name:'阿尔伯塔',city:'埃德蒙顿',prov:'阿省',deadline:'2027季:开放10/1;多数专业申请截止3/1;自报成绩4/30;补件8/1;入学奖1/10',tuition:'28,000-35,000',tuitionRMB:'14-18万',programs:{
      eng:{gpa:'85-88%',label:'close',ielts:'6.5(5.5)',dual:'limit',dual_type:'EAP不含工程',dual_thr:'5.0(单项4.5)',coop:'yes',coop_note:'Engineering Co-op',note:'本校EAP不含工程',note_detail:'可通过CCEL双录但竞争激烈;🆕Alberta Year One Foundation平行大一(1/5/9月三季入学,高中均分70-75%,直录IELTS6.0(5.5),未达标配EAP)2026年起开放工程方向,读完直升大二'},
      cs:{gpa:'82-88%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'yes',coop_note:'CS Co-op',note:'你雅思5.0已达标双录!',note_detail:'EAP读完免雅思，CS录取82-88%你在范围内'},
      math:{gpa:'85-90%',label:'close',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'yes',coop_note:'',note:'你雅思5.0已达标双录',note_detail:''},
      psych:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'no',coop_note:'',note:'你雅思5.0已达标双录',note_detail:'心理GPA75%你89.6远超'},
      biz:{gpa:'80-85%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'yes',coop_note:'',note:'商科比CS好进',note_detail:''},
      health:{gpa:'80-85%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'70-75%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'渥太华',city:'渥太华',prov:'安省',deadline:'2027季:开放9/17;推荐截止1/15;材料2/15',tuition:'32,000-40,000',tuitionRMB:'16-20万',programs:{
      eng:{gpa:'80-87%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.0+',coop:'yes',coop_note:'Engineering Co-op',note:'你雅思5.0已达标!',note_detail:'EIP雅思4.0+即可，你5.0完全够'},
      cs:{gpa:'80-87%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.0+',coop:'yes',coop_note:'CS Co-op',note:'你雅思5.0已达标!',note_detail:'渥太华CS Co-op就业好'},
      math:{gpa:'75-80%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.0+',coop:'yes',coop_note:'',note:'你雅思5.0已达标!',note_detail:''},
      psych:{gpa:'约70%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.0+',coop:'no',coop_note:'',note:'最推荐!GPA绰绰有余',note_detail:'渥太华心理录取约70%，你89.6远超'},
      biz:{gpa:'85%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.0+',coop:'yes',coop_note:'Telfer Co-op',note:'你雅思5.0已达标!',note_detail:'Telfer商学院85%你89.6远超'},
      health:{gpa:'89%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.0+',coop:'no',coop_note:'',note:'GPA踩线!你雅思5.0已达标EIP',note_detail:'渥太华健康科学89%你89.6刚好踩线'},
      sci:{gpa:'75-80%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.0+',coop:'yes',coop_note:'',note:'你雅思5.0已达标!',note_detail:''},
      social:{gpa:'80-85%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.0+',coop:'no',coop_note:'',note:'你雅思5.0已达标!',note_detail:''}
    }},
    {name:'韦士敦',city:'伦敦',prov:'安省',deadline:'2027-01-15平等考虑(Ivey AEO同日)',tuition:'32,000-38,000',tuitionRMB:'16-19万',programs:{
      eng:{gpa:'91%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'yes',coop_note:'Engineering Co-op',note:'你听力阅读4.5不够Boost',note_detail:'Boost9周读完免雅思，但你听力4.5<门槛5.0'},
      cs:{gpa:'84%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'yes',coop_note:'',note:'GPA够但Boost门槛不够',note_detail:''},
      math:{gpa:'mid 70s',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'mid-high 70s',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'85%(MOS)/94%(Ivey)',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'yes',coop_note:'Ivey AEO',note:'MOS GPA够,Ivey极难',note_detail:'Ivey AEO 94%极难，MOS 85%你89.6远超'},
      health:{gpa:'91%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'麦克马斯特',city:'哈密尔顿',prov:'安省',deadline:'2027季:推荐截止1/15;工程/CS/iBioMed/B.Tech须工程补充申请(3视频+1书面);入学奖2/19',tuition:'34,000-42,000',tuitionRMB:'17-21万',programs:{
      eng:{gpa:'92%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'MELD+STEP',dual_thr:'MELD:5.0/STEP:6.5(读写6.0听说5.5)',coop:'yes',coop_note:'全部工程Co-op',note:'工程GPA差2.4分;你雅思5.0已达标MELD!',note_detail:'麦马工程92%你差2.4分；MELD(1年)门槛5.0你达标!🆕2026Fall起完成MELD可获12本科学分(4门课不再白读);STEP(7周夏)门槛6.5你不够；⚠️中加学籍学生必须提交雅思成绩;🆕已确认(2026-09-11):2027Fall起工程/iBioMed改双路径——Discovery Track(大一通识后按志愿+GPA+名额选拔,保证大二工程席位但不保证第一志愿)/Direct Program Track(高中申请即锁定具体工程方向,大一保持成绩即提前锁定);申请时同一项目内可按顺序填最多2个路径、优先审第一选择;另新增本科核工程(2027年9月起:核工程学士/核工程与社会4年/核工程与管理5年,均含Co-op)'},
      cs:{gpa:'94%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'MELD+STEP',dual_thr:'MELD:5.0/STEP:6.5(读写6.0听说5.5)',coop:'yes',coop_note:'',note:'CS差5分;你雅思5.0已达标MELD!',note_detail:'🆕2026Fall起完成MELD可获12本科学分(4门课不再白读);⚠️中加学籍学生必须提交雅思成绩'},
      math:{gpa:'85%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'MELD+STEP',dual_thr:'MELD:5.0/STEP:6.5(读写6.0听说5.5)',coop:'yes',coop_note:'',note:'你踩线!MELD门槛5.0你达标',note_detail:'麦马数学85%你刚好踩线；MELD(1年)门槛5.0你达标；🆕2026Fall起完成MELD可获12本科学分(4门课不再白读)；⚠️中加学籍学生必须提交雅思成绩'},
      psych:{gpa:'85%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'MELD+STEP',dual_thr:'MELD:5.0/STEP:6.5(读写6.0听说5.5)',coop:'no',coop_note:'',note:'你踩线!MELD门槛5.0你达标',note_detail:'🆕2026Fall起完成MELD可获12本科学分(4门课不再白读);⚠️中加学籍学生必须提交雅思成绩'},
      biz:{gpa:'88%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'MELD+STEP',dual_thr:'MELD:5.0/STEP:6.5(读写6.0听说5.5)',coop:'yes',coop_note:'DeGroote Co-op',note:'商科GPA够!超1.6分;MELD门槛5.0你达标',note_detail:'DeGroote 88%你89.6超1.6分；🆕2026Fall起完成MELD可获12本科学分(4门课不再白读)；⚠️中加学籍学生必须提交雅思成绩'},
      health:{gpa:'96%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'MELD+STEP',dual_thr:'MELD:5.0/STEP:6.5(读写6.0听说5.5)',coop:'no',coop_note:'',note:'BHSc极难(3%录取率)',note_detail:'🆕2026Fall起完成MELD可获12本科学分(4门课不再白读);⚠️中加学籍学生必须提交雅思成绩'},
      sci:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'MELD+STEP',dual_thr:'MELD:5.0/STEP:6.5(读写6.0听说5.5)',coop:'yes',coop_note:'',note:'MELD门槛5.0你达标',note_detail:'🆕2026Fall起完成MELD可获12本科学分(4门课不再白读);⚠️中加学籍学生必须提交雅思成绩'},
      social:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'MELD+STEP',dual_thr:'MELD:5.0/STEP:6.5(读写6.0听说5.5)',coop:'no',coop_note:'',note:'MELD门槛5.0你达标',note_detail:'🆕2026Fall起完成MELD可获12本科学分(4门课不再白读);⚠️中加学籍学生必须提交雅思成绩'}
    }},
    {name:'皇后',city:'金斯顿',prov:'安省',deadline:'2月1日(国际生)',tuition:'34,000-42,000',tuitionRMB:'17-21万',programs:{
      eng:{gpa:'88%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Q-Bridge',dual_thr:'5.5(EAP)/6.0(Accel)',coop:'yes',coop_note:'',note:'GPA够!超1.6分;EAP 5.5/Accel 6.0',note_detail:'2026 Q-Bridge分EAP(5.5)和Accelerated(6.0)两轨；你雅思5.0未达标'},
      cs:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'Q-Bridge',dual_thr:'5.5(EAP)/6.0(Accel)',coop:'no',coop_note:'',note:'EAP 5.5/Accel 6.0',note_detail:'2026 Q-Bridge分EAP(5.5)和Accelerated(6.0)两轨；你雅思5.0未达标'},
      math:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Q-Bridge',dual_thr:'5.5(EAP)/6.0(Accel)',coop:'no',coop_note:'',note:'EAP 5.5/Accel 6.0',note_detail:'2026 Q-Bridge分EAP(5.5)和Accelerated(6.0)两轨；你雅思5.0未达标'},
      psych:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Q-Bridge',dual_thr:'5.5(EAP)/6.0(Accel)',coop:'no',coop_note:'',note:'EAP 5.5/Accel 6.0',note_detail:'2026 Q-Bridge分EAP(5.5)和Accelerated(6.0)两轨；你雅思5.0未达标'},
      biz:{gpa:'94%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'Q-Bridge',dual_thr:'5.5(EAP)/6.0(Accel)',coop:'yes',coop_note:'Smith Commerce',note:'Smith Commerce极难',note_detail:'需要补充申请；2026 Q-Bridge分EAP(5.5)和Accelerated(6.0)两轨'},
      health:{gpa:'94%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'Q-Bridge',dual_thr:'5.5(EAP)/6.0(Accel)',coop:'no',coop_note:'',note:'极难(7%录取率)',note_detail:'2026 Q-Bridge分EAP(5.5)和Accelerated(6.0)两轨'},
      sci:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'Q-Bridge',dual_thr:'5.5(EAP)/6.0(Accel)',coop:'no',coop_note:'',note:'EAP 5.5/Accel 6.0',note_detail:'2026 Q-Bridge分EAP(5.5)和Accelerated(6.0)两轨；你雅思5.0未达标'},
      social:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Q-Bridge',dual_thr:'5.5(EAP)/6.0(Accel)',coop:'no',coop_note:'',note:'EAP 5.5/Accel 6.0',note_detail:'2026 Q-Bridge分EAP(5.5)和Accelerated(6.0)两轨；你雅思5.0未达标'}
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
    {name:'卡尔加里',city:'卡尔加里',prov:'阿省',deadline:'常设:国际生开放8/15;申请截止3/1;材料3/15;4/1前offer须5/1接受',tuition:'26,000-32,000',tuitionRMB:'13-16万',programs:{
      eng:{gpa:'85-90%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'GPA在范围内',note_detail:''},
      cs:{gpa:'80-85%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      math:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'80-85%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      health:{gpa:'80-85%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:'🆕护理BScN(主校区)自2026Fall起:均分≥82%者进入抽签制而非纯拼分(官方日历);本行健康科学为通用口径,护理为独立申请通道'},
      sci:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      social:{gpa:'70-75%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'SFU',city:'温哥华',prov:'BC省',deadline:'2月28日',tuition:'26,000-34,000',tuitionRMB:'13-17万',programs:{
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
    {name:'卡尔顿',city:'渥太华',prov:'安省',deadline:'常规3/31;冬季截止11/15;夏季截止3/1',tuition:'26,000-34,000',tuitionRMB:'13-17万',programs:{
      eng:{gpa:'78-84%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'与渥太华同城',note_detail:''},
      cs:{gpa:'78-84%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'CS Co-op',note:'',note_detail:''},
      math:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'78-84%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'Sprott Co-op',note:'Sprott商学院',note_detail:''},
      health:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'约克',city:'多伦多',prov:'安省',deadline:'滚动;2027国际生入学奖申请11/1-1/27',tuition:'26,000-34,000',tuitionRMB:'13-17万',programs:{
      eng:{gpa:'雅思7.5不双录!',label:'na',ielts:'7.5!',dual:'limit',dual_type:'YUELI不含工程CS',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'工程雅思7.5不双录!',note_detail:'约克工程要求雅思7.5且不接受双录取！'},
      cs:{gpa:'雅思7.5不双录!',label:'na',ielts:'7.5!',dual:'limit',dual_type:'YUELI不含工程CS',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'CS同工程限制',note_detail:''},
      math:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'YUELI',dual_thr:'5.0+',coop:'no',coop_note:'',note:'理学院可双录',note_detail:''},
      psych:{gpa:'65-70%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'YUELI',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'YUELI',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'Schulich难进',note_detail:''},
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
    {name:'曼尼托巴',city:'温尼伯',prov:'曼省',deadline:'3月1日',tuition:'18,000-24,000',tuitionRMB:'9-12万',programs:{
      eng:{gpa:'80-85%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ELSP',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'性价比极高',note_detail:'曼省学费最低+移民政策友好'},
      cs:{gpa:'80-85%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ELSP',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      math:{gpa:'70-75%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ELSP',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'65-70%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ELSP',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ELSP',dual_thr:'5.0+',coop:'yes',coop_note:'Asper Co-op',note:'Asper商学院',note_detail:''},
      health:{gpa:'70-75%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ELSP',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'70-75%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ELSP',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'65-70%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ELSP',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''}
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
    {name:'康考迪亚',city:'蒙特利尔',prov:'魁省',deadline:'常设:秋季3/1(国际生建议2/1);冬季11/1;最多填3个志愿',tuition:'22,000-28,000',tuitionRMB:'11-14万',programs:{
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
    {name:'UNSW',city:'悉尼',prov:'澳洲',deadline:'滚动',tuition:'43,650(2027)',tuitionRMB:'约21万',isFoundation:true,programs:{
      eng:{gpa:'预科GPA7.5/9.0',label:'ok',ielts:'Extended:5.0(4.5)|Standard Plus:5.5(5.0)|Standard理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended(15月)/Standard Plus(12月)',dual_thr:'5.0(4.5)Extended / 5.5(5.0)Standard Plus',coop:'yes',coop_note:'',note:'你雅思5.0走Extended达标!',note_detail:'UNSW Extended预科15个月IELTS5.0(4.5)你达标;🆕2026起新增Standard Plus 12个月(IELTS5.5/5.0);标准预科分轨:理科/文科IELTS5.5(写作5.5/其他≥5.0)你总分差0.5;商科IELTS6.0(写作5.5/其他≥5.5)你差1.0;升学率91%'},
      cs:{gpa:'预科GPA7.5/9.0',label:'ok',ielts:'Extended:5.0(4.5)|Standard Plus:5.5(5.0)|Standard理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended(15月)/Standard Plus(12月)',dual_thr:'5.0(4.5)Extended / 5.5(5.0)Standard Plus',coop:'yes',coop_note:'',note:'你雅思5.0走Extended达标!',note_detail:'UNSW Extended预科15个月IELTS5.0(4.5)你达标;🆕2026起新增Standard Plus 12个月(IELTS5.5/5.0);标准预科理科IELTS5.5(写作5.5/其他≥5.0)你总分差0.5'},
      math:{gpa:'预科GPA7.0/9.0',label:'ok',ielts:'Extended:5.0(4.5)|Standard Plus:5.5(5.0)|Standard理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended(15月)/Standard Plus(12月)',dual_thr:'5.0(4.5)Extended / 5.5(5.0)Standard Plus',coop:'no',coop_note:'',note:'',note_detail:'🆕2026起新增Standard Plus 12个月(IELTS5.5/5.0);标准预科理科IELTS5.5(写作5.5/其他≥5.0)'},
      psych:{gpa:'预科GPA6.5/9.0',label:'ok',ielts:'Extended:5.0(4.5)|Standard Plus:5.5(5.0)|Standard理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended(15月)/Standard Plus(12月)',dual_thr:'5.0(4.5)Extended / 5.5(5.0)Standard Plus',coop:'no',coop_note:'',note:'',note_detail:'🆕2026起新增Standard Plus 12个月(IELTS5.5/5.0);标准预科理科IELTS5.5(写作5.5/其他≥5.0)'},
      biz:{gpa:'预科GPA7.0/9.0',label:'ok',ielts:'Extended:5.0(4.5)|Standard Plus:5.5(5.0)|Standard商科:6.0(写作5.5其他5.5)',dual:'yes',dual_type:'Extended(15月)/Standard Plus(12月)',dual_thr:'5.0(4.5)Extended / 5.5(5.0)Standard Plus',coop:'yes',coop_note:'',note:'标准商科IELTS6.0你差1.0;走Extended可行',note_detail:'🆕2026起新增Standard Plus 12个月(IELTS5.5/5.0);标准预科商科IELTS6.0(写作5.5/其他≥5.5)你差1.0;Extended预科IELTS5.0(4.5)你达标'},
      health:{gpa:'预科GPA7.0/9.0',label:'ok',ielts:'Extended:5.0(4.5)|Standard Plus:5.5(5.0)|Standard理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended(15月)/Standard Plus(12月)',dual_thr:'5.0(4.5)Extended / 5.5(5.0)Standard Plus',coop:'no',coop_note:'',note:'',note_detail:'🆕2026起新增Standard Plus 12个月(IELTS5.5/5.0);标准预科理科IELTS5.5(写作5.5/其他≥5.0)'},
      sci:{gpa:'预科GPA7.0/9.0',label:'ok',ielts:'Extended:5.0(4.5)|Standard Plus:5.5(5.0)|Standard理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended(15月)/Standard Plus(12月)',dual_thr:'5.0(4.5)Extended / 5.5(5.0)Standard Plus',coop:'no',coop_note:'',note:'',note_detail:'🆕2026起新增Standard Plus 12个月(IELTS5.5/5.0);标准预科理科IELTS5.5(写作5.5/其他≥5.0)'},
      social:{gpa:'预科GPA6.5/9.0',label:'ok',ielts:'Extended:5.0(4.5)|Standard Plus:5.5(5.0)|Standard理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended(15月)/Standard Plus(12月)',dual_thr:'5.0(4.5)Extended / 5.5(5.0)Standard Plus',coop:'no',coop_note:'',note:'',note_detail:'🆕2026起新增Standard Plus 12个月(IELTS5.5/5.0);标准预科理科IELTS5.5(写作5.5/其他≥5.0)'}
    }},
    {name:'昆士兰',city:'布里斯班',prov:'澳洲',deadline:'滚动',tuition:'36,000',tuitionRMB:'约18万',isFoundation:true,programs:{
      eng:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|IE打包:5.0(5.0)',dual:'yes',dual_type:'标准预科(10月)/IE+预科打包',dual_thr:'5.5(5.0)标准 / 5.0(5.0)+IE打包',coop:'yes',coop_note:'',note:'标准预科差0.5;IE打包你总分够但单项需5.0',note_detail:'🆕2026-27 UQ College官方:标准预科IELTS 5.5(单项≥5.0,10个月);打包Integrated English+预科IELTS 5.0(单项≥5.0);加速预科4个月IELTS 6.0(W6.0/其他≥5.5)。你听力/阅读4.5未达标标准预科，可走IE打包或先读语言'},
      cs:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|IE打包:5.0(5.0)',dual:'yes',dual_type:'标准预科(10月)/IE+预科打包',dual_thr:'5.5(5.0)标准 / 5.0(5.0)+IE打包',coop:'no',coop_note:'',note:'标准预科差0.5;IE打包你总分够但单项需5.0',note_detail:'🆕2026-27 UQ College官方:标准预科IELTS 5.5(单项≥5.0,10个月);打包Integrated English+预科IELTS 5.0(单项≥5.0);加速预科4个月IELTS 6.0(W6.0/其他≥5.5)。你听力/阅读4.5未达标标准预科，可走IE打包或先读语言'},
      math:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|IE打包:5.0(5.0)',dual:'yes',dual_type:'标准预科(10月)/IE+预科打包',dual_thr:'5.5(5.0)标准 / 5.0(5.0)+IE打包',coop:'no',coop_note:'',note:'标准预科差0.5;IE打包你总分够但单项需5.0',note_detail:'🆕2026-27 UQ College官方:标准预科IELTS 5.5(单项≥5.0,10个月);打包Integrated English+预科IELTS 5.0(单项≥5.0);加速预科4个月IELTS 6.0(W6.0/其他≥5.5)。你听力/阅读4.5未达标标准预科，可走IE打包或先读语言'},
      psych:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|IE打包:5.0(5.0)',dual:'yes',dual_type:'标准预科(10月)/IE+预科打包',dual_thr:'5.5(5.0)标准 / 5.0(5.0)+IE打包',coop:'no',coop_note:'',note:'标准预科差0.5;IE打包你总分够但单项需5.0',note_detail:'🆕2026-27 UQ College官方:标准预科IELTS 5.5(单项≥5.0,10个月);打包Integrated English+预科IELTS 5.0(单项≥5.0);加速预科4个月IELTS 6.0(W6.0/其他≥5.5)。你听力/阅读4.5未达标标准预科，可走IE打包或先读语言'},
      biz:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|IE打包:5.0(5.0)',dual:'yes',dual_type:'标准预科(10月)/IE+预科打包',dual_thr:'5.5(5.0)标准 / 5.0(5.0)+IE打包',coop:'no',coop_note:'',note:'标准预科差0.5;IE打包你总分够但单项需5.0',note_detail:'🆕2026-27 UQ College官方:标准预科IELTS 5.5(单项≥5.0,10个月);打包Integrated English+预科IELTS 5.0(单项≥5.0);加速预科4个月IELTS 6.0(W6.0/其他≥5.5)。你听力/阅读4.5未达标标准预科，可走IE打包或先读语言'},
      health:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|IE打包:5.0(5.0)',dual:'yes',dual_type:'标准预科(10月)/IE+预科打包',dual_thr:'5.5(5.0)标准 / 5.0(5.0)+IE打包',coop:'no',coop_note:'',note:'标准预科差0.5;IE打包你总分够但单项需5.0',note_detail:'🆕2026-27 UQ College官方:标准预科IELTS 5.5(单项≥5.0,10个月);打包Integrated English+预科IELTS 5.0(单项≥5.0);加速预科4个月IELTS 6.0(W6.0/其他≥5.5)。你听力/阅读4.5未达标标准预科，可走IE打包或先读语言'},
      sci:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|IE打包:5.0(5.0)',dual:'yes',dual_type:'标准预科(10月)/IE+预科打包',dual_thr:'5.5(5.0)标准 / 5.0(5.0)+IE打包',coop:'no',coop_note:'',note:'标准预科差0.5;IE打包你总分够但单项需5.0',note_detail:'🆕2026-27 UQ College官方:标准预科IELTS 5.5(单项≥5.0,10个月);打包Integrated English+预科IELTS 5.0(单项≥5.0);加速预科4个月IELTS 6.0(W6.0/其他≥5.5)。你听力/阅读4.5未达标标准预科，可走IE打包或先读语言'},
      social:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|IE打包:5.0(5.0)',dual:'yes',dual_type:'标准预科(10月)/IE+预科打包',dual_thr:'5.5(5.0)标准 / 5.0(5.0)+IE打包',coop:'no',coop_note:'',note:'标准预科差0.5;IE打包你总分够但单项需5.0',note_detail:'🆕2026-27 UQ College官方:标准预科IELTS 5.5(单项≥5.0,10个月);打包Integrated English+预科IELTS 5.0(单项≥5.0);加速预科4个月IELTS 6.0(W6.0/其他≥5.5)。你听力/阅读4.5未达标标准预科，可走IE打包或先读语言'}
    }},
    {name:'阿德莱德',city:'阿德莱德',prov:'澳洲',deadline:'滚动',tuition:'36,200(2027)',tuitionRMB:'约17.5万',isFoundation:true,programs:{
      eng:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|延伸:5.0(5.0)',dual:'yes',dual_type:'标准/延伸预科',dual_thr:'5.5(5.0)标准 / 5.0(5.0)延伸',coop:'yes',coop_note:'',note:'标准预科差0.5;延伸你总分够但单项需5.0',note_detail:'🆕2026-27 Adelaide College官方:标准/强化预科IELTS 5.5(单项≥5.0,9-12个月);延伸预科IELTS 5.0(单项≥5.0);加速预科IELTS 6.0(5.5)。你听力/阅读4.5未达标，需先读语言或考出5.0单项'},
      cs:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|延伸:5.0(5.0)',dual:'yes',dual_type:'标准/延伸预科',dual_thr:'5.5(5.0)标准 / 5.0(5.0)延伸',coop:'no',coop_note:'',note:'标准预科差0.5;延伸你总分够但单项需5.0',note_detail:'🆕2026-27 Adelaide College官方:标准/强化预科IELTS 5.5(单项≥5.0,9-12个月);延伸预科IELTS 5.0(单项≥5.0);加速预科IELTS 6.0(5.5)。你听力/阅读4.5未达标，需先读语言或考出5.0单项'},
      math:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|延伸:5.0(5.0)',dual:'yes',dual_type:'标准/延伸预科',dual_thr:'5.5(5.0)标准 / 5.0(5.0)延伸',coop:'no',coop_note:'',note:'标准预科差0.5;延伸你总分够但单项需5.0',note_detail:'🆕2026-27 Adelaide College官方:标准/强化预科IELTS 5.5(单项≥5.0,9-12个月);延伸预科IELTS 5.0(单项≥5.0);加速预科IELTS 6.0(5.5)。你听力/阅读4.5未达标，需先读语言或考出5.0单项'},
      psych:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|延伸:5.0(5.0)',dual:'yes',dual_type:'标准/延伸预科',dual_thr:'5.5(5.0)标准 / 5.0(5.0)延伸',coop:'no',coop_note:'',note:'标准预科差0.5;延伸你总分够但单项需5.0',note_detail:'🆕2026-27 Adelaide College官方:标准/强化预科IELTS 5.5(单项≥5.0,9-12个月);延伸预科IELTS 5.0(单项≥5.0);加速预科IELTS 6.0(5.5)。你听力/阅读4.5未达标，需先读语言或考出5.0单项'},
      biz:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|延伸:5.0(5.0)',dual:'yes',dual_type:'标准/延伸预科',dual_thr:'5.5(5.0)标准 / 5.0(5.0)延伸',coop:'no',coop_note:'',note:'标准预科差0.5;延伸你总分够但单项需5.0',note_detail:'🆕2026-27 Adelaide College官方:标准/强化预科IELTS 5.5(单项≥5.0,9-12个月);延伸预科IELTS 5.0(单项≥5.0);加速预科IELTS 6.0(5.5)。你听力/阅读4.5未达标，需先读语言或考出5.0单项'},
      health:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|延伸:5.0(5.0)',dual:'yes',dual_type:'标准/延伸预科',dual_thr:'5.5(5.0)标准 / 5.0(5.0)延伸',coop:'no',coop_note:'',note:'标准预科差0.5;延伸你总分够但单项需5.0',note_detail:'🆕2026-27 Adelaide College官方:标准/强化预科IELTS 5.5(单项≥5.0,9-12个月);延伸预科IELTS 5.0(单项≥5.0);加速预科IELTS 6.0(5.5)。你听力/阅读4.5未达标，需先读语言或考出5.0单项'},
      sci:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|延伸:5.0(5.0)',dual:'yes',dual_type:'标准/延伸预科',dual_thr:'5.5(5.0)标准 / 5.0(5.0)延伸',coop:'no',coop_note:'',note:'标准预科差0.5;延伸你总分够但单项需5.0',note_detail:'🆕2026-27 Adelaide College官方:标准/强化预科IELTS 5.5(单项≥5.0,9-12个月);延伸预科IELTS 5.0(单项≥5.0);加速预科IELTS 6.0(5.5)。你听力/阅读4.5未达标，需先读语言或考出5.0单项'},
      social:{gpa:'预科GPA60%',label:'ok',ielts:'标准:5.5(5.0)|延伸:5.0(5.0)',dual:'yes',dual_type:'标准/延伸预科',dual_thr:'5.5(5.0)标准 / 5.0(5.0)延伸',coop:'no',coop_note:'',note:'标准预科差0.5;延伸你总分够但单项需5.0',note_detail:'🆕2026-27 Adelaide College官方:标准/强化预科IELTS 5.5(单项≥5.0,9-12个月);延伸预科IELTS 5.0(单项≥5.0);加速预科IELTS 6.0(5.5)。你听力/阅读4.5未达标，需先读语言或考出5.0单项'}
    }}
  ]
};

// delpoy_rev_91895
// 最后更新: 2026-09-11
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
