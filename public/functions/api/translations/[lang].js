// GET /api/translations/:lang — 返回指定语言的翻译 JSON
// 支持 lang = zh / en

const TRANSLATIONS = {
  zh: {
    "app.title": "TopFO 加拿大留学申请助手",
    "nav.schools": "院校库",
    "nav.rankings": "排名",
    "nav.community": "社区",
    "nav.chat": "AI顾问",
    "nav.settings": "设置",
    "tier.t1": "极难申",
    "tier.t2": "现实目标",
    "tier.t3": "保底校",
    "tier.au": "澳洲保底",
    "status.planning": "规划中",
    "status.applying": "申请中",
    "status.submitted": "已提交",
    "status.accepted": "已录取",
    "status.rejected": "已拒绝",
    "status.waitlisted": "候补",
    "label.hard": "难度大",
    "label.close": "踩线",
    "label.ok": "稳妥",
    "label.na": "不适用",
    "coop.yes": "有Co-op",
    "coop.no": "无Co-op",
    "dual.yes": "可双录",
    "dual.no": "无双录",
    "dual.limit": "有条件下可双录",
    "recommend.reach": "冲刺院校",
    "recommend.match": "匹配院校",
    "recommend.safety": "保底院校",
    "recommend.australia": "澳洲保底",
    "gpa.label": "GPA",
    "ielts.label": "雅思",
    "deadline.label": "截止日期",
    "tuition.label": "学费",
    "priority.high": "高优先级",
    "priority.medium": "中优先级",
    "priority.low": "低优先级"
  },
  en: {
    "app.title": "TopFO Study in Canada",
    "nav.schools": "Schools",
    "nav.rankings": "Rankings",
    "nav.community": "Community",
    "nav.chat": "AI Advisor",
    "nav.settings": "Settings",
    "tier.t1": "Reach",
    "tier.t2": "Target",
    "tier.t3": "Safety",
    "tier.au": "Australia",
    "status.planning": "Planning",
    "status.applying": "Applying",
    "status.submitted": "Submitted",
    "status.accepted": "Accepted",
    "status.rejected": "Rejected",
    "status.waitlisted": "Waitlisted",
    "label.hard": "Hard",
    "label.close": "Borderline",
    "label.ok": "Safe",
    "label.na": "N/A",
    "coop.yes": "Co-op Available",
    "coop.no": "No Co-op",
    "dual.yes": "Dual Admission",
    "dual.no": "No Dual Admission",
    "dual.limit": "Limited Dual",
    "recommend.reach": "Reach Schools",
    "recommend.match": "Match Schools",
    "recommend.safety": "Safety Schools",
    "recommend.australia": "Australia Backup",
    "gpa.label": "GPA",
    "ielts.label": "IELTS",
    "deadline.label": "Deadline",
    "tuition.label": "Tuition",
    "priority.high": "High Priority",
    "priority.medium": "Medium Priority",
    "priority.low": "Low Priority"
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestGet(context) {
  const { params } = context;
  try {
    const lang = (params.lang || 'zh').toLowerCase();

    const translations = TRANSLATIONS[lang];
    if (!translations) {
      return Response.json({ error: `Unsupported language: ${lang}. Supported: zh, en` }, {
        status: 400,
        headers: corsHeaders()
      });
    }

    return Response.json({ lang, translations }, {
      headers: {
        ...corsHeaders(),
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500, headers: corsHeaders() });
  }
}
