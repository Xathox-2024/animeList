// /js/animeWatching.js
(function () {
  const LIST_SELECTOR = '#animeList';
  const ITEM_SELECTOR = '.al-item';
  const BTN_SELECTOR  = '.al-watch';
  const NAME_SEL      = '.al-name';
  const YEAR_SEL      = '.al-meta'; // adapte si l'année est ailleurs

  const STORAGE_KEY = 'anime-watching-keys';

  // Optionnel : si tu mets <body data-role="admin"> côté EJS,
  // on s'assure que seul l'admin active le module.
  const role = (document.body && document.body.dataset && document.body.dataset.role) || '';
  if (role && role !== 'admin') return;

  const $list = document.querySelector(LIST_SELECTOR);
  if (!$list) return;

  // --- utils ---
  const loadSet = () => new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
  const saveSet = (set) => localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));

  const watchingSet = loadSet();

  // crée une clé stable pour un item (nom + année si dispo)
  function buildKey(item) {
    const name = (item.querySelector(NAME_SEL)?.textContent || '').trim().toLowerCase();
    const year = (item.querySelector(YEAR_SEL)?.textContent || '').match(/\d{4}/)?.[0] || '';
    return (name + '|' + year) || String(Math.random());
  }

  // mémorise l'index d'origine si pas déjà défini
  function ensureOriginalIndex(item, index) {
    if (!item.dataset.originalIndex) item.dataset.originalIndex = String(index);
  }

  // applique l'état (classe + bouton) depuis la clé
  function applyState(item, isOn) {
    const btn = item.querySelector(BTN_SELECTOR);
    if (!btn) return;

    if (isOn) {
      item.classList.add('is-watching');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      item.classList.remove('is-watching');
      btn.setAttribute('aria-pressed', 'false');
    }
  }

  // ré-ordonne la liste : verts en haut, rouges selon index d'origine
  function reorder() {
    const items = Array.from($list.querySelectorAll(ITEM_SELECTOR));

    const watching = [];
    const others   = [];

    for (const it of items) {
      (it.classList.contains('is-watching') ? watching : others).push(it);
    }

    // on garde l'ordre courant pour "watching"
    // et on remet les autres selon leur index d'origine
    others.sort((a, b) => Number(a.dataset.originalIndex) - Number(b.dataset.originalIndex));

    const ordered = [...watching, ...others];

    const frag = document.createDocumentFragment();
    for (const it of ordered) frag.appendChild(it);
    $list.appendChild(frag);
  }

  // toggle au clic
  function onToggle(item) {
    const key = item.dataset.key || buildKey(item);
    item.dataset.key = key;

    const isOn = !item.classList.contains('is-watching');
    applyState(item, isOn);

    if (isOn) watchingSet.add(key);
    else      watchingSet.delete(key);

    saveSet(watchingSet);
    reorder();
  }

  // installe bouton + état + index (⚠️ ne crée PLUS le bouton si absent)
  function setupItem(item, index) {
    ensureOriginalIndex(item, index);

    const btn = item.querySelector(BTN_SELECTOR);
    if (!btn) return; // si le bouton n'est pas rendu par l'EJS (ex: pas admin), on stoppe

    const key = buildKey(item);
    item.dataset.key = key;

    // applique l'état persistant
    applyState(item, watchingSet.has(key));

    // clic
    btn.addEventListener('click', () => onToggle(item));
  }

  // setup initial sur items existants
  function init() {
    const items = Array.from($list.querySelectorAll(ITEM_SELECTOR));
    items.forEach((it, i) => setupItem(it, i));
    reorder();
  }

  // observe les ajouts dynamiques (si la liste se met à jour après)
  const mo = new MutationObserver(() => {
    let needReorder = false;
    const items = Array.from($list.querySelectorAll(ITEM_SELECTOR));
    items.forEach((it, i) => {
      if (!it.dataset.originalIndex) {
        setupItem(it, i);
        needReorder = true;
      }
    });
    if (needReorder) reorder();
  });

  document.addEventListener('DOMContentLoaded', () => {
    init();
    mo.observe($list, { childList: true, subtree: false });
  });
})();
