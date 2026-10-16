#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
update_1016_report.py — 2026-10-16 刷新《加拿大大学 2027 届本科招生语言要求分析报告》
① 数据截至日期  ② 修正 4 处已过时口径  ③ 追加「八、补遗」章节
说明：本文件内一律不得出现英文直撇号 (U+0027)，所有格统一用 U+2019。
"""
import io, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPORT = os.path.join(ROOT, 'reports/加拿大大学2027语言要求分析报告.html')

OLD_DATE = '2026-09-09'
NEW_DATE = '2026-10-16'

REPS = [
 # 1) 封面「数据截至」
 (u'客观信息汇编 · 数据截至 %s' % OLD_DATE,
  u'客观信息汇编 · 数据截至 %s（含此前版本补遗）' % NEW_DATE),

 # 2) OSR 接受名单（原仅列 2 所，现为 6 所）
 (u'滑铁卢、麦马接受；多大（本科）、阿尔伯塔、多伦多大学系统明确',
  u'<b>接受 6 所</b>：滑铁卢、麦马、曼尼托巴、约克、渥太华、维多利亚（UVic）；明确'),

 # 3) 多大行——补 UTSC / UTM 语言班（此前「UTSC 无语言班」记载有误）
 (u'未达直录可评估 IFP（见第四章）。',
  u'未达直录可评估 IFP（见第四章）。<b>UTSC 另有 AE（Academic English）</b>：夏季 8 周、邀请制、'
  u'雅思 <b>5.5</b>（写作 ≥5.5、单项 ≥5.0）、国际生面授 C$8,200／线上 C$8,050；'
  u'<b>UTM 另有 ACE@UTM</b>：Summer 8 周 5.5（无单项 &lt;5.0）／Fall-Winter 24 周 6.0（无单项 &lt;5.5）。'
  u'⚠️ 此前「UTSC 无语言班」的记载有误，已更正。'),

 # 4) 渥太华行——EIP 逐档门槛
 (u'护理、部分健康科学要求更高（雅思 7.0）。未达标可评估 EIP/语言预科通道。PTE 60(60)、CAEL 60。',
  u'护理、部分健康科学要求更高（雅思 7.0）。<b>未达标可走 EIP（English Intensive Program）：'
  u'雅思 6.0 → 可入正课 + 加修额外 ESL；4.5 起 → 可获「以完成 EIP 为条件」的录取；'
  u'⚠️ 任一单项 4.0 即出局</b>（EIP 约 CAD 6,985/期，Winter 2027 档 1/12 开课）。'
  u'⚠️ 本科<b>不认可</b> IELTS UKVI、CELPIP、TCF-TEF Canada。PTE 60(60)、CAEL 60。'),

 # 5) 卡尔加里行——ACC 具体门槛
 (u'未达标可评估 Academic Communication Certificate (ACC)。',
  u'未达标可评估 Academic Communication Certificate (ACC)：<b>12 或 13 周、250 小时</b>，'
  u'2027 三期（01-04／04-19／09-20，秋季仅 3 门课）；门槛 <b>IELTS 6.0（写作 6.0、其他 5.5）</b>／'
  u'DET 110（Production 100）／TOEFL 70（新制 4.0、写作 20）／CAEL 60（写作 60）。'),

 # 6) UVic 行——口径冲突留证
 (u'未达标可评估 UVic ELC 条件录取（雅思 5.5/托福 71）。',
  u'未达标可评估 UVic ELC 条件录取。⚠️ 存在两套口径：本站早期记载 5.5／托福 71；'
  u'第三方核对为 <b>IELTS 6.0（无单项 &lt;5.5）／TOEFL 79（17）／CAEL 60（50）</b> —— '
  u'<b>待校方官网终核</b>。ELC/ELPI 最长 24 个月且无需重新申请。UVic 接受 IELTS One Skill Retake。'),
]

ADDENDUM = u"""
<h2>八、2026-09-09 以来的重要变更（本轮补遗）</h2>
<p class="lead">本节汇总 2026-09-09 至 <b>2026-10-16</b> 期间新核实的语言与衔接通道变化，以及与本章前述版本口径不一致之处。
凡标注「第三方」「待核」者均未作为结论采用。</p>

<h3>8.1 雅思单科重考（One Skill Retake）接受名单</h3>
<table>
<caption>对「听/读单项偏低、其余达标」的申请人，这是成本最低的单点突破方式</caption>
<thead><tr><th style="width:22%">校别</th><th style="width:26%">是否接受 OSR</th><th>说明</th></tr></thead>
<tbody>
<tr><td><b>接受（6 所）</b></td><td>滑铁卢 · 麦马 · 曼尼托巴 · 约克 · 渥太华 · 维多利亚（UVic）</td><td>可只重考未达标的单项，无需全套重考；UVic 同时接受 TOEFL MyBest</td></tr>
<tr><td><b>官方明确不接受</b></td><td>多大（本科三校区）· UBC · 麦吉尔 · 阿尔伯塔</td><td>多大另不接受 MyBest / TOEFL Essentials / ITP；UBC 不收 MyBest</td></tr>
</tbody>
</table>

