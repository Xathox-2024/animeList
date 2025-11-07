(function () {
  const banner = document.getElementById("cookie-banner");
  if (!banner) return;

  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-reject");

  function deleteAnalyticsCookies() {
    const toDelete = ["_ga", "_gid", "_gat"];
    document.cookie.split(";").forEach((c) => {
      const [rawName] = c.split("=");
      const name = rawName.trim();
      if (
        toDelete.includes(name) ||
        name.startsWith("_ga_") ||
        name.startsWith("_gac_")
      ) {
        document.cookie = `${name}=; Max-Age=0; path=/;`;
      }
    });
  }

  async function send(choice) {
    try {
      const res = await fetch("/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice }),
      });

      if (res.ok) {
        if (choice === "rejected") {
          deleteAnalyticsCookies();
        }

        banner.remove();

        const eventName =
          choice === "accepted"
            ? "cookie-consent-accepted"
            : "cookie-consent-rejected";
        window.dispatchEvent(new Event(eventName));
      }
    } catch (e) {
      console.error("Erreur consentement:", e);
    }
  }

  acceptBtn && acceptBtn.addEventListener("click", () => send("accepted"));
  rejectBtn && rejectBtn.addEventListener("click", () => send("rejected"));
})();
