// Gestion du menu déroulant de l'avatar
document.addEventListener("DOMContentLoaded", () => {
  const avatarBtn = document.getElementById("avatarBtn");
  const avatarMenu = document.getElementById("avatarMenu");

  if (!avatarBtn || !avatarMenu) return;

  // Fonction pour fermer le menu
  const closeMenu = () => {
    avatarMenu.classList.remove("open");
    avatarBtn.setAttribute("aria-expanded", "false");
  };

  // Clique sur l'avatar → ouvre / ferme le menu
  avatarBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = avatarMenu.classList.contains("open");

    if (isOpen) {
      closeMenu();
    } else {
      avatarMenu.classList.add("open");
      avatarBtn.setAttribute("aria-expanded", "true");
    }
  });

  // Clique à l’extérieur → ferme le menu
  document.addEventListener("click", (e) => {
    if (!avatarMenu.contains(e.target) && e.target !== avatarBtn) {
      closeMenu();
    }
  });

  // Touche Échap → ferme le menu
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
});
