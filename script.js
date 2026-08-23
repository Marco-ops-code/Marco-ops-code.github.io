document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");

const yearElement = document.getElementById("year");
const revealElements = document.querySelectorAll(".reveal");
const themeToggle = document.getElementById("themeToggle");
const reduceMotionGlobal = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const headerNav = document.querySelector(".header");
const headerOffset = () => (headerNav ? headerNav.offsetHeight + 8 : 80);

function getScrollPosition() {
  return window.scrollY ?? 0;
}

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  /* threshold 0 : une section tres haute (ex. Competences) ne depasse jamais 12% de ratio visible au debut */
  { threshold: 0, rootMargin: "0px 0px 8% 0px" }
);

revealElements.forEach((element) => observer.observe(element));

const heroReveal = document.querySelector(".hero.reveal");
if (heroReveal) {
  heroReveal.classList.add("visible");
}

function initAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") {
        return;
      }
      const target = document.querySelector(hash);
      if (!target) {
        return;
      }
      event.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
      window.scrollTo({ top, behavior: reduceMotionGlobal ? "auto" : "smooth" });
      if (hash === "#main") {
        target.focus({ preventScroll: true });
      }
    });
  });
}

function initSkillsTyping() {
  const skillsSection = document.getElementById("skills");
  if (!skillsSection) {
    return null;
  }

  const skillCards = skillsSection.querySelectorAll(".skill-card");
  const reduceMotionSkills = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const waitSkill = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  let sectionVisible = false;
  let activeCard = null;

  const runSkillCodeLoop = async (el, fullText, lang, card) => {
    el.classList.add("hljs");

    if (reduceMotionSkills) {
      el.innerHTML = highlightSkillCode(lang, fullText);
      return;
    }

    while (true) {
      while (card.dataset.typingPaused === "true") {
        await waitSkill(150);
      }

      for (let i = 1; i <= fullText.length; i += 1) {
        if (card.dataset.typingPaused === "true") {
          break;
        }
        el.innerHTML = highlightSkillCode(lang, fullText.slice(0, i));
        await waitSkill(28);
      }

      if (card.dataset.typingPaused === "true") {
        continue;
      }

      await waitSkill(1400);
      el.innerHTML = "";
      await waitSkill(420);
    }
  };

  const ensureSkillPreview = (card) => {
    const key = card.dataset.skill?.trim().toLowerCase();
    const codeEl = card.querySelector(".skill-code-demo");
    if (!codeEl || !key || codeEl.innerHTML.trim()) {
      return;
    }

    const snippet = SKILL_CODE_SNIPPETS[key];
    if (!snippet) {
      return;
    }

    const hlLang = SKILL_HIGHLIGHT_LANG[key] ?? "xml";
    const initialPreview = snippet.split("\n").slice(0, 2).join("\n");
    codeEl.innerHTML = highlightSkillCode(hlLang, initialPreview);
  };

  const startSkillTyping = (card) => {
    if (!card || card.dataset.typingStarted === "true") {
      return;
    }

    const key = card.dataset.skill?.trim().toLowerCase();
    const codeEl = card.querySelector(".skill-code-demo");
    if (!codeEl || !key) {
      return;
    }

    const snippet = SKILL_CODE_SNIPPETS[key];
    if (!snippet) {
      return;
    }

    card.dataset.typingStarted = "true";
    const hlLang = SKILL_HIGHLIGHT_LANG[key] ?? "xml";
    ensureSkillPreview(card);
    window.setTimeout(() => {
      runSkillCodeLoop(codeEl, snippet, hlLang, card);
    }, 120);
  };

  const syncPauseState = () => {
    skillCards.forEach((card) => {
      const shouldPause = !sectionVisible || card !== activeCard;
      card.dataset.typingPaused = shouldPause ? "true" : "false";
    });
  };

  const activateCard = (card) => {
    activeCard = card || null;
    syncPauseState();
    if (activeCard) {
      startSkillTyping(activeCard);
    }
  };

  skillCards.forEach((card) => {
    card.dataset.typingPaused = "true";
    ensureSkillPreview(card);
  });

  const skillsVisibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        sectionVisible = entry.isIntersecting;
        syncPauseState();
      });
    },
    { threshold: 0, rootMargin: "0px 0px -20% 0px" }
  );
  skillsVisibilityObserver.observe(skillsSection);

  return { activateCard };
}

