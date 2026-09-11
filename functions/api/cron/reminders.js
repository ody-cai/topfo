// 每日截止日期提醒检查
// 由 Cloudflare Cron Triggers 调度调用
// 查询 7 天内到期的申请，自动创建通知

export async function onRequest(context) {
  const { env } = context;

  const today = new Date().toISOString().substring(0, 10);
  const in7Days = new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10);

  try {
    // 1. 查询 7 天内到期的申请
    const upcoming = await env.topfo_chat.prepare(`
      SELECT a.id, a.user_id, a.deadline, a.school_id, s.name_zh, s.name_en, a.notes
      FROM applications a
      JOIN schools s ON a.school_id = s.id
      WHERE a.deadline BETWEEN ? AND ?
      AND a.status NOT IN ('accepted', 'rejected', 'withdrawn')
    `).bind(today, in7Days).all();

    let upcomingCreated = 0;

    // 2. 为每个即将到期的申请创建通知（去重）
    for (const app of upcoming.results || []) {
      // 检查该用户是否已有同学校的 deadline 类型通知
      const existing = await env.topfo_chat.prepare(`
        SELECT id FROM notifications
        WHERE user_id = ? AND type = 'deadline' AND title LIKE ?
      `).bind(app.user_id, `%${app.name_zh}%`).all();

      if (existing.results.length === 0) {
        const daysLeft = Math.ceil((new Date(app.deadline) - new Date()) / 86400000);
        await env.topfo_chat.prepare(`
          INSERT INTO notifications (user_id, type, title, content, created_at)
          VALUES (?, 'deadline', ?, ?, datetime('now'))
        `).bind(
          app.user_id,
          `⏰ ${app.name_zh} 申请截止倒计时 ${daysLeft} 天`,
          `${app.name_en}（${app.name_zh}）的申请截止日期为 ${app.deadline}，还剩 ${daysLeft} 天。请及时准备材料！`
        ).run();
        upcomingCreated++;
      }
    }

    // 3. 检查今天到期的（未提交的），创建紧急通知
    const dueToday = await env.topfo_chat.prepare(`
      SELECT a.id, a.user_id, s.name_zh, s.name_en
      FROM applications a JOIN schools s ON a.school_id = s.id
      WHERE a.deadline = ? AND a.status NOT IN ('accepted', 'rejected', 'withdrawn', 'submitted')
    `).bind(today).all();

    let urgentCreated = 0;

    for (const app of dueToday.results || []) {
      const existing = await env.topfo_chat.prepare(`
        SELECT id FROM notifications
        WHERE user_id = ? AND type = 'deadline' AND title LIKE '%紧急%' AND title LIKE ?
      `).bind(app.user_id, `%${app.name_zh}%`).all();

      if (existing.results.length === 0) {
        await env.topfo_chat.prepare(`
          INSERT INTO notifications (user_id, type, title, content, created_at)
          VALUES (?, 'deadline', ?, ?, datetime('now'))
        `).bind(
          app.user_id,
          `🚨 紧急！${app.name_zh} 申请今日截止！`,
          `${app.name_en} 的申请截止日期就是今天！如已提交请忽略此提醒。`
        ).run();
        urgentCreated++;
      }
    }

    return Response.json({
      processed: true,
      upcoming: upcoming.results.length,
      upcomingCreated,
      dueToday: dueToday.results.length,
      urgentCreated,
      date: today
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
