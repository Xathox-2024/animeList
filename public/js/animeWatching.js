// /js/animeWatching.js
(function () {
  const LIST_SELECTOR = '#animeList';
  const ITEM_SELECTOR = '.al-item';
  const BTN_SELECTOR  = '.al-watch';
  const NAME_SEL      = '.al-name';
  const YEAR_SEL      = '.al-meta'; // si tu as l'année ici, sinon adapte

  const STORAGE_KEY = 'anime-watching-keys';

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

    // groupe par état
    const watching = [];
    const others   = [];

    for (const it of items) {
      (it.classList.contains('is-watching') ? watching : others).push(it);
    }

    // tri : on garde l'ordre d’activation pour les "watching" (tel quel),
    // et on remet les autres selon leur index d'origine.
    others.sort((a, b) => Number(a.dataset.originalIndex) - Number(b.dataset.originalIndex));

    const ordered = [...watching, ...others];

    // réinjection DOM (performant)
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

  // installe bouton + état + index
  function setupItem(item, index) {
    ensureOriginalIndex(item, index);

    let btn = item.querySelector(BTN_SELECTOR);
    if (!btn) {
      // si jamais le bouton n'est pas dans le template, on le crée ici
      btn = document.createElement('button');
      btn.className = 'al-watch';
      btn.type = 'button';
      btn.textContent = 'En cours de visionnage';
      btn.setAttribute('aria-pressed', 'false');
      const article = item.querySelector('.al-article') || item;
      article.insertBefore(btn, article.querySelector('.al-info'));
    }

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

  // observe les ajouts dynamiques (si ta liste se met à jour après)
  const mo = new MutationObserver((muts) => {
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