function wrapSkillCardForFlip(card) {
  if (card.querySelector(".skills-wheel__flip")) {
    return;
  }

  const flip = document.createElement("div");
  flip.className = "skills-wheel__flip";

  const front = document.createElement("div");
  front.className = "skills-wheel__face skills-wheel__face--front";

  const back = document.createElement("div");
  back.className = "skills-wheel__face skills-wheel__face--back";

  const logo = card.querySelector(".skill-logo");
  const title = card.querySelector(".skill-title-anim");
  const codeShell = card.querySelector(".skill-code-shell");
  const desc = card.querySelector(":scope > p");
  const head = card.querySelector(".skill-card-head");

  if (logo) {
    front.appendChild(logo);
  }

  if (title) {
    const backHead = document.createElement("div");
    backHead.className = "skill-card-head";
    backHead.appendChild(title);
    back.appendChild(backHead);
  } else if (head) {
    back.appendChild(head);
  }

  if (head?.parentElement === card) {
    head.remove();
  }

  if (codeShell) {
    back.appendChild(codeShell);
  }
  if (desc) {
    back.appendChild(desc);
  }

  flip.appendChild(front);
  flip.appendChild(back);
  card.appendChild(flip);
}

function wrapSkillsWheelSpin(wheel) {
  if (!wheel || wheel.querySelector(".skills-wheel__spin")) {
    return wheel?.querySelector(".skills-wheel__spin") ?? null;
  }

  const spin = document.createElement("div");
  spin.className = "skills-wheel__spin";

  while (wheel.firstChild) {
    spin.appendChild(wheel.firstChild);
  }

  wheel.appendChild(spin);
  return spin;
}

function initSkillsWheel(onActivateCard) {
  const stage = document.querySelector(".skills-wheel-stage");
  const wheel = document.querySelector(".skills-wheel");
  const detailSlot = document.getElementById("skillsWheelDetail");
  if (!stage || !wheel || !detailSlot) {
    return;
  }

  const spin = wrapSkillsWheelSpin(wheel);
  const cardRoot = spin ?? wheel;
  const cards = Array.from(cardRoot.querySelectorAll(".skills-wheel__card"));
  const reduceMotionWheel = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FLIP_MS = reduceMotionWheel ? 80 : 720;
  const FOLD_MS = reduceMotionWheel ? 80 : 650;
  const LAND_MS = reduceMotionWheel ? 80 : 500;
  let activeCard = null;
  let wheelBusy = false;
  const hint = document.getElementById("skillsWheelHint");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hintIdle = canHover
    ? "Survole pour arrêter la roue — clique pour le détail"
    : (hint?.textContent ?? "Touche une icône pour voir le détail");
  const hintOpen = "Reclique l’icône, ou Échap, pour la ranger";
  if (hint && canHover) {
    hint.textContent = hintIdle;
  }

  cards.forEach((card) => wrapSkillCardForFlip(card));
  cards.forEach((card) => {
    const title = card.querySelector(".skill-title-anim");
    if (title && !card.getAttribute("aria-label")) {
      card.setAttribute("aria-label", title.textContent.trim());
    }
    card.setAttribute("aria-controls", "skillsWheelDetail");
  });

  const setHint = (open) => {
    if (hint) {
      hint.textContent = open ? hintOpen : hintIdle;
    }
  };

  const finishReturn = (card, { land = true } = {}) => {
    card.classList.remove("is-active", "is-extracting", "is-returning", "is-flipped");
    card.setAttribute("aria-expanded", "false");
    (spin ?? wheel).appendChild(card);

    if (activeCard === card) {
      activeCard = null;
      onActivateCard?.(null);
    }

    stage.classList.remove("has-selection", "is-folding");
    setHint(false);

    if (land && !reduceMotionWheel) {
      card.classList.add("is-landing");
      window.setTimeout(() => {
        card.classList.remove("is-landing");
      }, LAND_MS);
    }
  };

  const returnCard = (card, { immediate = false } = {}) => {
    if (!card || !card.classList.contains("is-active")) {
      return;
    }

    if (card.classList.contains("is-returning") && !immediate) {
      return;
    }

    if (immediate || reduceMotionWheel) {
      finishReturn(card, { land: false });
      wheelBusy = false;
      return;
    }

    wheelBusy = true;
    card.classList.remove("is-flipped");
    card.classList.add("is-returning");
    stage.classList.add("is-folding");

    window.setTimeout(() => {
      stage.classList.remove("has-selection");
      setHint(false);
    }, Math.round(FLIP_MS * 0.72));

    window.setTimeout(() => {
      finishReturn(card, { land: true });
      wheelBusy = false;
    }, FLIP_MS + FOLD_MS);
  };

  const extractCard = (card) => {
    if (!card || wheelBusy) {
      return;
    }

    if (card === activeCard) {
      returnCard(card);
      return;
    }

    if (activeCard) {
      returnCard(activeCard, { immediate: true });
    }

    activeCard = card;
    card.classList.add("is-extracting", "is-active");
    card.setAttribute("aria-expanded", "true");
    detailSlot.appendChild(card);
    stage.classList.add("has-selection");
    setHint(true);
    onActivateCard?.(activeCard);

    const flipDelay = reduceMotionWheel ? 0 : 380;
    window.setTimeout(() => {
      card.classList.add("is-flipped");
    }, flipDelay);
  };

  cards.forEach((card) => {
    card.setAttribute("aria-expanded", "false");

    card.addEventListener("click", () => {
      extractCard(card);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && card.classList.contains("is-active")) {
        event.preventDefault();
        returnCard(card);
        card.focus();
        return;
      }
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      extractCard(card);
    });
  });
}