<h3>8.2 语言衔接通道的补遗</h3>
<table>
<thead><tr><th style="width:20%">院校 / 项目</th><th style="width:30%">门槛</th><th>关键说明</th></tr></thead>
<tbody>
<tr><td><b>UTSC AE</b>（Academic English）</td><td>IELTS 5.5（写作 ≥5.5、单项 ≥5.0）</td><td>夏季 8 周、邀请制；国际生面授 C$8,200／线上 C$8,050</td></tr>
<tr><td><b>UTM ACE@UTM</b></td><td>Summer 8 周 5.5（无单项 &lt;5.0）<br>Fall-Winter 24 周 6.0（无单项 &lt;5.5）</td><td>与 2027-09 首开的 IFP@UTM 并存；语言课即 Academic English Level 60</td></tr>
<tr><td><b>渥太华 EIP</b></td><td>6.0 可入正课 + 加修 ESL；<b>4.5 起可获条件录取</b></td><td>⚠️ 任一单项 4.0 即出局；约 CAD 6,985/期</td></tr>
<tr><td><b>卡尔加里 ACC</b></td><td>IELTS 6.0（写作 6.0、其他 5.5）</td><td>12/13 周、250 小时，2027 三期</td></tr>
<tr><td><b>皇后 QBridge</b></td><td>Accelerated 6.0／EAP 5.5</td><td>未达直录自动评估；<b>窗口 10 月即开，不是 2 月才开</b></td></tr>
<tr><td><b>阿德莱德预科</b>（Bradford）</td><td>IELTS 5.5（各单项 ≥5.0）</td><td>延伸预科 5.0（5.0）；⚠️ 部分学位预科入学要求更高（Law 路径 6.5/7.0），须逐学位核对</td></tr>
<tr><td><b>UNSW 国内预科中心</b></td><td>预科主课：商科 6.0（写作 5.5、各项 ≥5.5）／理科 5.5（写作 5.5、各项 ≥5.0）</td><td>⚠️ <b>凭 VEPT 校内内测替代雅思的通道自 2026 年起取消</b>；未达标者改走 FEEC 英语衔接课程，结业直接衔接主课、无需重考雅思；FEEC 结课与主课开课仅隔 3 天</td></tr>
</tbody>
</table>

<h3>8.3 豁免与成绩提交规则</h3>
<ul>
<li><b>滑铁卢（官方英语要求页原页）</b>：① <b>最近 4 年全日制教育全部在加拿大 → 免试</b>；② 「4 年全部在英语授课学校体系」亦可免试，但须提交注明授课语言的官方成绩单，或<b>原校校长直寄纸质证明信（email 不接受）</b>；③ ⚠️ <b>全日制 ESL 课程不计入这 4 年</b>；④ ⚠️ <b>凭豁免获录取却提交不合格成绩 → 校方保留撤销 offer 或改派 BASE 的权利</b>；⑤ 另有 TDSB 专项豁免（3 年 + ENG4U ≥80%）与 EFAS 通道（L400 总评 75% 且 420/440/460 各 ≥70%）。</li>
<li><b>麦吉尔</b>：豁免清单含 4 年英语国／CEGEP／BFI-OIB／IB Group 1 English ≥5／EB English L1-L2／A-Level English ≥C／GCSE-IGCSE-O-Level English ≥B(5)。⚠️ <b>非英语国家、即使就读英语授课学校仍须提供语言成绩</b>；⚠️ <b>成绩须由考试机构直送，不得自传，且不接受 Institutional 版本</b>。</li>
<li><b>康考迪亚</b>：语言路径存在<b>两套口径</b>（官方 6.0、无单项 &lt;5.5；中介口径 7.0 可免修 ESL）。⚠️ <b>拟修 ESL 者必须参加 ConCEPT 分班测试，未参加将被取消注册资格</b>。</li>
</ul>

<h3>8.4 ⚠️ 对语言班路径的签证前提（易被忽略）</h3>
<ul>
<li><b>ESL / 语言课同样需要 PAL（省证明信）</b> —— 即使后续正课属于免 PAL 类别（如公立硕博），前置语言课程仍须 PAL。缺 PAL 会被 IRCC <b>直接退回不处理</b>。</li>
<li><b>2026 年签发的 PAL 于 2026-12-31 到期</b>，递交学签当日须仍有效；<b>PAL 与配额年度绑定</b>，不能跨年使用。</li>
<li>境外单身申请人生活费证明 <b>CAD 23,448</b>（2026-09-01 起；魁省 24,617；每增 1 名家庭成员 +6,318），须叠加第一年学费与往返交通费。</li>
<li>2026-01-01 起，公立 DLI 的<b>硕士与博士</b>项目免 PAL；本科、文凭、研究生证书仍需。魁省用 <b>CAQ</b> 而非 PAL。</li>
</ul>

<p class="note">补遗来源：本轮及此前各轮日更的官方原页实抓与逐项复核记录（`uwaterloo.ca/future-students/admissions`、`utsc.utoronto.ca`、`uwaterloo.ca`／`carleton.ca`／`future.mcmaster.ca` 等校方页面，以及 Stellar Advisers、AdmissionPrep 等第三方交叉核对）。⚠️ 标注「第三方」「待核」者未作为结论采用。</p>
"""


def main():
    with io.open(REPORT, encoding='utf-8') as f:
        s = f.read()
    for old, new in REPS:
        c = s.count(old)
        assert c == 1, u'报告替换未命中或非唯一(%d): %s' % (c, old[:60])
        s = s.replace(old, new)

    anchor = u'<div class="foot"'
    assert s.count(anchor) == 1, '报告尾部 foot 锚点未命中'
    assert u'八、2026-09-09 以来的重要变更' not in s, '已存在补遗章节，勿重复插入'
    s = s.replace(anchor, ADDENDUM + anchor)

    with io.open(REPORT, 'w', encoding='utf-8') as f:
        f.write(s)
    print('[report] 6 处口径已更新 ; 「八、补遗」章节已追加 (%d 字符)' % len(ADDENDUM))


if __name__ == '__main__':
    main()
