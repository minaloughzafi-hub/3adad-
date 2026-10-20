(() => {
  const clock = document.getElementById("clock");
  const date = document.getElementById("date");
  const percent = document.getElementById("percent");
  const countLabel = document.getElementById("count");
  const counterButton = document.getElementById("counterButton");
  const resetButton = document.getElementById("resetButton");
  const message = document.getElementById("message");
  const swatches = [...document.querySelectorAll(".swatch")];

  const MAX = 1000;
  let count = 0;
  let theme = "blue";

  function updateClock() {
    const now = new Date();
    clock.textContent = new Intl.DateTimeFormat("ar-MA", {
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
    }).format(now);
    date.textContent = new Intl.DateTimeFormat("ar-MA", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    }).format(now);
  }

  function renderCount() {
    percent.textContent = ((count / MAX) * 100).toFixed(1) + "%";
    countLabel.textContent = `${count} / ${MAX}`;
    if (count >= MAX) message.textContent = "وصلت إلى 100%";
    else message.textContent = "";
  }

  function setTheme(nextTheme) {
    theme = nextTheme;
    document.body.dataset.theme = theme;
    swatches.forEach(button => {
      const active = button.dataset.theme === theme;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    document.querySelector('meta[name="theme-color"]').setAttribute(
      "content",
      theme === "blue" ? "#1769d2" : theme === "black" ? "#111318" : "#8a5638"
    );
  }

  counterButton.addEventListener("click", () => {
    if (count < MAX) count += 1;
    renderCount();
  });

  swatches.forEach(button => {
    button.addEventListener("click", () => setTheme(button.dataset.theme));
  });

  resetButton.addEventListener("click", () => {
    count = 0;
    setTheme("blue");
    renderCount();
    message.textContent = "تمت إعادة كل شيء إلى البداية";
  });

  updateClock();
  setInterval(updateClock, 1000);
  renderCount();
  setTheme("blue");

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {});
    });
  }
})();