function initProjectShots() {
  document.querySelectorAll(".project-shot img").forEach((img) => {
    const frame = img.closest(".project-shot");
    if (!frame) {
      return;
    }

    const markEmpty = () => {
      frame.classList.add("is-empty");
      frame.removeAttribute("href");
    };

    img.addEventListener("error", markEmpty);
    if (img.complete && img.naturalWidth === 0) {
      markEmpty();
    }
  });
}

function initShotLightbox() {
  const dialog = document.getElementById("shotLightbox");
  const dialogImg = dialog?.querySelector(".shot-lightbox__img");
  if (!dialog || !dialogImg) {
    return;
  }

  document.querySelectorAll("a.project-shot[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (link.classList.contains("is-empty")) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      const shot = link.querySelector("img");
      dialogImg.src = link.getAttribute("href") ?? "";
      dialogImg.alt = shot?.alt ?? "";
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      }
    });
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");
  const submitBtn = document.getElementById("contactSubmit");
  if (!form || !statusEl) {
    return;
  }

  const actionUrl = form.getAttribute("action") ?? "";
  const formspreeReady = actionUrl.includes("formspree.io/f/") && !actionUrl.includes("YOUR_FORM_ID");

  if (!formspreeReady) {
    statusEl.textContent =
      "Configure Formspree : remplace YOUR_FORM_ID dans l'attribut action du formulaire.";
    statusEl.dataset.state = "warn";
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusEl.textContent = "";
    statusEl.dataset.state = "";

    if (!form.reportValidity()) {
      return;
    }

    submitBtn?.setAttribute("disabled", "true");
    statusEl.textContent = "Envoi en cours...";
    statusEl.dataset.state = "pending";

    const formData = new FormData(form);
    const subjectInput = form.querySelector('[name="subject"]');
    const hiddenSubject = form.querySelector("#contactFormSubject");
    if (subjectInput instanceof HTMLInputElement && hiddenSubject instanceof HTMLInputElement) {
      const subjectValue = subjectInput.value.trim();
      hiddenSubject.value = subjectValue
        ? `[Portfolio] ${subjectValue}`
        : "Nouveau message portfolio";
      formData.set("_subject", hiddenSubject.value);
    }

    try {
      const response = await fetch(actionUrl, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      const payload = await response.json().catch(() => ({}));

      if (response.ok) {
        form.reset();
        statusEl.textContent =
          "Message recu par Formspree. Verifie ta boite mail (et les spams). Si rien n'arrive, confirme le formulaire dans ton dashboard Formspree.";
        statusEl.dataset.state = "success";
      } else {
        const apiError =
          typeof payload.error === "string"
            ? payload.error
            : Array.isArray(payload.errors) && payload.errors[0]?.message
              ? payload.errors[0].message
              : "Erreur lors de l'envoi.";

        const isFormNotFound =
          response.status === 404 ||
          payload.errors?.some((entry) => entry.code === "FORM_NOT_FOUND");

        statusEl.textContent = isFormNotFound
          ? "Formulaire introuvable : verifie l'ID Formspree (meewlnrz) et recharge la page (Ctrl+F5). Ouvre le site via http://localhost, pas en fichier local."
          : apiError;
        statusEl.dataset.state = "error";
      }
    } catch {
      statusEl.textContent = "Connexion impossible. Reessaie ou utilise l'email direct.";
      statusEl.dataset.state = "error";
    } finally {
      submitBtn?.removeAttribute("disabled");
    }
  });
}

