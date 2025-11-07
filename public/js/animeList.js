(() => {
  const listEl   = document.getElementById("animeList");
  const tpl      = document.getElementById("animeItemTpl");
  const countEl  = document.getElementById("count");
  const form     = document.getElementById("animeForm");
  const formMsg  = document.getElementById("formMsg");

  let allAnimes = [];
  let query = ""; // MAJ par animeSearch.js via window.__onAnimeSearchChange

  // ---- API ----
  async function load() {
    const res = await fetch("/api/anime");
    const { ok, data } = await res.json();
    if (!ok) throw new Error("API KO");
    allAnimes = data || [];
    render();
  }

  async function create(fd) {
    const res = await fetch("/anime", { method: "POST", body: fd });
    const { ok, data, message } = await res.json();
    if (!ok) throw new Error(message || "Erreur à l'ajout");
    return data;
  }

  async function remove(id) {
    const res = await fetch(`/anime/${id}`, { method: "DELETE" });
    const { ok, message } = await res.json();
    if (!ok) throw new Error(message || "Suppression impossible");
  }

  // ---- RENDER ----
  function render() {
    const sorted = [...allAnimes].sort((a, b) =>
      (a.name || "").localeCompare(b.name || "", "fr", { sensitivity: "base" })
    );

    const q = (query || "").trim().toLowerCase();
    const list = q ? sorted.filter(a => (a.name || "").toLowerCase().includes(q)) : sorted;

    listEl.innerHTML = "";
    for (const a of list) {
      const frag  = tpl.content.cloneNode(true);
      const item  = frag.querySelector(".al-item");
      const cover = frag.querySelector(".al-cover");
      const name  = frag.querySelector(".al-name");
      const meta  = frag.querySelector(".al-meta");
      const genres= frag.querySelector(".al-genres");
      const statusEl = frag.querySelector(".al-status");
      const desc  = frag.querySelector(".al-desc");
      const info  = frag.querySelector(".al-info");

      item.dataset.id = a._id;
      cover.src = a.imageUrl;
      cover.alt = `Affiche de ${a.name}`;
      name.textContent = a.name;
      meta.textContent = a.year ? String(a.year) : "";
      genres.textContent = (a.genres || []).join(", ");

      // statut
      statusEl.textContent = a.status ? `Statut : ${a.status}` : "";

      // description + voir plus
      desc.textContent = a.description || "";
      const needsMore = (a.description || "").length > 220;
      if (needsMore) {
        desc.classList.add("clamped");
        const more = document.createElement("button");
        more.type = "button";
        more.className = "al-more";
        more.textContent = "voir plus";
        info.appendChild(more);
      }

      listEl.appendChild(frag);
    }
    countEl.textContent = list.length;
  }

  // Voir plus / Voir moins (délégation)
  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".al-more");
    if (!btn) return;
    const item = btn.closest(".al-item");
    item.classList.toggle("expanded");
    btn.textContent = item.classList.contains("expanded") ? "voir moins" : "voir plus";
  });

  // Recherche (depuis la barre de la navbar)
  window.__onAnimeSearchChange = (text) => {
    query = text || "";
    render();
  };

  // ---- Ajout ----
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    formMsg.textContent = "Envoi...";
    try {
      const created = await create(new FormData(form)); 
      allAnimes.push(created);
      form.reset();
      formMsg.textContent = "Ajouté ✅";
      render();
    } catch (err) {
      console.error(err);
      formMsg.textContent = err.message || "Erreur serveur";
    }
  });

  // ---- Suppression (délégation) ----
  listEl.addEventListener("click", async (e) => {
    const btn = e.target.closest(".al-del");
    if (!btn) return;
    const item = btn.closest(".al-item");
    const id = item?.dataset?.id;
    if (!id) return;

    if (!confirm("Supprimer cet anime ?")) return;

    try {
      await remove(id);
      allAnimes = allAnimes.filter(a => String(a._id) !== String(id));
      render();
    } catch (err) {
      console.error(err);
      alert(err.message || "Erreur serveur");
    }
  });

  // init
  load().catch(err => {
    console.error(err);
    formMsg && (formMsg.textContent = "Impossible de charger la liste");
  });
})();
