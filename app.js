const STORAGE_KEY = 'graveyard:v1';

/** @typedef {'À tester'|'En pause'|'Enterrée'} IdeaStatus */

/**
 * @typedef {Object} Idea
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {string} excite
 * @property {string} notNow
 * @property {IdeaStatus} status
 */

function safeUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return String(Date.now()) + '-' + Math.random().toString(16).slice(2);
}

function loadIdeas() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveIdeas(ideas) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
}

function clampText(text, maxChars) {
  const t = String(text || '').trim().replace(/\s+/g, ' ');
  if (t.length <= maxChars) return t;
  return t.slice(0, Math.max(0, maxChars - 1)).trimEnd() + '…';
}

function firstSentence(text) {
  const t = String(text || '').trim();
  if (!t) return '';
  // Keep it permissive: take up to first ., !, ? or newline.
  const m = t.match(/^[^\n.!?]+[\n.!?]?/);
  const s = (m ? m[0] : t).trim();
  return clampText(s, 160);
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, String(v));
  }
  for (const c of children) node.appendChild(c);
  return node;
}

function render(ideas) {
  const list = document.getElementById('ideas');
  const empty = document.getElementById('empty');

  list.innerHTML = '';

  empty.style.display = ideas.length ? 'none' : 'block';

  for (const idea of ideas) {
    const title = el('p', { class: 'title', text: idea.title });

    const statusSelect = el('select', { class: 'small', 'data-id': idea.id, 'aria-label': 'Changer le statut' });
    for (const opt of ['À tester', 'En pause', 'Enterrée']) {
      const o = el('option', { value: opt, text: opt });
      if (opt === idea.status) o.selected = true;
      statusSelect.appendChild(o);
    }

    statusSelect.addEventListener('change', (e) => {
      const next = /** @type {HTMLSelectElement} */ (e.currentTarget).value;
      const idx = ideas.findIndex((x) => x.id === idea.id);
      if (idx === -1) return;
      ideas[idx] = { ...ideas[idx], status: /** @type {IdeaStatus} */ (next) };
      saveIdeas(ideas);
      render(ideas);
    });

    const delBtn = el('button', { class: 'btn small danger', type: 'button', text: 'Supprimer' });
    delBtn.addEventListener('click', () => {
      const ok = confirm('Supprimer cette idée ?');
      if (!ok) return;
      ideas = ideas.filter((x) => x.id !== idea.id);
      saveIdeas(ideas);
      render(ideas);
    });

    const controls = el('div', { class: 'controls' }, [statusSelect, delBtn]);

    const top = el('div', { class: 'itemTop' }, [title, controls]);

    const snip1 = firstSentence(idea.excite);
    const snip2 = firstSentence(idea.notNow);

    const snippets = el('div', { class: 'snippets' }, [
      el('p', { class: 'snip', text: snip1 || '—' }),
      el('p', { class: 'snip', text: snip2 || '—' }),
    ]);

    const li = el('li', { class: 'item' }, [top, snippets]);
    list.appendChild(li);
  }
}

function main() {
  let ideas = loadIdeas();

  const form = document.getElementById('ideaForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    /** @type {Idea} */
    const idea = {
      id: safeUUID(),
      title: String(fd.get('title') || '').trim(),
      body: String(fd.get('body') || '').trim(),
      excite: String(fd.get('excite') || '').trim(),
      notNow: String(fd.get('notNow') || '').trim(),
      status: /** @type {IdeaStatus} */ (String(fd.get('status') || 'À tester')),
    };

    if (!idea.title || !idea.body || !idea.excite || !idea.notNow) return;

    ideas = [idea, ...ideas];
    saveIdeas(ideas);
    form.reset();
    /** @type {HTMLInputElement} */ (document.getElementById('title')).focus();
    render(ideas);
  });

  render(ideas);
}

document.addEventListener('DOMContentLoaded', main);
