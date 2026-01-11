(function () {
  const timer = document.getElementById("session-timer");
  const value = document.getElementById("session-timer-value");
  if (!timer || !value) return;

  let remaining = parseInt(timer.dataset.remaining, 10);

  function format(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    return (
      String(h).padStart(2, "0") + ":" +
      String(m).padStart(2, "0") + ":" +
      String(s).padStart(2, "0")
    );
  }

  function tick() {
    if (remaining <= 0) {
      value.textContent = "00:00:00";
      window.location.href = "/logout";
      return;
    }

    if (remaining < 300) {
      timer.classList.add("warning");
    }

    value.textContent = format(remaining);
    remaining--;
  }

  tick();
  setInterval(tick, 1000);
})();
