// gère le rendu + ajout + suppression + fetch + tri + filtre
(() => {
  const listEl = document.getElementById("animeList");
  const tpl = document.getElementById("animeItemTpl");
  const countEl = document.getElementById("count");
  const form = document.getElementById("animeForm");
  const formMsg = document.getElementById("formMsg");

  let allAnimes = [];
  let query = ""; // vient de animeSearch.js via window.__onAnimeSearchChange

  // ---- API ----
  const fetchAnimes = async () => {
    try {
      const res = await fetch("/api/anime");
      const json = await res.json();
      if (!json.ok) throw new Error("API KO");
      allAnimes = json.data || [];
      render();
    } catch (e) {
      console.error("fetchAnimes error:", e);
    }
  };

  const createOne = async (formData) => {
    const res = await fetch("/anime", { method: "POST", body: formData });
    const isJson = res.headers.get("content-type")?.includes("application/json");
    if (!isJson) {
      const text = await res.text();
      throw new Error(
        res.status === 401 || text.toLowerCase().includes("login")
          ? "Connecte-toi pour ajouter un anime."
          : "Erreur serveur"
      );
    }
    const json = await res.json();
    if (!json.ok) throw new Error(json.message || "Erreur à l'ajout");
    return json.data;
  };

  const deleteOne = async (id) => {
    const res = await fetch(`/anime/${id}`, { method: "DELETE" });
    const isJson = res.headers.get("content-type")?.includes("application/json");
    const json = isJson ? await res.json() : { ok: false };
    if (!res.ok || !json.ok) throw new Error(json.message || "Suppression impossible");
    return true;
  };

  // ---- RENDER ----
  const render = () => {
    // tri A→Z
    const sorted = [...allAnimes].sort((a, b) =>
      (a.name || "").localeCompare(b.name || "", "fr", { sensitivity: "base" })
    );

    // filtre
    const q = (query || "").trim().toLowerCase();
    const filtered = q
      ? sorted.filter(a => (a.name || "").toLowerCase().includes(q))
      : sorted;

    listEl.innerHTML = "";
    filtered.forEach(a => {
      const node = tpl.content.cloneNode(true);
      const root = node.querySelector(".al-item");
      root.dataset.id = a._id;

      const cover = node.querySelector(".al-cover");
      const name = node.querySelector(".al-name");
      const meta = node.querySelector(".al-meta");
      const genres = node.querySelector(".al-genres");
      const desc = node.querySelector(".al-desc");

      cover.src = a.imageUrl;
      cover.alt = `Affiche de ${a.name}`;
      name.textContent = a.name;

      // meta = année uniquement (tu as retiré "date")
      meta.textContent = a.year ? String(a.year) : "";

      genres.textContent = (a.genres || []).join(", ");
      desc.textContent = a.description || "";

      listEl.appendChild(node);
    });

    countEl.textContent = filtered.length;
  };

  // reçoit la recherche depuis animeSearch.js
  window.__onAnimeSearchChange = (text) => {
    query = text || "";
    render();
  };

  // ---- Submit ajout ----
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    formMsg.textContent = "Envoi...";

    try {
      const fd = new FormData(form);
      const created = await createOne(fd);
      allAnimes.push(created);
      form.reset();
      formMsg.textContent = "Ajouté ✅";
      render();
    } catch (err) {
      console.error(err);
      formMsg.textContent = err.message || "Erreur serveur";
    }
  });

  // ---- Suppression (delegation) ----
  listEl.addEventListener("click", async (e) => {
    const btn = e.target.closest(".al-del");
    if (!btn) return;

    const item = btn.closest(".al-item");
    const id = item?.dataset?.id;
    if (!id) return;

    if (!confirm("Supprimer cet anime ?")) return;

    try {
      await deleteOne(id);
      allAnimes = allAnimes.filter(a => String(a._id) !== String(id));
      render();
    } catch (err) {
      console.error(err);
      alert(err.message || "Erreur serveur");
    }
  });

  // init
  fetchAnimes();
})();
