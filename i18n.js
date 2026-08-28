const LANG_STORAGE = "portfolio-lang";
const I18N_UI_FR = {
  theme_light: "Activer le thème clair",
  theme_dark: "Activer le thème sombre",
  menu_open: "Ouvrir le menu",
  menu_close: "Fermer le menu",
  skills_hint: "Touche une icône pour voir le détail",
  skills_hint_hover: "Survole pour arrêter la roue — clique pour le détail",
  skills_hint_open: "Reclique l’icône, ou Échap, pour la ranger",
  form_sending: "Envoi en cours...",
  form_ok: "Message reçu. Réponse sous 24 h — pense à vérifier les spams.",
  form_err: "Connexion impossible. Réessaie ou utilise l’email direct.",
  form_missing:
    "Formulaire introuvable : vérifie l’ID Formspree et recharge la page. Ouvre le site via http://localhost, pas en fichier local.",
};
const I18N_EN = {
  page_title: "Marc-Onel Volcimus — Full stack developer",
  legal_title: "Legal notice — Marc-Onel Volcimus",
  skip: "Skip to content",
  nav_main: "Main navigation",
  nav_about: "About",
  nav_work: "Work",
  nav_offer: "Offer",
  nav_contact: "Contact",
  nav_lang: "Language",
  nav_menu: "Menu",
  nav_back: "Back to the site",
  theme_light: "Switch to light theme",
  theme_dark: "Switch to dark theme",
  menu_open: "Open menu",
  menu_close: "Close menu",
  badge: "Available for 1 to 2 projects",
  hero_kicker: "Freelance full stack developer",
  hero_h1: "Showcase site, landing page, mobile app or PowerPoint — for independents and small businesses.",
  hero_lead:
    "Four formats, one standard: convince from the first visit. Proof included: two sites, two apps, plus a PowerPoint excerpt.",
  portrait_alt: "Portrait of Marc-Onel Volcimus",
  dock_actions: "Actions",
  dock_free: "Free",
  dock_book: "Book 30 min",
  dock_work: "See my work",
  about_h2: "About",
  about_p:
    "I’m Marc-Onel Volcimus, a full stack developer. I help independents and small businesses send a support that speaks for itself: showcase site, landing page, mobile app or PowerPoint. I work remotely, in French and English: WhatsApp and email are enough — time zones aren’t a problem.",
  facts: "Key facts",
  fact_clients: "Clients",
  fact_clients_v: "Independents and small businesses that want a credible presence",
  fact_stack: "Full stack",
  fact_delay: "Turnaround",
  fact_delay_v: "Reply within 24 h, in French or English",
  fact_place: "Location",
  fact_place_v: "Remote — email, phone or WhatsApp",
  offer_h2: "Offer",
  offer_intro:
    "Four formats, one standard: a product that makes you look more serious from the first visit.",
  offer_vitrine_h: "Showcase site",
  offer_vitrine_p: "Clear, fast, carefully designed pages to present your work and build trust.",
  offer_landing_h: "Landing page",
  offer_landing_p: "A single page, built to convert, with a sharp message and an obvious call to action.",
  offer_app_h: "Mobile app",
  offer_app_p: "A phone tool in C# / .NET, made for real use: a clear flow, generation, export.",
  offer_ppt_h: "PowerPoint presentation",
  offer_ppt_p: "Professional decks for any brief: pitch, class, report — clear, visual, ready to present.",
  skills_h2: "Skills",
  skills_intro: "The tools I design and ship with. An icon opens the detail.",
  skills_wheel: "Skills wheel",
  skills_hint: "Tap an icon to see the detail",
  skills_hint_hover: "Hover to pause the wheel — click for the detail",
  skills_hint_open: "Click the icon again, or Escape, to put it back",
  skill_html_h: "Semantic HTML5 and SEO",
  skill_html_p: "Clean structure, accessible markup and content shaped for visibility.",
  skill_css_h: "Modern CSS3 and responsive design",
  skill_css_p: "Fluid interfaces, careful motion and a real mobile/desktop fit.",
  skill_js_h: "Interactive JavaScript and animation",
  skill_js_p: "Dynamic experiences and micro-interactions that bring interfaces to life.",
  skill_php_h: "PHP backend for forms/APIs",
  skill_php_p: "Reliable server logic for data handling and simple endpoints.",
  skill_webpack_p: "Bundling, asset splitting and faster pages — performance, not decoration.",
  skill_ux_h: "Conversion-focused UI/UX",
  skill_ux_p: "A clear user path, a premium look, and decisions driven by the goal.",
  skill_cs_p: "Object-oriented apps, performance and the .NET ecosystem for a solid backend.",
  skill_py_p: "Scripts, APIs and data work with a clear syntax and strong libraries.",
  skill_mysql_h: "MySQL databases",
  skill_mysql_p: "Schema design, efficient SQL and reliable application data.",
  skill_gimp_p: "Retouch, crop and export for the web — sharp, light images, ready to publish.",
  skill_msp_p: "Project planning: milestones, Gantt, workload and deadlines held to delivery.",
  work_h2: "Work",
  work_intro: "Click a tab: the folder opens in the drawer, with the screenshot and the full brief.",
  work_tabs: "Work folders",
  blurb_lk: "Salon: services, gallery, booking.",
  blurb_angela: "Artist: music, dates, gallery.",
  blurb_task: "Matrices and equations, Word export.",
  blurb_multi: "PDF / Word exams, tailored to the audience.",
  blurb_ppt: "Ten slides to pitch an offer.",
  zoom_lk: "Enlarge the LK Studio screenshot",
  zoom_angela: "Enlarge the Angela Volcimus Louis screenshot",
  zoom_task: "Enlarge the Task Engine screenshot",
  zoom_multi_home: "Enlarge the MultiTask home screen",
  zoom_multi_gen: "Enlarge the MultiTask generate screen",
  zoom_multi_profile: "Enlarge the MultiTask profile screen",
  open_ppt: "Open the PowerPoint excerpt",
  alt_lk: "LK Studio homepage: dark salon, Precision Style Confidence title and booking buttons",
  alt_angela: "Homepage of Angela Volcimus Louis, vocal artist: R&B, classical, gospel",
  alt_task: "Task Engine home screen, matrix and linear-equation generator",
  alt_multi_home: "MultiTask home: daily goal and Generate button",
  alt_multi_gen: "Generate: subject choices for a custom exam",
  alt_multi_profile: "Student profile: level, XP and session stats",
  kicker_lk: "Web · React / Vite · Salon & barbershop",
  lk_p: "A showcase site for a salon: services, gallery, reviews, and a booking in seconds — plus WhatsApp.",
  lk_li1: "Context: look credible online and book without a long back-and-forth",
  lk_li2: "Role: pages, booking form, gallery, admin area",
  lk_li3: "Result: a site you can send as-is, with slots and direct contact",
  see_site: "View the site",
  similar_vitrine: "A similar showcase site?",
  github_code: "GitHub code",
  kicker_angela: "Web · PHP · Vocal artist",
  angela_p: "An artist site: world, music, dates and gallery — listen, follow the stage and book, without hunting around.",
  angela_li1: "Context: an online presence that matches the voice — R&B, classical and gospel",
  angela_li2: "Role: home, music, concerts, gallery, contact and admin",
  angela_li3: "Result: a dark, readable site, with listening and upcoming dates from the first screen",
  similar_artist: "A similar artist site?",
  kicker_task: "Windows · C# / .NET",
  task_p: "A matrix and linear-equation generator: the teacher picks the assignment type, sets the parameters, then exports individual worksheets as Word (.docx).",
  task_li1: "Context: produce matrix-theory and linear-system exercises without rebuilding everything by hand",
  task_li2: "Role: Windows interface, task generation, document export, app theme",
  task_li3: "Result: a three-step assistant (home, choice, document) ready to use",
  similar_tool: "A similar business tool?",
  kicker_multi: "Mobile · C# / .NET 10 · Pupils, students, teachers",
  multi_p: "Generates different kinds of exams as PDF and Word, as needed: pupil practice, student session, or a paper prepared by a teacher.",
  multi_li1: "Context: practise or produce a paper without composing everything by hand",
  multi_li2: "Role: mobile flow, daily goal, custom exam generation, PDF / Word export",
  multi_li3: "Result: a clear dashboard and a Generate button to start a tailored test",
  similar_learn: "A similar learning tool?",
  deck_title: "Look credible from the first visit",
  deck_meta: "10 slides · deliverable excerpt",
  kicker_ppt: "Presentation · PowerPoint",
  ppt_name: "SME excerpt",
  ppt_p: "Ten slides to pitch an offer: audience, problem, formats, process, deliverable, next step. The same standard as for a site.",
  ppt_li1: "Context: an independent who has to convince without explaining",
  ppt_li2: "Role: structure, hierarchy, tone, reading rhythm",
  ppt_li3: "Result: an excerpt you can open online, ready as a base for the PowerPoint file",
  see_slides: "View the slides",
  similar_ppt: "A similar presentation?",
  process_title: "<span class=\"process-c\">H</span>ow we work?",
  process_intro: "Four steps, one contact, a quote within 48 h after the brief.",
  step_brief: "Brief",
  step_brief_p: "30 minutes to frame the goal, the audience and the constraint.",
  step_prop: "Proposal",
  step_prop_p: "Scope, timeline and quote — you approve before I write a line.",
  step_build: "Design &amp; build",
  step_build_p: "Layouts, pages, forms: you see it move, you correct early.",
  step_ship: "Delivery",
  step_ship_p: "Go-live, handoff, and a session so you know how to keep it alive.",
  pricing_h2: "Pricing",
  pricing_intro: "Four formats, quote within 48 h. A free 30-minute consultation.",
  pricing_trust: "2 openings this quarter.",
  pricing_from: "From — on quote",
  price_vitrine_p: "Several pages to present the business and build trust.",
  price_vitrine_1: "Home, offer, about, contact",
  price_vitrine_2: "Clear path, performance and SEO basics",
  price_vitrine_3: "Form, timeline and handoff",
  price_landing_p: "A single page to convert: message, proof, call to action.",
  price_landing_1: "Structure, interface copy and mobile version",
  price_landing_2: "Form or button to WhatsApp / email",
  price_landing_3: "Go-live and review together",
  price_app_p: "A phone tool in C# / .NET, made for real use.",
  price_app_1: "Mobile flow: home, generate, profile",
  price_app_2: "PDF / Word export and business logic",
  price_app_3: "Review together and handoff",
  price_ppt_p: "A deck to pitch: pitch, class or report, ready to present.",
  price_ppt_1: "Structure problem → offer → proof → decision",
  price_ppt_2: "Editable PowerPoint file + PDF version",
  price_ppt_3: "Online excerpt so you can see the level",
  see_excerpt: "View the excerpt",
  contact_h2: "Book 30 minutes",
  contact_sub:
    '<strong class="contact-wa">WhatsApp</strong> for the slot. Or a message here — reply within 24 h, in French or English. Quote within 48 h after the brief.',
  phone_label: "Phone",
  form_lead: "Prefer to write?",
  form_note: "Send the brief here — same timing: reply within 24 h, in French or English.",
  label_name: "Name",
  label_project: "Project type",
  opt_choose: "Choose a format",
  opt_vitrine: "Showcase site",
  opt_landing: "Landing page",
  opt_app: "Mobile app",
  opt_ppt: "PowerPoint presentation",
  opt_other: "Other / to specify",
  label_subject: "Subject",
  label_message: "Message",
  form_subject: "New portfolio message",
  honeypot: "Leave empty",
  form_send: "Send the message",
  form_sending: "Sending…",
  form_ok: "Message received. I’ll reply within 24 h — check spam if needed.",
  form_err: "Could not send. Try again or use email directly.",
  form_missing: "Form not found. Refresh the page, or write by email.",
  legal: "Legal notice",
  lightbox: "Screenshot enlargement",
  close: "Close",
  wa_book_href:
    "https://wa.me/79965064486?text=Hi%20Marc-Onel%2C%20I%27d%20like%20to%20book%2030%20minutes%20to%20talk%20about%20a%20project.",
  legal_h1: "Legal notice",
  legal_intro: "Information about the site publisher, hosting and data processing.",
  legal_editor: "Publisher",
  legal_editor_p:
    "This site is published by <strong>Marc-Onel Volcimus</strong>, a freelance full stack developer, as a natural person. It is not tied to a registered company on this page.",
  legal_editor_p2:
    "Remote work, replies in French or English. Contact is by email, phone or WhatsApp — time zones aren’t a problem.",
  legal_host: "Hosting",
  legal_host_p:
    "The site is hosted by <strong>GitHub Pages</strong>, a service of GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, United States. Site: <a href=\"https://pages.github.com\" target=\"_blank\" rel=\"noopener noreferrer\">pages.github.com</a>.",
  legal_privacy: "Personal data",
  legal_privacy_p:
    "The contact form is sent through <strong>Formspree</strong> (Whistlin’ See Dan, LLC) so the message reaches the publisher. The fields sent are name, email, subject and message. They are used only to answer the request. They are not sold.",
  legal_privacy_p2:
    "WhatsApp, email and phone are the services you already use to write. Site fonts are loaded from <strong>Google Fonts</strong>.",
  legal_privacy_p3:
    "For a question or a deletion request, write to <a href=\"mailto:marconelvolcimus079@gmail.com\">marconelvolcimus079@gmail.com</a>.",
  legal_storage: "Local storage",
  legal_storage_p:
    "Light or dark theme, and language, are saved in the browser (<code>localStorage</code>). No advertising cookies are set.",
  legal_ip: "Intellectual property",
  legal_ip_p:
    "Texts, visuals and code remain the property of their authors. Client work excerpts are shown as demonstration.",
  legal_back: "Back to the portfolio",
};

