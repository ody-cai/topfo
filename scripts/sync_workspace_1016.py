#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
sync_workspace_1016.py — 2026-10-16 收口：把权威源全量同步到工作区，并修正命名/引用
"""
import io, os, shutil, hashlib

SRC = os.path.expanduser('~/WorkBuddy/升学')
DST = os.path.expanduser('~/WorkBuddy/2026-06-16-17-01-52')

PAIRS = [
    ('public/js/data.js',                                  'public/js/data.js'),
    ('加拿大大学录取要求对照表_2026.html',                     '加拿大大学录取要求对照表_2026.html'),
    ('加拿大大学录取要求完整对照表_2026.md',                   '加拿大大学录取要求完整对照表_2026.md'),
    ('public/pages/admission.html',                        'public/pages/admission.html'),
    ('public/pages/timeline.html',                         'public/pages/timeline.html'),
    ('public/pages/plan.html',                             'public/pages/plan.html'),
    ('public/pages/plan.html',                             '申请作战清单与10月行动日历_2026-10-16.html'),
    ('reports/加拿大大学2027语言要求分析报告.html',            '加拿大大学2027语言要求分析报告.html'),
    ('reports/加拿大大学2027语言要求分析报告.pdf',             '加拿大大学2027语言要求分析报告.pdf'),
]

OLD_PLAN = '申请作战清单与10月行动日历_2026-09-24.html'
NEW_PLAN = '申请作战清单与10月行动日历_2026-10-16.html'


def md5(p):
    h = hashlib.md5()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def main():
    for rel, dstrel in PAIRS:
        s = os.path.join(SRC, rel)
        d = os.path.join(DST, dstrel)
        os.makedirs(os.path.dirname(d), exist_ok=True)
        shutil.copy2(s, d)
        a, b = md5(s), md5(d)
        print('%s %-52s %s' % ('OK  ' if a == b else 'DIFF', dstrel, a))

    # 旧命名文件：改名而非删除，避免留下两个同名快照
    old = os.path.join(DST, OLD_PLAN)
    new = os.path.join(DST, NEW_PLAN)
    if os.path.exists(old):
        if os.path.exists(new):
            os.remove(old)
            print('OK   已移除旧命名快照（内容已由 %s 取代）' % NEW_PLAN)
        else:
            os.rename(old, new)
            print('OK   已改名 %s → %s' % (OLD_PLAN, NEW_PLAN))

    # MD 中的章节标题与文件引用
    mdp = os.path.join(SRC, '加拿大大学录取要求完整对照表_2026.md')
    s = io.open(mdp, encoding='utf-8').read()
    reps = [
        (u'## 申请作战清单（按 GPA 89.6 重排）与 10 月行动日历 — 2026-09-24',
         u'## 申请作战清单（按 GPA 89.6 重排）与 10 月行动日历 — 基准日 2026-10-16（含 2026-09-24 初版）'),
        (u'离线单文件：`%s`' % OLD_PLAN,
         u'离线单文件：`%s`' % NEW_PLAN),
    ]
    for old_s, new_s in reps:
        c = s.count(old_s)
        if c:
            s = s.replace(old_s, new_s)
        print('MD 替换 x%d : %s' % (c, old_s[:56]))
    io.open(mdp, 'w', encoding='utf-8').write(s)
    shutil.copy2(mdp, os.path.join(DST, os.path.basename(mdp)))
    print('OK   MD 已回写并同步到工作区  md5=%s' % md5(mdp))


if __name__ == '__main__':
    main()
