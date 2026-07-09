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
  _loginModalInjected: false,
  _registerModalInjected: false,

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
      // 从 localStorage 获取登录时服务端返回的 user 信息
      const loginInfo = JSON.parse(localStorage.getItem('admission_user') || '{}');
      return { name: loginInfo.name || claims.sub, display: loginInfo.display || claims.sub };
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

  _getRole() {
    try {
      const raw = localStorage.getItem(this._key);
      if (!raw) return null;
      const parts = JSON.parse(raw).token.split('.');
      const claims = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return claims.role || null;
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
      // Normalize user object (backend returns display_name, frontend expects display)
      const userData = result.user || {};
      if (userData.display_name && !userData.display) {
        userData.display = userData.display_name;
      }
      localStorage.setItem('admission_user', JSON.stringify(userData || { name: username, display: username }));

      // 立即获取个人数据
      await this._fetchPersonalData();

      this._notifyAll();
      return { ok: true, msg: '登录成功', user: result.user };
    } catch (e) {
      return { ok: false, msg: '网络错误，请重试' };
    }
  },

  logout() {
    this._stopNotifPolling();
    localStorage.removeItem(this._key);
    localStorage.removeItem('admission_user');
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

  _navExtrasInjected: false,

  _injectNavExtras() {
    if (this._navExtrasInjected) return;
    this._navExtrasInjected = true;

    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    // 语言切换器
    const langBtn = document.createElement('button');
    langBtn.id = 'navLangBtn';
    langBtn.className = 'nav-lang-btn';
    langBtn.title = typeof I18N !== 'undefined' && I18N.t ? I18N.t('lang.switch') : '切换语言';
    langBtn.textContent = typeof I18N !== 'undefined' && I18N.t ? I18N.t('lang.' + (I18N.getCurrentLang())) : '🌐';
    langBtn.onclick = (e) => {
      e.stopPropagation();
      const menu = document.getElementById('navLangMenu');
      if (menu) menu.classList.toggle('show');
    };
    navLinks.appendChild(langBtn);

    // 语言下拉菜单（使用 data-i18n 属性让页面刷新后正确显示）
    const langMenu = document.createElement('div');
    langMenu.id = 'navLangMenu';
    langMenu.className = 'nav-lang-menu';
    langMenu.innerHTML = `
      <div class="nav-lang-option" data-lang="zh">🇨🇳 <span data-i18n="lang.zh">中文</span></div>
      <div class="nav-lang-option" data-lang="en">🇬🇧 <span data-i18n="lang.en">EN</span></div>
      <div class="nav-lang-option" data-lang="fr">🇫🇷 <span data-i18n="lang.fr">FR</span></div>
    `;
    langMenu.querySelectorAll('.nav-lang-option').forEach(opt => {
      opt.addEventListener('click', async () => {
        const lang = opt.getAttribute('data-lang');
        if (typeof I18N !== 'undefined') {
          await I18N.setLang(lang);
          // setLang 会触发 location.reload()，以下代码不会执行
        }
        langMenu.classList.remove('show');
      });
    });
    navLinks.appendChild(langMenu);

    // 通知图标
    const notifBtn = document.createElement('button');
    notifBtn.id = 'navNotifBtn';
    notifBtn.className = 'nav-notif-btn';
    notifBtn.title = I18N ? I18N.t('nav.notifications') : '通知';
    notifBtn.style.display = 'none'; // 登录后显示
    notifBtn.innerHTML = '🔔 <span id="notifBadge" style="display:none;background:red;color:white;border-radius:50%;padding:1px 5px;font-size:10px;vertical-align:top;">0</span>';
    notifBtn.onclick = () => { window.location.href = '/pages/notifications.html'; };
    navLinks.appendChild(notifBtn);
  },

  _updateNav(logged, user) {
    const btn = document.getElementById('navAuthBtn');
    if (!btn) return;

    // 注入导航额外元素
    this._injectNavExtras();

    // 移除旧的编辑按钮
    const oldEdit = document.getElementById('navEditBtn');
    if (oldEdit) oldEdit.remove();

    // 更新语言切换按钮文本
    const langBtn = document.getElementById('navLangBtn');
    if (langBtn && typeof I18N !== 'undefined') {
      langBtn.textContent = I18N.t('lang.' + I18N.getCurrentLang());
    }

    if (logged) {
      btn.className = 'nav-auth-btn logged-in';
      btn.textContent = user ? user.display : '用户';
      btn.title = '点击退出登录';

      // 显示通知图标并开始轮询
      const notifBtn = document.getElementById('navNotifBtn');
      if (notifBtn) {
        notifBtn.style.display = '';
        this._startNotifPolling();
      }

      // 学生/咨询师/管理员显示编辑数据按钮和聊天
      if (this._getRole() === 'student' || this._getRole() === 'consultant' || this._getRole() === 'admin') {
        const editBtn = document.createElement('button');
        editBtn.id = 'navEditBtn';
        editBtn.className = 'nav-auth-btn';
        editBtn.textContent = '✏️ ' + (typeof I18N !== 'undefined' ? I18N.t('nav.editData') : '编辑数据');
        editBtn.title = '修改GPA和雅思分数';
        editBtn.style.marginLeft = '8px';
        editBtn.onclick = () => AUTH.showProfileModal();
        btn.parentNode.insertBefore(editBtn, btn.nextSibling);

        this._updateChatWidget();
      } else {
        this._hideChatWidget();
      }
    } else {
      btn.className = 'nav-auth-btn';
      btn.textContent = typeof I18N !== 'undefined' ? I18N.t('nav.login') : '登录';
      btn.title = '登录查看个人数据';
      this._hideChatWidget();

      // 隐藏通知图标并停止轮询
      this._stopNotifPolling();
      const notifBtn = document.getElementById('navNotifBtn');
      if (notifBtn) notifBtn.style.display = 'none';
    }
  },

  // ===== 通知未读数轮询 =====
  _notifPollTimer: null,

  async fetchUnreadCount() {
    try {
      const token = this._getToken();
      if (!token) {
        const badge = document.getElementById('notifBadge');
        if (badge) badge.style.display = 'none';
        return;
      }
      const resp = await fetch('/api/notifications?unread=true', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resp.ok) {
        const data = await resp.json();
        const unread = data.unread_count || 0;
        const badge = document.getElementById('notifBadge');
        if (badge) {
          if (unread > 0) {
            badge.style.display = '';
            badge.textContent = unread > 99 ? '99+' : unread;
          } else {
            badge.style.display = 'none';
          }
        }
      }
    } catch (e) {
      // 静默失败
    }
  },

  _startNotifPolling() {
    this._stopNotifPolling();
    this.fetchUnreadCount();
    this._notifPollTimer = setInterval(() => this.fetchUnreadCount(), 60000);
  },

  _stopNotifPolling() {
    if (this._notifPollTimer) {
      clearInterval(this._notifPollTimer);
      this._notifPollTimer = null;
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

  _injectLoginModal() {
    if (this._loginModalInjected) return;
    this._loginModalInjected = true;

    const t = (typeof I18N !== 'undefined' && I18N.t) ? I18N.t : (k) => k;
    const html = `
    <div id="loginModal" class="login-modal">
      <div class="login-modal-content" style="max-width:360px;">
        <h3 style="margin:0 0 16px;font-size:18px;font-weight:600;color:var(--c-text);">🔐 ${t('auth.login.title')}</h3>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <input id="loginUser" type="text" placeholder="${t('auth.login.username')}"
            style="padding:10px 14px;border:1px solid var(--c-border);border-radius:8px;font-size:14px;background:var(--c-bg-secondary);color:var(--c-text);outline:none;"
            autocomplete="username">
          <input id="loginPass" type="password" placeholder="${t('auth.login.password')}"
            style="padding:10px 14px;border:1px solid var(--c-border);border-radius:8px;font-size:14px;background:var(--c-bg-secondary);color:var(--c-text);outline:none;"
            autocomplete="current-password">
        </div>
        <div id="loginError" style="display:none;color:#e74c3c;font-size:12px;margin:8px 0;"></div>
        <button id="loginSubmitBtn" onclick="AUTH.handleLoginSubmit()"
          style="width:100%;padding:12px;margin-top:12px;background:var(--c-primary);color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer;">${t('auth.login.submit')}</button>
        <div style="margin-top:12px;text-align:center;font-size:12px;color:var(--c-text-tertiary);">
          <a href="javascript:void(0)" onclick="AUTH.hideLoginModal();AUTH.showRegisterModal();" style="color:var(--c-primary);text-decoration:none;">${t('auth.login.noAccount')}</a>
          &nbsp;·&nbsp;
          <span style="cursor:pointer;">${t('auth.login.demo', {demo: 'demo', pass: 'topfo2026'}) || '体验: demo / topfo2026'}</span>
        </div>
      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', html);

    // 回车提交
    const passInput = document.getElementById('loginPass');
    if (passInput) {
      passInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.handleLoginSubmit();
      });
    }
  },

  showLoginModal() {
    this._injectLoginModal();
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
    const role = this._getRole();
    // 学生/咨询师/管理员可用 AI 升学顾问
    if (role === 'student' || role === 'consultant' || role === 'admin') {
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
  },

  // ===== 注册弹窗 =====

  _injectRegisterModal() {
    if (this._registerModalInjected) return;
    this._registerModalInjected = true;

    const t = (typeof I18N !== 'undefined' && I18N.t) ? I18N.t : (k) => k;
    const html = `
    <div id="registerModal" class="login-modal">
      <div class="login-modal-content" style="max-width:360px;">
        <h3 style="margin:0 0 16px;font-size:18px;font-weight:600;color:var(--c-text);">📝 ${t('auth.register.title')}</h3>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <input id="regUser" type="text" placeholder="${t('auth.register.username')}"
            style="padding:10px 14px;border:1px solid var(--c-border);border-radius:8px;font-size:14px;background:var(--c-bg-secondary);color:var(--c-text);outline:none;"
            autocomplete="username">
          <input id="regPass" type="password" placeholder="${t('auth.register.password')}"
            style="padding:10px 14px;border:1px solid var(--c-border);border-radius:8px;font-size:14px;background:var(--c-bg-secondary);color:var(--c-text);outline:none;"
            autocomplete="new-password">
          <input id="regDisplay" type="text" placeholder="${t('auth.register.displayName')}"
            style="padding:10px 14px;border:1px solid var(--c-border);border-radius:8px;font-size:14px;background:var(--c-bg-secondary);color:var(--c-text);outline:none;">
        </div>
        <div id="regError" style="display:none;color:#e74c3c;font-size:12px;margin:8px 0;"></div>
        <button id="regSubmitBtn" onclick="AUTH.handleRegisterSubmit()"
          style="width:100%;padding:12px;margin-top:12px;background:var(--c-primary);color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer;">${t('auth.register.submit')}</button>
        <div style="margin-top:12px;text-align:center;font-size:12px;color:var(--c-text-tertiary);">
          <a href="javascript:void(0)" onclick="AUTH.hideRegisterModal();AUTH.showLoginModal();" style="color:var(--c-primary);text-decoration:none;">${t('common.login') || '已有账号？登录'}</a>
        </div>
      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', html);

    const passInput = document.getElementById('regPass');
    if (passInput) {
      passInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.handleRegisterSubmit();
      });
    }
  },

  showRegisterModal() {
    this._injectRegisterModal();
    const modal = document.getElementById('registerModal');
    if (modal) modal.classList.add('show');
  },

  hideRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) modal.classList.remove('show');
  },

  async handleRegisterSubmit() {
    const userInput = document.getElementById('regUser');
    const passInput = document.getElementById('regPass');
    const displayInput = document.getElementById('regDisplay');
    const errorEl = document.getElementById('regError');
    const btn = document.getElementById('regSubmitBtn');

    const username = userInput.value.trim();
    const password = passInput.value;
    const display = displayInput.value.trim() || username;

    if (!username || !password) {
      errorEl.style.display = 'block';
      errorEl.textContent = '请输入用户名和密码';
      return;
    }

    if (btn) { btn.disabled = true; btn.textContent = '注册中...'; }
    errorEl.style.display = 'none';

    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, display })
      });
      const result = await resp.json();

      if (btn) { btn.disabled = false; btn.textContent = '注册'; }

      if (resp.ok) {
        this.hideRegisterModal();
        userInput.value = '';
        passInput.value = '';
        displayInput.value = '';
        // 注册成功后自动填入登录表单
        const loginUser = document.getElementById('loginUser');
        const loginPass = document.getElementById('loginPass');
        if (loginUser) loginUser.value = username;
        if (loginPass) loginPass.value = password;
        this.showLoginModal();
      } else {
        errorEl.style.display = 'block';
        errorEl.textContent = result.error || '注册失败';
      }
    } catch (e) {
      if (btn) { btn.disabled = false; btn.textContent = '注册'; }
      errorEl.style.display = 'block';
      errorEl.textContent = '网络错误，请重试';
    }
  },

  // ===== API 数据获取 =====

  async fetchSchools(category) {
    const url = category ? `/api/schools?category=${category}` : '/api/schools';
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      return data.schools || [];
    } catch {
      return [];
    }
  },

  async fetchRankings(params) {
    const qs = new URLSearchParams(params).toString();
    try {
      const resp = await fetch(`/api/rankings?${qs}`);
      const data = await resp.json();
      return data.rankings || [];
    } catch {
      return [];
    }
  }
};