function initNavMenus() {
  const source = document.getElementById("navLinksSource");
  const mobile = document.getElementById("navLinksMobile");
  if (!source || !mobile || mobile.children.length > 0) {
    return;
  }
  mobile.innerHTML = source.innerHTML;
}

function initHeaderScroll() {
  const header = document.getElementById("siteHeader");
  if (!header) {
    return;
  }

  const onScroll = () => {
    header.classList.toggle("header--scrolled", getScrollPosition() > 16);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function updateThemeToggleUi() {
  const isDark = document.body.classList.contains("dark");
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  themeToggle?.setAttribute(
    "aria-label",
    isDark ? "Activer le thème clair" : "Activer le thème sombre"
  );
}

function initMobileNav() {
  initNavMenus();

  const burger = document.getElementById("navBurger");
  const backdrop = document.getElementById("navBackdrop");
  const mobileNav = document.getElementById("siteNavMobile");
  const navLinks = document.querySelectorAll(".nav-links a[data-nav]");
  const mobileNavQuery = window.matchMedia("(max-width: 1024px)");
  const desktopNav = document.querySelector(".site-nav--desktop");

  if (!burger || !mobileNav) {
    return;
  }

  const isOpen = () => document.body.classList.contains("nav-open");

  const setNavOpen = (open) => {
    document.body.classList.toggle("nav-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    mobileNav.toggleAttribute("aria-hidden", !open);
  };

  burger.addEventListener("click", () => {
    setNavOpen(!isOpen());
  });

  backdrop?.addEventListener("click", () => {
    setNavOpen(false);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileNavQuery.matches) {
        setNavOpen(false);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setNavOpen(false);
      burger.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (!mobileNavQuery.matches) {
      if (isOpen()) {
        setNavOpen(false);
      }
      if (desktopNav) {
        desktopNav.removeAttribute("aria-hidden");
      }
      mobileNav.setAttribute("aria-hidden", "true");
      return;
    }
    if (desktopNav) {
      desktopNav.setAttribute("aria-hidden", "true");
    }
  });

  if (!mobileNavQuery.matches && desktopNav) {
    desktopNav.removeAttribute("aria-hidden");
    mobileNav.setAttribute("aria-hidden", "true");
  } else if (desktopNav) {
    desktopNav.setAttribute("aria-hidden", "true");
  }
}

function initNavActiveSection() {
  const navLinks = document.querySelectorAll(".nav-links a[data-nav]");
  if (!navLinks.length) {
    return;
  }

  const sectionMap = new Map();
  navLinks.forEach((link) => {
    const id = link.getAttribute("data-nav");
    const section = id ? document.getElementById(id) : null;
    if (section) {
      sectionMap.set(section, link);
    }
  });

  const sections = [...sectionMap.keys()];
  if (!sections.length) {
    return;
  }

  const setActive = (sectionId) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("data-nav") === sectionId;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length) {
        setActive(visible[0].target.id);
        return;
      }

      if (getScrollPosition() < 120) {
        setActive("");
      }
    },
    {
      threshold: [0.12, 0.3, 0.5],
      rootMargin: `-${headerOffset()}px 0px -58% 0px`,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

initAnchorScroll();
initHeaderScroll();
initMobileNav();
initNavActiveSection();
initProjectShots();
initShotLightbox();
initContactForm();
initProcessSpider();

function initProcessSpider() {
  const process = document.getElementById("process");
  const letter = process?.querySelector(".process-c");
  const spider = process?.querySelector(".work-steps__spider");
  const steps = process?.querySelector(".work-steps");
  const progress = process?.querySelector(".work-steps__progress");
  if (!process || !letter || !spider || !steps || reduceMotionGlobal) {
    return;
  }

  const items = Array.from(steps.querySelectorAll(":scope > li"));
  const isVertical = () => window.matchMedia("(max-width: 760px)").matches;
  let loopTimer = 0;
  let walkFrame = 0;
  let started = false;

  function bubblePoint(item) {
    const box = process.getBoundingClientRect();
    const rect = item.getBoundingClientRect();
    return {
      x: rect.left + 15 - box.left,
      y: rect.top + 15 - box.top,
    };
  }

  function layoutDrop() {
    process.classList.toggle("is-vertical", isVertical());
    if (items.length < 4) {
      return false;
    }
    const box = process.getBoundingClientRect();
    const letterBox = letter.getBoundingClientRect();
    const first = bubblePoint(items[0]);
    const webX = letterBox.left + letterBox.width / 2 - box.left;
    const webTop = letterBox.bottom - box.top - 2;
    process.style.setProperty("--web-x", `${webX}px`);
    process.style.setProperty("--web-top", `${webTop}px`);
    process.style.setProperty("--web-h", `${Math.max(28, first.y - webTop)}px`);
    return true;
  }

  function setSpiderAt(point, walking) {
    spider.style.left = `${point.x}px`;
    spider.style.top = `${point.y}px`;
    spider.style.transform = walking
      ? isVertical()
        ? "translate(-50%, calc(-100% + 3px)) rotate(90deg)"
        : "translate(-50%, calc(-100% + 3px))"
      : "translate(-50%, 0)";
  }

  function setProgress(ratio) {
    if (!progress) {
      return;
    }
    const value = Math.max(0, Math.min(1, ratio));
    progress.style.transform = isVertical() ? `scaleY(${value})` : `scaleX(${value})`;
  }

  function fillUpTo(index) {
    items.forEach((item, i) => {
      item.classList.toggle("is-filled", i <= index);
    });
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function stopWalk() {
    window.cancelAnimationFrame(walkFrame);
    walkFrame = 0;
  }

  function startWalk() {
    stopWalk();
    const pauseMs = 1600;
    const moveMs = 5400;
    setSpiderAt(items.map(bubblePoint)[0], true);
    process.classList.toggle("is-vertical", isVertical());
    process.classList.remove("is-dropping");
    process.classList.add("is-walking");
    fillUpTo(0);
    setProgress(0.02);

    let segment = 0;
    let phaseStart = performance.now();

    function tick(now) {
      const points = items.map(bubblePoint);
      const elapsed = now - phaseStart;
      const moving = segment < points.length - 1;
      const duration = moving ? (elapsed < pauseMs ? pauseMs : moveMs) : pauseMs + 2800;

      if (!moving) {
        fillUpTo(points.length - 1);
        setProgress(1);
        setSpiderAt(points[points.length - 1], true);
        if (elapsed >= duration) {
          loopTimer = window.setTimeout(startDrop, 400);
          return;
        }
        walkFrame = window.requestAnimationFrame(tick);
        return;
      }

      if (elapsed < pauseMs) {
        fillUpTo(segment);
        setProgress(segment / (points.length - 1));
        setSpiderAt(points[segment], true);
        walkFrame = window.requestAnimationFrame(tick);
        return;
      }

      const moveElapsed = elapsed - pauseMs;
      if (moveElapsed >= moveMs) {
        segment += 1;
        fillUpTo(segment);
        setProgress(segment / (points.length - 1));
        setSpiderAt(points[segment], true);
        phaseStart = now;
        walkFrame = window.requestAnimationFrame(tick);
        return;
      }

      const from = points[segment];
      const to = points[segment + 1];
      const p = easeInOut(moveElapsed / moveMs);
      setSpiderAt(
        {
          x: from.x + (to.x - from.x) * p,
          y: from.y + (to.y - from.y) * p,
        },
        true
      );
      setProgress((segment + p) / (points.length - 1));
      walkFrame = window.requestAnimationFrame(tick);
    }

    walkFrame = window.requestAnimationFrame(tick);
  }

  function startDrop() {
    window.clearTimeout(loopTimer);
    stopWalk();
    if (!layoutDrop()) {
      return;
    }
    items.forEach((item) => item.classList.remove("is-filled"));
    setProgress(0);
    spider.style.left = "";
    spider.style.top = "";
    spider.style.transform = "";
    process.classList.remove("is-dropping", "is-walking");
    void process.offsetWidth;
    process.classList.add("is-dropping");
  }

  spider.addEventListener("animationend", (event) => {
    if (event.target !== spider) {
      return;
    }
    if (event.animationName === "spiderDescend") {
      startWalk();
    }
  });

  const view = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          startDrop();
        }
      });
    },
    { threshold: 0.28 }
  );
  view.observe(process);

  window.addEventListener("resize", () => {
    if (process.classList.contains("is-dropping")) {
      layoutDrop();
    }
    if (process.classList.contains("is-walking")) {
      process.classList.toggle("is-vertical", isVertical());
    }
  });
}

