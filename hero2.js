(function initHero2() {
  const root = document.getElementById("ecran2");
  const openBtn = document.getElementById("openHero2");
  const home = document.getElementById("home");
  const wrap = home && home.closest(".hero-wrap");
  const panel = root && root.querySelector(".ecran2__panel");
  if (!root || !openBtn || !home || !wrap || !panel) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lastFocus = null;
  let closeTimer = 0;
  let tickTimer = 0;
  let left = 15;

  function clearReturn() {
    window.clearInterval(tickTimer);
    tickTimer = 0;
  }

  function paintWait() {
    const el = panel.querySelector(".ecran2__wait");
    if (!el) return;
    const tpl = typeof t === "function" ? t("h2_wait") : "";
    const text = tpl && tpl !== "h2_wait" ? tpl : "Retour à la première page dans {n} s";
    el.textContent = text.replace("{n}", String(left));
  }

  function armReturn() {
    clearReturn();
    left = 15;
    paintWait();
    tickTimer = window.setInterval(() => {
      left -= 1;
      if (left <= 0) {
        clearReturn();
        close();
        return;
      }
      paintWait();
    }, 1000);
  }

  function fit() {
    const base = wrap.offsetHeight;
    const need = panel.scrollHeight;
    wrap.style.minHeight = Math.max(base, need) + "px";
  }

  function open() {
    window.clearTimeout(closeTimer);
    clearReturn();
    lastFocus = document.activeElement;
    wrap.style.minHeight = wrap.offsetHeight + "px";
    root.hidden = false;
    root.removeAttribute("aria-hidden");
    home.setAttribute("aria-hidden", "true");
    home.setAttribute("inert", "");
    wrap.classList.add("is-facet-2");
    if (!reduced) void root.offsetWidth;
    root.classList.add("is-open");
    fit();
    openBtn.setAttribute("aria-expanded", "true");
    const first = panel.querySelector("a[href]");
    if (first) first.focus();
    armReturn();
    window.dispatchEvent(new CustomEvent("hero2:open"));
  }

  function close() {
    clearReturn();
    root.classList.remove("is-open");
    const finish = () => {
      root.hidden = true;
      root.setAttribute("aria-hidden", "true");
      wrap.classList.remove("is-facet-2");
      wrap.style.minHeight = "";
      home.removeAttribute("aria-hidden");
      home.removeAttribute("inert");
      openBtn.setAttribute("aria-expanded", "false");
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    };
    if (reduced) finish();
    else closeTimer = window.setTimeout(finish, 450);
  }

  openBtn.addEventListener("click", open);
  panel.querySelectorAll("[data-h2-close]").forEach((el) => {
    el.addEventListener("click", () => {
      if (el.matches("a[href^='#']")) lastFocus = null;
      close();
    });
  });

  panel.addEventListener("click", (event) => {
    if (event.target.closest("a, button, .ecran2__copy, .ecran2__card")) return;
    close();
  });

  document.addEventListener("keydown", (event) => {
    if (!wrap.classList.contains("is-facet-2") || event.key !== "Escape") return;
    event.preventDefault();
    close();
  });

  window.addEventListener("resize", () => {
    if (wrap.classList.contains("is-facet-2")) fit();
  });
})();
