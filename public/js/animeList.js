// je gère le rendu + ajout + fetch + tri + filtre côté client
(() => {
  const listEl = document.getElementById("animeList");
  const tpl = document.getElementById("animeItemTpl");
  const countEl = document.getElementById("count");
  const form = document.getElementById("animeForm");
  const formMsg = document.getElementById("formMsg");

  let allAnimes = [];
  let query = ""; // synchronisé avec la barre de recherche de la navbar (animeSearch.js)

  const fetchAnimes = async () => {
    try {
      const res = await fetch("/api/anime");
      const json = await res.json();
      if (!json.ok) throw new Error("API KO");
      allAnimes = json.data || [];
      render();
    } catch (e) {
      console.error(e);
    }
  };

  const render = () => {
    // je trie a->z (sécurité côté client)
    const sorted = [...allAnimes].sort((a, b) =>
      (a.name || "").localeCompare(b.name || "", "fr", { sensitivity: "base" })
    );

    // je filtre par recherche
    const q = query.trim().toLowerCase();
    const filtered = q
      ? sorted.filter(a => (a.name || "").toLowerCase().includes(q))
      : sorted;

    listEl.innerHTML = "";
    filtered.forEach(a => {
      const li = tpl.content.cloneNode(true);
      const cover = li.querySelector(".al-cover");
      const name = li.querySelector(".al-name");
      const meta = li.querySelector(".al-meta");
      const genres = li.querySelector(".al-genres");
      const desc = li.querySelector(".al-desc");

      cover.src = a.imageUrl;
      cover.alt = `Affiche de ${a.name}`;
      name.textContent = a.name;

      const parts = [];
      if (a.date) parts.push(a.date);
      if (a.year) parts.push(a.year);
      meta.textContent = parts.join(" • ");

      genres.textContent = (a.genres || []).join(", ");
      desc.textContent = a.description || "";
      listEl.appendChild(li);
    });

    countEl.textContent = filtered.length;
  };

  // je reçois les changements de recherche depuis animeSearch.js
  window.__onAnimeSearchChange = (text) => {
    query = text || "";
    render();
  };

  // submit ajout
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    formMsg.textContent = "Envoi...";
    const fd = new FormData(form);

    try {
      const res = await fetch("/anime", {
        method: "POST",
        body: fd
      });
      const json = await res.json();

      if (!json.ok) {
        formMsg.textContent = json.message || "Erreur à l'ajout";
        return;
      }
      // j'ajoute local + rerender
      allAnimes.push(json.data);
      form.reset();
      formMsg.textContent = "Ajouté ✅";
      render();
    } catch (err) {
      console.error(err);
      formMsg.textContent = "Erreur serveur";
    }
  });

  // init
  fetchAnimes();
})();