const sectionTitleFocusElements = document.querySelectorAll("main .section");
if (sectionTitleFocusElements.length) {
  const sectionFocusObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("in-view-section", entry.isIntersecting);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "-12% 0px -55% 0px",
    }
  );

  sectionTitleFocusElements.forEach((section) => sectionFocusObserver.observe(section));
}

/** Langages highlight.js alignes sur chaque carte (HTML/XML, CSS, JS, PHP, C#, Python) */
const SKILL_HIGHLIGHT_LANG = {
  html: "xml",
  css: "css",
  javascript: "javascript",
  php: "php",
  performance: "javascript",
  ux: "xml",
  csharp: "csharp",
  python: "python",
  mysql: "sql",
  gimp: "xml",
  msproject: "xml",
};

function escapeHtmlForCode(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function highlightSkillCode(_lang, code) {
  const escaped = escapeHtmlForCode(code);
  return escaped
    .replace(
      /(\/\/.*|#(?!!).*)/g,
      '<span class="hljs-comment">$1</span>'
    )
    .replace(
      /(&quot;.*?&quot;|&#39;.*?&#39;|`[^`]*`)/g,
      '<span class="hljs-string">$1</span>'
    )
    .replace(
      /\b(const|let|var|function|return|class|using|namespace|static|void|def|if|from|SELECT|CREATE|TABLE|NOT|NULL|UNIQUE|PRIMARY|KEY|ORDER|BY|LIMIT|declare|echo)\b/g,
      '<span class="hljs-keyword">$1</span>'
    );
}

const SKILL_CODE_SNIPPETS = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>...</title>
</head>
<body>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</body>
</html>`,

  css: `:root {
  --accent: #34d399;
}
@media (max-width: 768px) {
  .grid { gap: 1rem; }
}
.card:hover {
  transform: translateY(-4px);
}`,

  javascript: `document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".btn");
  btn?.addEventListener("click", () => {
    console.log("ready");
  });
});`,

  php: `<?php
