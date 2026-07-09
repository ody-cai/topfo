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
    {name:'多大·圣乔治',city:'多伦多',prov:'安省',deadline:'1月15日(热门)/3月31日',tuition:'42,000-62,000',tuitionRMB:'21-34万',programs:{
      eng:{gpa:'92-95%',label:'hard',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'PEY Co-op',note:'工程无IFP双录!须直录雅思6.5',note_detail:'⚠️2026-27 IFP仅覆盖Arts&Science/建筑景观设计/音乐，不含Faculty of Applied Science&Engineering！工程必须直录雅思6.5(6.0)'},
      cs:{gpa:'93%(comp)/97.2%(median)',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP(Arts&Sci/Arch/Music)',dual_thr:'5.0-6.5(写作5.5/单项≥5.0)',coop:'yes',coop_note:'PEY Co-op',note:'CS竞争均分93%但录取中位97.2%;IFP覆盖Arts&Sci含CS',note_detail:'2026-27 IFP覆盖Arts&Science(含CS/数学/心理)、建筑景观设计、音乐；新门槛单项≥5.0你听力/阅读4.5未达标'},
      math:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP(Arts&Sci/Arch/Music)',dual_thr:'5.0-6.5(写作5.5/单项≥5.0)',coop:'yes',coop_note:'',note:'IFP含Arts&Sci数学;门槛单项≥5.0你不够',note_detail:'2026-27 IFP覆盖Arts&Science(含数学)、建筑景观设计、音乐；新门槛单项≥5.0你听力/阅读4.5未达标'},
      psych:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP(Arts&Sci/Arch/Music)',dual_thr:'5.0-6.5(写作5.5/单项≥5.0)',coop:'no',coop_note:'',note:'IFP含Arts&Sci心理;门槛单项≥5.0你不够',note_detail:'2026-27 IFP覆盖Arts&Science(含心理)、建筑景观设计、音乐；新门槛单项≥5.0你听力/阅读4.5未达标'},
      biz:{gpa:'92-95%',label:'hard',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'Rotman Commerce',note:'Rotman极难;不含IFP(排除)',note_detail:'Rotman需补充申请且均分93%+；IFP Arts&Sci不含Rotman Commerce'},
      health:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP(Arts&Sci/Arch/Music)',dual_thr:'5.0-6.5(写作5.5/单项≥5.0)',coop:'no',coop_note:'',note:'IFP含Arts&Sci;门槛单项≥5.0你不够',note_detail:'2026-27 IFP覆盖Arts&Science、建筑景观设计、音乐；新门槛单项≥5.0你听力/阅读4.5未达标'},
      sci:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP(Arts&Sci/Arch/Music)',dual_thr:'5.0-6.5(写作5.5/单项≥5.0)',coop:'no',coop_note:'',note:'IFP含Arts&Sci理科;门槛单项≥5.0你不够',note_detail:'2026-27 IFP覆盖Arts&Science、建筑景观设计、音乐；新门槛单项≥5.0你听力/阅读4.5未达标'},
      social:{gpa:'80-85%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'IFP(Arts&Sci/Arch/Music)',dual_thr:'5.0-6.5(写作5.5/单项≥5.0)',coop:'no',coop_note:'',note:'IFP含Arts&Sci社科;门槛单项≥5.0你不够',note_detail:'2026-27 IFP覆盖Arts&Science、建筑景观设计、音乐；新门槛单项≥5.0你听力/阅读4.5未达标'}
    }},
    {name:'UBC·温哥华',city:'温哥华',prov:'BC省',deadline:'1月15日',tuition:'40,000-48,000',tuitionRMB:'20-25万',programs:{
      eng:{gpa:'90-94%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'Vantage',dual_thr:'5.0(单项4.5)',coop:'yes',coop_note:'Engineering Co-op',note:'Vantage可双录',note_detail:'Vantage College提供工程/数学/物理方向双录，你雅思5.0已达标'},
      cs:{gpa:'92-95%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'Vantage',dual_thr:'5.0(单项4.5)',coop:'yes',coop_note:'CS Co-op',note:'Vantage可双录',note_detail:''},
      math:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'Vantage',dual_thr:'5.0(单项4.5)',coop:'yes',coop_note:'',note:'你雅思5.0已达标Vantage',note_detail:''},
      psych:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:'UBC心理学无Vantage双录'},
      biz:{gpa:'90-94%',label:'hard',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'Sauder Co-op',note:'Sauder极难+补充申请',note_detail:'需Personal Profile+面试'},
      health:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'须直录',note_detail:''},
      sci:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'yes',dual_type:'Vantage',dual_thr:'5.0(单项4.5)',coop:'yes',coop_note:'',note:'你雅思5.0已达标Vantage',note_detail:''},
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
    {name:'滑铁卢',city:'滑铁卢',prov:'安省',deadline:'工程CS建议1月前/3月31日',tuition:'40,000-48,000',tuitionRMB:'20-25万',programs:{
      eng:{gpa:'90-95%',label:'hard',ielts:'6.5(写作口语6.5/其余6.0)',dual:'limit',dual_type:'BASE仅工程',dual_thr:'5.5(写作5.5)',coop:'yes',coop_note:'全球最强Co-op体系',note:'BASE仅工程方向',note_detail:'BASE不含建筑/生物医学/系统设计'},
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
    {name:'多大·士嘉堡(UTSC)',city:'多伦多(东)',prov:'安省',deadline:'3月2日(国际)',tuition:'67,700',tuitionRMB:'34万',programs:{
      eng:{gpa:'—',label:'na',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'无传统工程',note_detail:'UTSC无Engineering本科'},
      cs:{gpa:'Low 90s(非Co-op)/High 90s(Co-op)',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'CS Co-op(3×4月)',note:'非Co-op踩线!Co-op差远',note_detail:'UTSC CS非Co-op版low 90s你89.6踩线;Co-op版要high 90s几乎不可能;不需补充申请'},
      math:{gpa:'85-90%',label:'close',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'统计Co-op',note:'踩线',note_detail:'UTSC Applied Statistics high 80s'},
      psych:{gpa:'Mid-high 70s(非Co-op)/Low 80s(Co-op)',label:'ok',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'心理Co-op',note:'GPA绰绰有余!心理有Co-op',note_detail:'UTSC心理学非Co-op mid-high 70s你89.6远超;Co-op版low 80s你也够;北美少数本科有临床心理方向'},
      biz:{gpa:'80-85%(Management)',label:'ok',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'MIT Co-op',note:'Management踩线',note_detail:'UTSC Management & IT有Co-op'},
      health:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'健康科学Co-op',note:'GPA够',note_detail:''},
      sci:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'Mid 70s',label:'ok',ielts:'6.5(6.0)',dual:'no',dual_type:'—',dual_thr:'—',coop:'no',coop_note:'',note:'GPA绰绰有余',note_detail:''}
    }},
    {name:'多大·密西沙加(UTM)',city:'密西沙加',prov:'安省',deadline:'3月2日(国际)',tuition:'67,700',tuitionRMB:'34万',programs:{
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
    {name:'阿尔伯塔',city:'埃德蒙顿',prov:'阿省',deadline:'3月1日(可延至4月)',tuition:'28,000-35,000',tuitionRMB:'14-18万',programs:{
      eng:{gpa:'85-88%',label:'close',ielts:'6.5(5.5)',dual:'limit',dual_type:'EAP不含工程',dual_thr:'5.0(单项4.5)',coop:'yes',coop_note:'Engineering Co-op',note:'本校EAP不含工程',note_detail:'可通过CCEL双录但竞争激烈'},
      cs:{gpa:'82-88%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'yes',coop_note:'CS Co-op',note:'你雅思5.0已达标双录!',note_detail:'EAP读完免雅思，CS录取82-88%你在范围内'},
      math:{gpa:'85-90%',label:'close',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'yes',coop_note:'',note:'你雅思5.0已达标双录',note_detail:''},
      psych:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'no',coop_note:'',note:'你雅思5.0已达标双录',note_detail:'心理GPA75%你89.6远超'},
      biz:{gpa:'80-85%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'yes',coop_note:'',note:'商科比CS好进',note_detail:''},
      health:{gpa:'80-85%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'70-75%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'EAP',dual_thr:'5.0(单项4.5)',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'渥太华',city:'渥太华',prov:'安省',deadline:'3月31日',tuition:'32,000-40,000',tuitionRMB:'16-20万',programs:{
      eng:{gpa:'80-87%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.0+',coop:'yes',coop_note:'Engineering Co-op',note:'你雅思5.0已达标!',note_detail:'EIP雅思4.0+即可，你5.0完全够'},
      cs:{gpa:'80-87%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.0+',coop:'yes',coop_note:'CS Co-op',note:'你雅思5.0已达标!',note_detail:'渥太华CS Co-op就业好'},
      math:{gpa:'75-80%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.0+',coop:'yes',coop_note:'',note:'你雅思5.0已达标!',note_detail:''},
      psych:{gpa:'约70%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.0+',coop:'no',coop_note:'',note:'最推荐!GPA绰绰有余',note_detail:'渥太华心理录取约70%，你89.6远超'},
      biz:{gpa:'85%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.0+',coop:'yes',coop_note:'Telfer Co-op',note:'你雅思5.0已达标!',note_detail:'Telfer商学院85%你89.6远超'},
      health:{gpa:'89%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.0+',coop:'no',coop_note:'',note:'GPA踩线!你雅思5.0已达标EIP',note_detail:'渥太华健康科学89%你89.6刚好踩线'},
      sci:{gpa:'75-80%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.0+',coop:'yes',coop_note:'',note:'你雅思5.0已达标!',note_detail:''},
      social:{gpa:'80-85%',label:'ok',ielts:'6.5(写作6.5/其余6.0)',dual:'yes',dual_type:'EIP',dual_thr:'4.0+',coop:'no',coop_note:'',note:'你雅思5.0已达标!',note_detail:''}
    }},
    {name:'韦士敦',city:'伦敦',prov:'安省',deadline:'3月31日(Ivey建议1月前)',tuition:'32,000-38,000',tuitionRMB:'16-19万',programs:{
      eng:{gpa:'91%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'yes',coop_note:'Engineering Co-op',note:'你听力阅读4.5不够Boost',note_detail:'Boost9周读完免雅思，但你听力4.5<门槛5.0'},
      cs:{gpa:'84%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'yes',coop_note:'',note:'GPA够但Boost门槛不够',note_detail:''},
      math:{gpa:'mid 70s',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'mid-high 70s',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'85%(MOS)/94%(Ivey)',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'yes',coop_note:'Ivey AEO',note:'MOS GPA够,Ivey极难',note_detail:'Ivey AEO 94%极难，MOS 85%你89.6远超'},
      health:{gpa:'91%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'Boost',dual_thr:'总分5.5(读写5.5/听说5.0)',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'麦克马斯特',city:'哈密尔顿',prov:'安省',deadline:'热门1月关闭/3月31日',tuition:'34,000-42,000',tuitionRMB:'17-21万',programs:{
      eng:{gpa:'92%',label:'hard',ielts:'6.5(6.0)',dual:'yes',dual_type:'MELD+STEP',dual_thr:'MELD:5.0/STEP:6.5(读写6.0听说5.5)',coop:'yes',coop_note:'全部工程Co-op',note:'工程GPA差2.4分;你雅思5.0已达标MELD!',note_detail:'麦马工程92%你差2.4分；MELD(1年)门槛5.0你达标!🆕2026Fall起完成MELD可获12本科学分(4门课不再白读);STEP(7周夏)门槛6.5你不够；⚠️中加学籍学生必须提交雅思成绩'},
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
    {name:'卡尔加里',city:'卡尔加里',prov:'阿省',deadline:'3月1日(可延至4月15日)',tuition:'26,000-32,000',tuitionRMB:'13-16万',programs:{
      eng:{gpa:'85-90%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'GPA在范围内',note_detail:''},
      cs:{gpa:'80-85%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      math:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'80-85%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      health:{gpa:'80-85%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
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
    {name:'维多利亚',city:'维多利亚',prov:'BC省',deadline:'2月28日',tuition:'26,000-32,000',tuitionRMB:'13-16万',programs:{
      eng:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.5+',coop:'yes',coop_note:'',note:'',note_detail:''},
      cs:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.5+',coop:'yes',coop_note:'CS Co-op',note:'',note_detail:''},
      math:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.5+',coop:'yes',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.5+',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'80-85%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.5+',coop:'yes',coop_note:'',note:'',note_detail:''},
      health:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.5+',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.5+',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.5+',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'卡尔顿',city:'渥太华',prov:'安省',deadline:'3月31日',tuition:'26,000-34,000',tuitionRMB:'13-17万',programs:{
      eng:{gpa:'78-84%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'与渥太华同城',note_detail:''},
      cs:{gpa:'78-84%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'CS Co-op',note:'',note_detail:''},
      math:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'78-84%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'Sprott Co-op',note:'Sprott商学院',note_detail:''},
      health:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'',note_detail:''},
      social:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'约克',city:'多伦多',prov:'安省',deadline:'滚动录取',tuition:'26,000-34,000',tuitionRMB:'13-17万',programs:{
      eng:{gpa:'雅思7.5不双录!',label:'na',ielts:'7.5!',dual:'limit',dual_type:'YUELI不含工程CS',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'工程雅思7.5不双录!',note_detail:'约克工程要求雅思7.5且不接受双录取！'},
      cs:{gpa:'雅思7.5不双录!',label:'na',ielts:'7.5!',dual:'limit',dual_type:'YUELI不含工程CS',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'CS同工程限制',note_detail:''},
      math:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'YUELI',dual_thr:'5.0+',coop:'no',coop_note:'',note:'理学院可双录',note_detail:''},
      psych:{gpa:'65-70%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'YUELI',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'75-80%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'YUELI',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'Schulich难进',note_detail:''},
      health:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'YUELI',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'70-75%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'YUELI',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      social:{gpa:'65-70%',label:'ok',ielts:'6.5(6.0)',dual:'yes',dual_type:'YUELI',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'Laurier',city:'滑铁卢',prov:'安省',deadline:'3月31日',tuition:'24,000-30,000',tuitionRMB:'12-15万',programs:{
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
    {name:'温莎',city:'温莎',prov:'安省',deadline:'滚动录取',tuition:'22,000-28,000',tuitionRMB:'11-14万',programs:{
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
    {name:'康考迪亚',city:'蒙特利尔',prov:'魁省',deadline:'2月1日(部分滚动)',tuition:'22,000-28,000',tuitionRMB:'11-14万',programs:{
      eng:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'',note:'蒙特利尔',note_detail:''},
      cs:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'CS Co-op',note:'',note_detail:''},
      math:{gpa:'70-75%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'70-75%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'75-80%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'yes',coop_note:'JMSB Co-op',note:'JMSB商学院',note_detail:''},
      health:{gpa:'70-75%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'70-75%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''},
      social:{gpa:'65-70%',label:'ok',ielts:'6.5(5.5)',dual:'yes',dual_type:'ESL',dual_thr:'5.0+',coop:'no',coop_note:'',note:'',note_detail:''}
    }}
  ],
  au:[
    {name:'UNSW',city:'悉尼',prov:'澳洲',deadline:'滚动',tuition:'42,000',tuitionRMB:'约20万',isFoundation:true,programs:{
      eng:{gpa:'预科GPA7.5/9.0',label:'ok',ielts:'Extended预科:5.0(4.5)|标准理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended预科(15月)',dual_thr:'5.0(4.5)',coop:'yes',coop_note:'',note:'你雅思5.0走Extended达标!',note_detail:'UNSW Extended预科15个月IELTS5.0(4.5)你达标;🆕2026起标准预科分轨:理科/文科IELTS5.5(写作5.5/其他≥5.0)你总分差0.5;商科IELTS6.0(写作5.5/其他≥5.5)你差1.0;升学率91%'},
      cs:{gpa:'预科GPA7.5/9.0',label:'ok',ielts:'Extended预科:5.0(4.5)|标准理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended预科(15月)',dual_thr:'5.0(4.5)',coop:'yes',coop_note:'',note:'你雅思5.0走Extended达标!',note_detail:'🆕2026起标准预科分轨:理科IELTS5.5(写作5.5/其他≥5.0)你总分差0.5'},
      math:{gpa:'预科GPA7.0/9.0',label:'ok',ielts:'Extended预科:5.0(4.5)|标准理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended预科(15月)',dual_thr:'5.0(4.5)',coop:'no',coop_note:'',note:'',note_detail:'🆕2026起标准预科分轨'},
      psych:{gpa:'预科GPA6.5/9.0',label:'ok',ielts:'Extended预科:5.0(4.5)|标准理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended预科(15月)',dual_thr:'5.0(4.5)',coop:'no',coop_note:'',note:'',note_detail:'🆕2026起标准预科分轨'},
      biz:{gpa:'预科GPA7.0/9.0',label:'ok',ielts:'Extended预科:5.0(4.5)|标准商科:6.0(写作5.5其他5.5)',dual:'yes',dual_type:'Extended预科(15月)',dual_thr:'5.0(4.5)',coop:'yes',coop_note:'',note:'标准商科IELTS6.0你差1.0;走Extended可行',note_detail:'🆕2026起标准预科商科IELTS6.0(写作5.5/其他≥5.5)你差1.0;Extended预科IELTS5.0(4.5)你达标'},
      health:{gpa:'预科GPA7.0/9.0',label:'ok',ielts:'Extended预科:5.0(4.5)|标准理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended预科(15月)',dual_thr:'5.0(4.5)',coop:'no',coop_note:'',note:'',note_detail:'🆕2026起标准预科分轨'},
      sci:{gpa:'预科GPA7.0/9.0',label:'ok',ielts:'Extended预科:5.0(4.5)|标准理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended预科(15月)',dual_thr:'5.0(4.5)',coop:'no',coop_note:'',note:'',note_detail:'🆕2026起标准预科分轨'},
      social:{gpa:'预科GPA6.5/9.0',label:'ok',ielts:'Extended预科:5.0(4.5)|标准理科:5.5(写作5.5其他5.0)',dual:'yes',dual_type:'Extended预科(15月)',dual_thr:'5.0(4.5)',coop:'no',coop_note:'',note:'',note_detail:'🆕2026起标准预科分轨'}
    }},
    {name:'昆士兰',city:'布里斯班',prov:'澳洲',deadline:'滚动',tuition:'36,000',tuitionRMB:'约18万',isFoundation:true,programs:{
      eng:{gpa:'预科GPA60%',label:'ok',ielts:'预科入:5.0(4.5)',dual:'yes',dual_type:'标准预科',dual_thr:'5.0(4.5)',coop:'yes',coop_note:'',note:'你雅思5.0已达标!',note_detail:''},
      cs:{gpa:'预科GPA60%',label:'ok',ielts:'预科入:5.0(4.5)',dual:'yes',dual_type:'标准预科',dual_thr:'5.0(4.5)',coop:'no',coop_note:'',note:'',note_detail:''},
      math:{gpa:'预科GPA60%',label:'ok',ielts:'预科入:5.0(4.5)',dual:'yes',dual_type:'标准预科',dual_thr:'5.0(4.5)',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'预科GPA60%',label:'ok',ielts:'预科入:5.0(4.5)',dual:'yes',dual_type:'标准预科',dual_thr:'5.0(4.5)',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'预科GPA60%',label:'ok',ielts:'预科入:5.0(4.5)',dual:'yes',dual_type:'标准预科',dual_thr:'5.0(4.5)',coop:'no',coop_note:'',note:'',note_detail:''},
      health:{gpa:'预科GPA60%',label:'ok',ielts:'预科入:5.0(4.5)',dual:'yes',dual_type:'标准预科',dual_thr:'5.0(4.5)',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'预科GPA60%',label:'ok',ielts:'预科入:5.0(4.5)',dual:'yes',dual_type:'标准预科',dual_thr:'5.0(4.5)',coop:'no',coop_note:'',note:'',note_detail:''},
      social:{gpa:'预科GPA60%',label:'ok',ielts:'预科入:5.0(4.5)',dual:'yes',dual_type:'标准预科',dual_thr:'5.0(4.5)',coop:'no',coop_note:'',note:'',note_detail:''}
    }},
    {name:'阿德莱德',city:'阿德莱德',prov:'澳洲',deadline:'滚动',tuition:'34,000',tuitionRMB:'约17万',isFoundation:true,programs:{
      eng:{gpa:'预科GPA60%',label:'ok',ielts:'预科入:5.0(4.5)',dual:'yes',dual_type:'标准预科',dual_thr:'5.0(4.5)',coop:'yes',coop_note:'',note:'你雅思5.0已达标!',note_detail:''},
      cs:{gpa:'预科GPA60%',label:'ok',ielts:'预科入:5.0(4.5)',dual:'yes',dual_type:'标准预科',dual_thr:'5.0(4.5)',coop:'no',coop_note:'',note:'',note_detail:''},
      math:{gpa:'预科GPA60%',label:'ok',ielts:'预科入:5.0(4.5)',dual:'yes',dual_type:'标准预科',dual_thr:'5.0(4.5)',coop:'no',coop_note:'',note:'',note_detail:''},
      psych:{gpa:'预科GPA60%',label:'ok',ielts:'预科入:5.0(4.5)',dual:'yes',dual_type:'标准预科',dual_thr:'5.0(4.5)',coop:'no',coop_note:'',note:'',note_detail:''},
      biz:{gpa:'预科GPA60%',label:'ok',ielts:'预科入:5.0(4.5)',dual:'yes',dual_type:'标准预科',dual_thr:'5.0(4.5)',coop:'no',coop_note:'',note:'',note_detail:''},
      health:{gpa:'预科GPA60%',label:'ok',ielts:'预科入:5.0(4.5)',dual:'yes',dual_type:'标准预科',dual_thr:'5.0(4.5)',coop:'no',coop_note:'',note:'',note_detail:''},
      sci:{gpa:'预科GPA60%',label:'ok',ielts:'预科入:5.0(4.5)',dual:'yes',dual_type:'标准预科',dual_thr:'5.0(4.5)',coop:'no',coop_note:'',note:'',note_detail:''},
      social:{gpa:'预科GPA60%',label:'ok',ielts:'预科入:5.0(4.5)',dual:'yes',dual_type:'标准预科',dual_thr:'5.0(4.5)',coop:'no',coop_note:'',note:'',note_detail:''}
    }}
  ]
};
