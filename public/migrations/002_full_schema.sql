-- TopFO 项目完整数据库 Schema v2
-- 学校/专业/排名/申请/讨论/通知/提醒

-- 学校表
CREATE TABLE IF NOT EXISTS schools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  city TEXT,
  province TEXT,
  tier TEXT NOT NULL DEFAULT 't2',
  deadline TEXT,
  tuition TEXT,
  tuition_rmb TEXT,
  is_foundation INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_schools_tier ON schools(tier);
CREATE INDEX IF NOT EXISTS idx_schools_province ON schools(province);

-- 专业表（每个学校可能有多个专业方向）
CREATE TABLE IF NOT EXISTS programs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK(category IN ('cs','eng','math','psych','biz','health','sci','social')),
  gpa_min TEXT,
  label TEXT NOT NULL DEFAULT 'ok' CHECK(label IN ('hard','close','ok','na')),
  ielts_min TEXT,
  has_coop INTEGER NOT NULL DEFAULT 0,
  coop_note TEXT,
  dual_type TEXT,
  dual_thr TEXT,
  note TEXT,
  note_detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_programs_school ON programs(school_id);
CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);

-- 排名表
CREATE TABLE IF NOT EXISTS rankings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school TEXT NOT NULL,
  city TEXT,
  category TEXT NOT NULL CHECK(category IN ('cs','eng','math','psych','biz','health','sci','social','overall')),
  source TEXT NOT NULL CHECK(source IN ('qs','the','usn')),
  rank TEXT NOT NULL,
  year INTEGER NOT NULL DEFAULT 2027,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rankings_category ON rankings(category);
CREATE INDEX IF NOT EXISTS idx_rankings_source_year ON rankings(source, year);

-- 申请记录表
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  school_id INTEGER NOT NULL REFERENCES schools(id),
  program_id INTEGER REFERENCES programs(id),
  deadline TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('high','medium','low')),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'planning' CHECK(status IN ('planning','applying','submitted','accepted','rejected','waitlisted')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(user_id, status);

-- 讨论主题表
CREATE TABLE IF NOT EXISTS discussions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_discussions_category ON discussions(category);

-- 讨论评论表
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discussion_id INTEGER NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_comments_discussion ON comments(discussion_id);

-- 通知表
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- 提醒表
CREATE TABLE IF NOT EXISTS reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  deadline TEXT,
  notes TEXT,
  is_done INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_reminders_user ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_deadline ON reminders(deadline);

-- 翻译表（支持多语言）
CREATE TABLE IF NOT EXISTS translations (
  lang TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  PRIMARY KEY (lang, key)
);

-- 插入基础翻译数据
INSERT OR IGNORE INTO translations (lang, key, value) VALUES
  ('zh', 'app.title', 'TopFO 加拿大留学申请助手'),
  ('zh', 'nav.schools', '院校库'),
  ('zh', 'nav.rankings', '排名'),
  ('zh', 'nav.community', '社区'),
  ('zh', 'nav.chat', 'AI顾问'),
  ('zh', 'nav.settings', '设置'),
  ('zh', 'tier.t1', '极难申'),
  ('zh', 'tier.t2', '现实目标'),
  ('zh', 'tier.t3', '保底校'),
  ('zh', 'tier.au', '澳洲保底'),
  ('zh', 'status.planning', '规划中'),
  ('zh', 'status.applying', '申请中'),
  ('zh', 'status.submitted', '已提交'),
  ('zh', 'status.accepted', '已录取'),
  ('zh', 'status.rejected', '已拒绝'),
  ('zh', 'status.waitlisted', '候补'),
  ('en', 'app.title', 'TopFO Study in Canada'),
  ('en', 'nav.schools', 'Schools'),
  ('en', 'nav.rankings', 'Rankings'),
  ('en', 'nav.community', 'Community'),
  ('en', 'nav.chat', 'AI Advisor'),
  ('en', 'nav.settings', 'Settings'),
  ('en', 'tier.t1', 'Reach'),
  ('en', 'tier.t2', 'Target'),
  ('en', 'tier.t3', 'Safety'),
  ('en', 'tier.au', 'Australia'),
  ('en', 'status.planning', 'Planning'),
  ('en', 'status.applying', 'Applying'),
  ('en', 'status.submitted', 'Submitted'),
  ('en', 'status.accepted', 'Accepted'),
  ('en', 'status.rejected', 'Rejected'),
  ('en', 'status.waitlisted', 'Waitlisted');

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  username TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK(role IN ('student', 'consultant', 'admin', 'demo')),
  display_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 学生档案表
CREATE TABLE IF NOT EXISTS student_profiles (
  username TEXT PRIMARY KEY,
  gpa TEXT,
  ielts TEXT,
  target_schools TEXT,
  counselor_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (username) REFERENCES users(username)
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
