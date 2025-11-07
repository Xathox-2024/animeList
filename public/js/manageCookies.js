document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("manage-cookies");
  if (!btn) return;

  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/consent/reset", {
        method: "POST",
      });
      if (res.ok) {
        location.reload();
      }
    } catch (err) {
      console.error("Erreur reset cookies:", err);
    }
  });
});