let currentLang = "fr";

function t(key) {
  if (currentLang === "en" && I18N_EN[key] != null) {
    return I18N_EN[key];
  }
  return I18N_UI_FR[key] ?? key;
}

function getSavedLang() {
  try {
    const saved = localStorage.getItem(LANG_STORAGE);
    if (saved === "en" || saved === "fr") {
      return saved;
    }
  } catch (error) {
    /* storage blocked */
  }
  return "fr";
}

function stashOriginal(el, attr, value) {
  if (!el.hasAttribute(attr)) {
    el.setAttribute(attr, value);
  }
}

function applyLanguage(lang) {
  currentLang = lang === "en" ? "en" : "fr";
  document.documentElement.lang = currentLang;
  document.documentElement.classList.remove("lang-pending");
  document.documentElement.classList.add("lang-ready");
  try {
    localStorage.setItem(LANG_STORAGE, currentLang);
  } catch (error) {
    /* storage blocked */
  }

  if (!document.documentElement.hasAttribute("data-title-src")) {
    document.documentElement.setAttribute("data-title-src", document.title);
  }
  const titleKey = document.body?.dataset.page === "legal" ? "legal_title" : "page_title";
  document.title =
    currentLang === "en" && I18N_EN[titleKey]
      ? I18N_EN[titleKey]
      : document.documentElement.getAttribute("data-title-src");

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const html = el.hasAttribute("data-i18n-html");
    stashOriginal(el, "data-i18n-src", html ? el.innerHTML : el.textContent);
    if (el instanceof HTMLOptionElement) {
      stashOriginal(el, "data-value-src", el.value);
    }
    if (currentLang === "fr") {
      const src = el.getAttribute("data-i18n-src");
      if (html) {
        el.innerHTML = src;
      } else {
        el.textContent = src;
      }
      if (el instanceof HTMLOptionElement && el.getAttribute("data-value-src")) {
        el.value = el.getAttribute("data-value-src");
      }
      return;
    }
    const value = I18N_EN[key];
    if (value == null) {
      return;
    }
    if (html) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
    if (el instanceof HTMLOptionElement && el.getAttribute("data-value-src")) {
      el.value = value;
    }
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    stashOriginal(el, "data-aria-src", el.getAttribute("aria-label") ?? "");
    if (currentLang === "en" && I18N_EN[key]) {
      el.setAttribute("aria-label", I18N_EN[key]);
    } else {
      el.setAttribute("aria-label", el.getAttribute("data-aria-src"));
    }
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    const key = el.getAttribute("data-i18n-alt");
    stashOriginal(el, "data-alt-src", el.getAttribute("alt") ?? "");
    if (currentLang === "en" && I18N_EN[key]) {
      el.setAttribute("alt", I18N_EN[key]);
    } else {
      el.setAttribute("alt", el.getAttribute("data-alt-src"));
    }
  });

  document.querySelectorAll("a[data-wa-book]").forEach((el) => {
    stashOriginal(el, "data-href-src", el.getAttribute("href") ?? "");
    el.setAttribute("href", currentLang === "en" ? I18N_EN.wa_book_href : el.getAttribute("data-href-src"));
  });

  const hiddenSubject = document.getElementById("contactFormSubject");
  if (hiddenSubject) {
    stashOriginal(hiddenSubject, "data-value-src", hiddenSubject.value);
    hiddenSubject.value =
      currentLang === "en" ? I18N_EN.form_subject : hiddenSubject.getAttribute("data-value-src");
  }

  document.querySelectorAll(".nav-lang__btn").forEach((btn) => {
    const on = btn.getAttribute("data-lang") === currentLang;
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-pressed", String(on));
  });

  window.dispatchEvent(new CustomEvent("portfolio:lang", { detail: currentLang }));
}

function initLanguageSwitch() {
  applyLanguage(getSavedLang());
  document.querySelectorAll(".nav-lang__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLanguage(btn.getAttribute("data-lang"));
    });
  });
}