declare(strict_types=1);
$name = filter_input(INPUT_POST, "name", FILTER_SANITIZE_SPECIAL_CHARS);
echo htmlspecialchars($name ?? "", ENT_QUOTES, "UTF-8");
?>`,

  performance: `module.exports = {
  mode: "production",
  optimization: {
    splitChunks: { chunks: "all" },
    minimize: true
  }
};`,

  ux: `<button type="button" aria-expanded="false" aria-controls="menu">
  Menu
</button>
<nav aria-label="Principal">
  <ul>...</ul>
</nav>`,

  csharp: `using System;
namespace Demo;
class Program {
  static void Main() {
    Console.WriteLine("Hello");
  }
}`,

  python: `def greet(name: str) -> str:
    return f"Hello, {name}"

if __name__ == "__main__":
    print(greet("world"))`,

  mysql: `CREATE TABLE clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(180) UNIQUE
);

SELECT nom, email
FROM clients
ORDER BY id DESC
LIMIT 5;`,

  gimp: `; GIMP — export web
(gimp-image-scale img 1600 900)
(file-webp-save
  img drawable "hero.webp"
  0 90)`,

  msproject: `Projet : site vitrine
T1  Brief          2 j
T2  Maquettes      5 j
T3  Intégration    8 j
T4  Recette        3 j`,
};

const skillsTypingController = initSkillsTyping();
initSkillsWheel(skillsTypingController?.activateCard);

const storedTheme = localStorage.getItem("theme");
if (storedTheme === "dark") {
  document.body.classList.add("dark");
  document.documentElement.classList.add("theme-dark");
}
updateThemeToggleUi();

themeToggle?.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  document.documentElement.classList.toggle("theme-dark", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeToggleUi();
});

