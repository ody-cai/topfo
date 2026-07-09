-- 软删除：讨论帖 + 评论
ALTER TABLE discussions ADD COLUMN is_deleted INTEGER NOT NULL DEFAULT 0;
ALTER TABLE comments ADD COLUMN is_deleted INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_discussions_active ON discussions(is_deleted, created_at);