// 全局点击事件：关闭弹出层
document.addEventListener('click', function(e) {
  // 语言菜单：点击外部关闭
  const langMenu = document.getElementById('navLangMenu');
  if (langMenu && langMenu.classList.contains('show')) {
    const langBtn = document.getElementById('navLangBtn');
    if (langBtn && !langBtn.contains(e.target) && !langMenu.contains(e.target)) {
      langMenu.classList.remove('show');
    }
  }
  // 登录弹窗
  // 登录弹窗
  const loginModal = document.getElementById('loginModal');
  if (loginModal && loginModal.classList.contains('show')) {
    const content = loginModal.querySelector('.login-modal-content');
    if (content && !content.contains(e.target) && e.target.id !== 'navAuthBtn') {
      AUTH.hideLoginModal();
    }
  }
  // 注册弹窗
  const registerModal = document.getElementById('registerModal');
  if (registerModal && registerModal.classList.contains('show')) {
    const content = registerModal.querySelector('.login-modal-content');
    if (content && !content.contains(e.target)) {
      AUTH.hideRegisterModal();
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
    const registerModal = document.getElementById('registerModal');
    if (registerModal && registerModal.classList.contains('show')) {
      AUTH.handleRegisterSubmit();
      return;
    }
    const profileModal = document.getElementById('profileModal');
    if (profileModal && profileModal.classList.contains('show')) {
      AUTH.handleProfileSave();
    }
  }
});
