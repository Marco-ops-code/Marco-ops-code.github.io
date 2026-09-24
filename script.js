document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");

const yearElement = document.getElementById("year");
const revealElements = document.querySelectorAll(".reveal");
const themeToggle = document.getElementById("themeToggle");
const reduceMotionGlobal = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const headerNav = document.querySelector(".header");
const headerOffset = () => {
  if (!headerNav) {
    return 16;
  }
  if (headerNav.classList.contains("header--hero")) {
    return 16;
  }
  return headerNav.offsetHeight + 8;
};

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

function initAboutIn() {
  const about = document.getElementById("about");
  if (!about) {
    return;
  }

  const play = () => {
    requestAnimationFrame(() => {
      about.classList.add("is-in");
      about.classList.add("is-pillars-on");
    });
  };
  if (reduceMotionGlobal || !("IntersectionObserver" in window)) {
    about.classList.add("is-in");
    about.classList.add("is-pillars-on");
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.25)) {
        play();
        io.disconnect();
      }
    },
    { threshold: [0.25, 0.5] }
  );
  io.observe(about);
}

initAboutIn();

const heroReveal = document.querySelector(".hero.reveal");
if (heroReveal) {
  heroReveal.classList.add("visible");
}

function initAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#" || anchor.hasAttribute("data-tarifs-option") || anchor.hasAttribute("data-cartes-option")) {
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
  const SLIDE_MS = reduceMotionWheel ? 80 : 620;
  const LAND_MS = reduceMotionWheel ? 80 : 580;
  let activeCard = null;
  let wheelBusy = false;
  const hint = document.getElementById("skillsWheelHint");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hintIdleKey = canHover ? "skills_hint_hover" : "skills_hint";
  const hintOpenKey = "skills_hint_open";
  if (hint && canHover) {
    hint.textContent = t(hintIdleKey);
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
      hint.textContent = open ? t(hintOpenKey) : t(hintIdleKey);
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

    window.setTimeout(() => {
      card.classList.add("is-returning");
      stage.classList.add("is-folding");
      stage.classList.remove("has-selection");
      setHint(false);
    }, FLIP_MS);

    window.setTimeout(() => {
      finishReturn(card, { land: true });
      wheelBusy = false;
    }, FLIP_MS + SLIDE_MS);
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

    const flipDelay = reduceMotionWheel ? 0 : Math.round(SLIDE_MS * 0.78);
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

  window.addEventListener("portfolio:lang", () => {
    setHint(Boolean(activeCard));
    cards.forEach((card) => {
      const title = card.querySelector(".skill-title-anim");
      if (title) {
        card.setAttribute("aria-label", title.textContent.trim());
      }
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

function initWorkCabinet() {
  const root = document.querySelector("#projects .work-cabinet");
  if (!root) {
    return;
  }

  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = [...root.querySelectorAll('[role="tabpanel"]')];

  const selectTab = (tab) => {
    tabs.forEach((item) => {
      const on = item === tab;
      item.setAttribute("aria-selected", on ? "true" : "false");
      item.tabIndex = on ? 0 : -1;
    });
    const panelId = tab.getAttribute("aria-controls");
    panels.forEach((panel) => {
      panel.hidden = panel.id !== panelId;
    });
    const scroller = tab.closest(".work-cabinet__tabs");
    if (scroller && scroller.scrollWidth > scroller.clientWidth + 4) {
      const left = tab.offsetLeft - (scroller.clientWidth - tab.offsetWidth) / 2;
      scroller.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
        return;
      }
      event.preventDefault();
      const next =
        event.key === "ArrowRight"
          ? tabs[(index + 1) % tabs.length]
          : tabs[(index - 1 + tabs.length) % tabs.length];
      next.focus();
      selectTab(next);
    });
  });

  document.querySelectorAll(".hero-works__ring[data-tab]").forEach((ring) => {
    ring.addEventListener("click", () => {
      const tab = document.getElementById(ring.getAttribute("data-tab"));
      if (tab) {
        selectTab(tab);
      }
    });
  });
}

function initShotLightbox() {
  const dialog = document.getElementById("shotLightbox");
  const dialogImg = dialog?.querySelector(".shot-lightbox__img");
  const liveLink = dialog?.querySelector(".shot-lightbox__live");
  if (!dialog || !dialogImg) {
    return;
  }

  const setLiveLink = (url) => {
    if (!liveLink) {
      return;
    }
    if (url) {
      liveLink.href = url;
      liveLink.hidden = false;
      dialog.classList.add("is-live");
      return;
    }
    liveLink.removeAttribute("href");
    liveLink.hidden = true;
    dialog.classList.remove("is-live");
  };

  document.querySelectorAll("a.project-shot[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") ?? "";
      if (link.classList.contains("is-empty") || !/\.(jpe?g|png|webp|gif)(\?|$)/i.test(href)) {
        if (link.classList.contains("is-empty")) {
          event.preventDefault();
        }
        return;
      }
      event.preventDefault();
      const shot = link.querySelector("img");
      dialogImg.src = href;
      dialogImg.alt = shot?.alt ?? "";
      setLiveLink(link.getAttribute("data-live"));
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
    statusEl.textContent = t("form_sending");
    statusEl.dataset.state = "pending";

    const formData = new FormData(form);
    const subjectInput = form.querySelector('[name="subject"]');
    const projectInput = form.querySelector('[name="project"]');
    const hiddenSubject = form.querySelector("#contactFormSubject");
    if (subjectInput instanceof HTMLInputElement && hiddenSubject instanceof HTMLInputElement) {
      const subjectValue = subjectInput.value.trim();
      const projectValue =
        projectInput instanceof HTMLSelectElement ? projectInput.value.trim() : "";
      const parts = ["[Portfolio]", projectValue, subjectValue].filter(Boolean);
      hiddenSubject.value = parts.length > 1 ? parts.join(" ") : "Nouveau message portfolio";
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
        statusEl.textContent = t("form_ok");
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

        statusEl.textContent = isFormNotFound ? t("form_missing") : apiError;
        statusEl.dataset.state = "error";
      }
    } catch {
      statusEl.textContent = t("form_err");
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
    isDark ? t("theme_light") : t("theme_dark")
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
    burger.setAttribute("aria-label", open ? t("menu_close") : t("menu_open"));
    mobileNav.toggleAttribute("aria-hidden", !open);
  };

  burger.addEventListener("click", () => {
    setNavOpen(!isOpen());
  });

  backdrop?.addEventListener("click", () => {
    setNavOpen(false);
  });

  window.addEventListener("portfolio:lang", () => {
    burger.setAttribute("aria-label", isOpen() ? t("menu_close") : t("menu_open"));
    updateThemeToggleUi();
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
initLanguageSwitch();
initNavActiveSection();
initProjectShots();
initShotLightbox();
initWorkCabinet();
initContactForm();

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

const THEME_TOGGLE_ENABLED = false;
if (THEME_TOGGLE_ENABLED) {
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
} else {
  document.body.classList.remove("dark");
  document.documentElement.classList.remove("theme-dark");
}

(() => {
  const roots = document.querySelectorAll("[data-resa-chrono]");
  if (!roots.length) {
    return;
  }

  if (reduceMotionGlobal || !("IntersectionObserver" in window)) {
    return;
  }

  const DURATION = 1600;
  const easeOut = (t) => 1 - Math.pow(1 - t, 5);

  function countUp(el, target) {
    const start = performance.now();

    function frame(now) {
      const t = Math.min((now - start) / DURATION, 1);
      el.textContent = String(Math.round(easeOut(t) * target));
      if (t < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  function play(root) {
    const num = root.querySelector("[data-chrono-num]");
    const target = parseInt(num?.dataset.target, 10) || 0;

    void root.offsetWidth;
    root.classList.remove("is-armed");
    if (num) {
      countUp(num, target);
    }
    window.setTimeout(() => root.classList.add("is-done"), DURATION);
  }

  roots.forEach((root) => {
    root.classList.add("is-armed");
    const num = root.querySelector("[data-chrono-num]");
    if (num) {
      num.textContent = "0";
    }
  });

  const chronoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        chronoObserver.unobserve(entry.target);
        play(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  roots.forEach((root) => chronoObserver.observe(root));
})();

(() => {
  const root = document.querySelector("[data-cartes]");
  if (!root) {
    return;
  }

  const track = root.querySelector("[data-cartes-track]");
  const stage = root.querySelector("[data-cartes-stage]");
  const area = root.querySelector("[data-cartes-area]");
  const board = root.querySelector("[data-cartes-board]");
  const hint = root.querySelector("[data-cartes-hint]");
  const cards = Array.from(root.querySelectorAll(".cartes-card"));
  const count = cards.length;
  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function selectOption(select, wanted) {
    const w = wanted.trim().toLowerCase();
    const option = Array.from(select.options).find((optionEl) => {
      const key = (optionEl.getAttribute("data-i18n") ?? "").trim().toLowerCase();
      const value = optionEl.value.trim().toLowerCase();
      const label = optionEl.textContent.trim().toLowerCase();
      return key === w || value === w || label === w;
    });
    if (!option) {
      return false;
    }

    select.value = option.value;
    select.dispatchEvent(new Event("input", { bubbles: true }));
    select.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cartes-option]");
    if (!button) {
      return;
    }

    const href = button.getAttribute("href");
    const target = href && href.startsWith("#") ? document.querySelector(href) : null;
    if (!target) {
      return;
    }

    event.preventDefault();

    const select = root.dataset.formSelect ? document.querySelector(root.dataset.formSelect) : null;
    if (select instanceof HTMLSelectElement) {
      selectOption(select, button.dataset.cartesOption);
    }

    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
    window.scrollTo({ top, behavior: reduceQuery.matches ? "auto" : "smooth" });
    history.pushState(null, "", href);

    const next = root.dataset.formFocus ? document.querySelector(root.dataset.formFocus) : null;
    if (next instanceof HTMLElement) {
      next.focus({ preventScroll: true });
    }
  });

  if (!track || !stage || !area || !board || count < 2) {
    return;
  }

  const SCROLL_SCREENS = 4.6;
  const PILE_SHARE = 0.7;
  const ARRIVAL_START = 0.1;
  const ARRIVAL_STEP = 0.18;
  const ARRIVAL_DURATION = 0.12;
  const HOLD_BEFORE_GRID = 0.1;
  const FLIGHT_STAGGER = 0.045;
  const FLIGHT_DURATION = 0.16;
  const ENTRY_OFFSET = 0.9;
  const DECK = [
    { x: -22, y: 8, r: -2.2 },
    { x: 16, y: -6, r: 1.6 },
    { x: -10, y: 12, r: -1.1 },
    { x: 0, y: 0, r: 0.4 },
  ];

  const lastArrivalEnd = ARRIVAL_START + (count - 2) * ARRIVAL_STEP + ARRIVAL_DURATION;
  const flightStart = lastArrivalEnd + HOLD_BEFORE_GRID;
  const total = flightStart + (count - 1) * FLIGHT_STAGGER + FLIGHT_DURATION + 0.025;

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const cssNumber = (name) => parseFloat(getComputedStyle(root).getPropertyValue(name)) || 0;

  let pinned = false;
  let forceGrid = false;
  let ticking = false;
  let geo = null;
  let cachedTop = 0;

  function shouldPin() {
    return !reduceQuery.matches && window.innerWidth >= 1100 && window.innerHeight >= 700;
  }

  function computeGeometry() {
    const W = cssNumber("--cartes-w");
    const H = cssNumber("--cartes-h");
    const gap = cssNumber("--cartes-gap");
    const em = cssNumber("--cartes-em") || 16;
    const cellW = (W - gap) / 2;
    const cellH = (H - gap) / 2;
    const k = (PILE_SHARE * W) / cellW;

    geo = {
      W,
      H,
      gap,
      em,
      k,
      naturalW: cellW * k,
      naturalH: cellH * k,
      centers: cards.map((_, i) => ({
        x: (i % 2) * (cellW + gap) + cellW / 2,
        y: Math.floor(i / 2) * (cellH + gap) + cellH / 2,
      })),
    };
  }

  function applyCardBoxes() {
    cards.forEach((card, i) => {
      const c = geo.centers[i];
      card.style.left = `${c.x - geo.naturalW / 2}px`;
      card.style.top = `${c.y - geo.naturalH / 2}px`;
      card.style.width = `${geo.naturalW}px`;
      card.style.height = `${geo.naturalH}px`;
      card.style.fontSize = `${geo.em * geo.k}px`;
    });
  }

  function layout() {
    const vh = window.innerHeight;
    track.style.height = `${stage.offsetHeight + SCROLL_SCREENS * vh}px`;
    const fit = Math.min(1, area.clientWidth / geo.W, (area.clientHeight - 28) / geo.H);
    root.style.setProperty("--fit", fit.toFixed(4));
    cachedTop = parseFloat(getComputedStyle(stage).top) || 0;
  }

  function reset() {
    track.style.height = "";
    root.style.removeProperty("--fit");
    cards.forEach((card) => {
      ["left", "top", "width", "height", "fontSize", "transform", "opacity", "pointerEvents"].forEach((prop) => {
        card.style[prop] = "";
      });
      card.style.removeProperty("--dim");
    });
    if (hint) {
      hint.style.opacity = "";
    }
  }

  function arrival(i, t) {
    if (i === 0) {
      return 1;
    }
    const start = ARRIVAL_START + (i - 1) * ARRIVAL_STEP;
    return clamp((t - start) / ARRIVAL_DURATION);
  }

  function flight(i, t) {
    const start = flightStart + (count - 1 - i) * FLIGHT_STAGGER;
    return clamp((t - start) / FLIGHT_DURATION);
  }

  function pose(i, t) {
    const c = geo.centers[i];
    const deck = DECK[i % DECK.length];
    const pile = { x: geo.W / 2 - c.x + deck.x, y: geo.H / 2 - c.y + deck.y, r: deck.r, s: 1 };
    const a = easeOut(arrival(i, t));
    const arriving = {
      x: pile.x,
      y: pile.y + (1 - a) * geo.H * ENTRY_OFFSET,
      r: pile.r + (1 - a) * 7,
      s: pile.s * (0.94 + 0.06 * a),
      o: clamp(a * 3),
    };
    const f = easeInOut(flight(i, t));
    return {
      x: lerp(arriving.x, 0, f),
      y: lerp(arriving.y, 0, f),
      r: lerp(arriving.r, 0, f),
      s: lerp(arriving.s, 1 / geo.k, f),
      o: arriving.o,
      arrived: arrival(i, t),
      f,
    };
  }

  function progress() {
    if (forceGrid) {
      return { p: 1, top: 0 };
    }
    const rect = track.getBoundingClientRect();
    const scrollable = Math.max(rect.height - stage.offsetHeight, 1);
    return {
      p: clamp((cachedTop - rect.top) / scrollable),
      top: rect.top,
    };
  }

  function update() {
    ticking = false;
    if (!pinned || !geo) {
      return;
    }

    const measured = progress();
    const vh = window.innerHeight;
    const p = measured.p;
    const t = p * total;
    const trackTop = measured.top;
    const poses = cards.map((_, i) => pose(i, t));
    const topIndex = poses.reduce((acc, q, i) => (q.arrived > 0.5 ? i : acc), 0);
    const anyFlight = poses.some((q) => q.f > 0);

    cards.forEach((card, i) => {
      const q = poses[i];
      card.style.transform = `translate3d(${q.x.toFixed(2)}px,${q.y.toFixed(2)}px,0) rotate(${q.r.toFixed(3)}deg) scale(${q.s.toFixed(4)})`;
      card.style.opacity = q.o.toFixed(3);

      let covered = 0;
      for (let j = i + 1; j < count; j += 1) {
        covered += poses[j].arrived;
      }
      card.style.setProperty("--dim", (0.07 * covered * (1 - q.f)).toFixed(3));

      const interactive = q.f > 0.85 || (!anyFlight && i === topIndex);
      card.style.pointerEvents = interactive ? "" : "none";

      const ready = i === 0 ? trackTop < vh * 0.7 : q.arrived > 0.3;
      if (ready || forceGrid) {
        card.classList.add("is-drawn");
      }
    });

    if (hint) {
      hint.style.opacity = (1 - clamp(p / 0.03)).toFixed(3);
    }
  }

  function requestUpdate() {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function sync() {
    root.style.setProperty("--cartes-top", `${headerOffset()}px`);
    const want = shouldPin();

    if (want !== pinned) {
      pinned = want;
      root.classList.toggle("is-pinned", pinned);
      if (!pinned) {
        reset();
      }
    }

    if (pinned) {
      computeGeometry();
      applyCardBoxes();
      layout();
      update();
    }
  }

  root.addEventListener("focusin", (event) => {
    if (!pinned || !event.target.matches(":focus-visible")) {
      return;
    }
    forceGrid = true;
    update();
  });

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", () => {
    sync();
  });
  window.addEventListener("load", sync);
  if (reduceQuery.addEventListener) {
    reduceQuery.addEventListener("change", sync);
  }

  sync();
})();

(() => {
  const root = document.querySelector("[data-trav]");
  if (!root) {
    return;
  }

  const track = root.querySelector("[data-trav-track]");
  const stage = root.querySelector("[data-trav-stage]");
  const line = root.querySelector(".trav-rail__line");
  const fill = root.querySelector("[data-trav-fill]");
  const knob = root.querySelector("[data-trav-knob]");
  const hint = root.querySelector("[data-trav-hint]");
  const steps = Array.from(root.querySelectorAll("[data-trav-step]"));
  const nodes = Array.from(root.querySelectorAll("[data-trav-go]"));
  const scenes = steps.map((step) => step.querySelector(".trav-scene"));
  const ctaLinks = steps.map((step) => Array.from(step.querySelectorAll("a")));
  const count = steps.length;
  if (!track || !stage || !line || count < 2) {
    return;
  }

  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const SCROLL_PER_STEP = 1.4;
  const BEATS = [0.04, 0.28, 0.52, 0.76];
  const JUMP_AT = 0.3;
  const HOLD = 0.84;
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smoothstep = (t) => t * t * (3 - 2 * t);

  let pinned = false;
  let ticking = false;

  function shouldPin() {
    return !reduceQuery.matches && window.innerWidth >= 1000 && window.innerHeight >= 700;
  }

  function layout() {
    track.style.height = `${stage.offsetHeight + SCROLL_PER_STEP * count * window.innerHeight}px`;
  }

  function stageTop() {
    return parseFloat(getComputedStyle(stage).top) || 0;
  }

  function progress() {
    const rect = track.getBoundingClientRect();
    const scrollable = Math.max(rect.height - stage.offsetHeight, 1);
    return clamp((stageTop() - rect.top) / scrollable);
  }

  function nodeStops() {
    const lineRect = line.getBoundingClientRect();
    const span = Math.max(lineRect.width, 1);
    return nodes.map((node) => {
      const box = node.getBoundingClientRect();
      return clamp((box.left + box.width / 2 - lineRect.left) / span);
    });
  }

  function railFraction(p, stops) {
    const raw = p * count;
    const index = Math.min(count - 1, Math.floor(raw));
    const local = raw - index;
    const here = stops[index];
    if (index >= count - 1) {
      return here;
    }
    if (local <= HOLD) {
      return here;
    }
    const t = smoothstep((local - HOLD) / (1 - HOLD));
    return here + (stops[index + 1] - here) * t;
  }

  function update() {
    ticking = false;
    if (!pinned) {
      return;
    }

    const travRect = track.getBoundingClientRect();
    if (travRect.bottom < -48 || travRect.top > window.innerHeight + 48) {
      return;
    }

    const p = progress();
    const active = Math.min(count - 1, Math.floor(p * count));
    const local = p >= 1 ? 1 : p * count - active;
    const stops = nodeStops();
    const fraction = railFraction(p, stops);
    const traveling = local > HOLD && active < count - 1;

    fill.style.width = `${(fraction * 100).toFixed(2)}%`;
    knob.style.left = `${(fraction * 100).toFixed(2)}%`;
    knob.classList.toggle("is-traveling", traveling);

    nodes.forEach((node, index) => {
      node.classList.toggle("is-done", fraction >= stops[index] - 0.01);
      node.classList.toggle("is-current", index === active);
      if (index === active) {
        node.setAttribute("aria-current", "step");
      } else {
        node.removeAttribute("aria-current");
      }
    });

    steps.forEach((step, index) => {
      step.classList.toggle("is-active", index === active);
      step.classList.toggle("is-before", index < active);
      ctaLinks[index].forEach((link) => {
        link.setAttribute("tabindex", index === active ? "0" : "-1");
      });
    });

    scenes.forEach((scene, index) => {
      if (!scene) {
        return;
      }
      let reached = 0;
      if (index < active) {
        reached = BEATS.length;
      } else if (index === active) {
        reached = BEATS.filter((beat) => local >= beat).length;
      }
      BEATS.forEach((_, beat) => {
        scene.classList.toggle(`b${beat + 1}`, beat < reached);
      });
    });

    if (hint) {
      hint.style.opacity = (1 - clamp(p / 0.03)).toFixed(3);
    }
  }

  function requestUpdate() {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function reset() {
    track.style.height = "";
    fill.style.width = "";
    knob.style.left = "";
    knob.classList.remove("is-traveling");
    if (hint) {
      hint.style.opacity = "";
    }
    steps.forEach((step) => step.classList.remove("is-active", "is-before"));
    scenes.forEach((scene) => scene && scene.classList.remove("b1", "b2", "b3", "b4"));
    ctaLinks.forEach((links) => {
      links.forEach((link) => link.removeAttribute("tabindex"));
    });
    nodes.forEach((node) => {
      node.classList.remove("is-done", "is-current");
      node.removeAttribute("aria-current");
    });
  }

  function sync() {
    root.style.setProperty("--trav-top", `${headerOffset()}px`);
    const want = shouldPin();

    if (want !== pinned) {
      pinned = want;
      root.classList.toggle("is-pinned", pinned);
      if (!pinned) {
        reset();
      }
    }

    if (pinned) {
      layout();
      update();
    }
  }

  nodes.forEach((node) => {
    node.addEventListener("click", () => {
      if (!pinned) {
        return;
      }
      const index = parseInt(node.dataset.travGo, 10);
      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - stage.offsetHeight;
      const targetP = (index + JUMP_AT) / count;
      const y = window.scrollY + rect.top - stageTop() + targetP * scrollable;
      window.scrollTo({ top: y, behavior: reduceQuery.matches ? "auto" : "smooth" });
    });
  });

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", sync);
  window.addEventListener("load", sync);
  if (reduceQuery.addEventListener) {
    reduceQuery.addEventListener("change", sync);
  }

  sync();
})();
