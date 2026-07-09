// ===== 认证模块（API 客户端） =====
// 密码验证 + 数据解密全部在服务端，前端只存 JWT token

const AUTH = {
  _key: 'admission_token',
  _dataKey: 'admission_pdata',
  _profileKey: 'admission_profile',
  _listeners: [],
  _data: null,
  _token: null,
  _modalInjected: false,

  // ===== 公开 API =====

  isLoggedIn() {
    return !!localStorage.getItem(this._key);
  },

  getCurrentUser() {
    if (!this.isLoggedIn()) return null;
    try {
      const raw = localStorage.getItem(this._key);
      if (!raw) return null;
      const parts = JSON.parse(raw).token.split('.');
      const claims = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return { name: '奇均', display: '奇均' };
    } catch { return null; }
  },

  getUsername() {
    if (!this.isLoggedIn()) return null;
    try {
      const raw = localStorage.getItem(this._key);
      if (!raw) return null;
      const parts = JSON.parse(raw).token.split('.');
      const claims = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return claims.sub || null;
    } catch { return null; }
  },

  getData() {
    if (this._data) return this._data;
    try {
      const cached = sessionStorage.getItem(this._dataKey);
      if (cached) { this._data = JSON.parse(cached); return this._data; }
    } catch {}
    return null;
  },

  // 获取本地编辑的个人数据（用于覆盖服务端数据）
  getProfile() {
    try {
      const raw = localStorage.getItem(this._profileKey);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  // 保存个人数据到本地 + 刷新所有页面展示
  saveProfile(profile) {
    localStorage.setItem(this._profileKey, JSON.stringify(profile));
    // 同步更新内存缓存
    const serverData = this.getData();
    if (serverData) {
      const merged = { ...serverData, ...profile };
      // 深度合并 ielts 避免丢失子分数
      if (serverData.ielts && profile.ielts) {
        merged.ielts = { ...serverData.ielts, ...profile.ielts };
      }
      this._data = merged;
      try { sessionStorage.setItem(this._dataKey, JSON.stringify(this._data)); } catch {}
    }
    this._notifyAll();
  },

  // 恢复默认（清除本地编辑，回到服务端数据）
  resetProfile() {
    localStorage.removeItem(this._profileKey);
    this._data = null;
    sessionStorage.removeItem(this._dataKey);
    this._notifyAll();
  },

  async login(username, password) {
    try {
      const resp = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const result = await resp.json();
      if (!resp.ok) return { ok: false, msg: result.error || '登录失败' };

      this._token = result.token;
      localStorage.setItem(this._key, JSON.stringify({ token: result.token, ts: Date.now() }));

      // 立即获取个人数据
      await this._fetchPersonalData();

      this._notifyAll();
      return { ok: true, msg: '登录成功', user: { name: '奇均', display: '奇均' } };
    } catch (e) {
      return { ok: false, msg: '网络错误，请重试' };
    }
  },

  logout() {
    localStorage.removeItem(this._key);
    sessionStorage.removeItem(this._dataKey);
    this._token = null;
    this._data = null;
    this._notifyAll();
  },

  async fetchData() {
    if (this._data) return this._data;
    return await this._fetchPersonalData();
  },

  onChange(fn) { this._listeners.push(fn); },

  // ===== 内部方法 =====

  _getToken() {
    if (this._token) return this._token;
    try {
      const raw = localStorage.getItem(this._key);
      if (raw) { this._token = JSON.parse(raw).token; return this._token; }
    } catch {}
    return null;
  },

  async _fetchPersonalData() {
    try {
      const token = this._getToken();
      if (!token) return null;
      const resp = await fetch('/api/me/data', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resp.ok) return null;
      const data = await resp.json();
      // 合并本地编辑的数据（深度合并 ielts）
      const profile = this.getProfile();
      if (profile) {
        this._data = { ...data, ...profile };
        if (data.ielts && profile.ielts) {
          this._data.ielts = { ...data.ielts, ...profile.ielts };
        }
      } else {
        this._data = data;
      }
      try { sessionStorage.setItem(this._dataKey, JSON.stringify(this._data)); } catch {}
      return this._data;
    } catch { return null; }
  },

  async _tryRestoreSession() {
    if (!this.isLoggedIn()) return false;
    if (this._data) return true;
    const data = await this._fetchPersonalData();
    return data !== null;
  },

  _notifyAll() {
    const logged = this.isLoggedIn();
    const user = logged ? this.getCurrentUser() : null;
    this._listeners.forEach(fn => fn(logged, user));
  },

  // 页面初始化：同步更新导航栏UI，异步恢复数据
  initPage() {
    const logged = this.isLoggedIn();
    const user = logged ? this.getCurrentUser() : null;
    this._updateNav(logged, user);

    // 已登录 → 尝试自动恢复数据
    if (logged && !this._data) {
      this._tryRestoreSession().then(success => {
        if (success) this._notifyAll();
      });
    }
  },

  _updateNav(logged, user) {
    const btn = document.getElementById('navAuthBtn');
    if (!btn) return;

    // 移除旧的编辑按钮
    const oldEdit = document.getElementById('navEditBtn');
    if (oldEdit) oldEdit.remove();

    if (logged) {
      btn.className = 'nav-auth-btn logged-in';
      btn.textContent = user ? user.display : '用户';
      btn.title = '点击退出登录';

      // 插入编辑数据按钮
      const editBtn = document.createElement('button');
      editBtn.id = 'navEditBtn';
      editBtn.className = 'nav-auth-btn';
      editBtn.textContent = '✏️ 编辑数据';
      editBtn.title = '修改GPA和雅思分数';
      editBtn.style.marginLeft = '8px';
      editBtn.onclick = () => AUTH.showProfileModal();
      btn.parentNode.insertBefore(editBtn, btn.nextSibling);

      // 显示/隐藏 AI 聊天
      this._updateChatWidget();
    } else {
      btn.className = 'nav-auth-btn';
      btn.textContent = '登录';
      btn.title = '登录查看个人数据';
      this._hideChatWidget();
    }
  },

  // ===== 个人数据编辑弹窗 =====

  _injectProfileModal() {
    if (this._modalInjected) return;
    this._modalInjected = true;

    const html = `
    <div id="profileModal" class="login-modal">
      <div class="login-modal-content" style="max-width:440px;">
        <h3 style="margin:0 0 4px;font-size:18px;">✏️ 编辑我的数据</h3>
        <p style="margin:0 0 16px;font-size:12px;color:var(--c-text-tertiary);">修改后自动刷新所有页面的匹配结果</p>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <label style="width:70px;font-size:13px;font-weight:500;">GPA</label>
            <input id="profileGpa" type="number" step="0.1" min="0" max="100" placeholder="如 89.6"
              style="flex:1;padding:8px 12px;border:1px solid var(--c-border);border-radius:6px;font-size:14px;"/>
            <span style="font-size:12px;color:var(--c-text-tertiary);">%</span>
          </div>
          <div style="border-top:1px solid var(--c-border);margin:4px 0;"></div>
          <div style="display:flex;align-items:center;gap:12px;">
            <label style="width:70px;font-size:13px;font-weight:500;">雅思总分</label>
            <input id="profileIeltsOverall" type="number" step="0.5" min="0" max="9" placeholder="如 5.0"
              style="flex:1;padding:8px 12px;border:1px solid var(--c-border);border-radius:6px;font-size:14px;"/>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <label style="width:36px;font-size:12px;color:var(--c-text-tertiary);">听力</label>
              <input id="profileIeltsL" type="number" step="0.5" min="0" max="9" placeholder="4.5"
                style="flex:1;padding:6px 10px;border:1px solid var(--c-border);border-radius:6px;font-size:13px;"/>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <label style="width:36px;font-size:12px;color:var(--c-text-tertiary);">阅读</label>
              <input id="profileIeltsR" type="number" step="0.5" min="0" max="9" placeholder="4.5"
                style="flex:1;padding:6px 10px;border:1px solid var(--c-border);border-radius:6px;font-size:13px;"/>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <label style="width:36px;font-size:12px;color:var(--c-text-tertiary);">写作</label>
              <input id="profileIeltsW" type="number" step="0.5" min="0" max="9" placeholder="5.5"
                style="flex:1;padding:6px 10px;border:1px solid var(--c-border);border-radius:6px;font-size:13px;"/>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <label style="width:36px;font-size:12px;color:var(--c-text-tertiary);">口语</label>
              <input id="profileIeltsS" type="number" step="0.5" min="0" max="9" placeholder="5.0"
                style="flex:1;padding:6px 10px;border:1px solid var(--c-border);border-radius:6px;font-size:13px;"/>
            </div>
          </div>
        </div>
        <div id="profileError" style="display:none;color:var(--c-danger);font-size:12px;margin-top:8px;"></div>
        <div style="display:flex;gap:8px;margin-top:16px;">
          <button onclick="AUTH.handleProfileSave()" id="profileSaveBtn"
            style="flex:1;padding:10px;background:var(--c-primary);color:#fff;border:none;border-radius:6px;font-size:14px;font-weight:500;cursor:pointer;">保存</button>
          <button onclick="AUTH.resetProfile();AUTH.hideProfileModal();"
            style="padding:10px 16px;background:transparent;color:var(--c-text-tertiary);border:1px solid var(--c-border);border-radius:6px;font-size:13px;cursor:pointer;">恢复默认</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  },

  showProfileModal() {
    this._injectProfileModal();
    const profile = this.getProfile();
    const serverData = this.getData();
    const data = profile || serverData || {};

    document.getElementById('profileGpa').value = data.gpa || '';
    document.getElementById('profileIeltsOverall').value = (data.ielts && data.ielts.overall) || '';
    document.getElementById('profileIeltsL').value = (data.ielts && data.ielts.listening) || '';
    document.getElementById('profileIeltsR').value = (data.ielts && data.ielts.reading) || '';
    document.getElementById('profileIeltsW').value = (data.ielts && data.ielts.writing) || '';
    document.getElementById('profileIeltsS').value = (data.ielts && data.ielts.speaking) || '';

    const modal = document.getElementById('profileModal');
    if (modal) modal.classList.add('show');
  },

  hideProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) modal.classList.remove('show');
  },

  handleProfileSave() {
    const gpa = document.getElementById('profileGpa').value.trim();
    const overall = document.getElementById('profileIeltsOverall').value.trim();
    const listening = document.getElementById('profileIeltsL').value.trim();
    const reading = document.getElementById('profileIeltsR').value.trim();
    const writing = document.getElementById('profileIeltsW').value.trim();
    const speaking = document.getElementById('profileIeltsS').value.trim();
    const errEl = document.getElementById('profileError');

    if (!gpa && !overall) {
      errEl.style.display = 'block';
      errEl.textContent = '请至少填写 GPA 或雅思总分';
      return;
    }

    const profile = {};
    if (gpa) profile.gpa = gpa;
    if (overall) {
      profile.ielts = { overall: Number(overall) };
      if (listening) profile.ielts.listening = Number(listening);
      if (reading) profile.ielts.reading = Number(reading);
      if (writing) profile.ielts.writing = Number(writing);
      if (speaking) profile.ielts.speaking = Number(speaking);
    }

    const btn = document.getElementById('profileSaveBtn');
    btn.disabled = true;
    btn.textContent = '保存中...';

    this.saveProfile(profile);
    this.hideProfileModal();

    setTimeout(() => { btn.disabled = false; btn.textContent = '保存'; }, 500);
  },

  // ===== 登录弹窗 =====",

  showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.add('show');
  },

  hideLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.remove('show');
  },

  async handleLoginSubmit() {
    const userInput = document.getElementById('loginUser');
    const passInput = document.getElementById('loginPass');
    const errorEl = document.getElementById('loginError');
    const btn = document.getElementById('loginSubmitBtn');

    const username = userInput.value.trim();
    const password = passInput.value;

    if (!username || !password) {
      errorEl.style.display = 'block';
      errorEl.textContent = '请输入账号和密码';
      return;
    }

    if (btn) { btn.disabled = true; btn.textContent = '验证中...'; }
    errorEl.style.display = 'none';

    const result = await this.login(username, password);

    if (btn) { btn.disabled = false; btn.textContent = '登录'; }

    if (result.ok) {
      this.hideLoginModal();
      userInput.value = '';
      passInput.value = '';
    } else {
      errorEl.style.display = 'block';
      errorEl.textContent = result.msg;
    }
  },

  handleNavAuthClick() {
    if (this.isLoggedIn()) {
      this.logout();
    } else {
      this.showLoginModal();
    }
  },

  // ===== AI 聊天组件（云同步版） =====
  _chatMessages: [],
  _chatInjected: false,
  _chatLoadingHistory: false,

  async _loadChatFromCloud() {
    if (this._chatLoadingHistory) return;
    this._chatLoadingHistory = true;
    try {
      const token = this._getToken();
      const resp = await fetch('/api/chat', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resp.ok) {
        const data = await resp.json();
        this._chatMessages = data.messages || [];
      }
    } catch {} finally {
      this._chatLoadingHistory = false;
    }
  },

  async _loadArchivedChat(since) {
    try {
      const token = this._getToken();
      const url = since ? `/api/chat?archive=true&since=${encodeURIComponent(since)}` : '/api/chat?archive=true';
      const resp = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resp.ok) {
        const data = await resp.json();
        return data.messages || [];
      }
    } catch {}
    return [];
  },

  _injectChatWidget() {
    if (this._chatInjected) return;
    this._chatInjected = true;

    const html = `
    <div id="chatWidget" class="chat-widget">
      <button class="chat-toggle" id="chatToggle" onclick="AUTH.toggleChat()" title="AI 升学顾问">
        🤖<span class="chat-dot"></span>
      </button>
      <div class="chat-panel" id="chatPanel">
        <div class="chat-header">
          <h3><span class="ai-icon">🤖</span> AI 升学顾问</h3>
          <div class="chat-header-actions">
            <button class="chat-clear" onclick="AUTH.showArchivePanel()" title="查看历史">📂</button>
            <button class="chat-clear" onclick="AUTH.clearChat()" title="清空对话">🗑</button>
            <button class="chat-close" onclick="AUTH.closeChat()">✕</button>
          </div>
        </div>
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input-area">
          <input type="text" id="chatInput" placeholder="输入你的问题..." onkeydown="if(event.key==='Enter')AUTH.sendChatMessage()">
          <button class="chat-send" id="chatSendBtn" onclick="AUTH.sendChatMessage()">➤</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);

    // 从云端加载历史
    this._loadChatFromCloud().then(() => this._renderChatHistory());
  },

  _renderChatHistory() {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    container.innerHTML = '';

    if (this._chatMessages.length === 0) {
      const div = document.createElement('div');
      div.className = 'chat-msg ai';
      div.innerHTML = `👋 你好！我是你的专属 AI 升学顾问。<br><br>
        我可以帮你分析加拿大大学的录取可能性、推荐院校、解答申请疑问。试试问我：
        <br><br>• 我的 GPA 能上哪些 CS 专业？
        <br>• 麦马大学我的录取概率如何？
        <br>• 雅思要提高到多少分？
        <br>• 推荐几个保底院校？
        <br><br><em style="font-size:11px;opacity:.6;">💡 聊天记录云端同步，3天内自动加载上下文，更早的对话点击 📂 查看</em>`;
      container.appendChild(div);
    } else {
      this._chatMessages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'chat-msg ' + (msg.role === 'user' ? 'user' : 'ai');
        div.textContent = msg.content;
        container.appendChild(div);
      });
      container.scrollTop = container.scrollHeight;
    }
  },

  _updateChatWidget() {
    const username = this.getUsername();
    if (username === 'caiqijun') {
      this._injectChatWidget();
      const w = document.getElementById('chatWidget');
      if (w) w.classList.add('visible');
    } else {
      this._hideChatWidget();
    }
  },

  _hideChatWidget() {
    const w = document.getElementById('chatWidget');
    if (w) w.classList.remove('visible');
    const panel = document.getElementById('chatPanel');
    if (panel) panel.classList.remove('open');
  },

  toggleChat() {
    const panel = document.getElementById('chatPanel');
    if (!panel) return;
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      const input = document.getElementById('chatInput');
      if (input) setTimeout(() => input.focus(), 200);
    }
  },

  closeChat() {
    const panel = document.getElementById('chatPanel');
    if (panel) panel.classList.remove('open');
  },

  clearChat() {
    this._chatMessages = [];
    this._renderChatHistory();
  },

  async showArchivePanel() {
    // 加载归档记录概览（按日期分组）
    try {
      this._addChatBubble('ai', '📂 正在加载历史记录...');
      const archived = await this._loadArchivedChat();

      const container = document.getElementById('chatMessages');
      // 移除加载提示
      const loadingEl = container.lastElementChild;
      if (loadingEl && loadingEl.textContent.includes('正在加载')) {
        loadingEl.remove();
      }

      if (archived.length === 0) {
        this._addChatBubble('ai', '📂 没有更早的聊天记录。\n\n所有近期对话会在 3 天后自动归档到这里。');
        return;
      }

      // 按日期分组显示
      const groups = {};
      archived.forEach(msg => {
        const date = msg.created_at ? msg.created_at.substring(0, 10) : '未知日期';
        if (!groups[date]) groups[date] = [];
        groups[date].push(msg);
      });

      let summary = '📂 <b>历史归档记录</b>\n\n';
      for (const [date, msgs] of Object.entries(groups)) {
        summary += `<b>${date}</b>（${msgs.length} 条消息）\n`;
      }
      summary += '\n<em style="font-size:11px;opacity:.6;">💡 输入具体日期可查看详细内容，如"查看 7月5日 的聊天"</em>';

      const div = document.createElement('div');
      div.className = 'chat-msg ai';
      div.innerHTML = summary;
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    } catch (e) {
      this._addChatBubble('ai', '⚠️ 加载归档记录失败');
    }
  },

  async sendChatMessage() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');
    if (!input || !sendBtn) return;

    const text = input.value.trim();
    if (!text) return;

    // 禁用输入
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;

    // 添加用户消息到本地
    const userMsg = { role: 'user', content: text };
    this._addChatBubble('user', text);
    this._chatMessages.push(userMsg);

    // 显示 typing
    const typingId = this._addTypingIndicator();

    // 调用后端（只发当前消息，后端自动加载 D1 历史作为上下文）
    try {
      const token = this._getToken();
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: text })
      });

      this._removeTypingIndicator(typingId);

      const data = await resp.json();

      if (data.reply) {
        this._addChatBubble('ai', data.reply);
        this._chatMessages.push({ role: 'assistant', content: data.reply });
      } else if (data.error) {
        this._addChatBubble('ai', '⚠️ ' + data.error);
      }

      // 本地保留最近 40 条显示
      if (this._chatMessages.length > 40) {
        this._chatMessages = this._chatMessages.slice(-40);
      }
    } catch (e) {
      this._removeTypingIndicator(typingId);
      this._addChatBubble('ai', '⚠️ 网络错误，请稍后重试');
    }

    // 恢复输入
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  },

  _addChatBubble(role, text) {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'chat-msg ' + role;
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  _addTypingIndicator() {
    const container = document.getElementById('chatMessages');
    if (!container) return null;

    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = 'chat-msg ai';
    div.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
  },

  _removeTypingIndicator(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.remove();
  }
};

// 全局点击事件：点击模态框外部关闭
document.addEventListener('click', function(e) {
  // 登录弹窗
  const loginModal = document.getElementById('loginModal');
  if (loginModal && loginModal.classList.contains('show')) {
    const content = loginModal.querySelector('.login-modal-content');
    if (content && !content.contains(e.target) && e.target.id !== 'navAuthBtn') {
      AUTH.hideLoginModal();
    }
  }
  // 个人数据编辑弹窗
  const profileModal = document.getElementById('profileModal');
  if (profileModal && profileModal.classList.contains('show')) {
    const content = profileModal.querySelector('.login-modal-content');
    if (content && !content.contains(e.target) && e.target.id !== 'navEditBtn') {
      AUTH.hideProfileModal();
    }
  }
});

// 回车键提交
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const loginModal = document.getElementById('loginModal');
    if (loginModal && loginModal.classList.contains('show')) {
      AUTH.handleLoginSubmit();
      return;
    }
    const profileModal = document.getElementById('profileModal');
    if (profileModal && profileModal.classList.contains('show')) {
      AUTH.handleProfileSave();
    }
  }
});
