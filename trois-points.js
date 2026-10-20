(function initTroisPoints() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lists = [...document.querySelectorAll(".trois-points")];
  if (!lists.length) return;

  function reveal(list) {
    if (reduced) {
      list.classList.add("is-on");
      return;
    }
    list.classList.add("is-ready");
    requestAnimationFrame(() => list.classList.add("is-on"));
  }

  lists.forEach((list) => {
    if (list.closest("#ecran2")) return;
    if (!("IntersectionObserver" in window)) {
      reveal(list);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(list);
          observer.disconnect();
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(list);
  });

  window.addEventListener("hero2:open", () => {
    lists.forEach((list) => {
      if (list.closest("#ecran2")) reveal(list);
    });
  });
})();
