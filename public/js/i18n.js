// ===== 国际化 i18n 管理器 =====
const I18N = {
  _currentLang: 'zh',
  _translations: {},
  _listeners: [],

  async init() {
    const saved = document.cookie.split('; ').find(row => row.startsWith('lang='));
    this._currentLang = saved ? saved.split('=')[1] : 'zh';
    await this._loadLang(this._currentLang);
  },

  async _loadLang(lang) {
    try {
      const resp = await fetch(`/js/i18n/${lang}.json`);
      if (!resp.ok) throw new Error('Not found');
      this._translations = await resp.json();
    } catch {
      // Fallback: try API
      try {
        const resp = await fetch(`/api/translations/${lang}`);
        this._translations = await resp.json();
      } catch {
        console.warn('i18n: failed to load translations for', lang);
        this._translations = {};
      }
    }
    this._applyTranslations();
  },

  t(key, params = {}) {
    let text = this._translations[key] || key;
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    });
    return text;
  },

  async setLang(lang) {
    this._currentLang = lang;
    document.cookie = `lang=${lang};path=/;max-age=31536000`;
    // 强制刷新页面，所有静态 data-i18n 和动态注入元素重新渲染
    location.reload();
  },

  onChange(fn) { this._listeners.push(fn); },

  _applyTranslations() {
    // Update all data-i18n element text
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    // Update all data-i18n-placeholder element placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });
    // Update page title
    const titleKey = document.querySelector('title')?.getAttribute('data-i18n');
    if (titleKey) {
      document.title = this.t(titleKey);
    }
  },

  getCurrentLang() { return this._currentLang; }
};
