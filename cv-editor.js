(function () {
  const sheet = document.querySelector(".sheet");
  const toolbar = document.querySelector(".toolbar");
  const photo = document.querySelector(".side__photo");
  if (!sheet || !toolbar || !photo) return;

  const lang = (document.documentElement.lang || "fr").slice(0, 2);
  const i18n = {
    fr: {
      edit: "Éditer",
      done: "Terminer",
      title: "Éditeur CV",
      photo: "Photo",
      choose: "Choisir une photo",
      original: "Photo d’origine",
      shape: "Forme",
      round: "Ronde",
      square: "Carrée",
      soft: "Arrondie",
      colors: "Couleurs",
      side: "Colonne",
      sideText: "Texte colonne",
      name: "Prénom",
      accent: "Accent",
      paper: "Fond",
      ink: "Texte",
      muted: "Secondaire",
      bar: "Barre",
      themes: "Palettes",
      chips: "Puces",
      chipTo: "Appliquer la puce à",
      addColor: "Ajouter une couleur",
      add: "Ajouter",
      saveTheme: "Enregistrer cette palette",
      size: "Taille du texte",
      design: "Mise en page",
      font: "Police",
      sans: "Sans",
      serif: "Serif",
      tech: "Tech",
      layouts: {
        classic: "Classique",
        right: "Colonne droite",
        top: "Bandeau haut",
        outline: "Contour",
        compact: "Compact",
        airy: "Aéré",
        card: "Carte",
      },
      hint: "Cliquez un texte sur le CV pour le modifier. Les liens se mettent à jour tout seuls.",
      blocks: "Blocs",
      addJob: "+ Expérience",
      addSkill: "+ Compétence",
      addLine: "+ Ligne colonne",
      reset: "Réinitialiser",
      saved: "Enregistré sur cet appareil — Imprimer pour un PDF.",
    },
    en: {
      edit: "Edit",
      done: "Done",
      title: "Resume editor",
      photo: "Photo",
      choose: "Choose a photo",
      original: "Original photo",
      shape: "Shape",
      round: "Round",
      square: "Square",
      soft: "Rounded",
      colors: "Colors",
      side: "Column",
      sideText: "Column text",
      name: "First name",
      accent: "Accent",
      paper: "Paper",
      ink: "Text",
      muted: "Secondary",
      bar: "Bar",
      themes: "Palettes",
      chips: "Swatches",
      chipTo: "Apply swatch to",
      addColor: "Add a color",
      add: "Add",
      saveTheme: "Save this palette",
      size: "Text size",
      design: "Layout",
      font: "Typeface",
      sans: "Sans",
      serif: "Serif",
      tech: "Tech",
      layouts: {
        classic: "Classic",
        right: "Right column",
        top: "Top banner",
        outline: "Outline",
        compact: "Compact",
        airy: "Airy",
        card: "Card",
      },
      hint: "Click any text on the resume to edit it. Links update automatically.",
      blocks: "Blocks",
      addJob: "+ Experience",
      addSkill: "+ Skill",
      addLine: "+ Sidebar line",
      reset: "Reset",
      saved: "Saved on this device — Print for a PDF.",
    },
    ru: {
      edit: "Править",
      done: "Готово",
      title: "Редактор резюме",
      photo: "Фото",
      choose: "Выбрать фото",
      original: "Исходное фото",
      shape: "Форма",
      round: "Круг",
      square: "Квадрат",
      soft: "Скруглённая",
      colors: "Цвета",
      side: "Колонка",
      sideText: "Текст колонки",
      name: "Имя",
      accent: "Акцент",
      paper: "Фон",
      ink: "Текст",
      muted: "Вторичный",
      bar: "Полоса",
      themes: "Палитры",
      chips: "Образцы",
      chipTo: "Куда применить",
      addColor: "Добавить цвет",
      add: "Добавить",
      saveTheme: "Сохранить палитру",
      size: "Размер текста",
      design: "Макет",
      font: "Шрифт",
      sans: "Гротеск",
      serif: "Антиква",
      tech: "Техно",
      layouts: {
        classic: "Классика",
        right: "Справа",
        top: "Сверху",
        outline: "Контур",
        compact: "Компакт",
        airy: "Свободный",
        card: "Карточка",
      },
      hint: "Нажмите на текст в резюме, чтобы изменить его. Ссылки обновляются сами.",
      blocks: "Блоки",
      addJob: "+ Опыт",
      addSkill: "+ Навык",
      addLine: "+ Строка слева",
      reset: "Сбросить",
      saved: "Сохранено на этом устройстве — Печать для PDF.",
    },
  };
  const t = i18n[lang] || i18n.fr;
  const defaults = {
    side: "#111111",
    sideText: "#edf2f7",
    name: "#ffffff",
    cyan: "#3ec6e0",
    paper: "#ffffff",
    ink: "#1a1a1a",
    muted: "#5c5c5c",
    bar: "#5b2a6e",
    size: "100",
    layout: "classic",
    photo: "round",
    font: "sans",
  };
  const themes = [
    { side: "#111111", cyan: "#3ec6e0", bar: "#5b2a6e", paper: "#ffffff", ink: "#1a1a1a", muted: "#5c5c5c", name: "#ffffff", sideText: "#edf2f7" },
    { side: "#0b1f3a", cyan: "#5b9fd6", bar: "#163a63", paper: "#ffffff", ink: "#12233a", muted: "#4d6480", name: "#ffffff", sideText: "#d7e6f5" },
    { side: "#14261c", cyan: "#6fbf73", bar: "#2d5a3d", paper: "#ffffff", ink: "#14261c", muted: "#4d6b55", name: "#ffffff", sideText: "#dcefe0" },
    { side: "#2a1218", cyan: "#e8b4b8", bar: "#7a1f3d", paper: "#fff8f8", ink: "#2a1218", muted: "#7a4a52", name: "#ffffff", sideText: "#f6dde0" },
    { side: "#1c1410", cyan: "#f0a14a", bar: "#c45c26", paper: "#fffaf5", ink: "#241910", muted: "#7a5a40", name: "#fff4e8", sideText: "#f6e2cc" },
    { side: "#161410", cyan: "#d4b562", bar: "#8a6d2e", paper: "#fffdf6", ink: "#1c1810", muted: "#6e6348", name: "#fff6d8", sideText: "#f0e6c4" },
    { side: "#1a1024", cyan: "#c4a0e8", bar: "#5b2d8a", paper: "#fcf9ff", ink: "#1e1228", muted: "#6a5480", name: "#f4e9ff", sideText: "#e6d6f7" },
    { side: "#0c2424", cyan: "#2ec4b6", bar: "#147a74", paper: "#f4fffd", ink: "#0e2422", muted: "#3d6e68", name: "#e8fffb", sideText: "#c8f4ee" },
    { side: "#1a0e10", cyan: "#e05a6a", bar: "#8e2034", paper: "#fff7f7", ink: "#2a1014", muted: "#7a4450", name: "#ffe4e8", sideText: "#f5cfd4" },
    { side: "#3d3428", cyan: "#c4a574", bar: "#8a7349", paper: "#f7f1e6", ink: "#2c2418", muted: "#6e624c", name: "#f7f1e6", sideText: "#f0e6d4" },
    { side: "#2a3138", cyan: "#8aa4b8", bar: "#44515c", paper: "#f5f7f9", ink: "#1c2228", muted: "#5a6874", name: "#eef3f7", sideText: "#d5e0e8" },
    { side: "#efe7d6", cyan: "#b08d57", bar: "#8a6a3a", paper: "#fffcf6", ink: "#2a2418", muted: "#6e6450", name: "#2a2418", sideText: "#3a3226" },
    { side: "#12352c", cyan: "#7dcca0", bar: "#1f6b4f", paper: "#f3fbf6", ink: "#12352c", muted: "#4d7a64", name: "#e8fff2", sideText: "#cdebd9" },
    { side: "#062a3f", cyan: "#3dbbff", bar: "#0a4e75", paper: "#f3fbff", ink: "#062a3f", muted: "#3d6e88", name: "#e7f6ff", sideText: "#c5e6f7" },
  ];
  const stockChips = [
    "#3ec6e0", "#5b9fd6", "#6fbf73", "#e8b4b8", "#f0a14a", "#d4b562",
    "#c4a0e8", "#2ec4b6", "#e05a6a", "#c4a574", "#8aa4b8", "#b08d57",
    "#ff6b35", "#00c2a8", "#4f46e5", "#111111", "#ffffff", "#5b2a6e",
    "#e11d48", "#0ea5e9", "#84cc16", "#f59e0b",
  ];
  const layouts = ["classic", "right", "top", "outline", "compact", "airy", "card"];
  const editableSel = [
    ".side h1 span",
    ".side h1 b",
    ".side__role",
    ".side h2",
    ".side li",
    ".main h2",
    ".lead",
    ".job__when",
    ".job h3",
    ".job p",
    ".edu-block strong",
    ".edu-block p",
    ".bar span",
  ].join(",");
  const storageKey = "cv-editor:" + (location.pathname.split("/").pop() || "cv.html");
  const chipsKey = "cv-editor-chips";
  const userThemesKey = "cv-editor-user-themes";
  const originalHtml = sheet.innerHTML;
  const originalPhoto = photo.getAttribute("src");
  let saveTimer = 0;

  function colorField(name, label) {
    return (
      "<label class=\"cv-editor__swatch\">" +
        "<input type=\"color\" data-color=\"" + name + "\" value=\"" + defaults[name] + "\" />" +
        "<span>" + label + "</span>" +
        "<input type=\"text\" data-hex=\"" + name + "\" value=\"" + defaults[name] + "\" maxlength=\"7\" spellcheck=\"false\" />" +
      "</label>"
    );
  }

  const panel = document.createElement("aside");
  panel.className = "cv-editor";
  panel.innerHTML =
    "<h2>" + t.title + "</h2>" +
    "<div class=\"cv-editor__block\">" +
      "<h3>" + t.photo + "</h3>" +
      "<div class=\"cv-editor__row\">" +
        "<label class=\"cv-file\">" + t.choose + "<input type=\"file\" accept=\"image/*\" /></label>" +
        "<button type=\"button\" class=\"is-ghost\" data-act=\"photo-reset\">" + t.original + "</button>" +
      "</div>" +
      "<p style=\"margin:10px 0 6px\">" + t.shape + "</p>" +
      "<div class=\"cv-editor__photos\">" +
        "<button type=\"button\" data-photo=\"round\">" + t.round + "</button>" +
        "<button type=\"button\" data-photo=\"square\">" + t.square + "</button>" +
        "<button type=\"button\" data-photo=\"soft\">" + t.soft + "</button>" +
      "</div>" +
    "</div>" +
    "<div class=\"cv-editor__block\">" +
      "<h3>" + t.design + "</h3>" +
      "<div class=\"cv-editor__designs\">" +
        layouts.map(function (id) {
          return "<button type=\"button\" data-layout=\"" + id + "\">" + t.layouts[id] + "</button>";
        }).join("") +
      "</div>" +
      "<p style=\"margin:10px 0 6px\">" + t.font + "</p>" +
      "<div class=\"cv-editor__fonts\">" +
        "<button type=\"button\" data-font=\"sans\">" + t.sans + "</button>" +
        "<button type=\"button\" data-font=\"serif\">" + t.serif + "</button>" +
        "<button type=\"button\" data-font=\"tech\">" + t.tech + "</button>" +
      "</div>" +
    "</div>" +
    "<div class=\"cv-editor__block\">" +
      "<h3>" + t.colors + "</h3>" +
      "<div class=\"cv-editor__swatches\">" +
        colorField("side", t.side) +
        colorField("cyan", t.accent) +
        colorField("paper", t.paper) +
        colorField("ink", t.ink) +
        colorField("sideText", t.sideText) +
        colorField("name", t.name) +
        colorField("muted", t.muted) +
        colorField("bar", t.bar) +
      "</div>" +
      "<p style=\"margin:10px 0 6px\">" + t.themes + "</p>" +
      "<div class=\"cv-editor__themes\" data-stock></div>" +
      "<div class=\"cv-editor__themes\" data-user></div>" +
      "<button type=\"button\" data-act=\"save-theme\" style=\"margin-top:8px\">" + t.saveTheme + "</button>" +
      "<p style=\"margin:10px 0 6px\">" + t.chips + "</p>" +
      "<label class=\"hint\">" + t.chipTo +
        "<select data-chip-target>" +
          "<option value=\"cyan\">" + t.accent + "</option>" +
          "<option value=\"side\">" + t.side + "</option>" +
          "<option value=\"bar\">" + t.bar + "</option>" +
          "<option value=\"paper\">" + t.paper + "</option>" +
          "<option value=\"ink\">" + t.ink + "</option>" +
          "<option value=\"sideText\">" + t.sideText + "</option>" +
          "<option value=\"name\">" + t.name + "</option>" +
          "<option value=\"muted\">" + t.muted + "</option>" +
        "</select>" +
      "</label>" +
      "<div class=\"cv-editor__chips\" data-stock-chips></div>" +
      "<div class=\"cv-editor__chips\" data-user-chips style=\"margin-top:6px\"></div>" +
      "<p style=\"margin:10px 0 6px\">" + t.addColor + "</p>" +
      "<div class=\"cv-editor__addcolor\">" +
        "<input type=\"color\" data-new-chip value=\"#4f46e5\" />" +
        "<button type=\"button\" class=\"is-primary\" data-act=\"add-chip\">" + t.add + "</button>" +
      "</div>" +
    "</div>" +
    "<div class=\"cv-editor__block\">" +
      "<h3>" + t.size + "</h3>" +
      "<input type=\"range\" min=\"88\" max=\"118\" value=\"100\" data-size />" +
    "</div>" +
    "<div class=\"cv-editor__block\">" +
      "<p class=\"hint\">" + t.hint + "</p>" +
    "</div>" +
    "<div class=\"cv-editor__block\">" +
      "<h3>" + t.blocks + "</h3>" +
      "<div class=\"cv-editor__row\">" +
        "<button type=\"button\" data-act=\"add-job\">" + t.addJob + "</button>" +
        "<button type=\"button\" data-act=\"add-skill\">" + t.addSkill + "</button>" +
        "<button type=\"button\" data-act=\"add-line\">" + t.addLine + "</button>" +
      "</div>" +
    "</div>" +
    "<div class=\"cv-editor__block\">" +
      "<div class=\"cv-editor__row\">" +
        "<button type=\"button\" class=\"is-ghost\" data-act=\"reset\">" + t.reset + "</button>" +
      "</div>" +
      "<p class=\"hint\" style=\"margin-top:8px\">" + t.saved + "</p>" +
    "</div>";
  document.body.insertBefore(panel, toolbar);

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "cv-edit-toggle";
  toggle.textContent = t.edit;
  toolbar.appendChild(toggle);

  function readStore(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      /* quota */
    }
  }

  function normalizeHex(value) {
    const text = String(value || "").trim();
    if (/^#[0-9a-fA-F]{6}$/.test(text)) return text.toLowerCase();
    if (/^#[0-9a-fA-F]{3}$/.test(text)) {
      return ("#" + text[1] + text[1] + text[2] + text[2] + text[3] + text[3]).toLowerCase();
    }
    return "";
  }

  function currentPhoto() {
    return document.querySelector(".side__photo");
  }

  function readColors() {
    const colors = {
      size: panel.querySelector("[data-size]").value,
      layout: sheet.getAttribute("data-layout") || defaults.layout,
      photo: sheet.getAttribute("data-photo") || defaults.photo,
      font: sheet.getAttribute("data-font") || defaults.font,
    };
    panel.querySelectorAll("[data-color]").forEach(function (input) {
      colors[input.dataset.color] = input.value;
    });
    return colors;
  }

  function syncColorInputs(colors) {
    panel.querySelectorAll("[data-color]").forEach(function (input) {
      const value = colors[input.dataset.color];
      if (!value) return;
      input.value = value;
      const hex = panel.querySelector("[data-hex=\"" + input.dataset.color + "\"]");
      if (hex) hex.value = value;
    });
    const range = panel.querySelector("[data-size]");
    if (range && colors.size) range.value = colors.size;
  }

  function markOn(group, attr, value) {
    panel.querySelectorAll("[" + attr + "]").forEach(function (btn) {
      btn.classList.toggle("is-on", btn.getAttribute(attr) === value);
    });
  }

  function applyColors(colors) {
    const root = document.documentElement;
    const merged = Object.assign({}, defaults, colors);
    root.style.setProperty("--side", merged.side);
    root.style.setProperty("--side-text", merged.sideText);
    root.style.setProperty("--name", merged.name);
    root.style.setProperty("--cyan", merged.cyan);
    root.style.setProperty("--paper", merged.paper);
    root.style.setProperty("--ink", merged.ink);
    root.style.setProperty("--muted", merged.muted);
    root.style.setProperty("--bar", merged.bar);
    sheet.style.fontSize = merged.size ? merged.size + "%" : "";
    sheet.setAttribute("data-layout", merged.layout || "classic");
    sheet.setAttribute("data-photo", merged.photo || "round");
    sheet.setAttribute("data-font", merged.font || "sans");
    markOn(panel, "data-layout", merged.layout || "classic");
    markOn(panel, "data-photo", merged.photo || "round");
    markOn(panel, "data-font", merged.font || "sans");
    syncColorInputs(merged);
  }

  function renderThemes() {
    const stock = panel.querySelector("[data-stock]");
    const user = panel.querySelector("[data-user]");
    stock.innerHTML = "";
    user.innerHTML = "";
    themes.forEach(function (theme) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cv-editor__theme";
      btn.title = theme.cyan;
      btn.style.background = "linear-gradient(135deg, " + theme.side + " 50%, " + theme.cyan + " 50%)";
      btn.addEventListener("click", function () {
        applyColors(Object.assign(readColors(), theme));
        scheduleSave();
      });
      stock.appendChild(btn);
    });
    const saved = readStore(userThemesKey, []);
    saved.forEach(function (theme, index) {
      const wrap = document.createElement("span");
      wrap.style.position = "relative";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cv-editor__theme";
      btn.style.background = "linear-gradient(135deg, " + theme.side + " 50%, " + theme.cyan + " 50%)";
      btn.addEventListener("click", function () {
        applyColors(Object.assign(readColors(), theme));
        scheduleSave();
      });
      const x = document.createElement("button");
      x.type = "button";
      x.className = "cv-editor__chip-x";
      x.textContent = "×";
      x.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        saved.splice(index, 1);
        writeStore(userThemesKey, saved);
        renderThemes();
      });
      wrap.appendChild(btn);
      wrap.appendChild(x);
      user.appendChild(wrap);
    });
  }

  function renderChips() {
    const stock = panel.querySelector("[data-stock-chips]");
    const user = panel.querySelector("[data-user-chips]");
    stock.innerHTML = "";
    user.innerHTML = "";
    stockChips.forEach(function (hex) {
      stock.appendChild(chipButton(hex, false));
    });
    const extras = readStore(chipsKey, []);
    extras.forEach(function (hex, index) {
      user.appendChild(chipButton(hex, true, index));
    });
  }

  function chipButton(hex, custom, index) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cv-editor__chip" + (custom ? " is-custom" : "");
    btn.style.background = hex;
    btn.title = hex;
    btn.addEventListener("click", function () {
      const target = panel.querySelector("[data-chip-target]").value;
      const next = readColors();
      next[target] = hex;
      applyColors(next);
      scheduleSave();
    });
    if (!custom) return btn;
    const wrap = document.createElement("span");
    wrap.style.position = "relative";
    const x = document.createElement("button");
    x.type = "button";
    x.className = "cv-editor__chip-x";
    x.textContent = "×";
    x.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      const extras = readStore(chipsKey, []);
      extras.splice(index, 1);
      writeStore(chipsKey, extras);
      renderChips();
    });
    wrap.appendChild(btn);
    wrap.appendChild(x);
    return wrap;
  }

  function editableNodes() {
    return sheet.querySelectorAll(editableSel);
  }

  function syncLink(el) {
    const link = el.closest("a") || (el.tagName === "A" ? el : null);
    if (!link) return;
    const text = (link.textContent || "").trim();
    if (text.includes("@")) link.href = "mailto:" + text.replace(/\s/g, "");
    else if (/^\+?[\d\s().-]+$/.test(text) && text.replace(/\D/g, "").length >= 8) {
      link.href = "tel:" + text.replace(/[^\d+]/g, "");
    } else if (/^https?:\/\//i.test(text)) link.href = text;
    else if (/^(instagram\.com|github\.com|[\w.-]+\.[a-z]{2,})/i.test(text)) {
      link.href = "https://" + text.replace(/^\/+/, "");
    }
  }

  function bindEditable(el) {
    if (el.dataset.cvBound === "1") return;
    el.dataset.cvBound = "1";
    el.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !el.matches("p, li, .lead, .job__when")) {
        event.preventDefault();
        el.blur();
      }
    });
    el.addEventListener("paste", function (event) {
      event.preventDefault();
      const text = (event.clipboardData || window.clipboardData).getData("text/plain");
      document.execCommand("insertText", false, text);
    });
    el.addEventListener("input", function () {
      syncLink(el);
      scheduleSave();
    });
  }

  function setEditing(on) {
    document.body.classList.toggle("cv-editing", on);
    toggle.classList.toggle("is-on", on);
    toggle.textContent = on ? t.done : t.edit;
    editableNodes().forEach(function (el) {
      el.contentEditable = on ? "true" : "false";
      if (on) bindEditable(el);
    });
    sheet.removeEventListener("click", guardLinks, true);
    if (on) {
      attachRemoves();
      sheet.addEventListener("click", guardLinks, true);
    } else {
      sheet.querySelectorAll(".cv-del").forEach(function (btn) {
        btn.remove();
      });
    }
  }

  function guardLinks(event) {
    const link = event.target.closest("a");
    if (link) event.preventDefault();
  }

  function attachRemoves() {
    sheet.querySelectorAll(".cv-del").forEach(function (btn) {
      btn.remove();
    });
    sheet.querySelectorAll(".job, .bar, .side li").forEach(function (node) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cv-del";
      btn.contentEditable = "false";
      btn.setAttribute("aria-label", "×");
      btn.textContent = "×";
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        node.remove();
        scheduleSave();
      });
      node.appendChild(btn);
    });
  }

  function scheduleSave() {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(save, 250);
  }

  function snapshotHtml() {
    const clone = sheet.cloneNode(true);
    clone.querySelectorAll(".cv-del").forEach(function (node) {
      node.remove();
    });
    clone.querySelectorAll("[contenteditable]").forEach(function (node) {
      node.removeAttribute("contenteditable");
      node.removeAttribute("data-cv-bound");
    });
    return clone.innerHTML;
  }

  function save() {
    const img = currentPhoto();
    const data = {
      html: snapshotHtml(),
      photo: img ? img.getAttribute("src") : originalPhoto,
      colors: readColors(),
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      try {
        data.photo = originalPhoto;
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch (ignored) {
        /* quota */
      }
    }
  }

  function restore() {
    let raw = "";
    try {
      raw = localStorage.getItem(storageKey) || "";
    } catch (error) {
      return;
    }
    if (!raw) {
      applyColors(defaults);
      return;
    }
    try {
      const data = JSON.parse(raw);
      if (data.html) {
        sheet.innerHTML = data.html;
        sheet.querySelectorAll(".cv-del").forEach(function (node) {
          node.remove();
        });
      }
      const img = currentPhoto();
      if (img && data.photo) img.setAttribute("src", data.photo);
      applyColors(data.colors || defaults);
    } catch (error) {
      applyColors(defaults);
    }
  }

  function resetAll() {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      /* ignore */
    }
    sheet.innerHTML = originalHtml;
    const img = currentPhoto();
    if (img) img.setAttribute("src", originalPhoto);
    applyColors(defaults);
    if (document.body.classList.contains("cv-editing")) {
      setEditing(true);
    }
  }

  function compressPhoto(file) {
    return new Promise(function (resolve, reject) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = function () {
        const max = 480;
        let width = img.width;
        let height = img.height;
        if (width > height && width > max) {
          height = Math.round((height * max) / width);
          width = max;
        } else if (height > max) {
          width = Math.round((width * max) / height);
          height = max;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error("image"));
      };
      img.src = url;
    });
  }

  function addJob() {
    const jobs = sheet.querySelectorAll(".job");
    const last = jobs[jobs.length - 1];
    if (!last) return;
    const clone = last.cloneNode(true);
    const when = clone.querySelector(".job__when");
    const title = clone.querySelector("h3");
    const lines = clone.querySelectorAll("p");
    if (when) when.innerHTML = "Nouveau";
    if (title) title.textContent = lang === "en" ? "New project" : lang === "ru" ? "Новый проект" : "Nouveau projet";
    lines.forEach(function (line, index) {
      if (line.classList.contains("job__when")) return;
      line.textContent = index === 0 ? (lang === "en" ? "Role" : lang === "ru" ? "Роль" : "Rôle") : "";
    });
    last.after(clone);
    setEditing(true);
    scheduleSave();
  }

  function addSkill() {
    const bars = sheet.querySelector(".bars");
    if (!bars) return;
    const last = bars.querySelector(".bar:last-child");
    const node = last ? last.cloneNode(true) : document.createElement("div");
    if (!last) {
      node.className = "bar";
      node.innerHTML = "<span>Nouveau</span><i><em></em></i>";
    }
    node.style.setProperty("--lvl", "70%");
    const label = node.querySelector("span");
    if (label) label.textContent = lang === "en" ? "New skill" : lang === "ru" ? "Новый навык" : "Nouvelle compétence";
    bars.appendChild(node);
    setEditing(true);
    scheduleSave();
  }

  function addLine() {
    const lists = sheet.querySelectorAll(".side ul");
    const list = lists[0];
    if (!list) return;
    const item = document.createElement("li");
    item.textContent = lang === "en" ? "New line" : lang === "ru" ? "Новая строка" : "Nouvelle ligne";
    list.appendChild(item);
    setEditing(true);
    scheduleSave();
  }

  toggle.addEventListener("click", function () {
    setEditing(!document.body.classList.contains("cv-editing"));
  });

  panel.querySelector("input[type=file]").addEventListener("change", function (event) {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    if (!file) return;
    compressPhoto(file).then(function (dataUrl) {
      const img = currentPhoto();
      if (img) img.setAttribute("src", dataUrl);
      scheduleSave();
    });
  });

  panel.addEventListener("click", function (event) {
    const layout = event.target.closest("[data-layout]");
    if (layout && layout.closest(".cv-editor__designs")) {
      const next = readColors();
      next.layout = layout.getAttribute("data-layout");
      applyColors(next);
      scheduleSave();
      return;
    }
    const photoBtn = event.target.closest("[data-photo]");
    if (photoBtn && photoBtn.closest(".cv-editor__photos")) {
      const next = readColors();
      next.photo = photoBtn.getAttribute("data-photo");
      applyColors(next);
      scheduleSave();
      return;
    }
    const fontBtn = event.target.closest("[data-font]");
    if (fontBtn && fontBtn.closest(".cv-editor__fonts")) {
      const next = readColors();
      next.font = fontBtn.getAttribute("data-font");
      applyColors(next);
      scheduleSave();
      return;
    }
    const act = event.target.closest("[data-act]");
    if (!act) return;
    if (act.dataset.act === "photo-reset") {
      const img = currentPhoto();
      if (img) img.setAttribute("src", originalPhoto);
      scheduleSave();
    }
    if (act.dataset.act === "reset") resetAll();
    if (act.dataset.act === "add-job") addJob();
    if (act.dataset.act === "add-skill") addSkill();
    if (act.dataset.act === "add-line") addLine();
    if (act.dataset.act === "save-theme") {
      const saved = readStore(userThemesKey, []);
      saved.push(readColors());
      writeStore(userThemesKey, saved);
      renderThemes();
    }
    if (act.dataset.act === "add-chip") {
      const hex = normalizeHex(panel.querySelector("[data-new-chip]").value);
      if (!hex) return;
      const extras = readStore(chipsKey, []);
      if (extras.indexOf(hex) === -1) extras.push(hex);
      writeStore(chipsKey, extras);
      renderChips();
    }
  });

  panel.querySelectorAll("[data-color]").forEach(function (input) {
    input.addEventListener("input", function () {
      const next = readColors();
      next[input.dataset.color] = input.value;
      applyColors(next);
      scheduleSave();
    });
  });

  panel.querySelectorAll("[data-hex]").forEach(function (input) {
    input.addEventListener("change", function () {
      const hex = normalizeHex(input.value);
      if (!hex) {
        input.value = readColors()[input.dataset.hex];
        return;
      }
      const next = readColors();
      next[input.dataset.hex] = hex;
      applyColors(next);
      scheduleSave();
    });
  });

  panel.querySelector("[data-size]").addEventListener("input", function () {
    applyColors(readColors());
    scheduleSave();
  });

  sheet.addEventListener("click", function (event) {
    if (!document.body.classList.contains("cv-editing")) return;
    if (event.target.closest(".side__photo")) {
      panel.querySelector("input[type=file]").click();
    }
  });

  renderThemes();
  renderChips();
  restore();
  if (/[?&]edit=1(?:&|$)/.test(location.search)) {
    setEditing(true);
  }
})();
