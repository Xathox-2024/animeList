// je connecte l'input de recherche dans la navbar à la page
(() => {
  const input = document.getElementById("animeSearchInput");
  if (!input) return;

  let t = null;
  const emit = (val) => {
    if (typeof window.__onAnimeSearchChange === "function") {
      window.__onAnimeSearchChange(val);
    }
  };

  input.addEventListener("input", (e) => {
    const val = e.target.value;
    clearTimeout(t);
    // je debounce léger
    t = setTimeout(() => emit(val), 120);
  });
})();
