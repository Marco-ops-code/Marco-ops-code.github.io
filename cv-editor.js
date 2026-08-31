(function () {
  const sheet = document.querySelector(".sheet");
  const toolbar = document.querySelector(".toolbar");
  const photo = document.querySelector(".side__photo");
  if (!sheet || !toolbar || !photo) return;

  const lang = (document.documentElement.lang || "fr").slice(0, 2);
  const copy = {
    fr: {
      edit: "Éditer",
      done: "Terminer",
      title: "Éditeur CV",
      photo: "Photo",
      choose: "Choisir une photo",
      original: "Photo d’origine",
      colors: "Couleurs",
      side: "Colonne",
      accent: "Accent",
      paper: "Fond",
      ink: "Texte",
      bar: "Barre",
      themes: "Thèmes",
      size: "Taille du texte",
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
      colors: "Colors",
      side: "Column",
      accent: "Accent",
      paper: "Paper",
      ink: "Text",
      bar: "Bar",
      themes: "Themes",
      size: "Text size",
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
      colors: "Цвета",
      side: "Колонка",
      accent: "Акцент",
      paper: "Фон",
      ink: "Текст",
      bar: "Полоса",
      themes: "Темы",
      size: "Размер текста",
      hint: "Нажмите на текст в резюме, чтобы изменить его. Ссылки обновляются сами.",
      blocks: "Блоки",
      addJob: "+ Опыт",
      addSkill: "+ Навык",
      addLine: "+ Строка слева",
      reset: "Сбросить",
      saved: "Сохранено на этом устройстве — Печать для PDF.",
    },
  }[lang] || null;
  const t = copy || {
    edit: "Éditer",
    done: "Terminer",
    title: "Éditeur CV",
    photo: "Photo",
    choose: "Choisir une photo",
    original: "Photo d’origine",
    colors: "Couleurs",
    side: "Colonne",
    accent: "Accent",
    paper: "Fond",
    ink: "Texte",
    bar: "Barre",
    themes: "Thèmes",
    size: "Taille du texte",
    hint: "Cliquez un texte sur le CV pour le modifier. Les liens se mettent à jour tout seuls.",
    blocks: "Blocs",
    addJob: "+ Expérience",
    addSkill: "+ Compétence",
    addLine: "+ Ligne colonne",
    reset: "Réinitialiser",
    saved: "Enregistré sur cet appareil — Imprimer pour un PDF.",
  };

  const defaults = {
    side: "#111111",
    cyan: "#3ec6e0",
    paper: "#ffffff",
    ink: "#1a1a1a",
    bar: "#5b2a6e",
    size: "100",
  };
  const themes = [
    { side: "#111111", cyan: "#3ec6e0", bar: "#5b2a6e", paper: "#ffffff", ink: "#1a1a1a" },
    { side: "#0f2744", cyan: "#7eb8d4", bar: "#1a365d", paper: "#ffffff", ink: "#132337" },
    { side: "#14261c", cyan: "#6fbf73", bar: "#2d5a3d", paper: "#ffffff", ink: "#14261c" },
    { side: "#2a1218", cyan: "#e8b4b8", bar: "#7a1f3d", paper: "#fff8f8", ink: "#2a1218" },
  ];
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
  const originalHtml = sheet.innerHTML;
  const originalPhoto = photo.getAttribute("src");
  let saveTimer = 0;

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
    "</div>" +
    "<div class=\"cv-editor__block\">" +
      "<h3>" + t.colors + "</h3>" +
      "<div class=\"cv-editor__swatches\">" +
        colorField("side", t.side) +
        colorField("cyan", t.accent) +
        colorField("paper", t.paper) +
        colorField("ink", t.ink) +
        colorField("bar", t.bar) +
      "</div>" +
      "<p style=\"margin:10px 0 6px\">" + t.themes + "</p>" +
      "<div class=\"cv-editor__themes\"></div>" +
    "</div>" +
    "<div class=\"cv-editor__block\">" +
      "<h3>" + t.size + "</h3>" +
      "<input type=\"range\" min=\"90\" max=\"112\" value=\"100\" data-size />" +
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

  const themeWrap = panel.querySelector(".cv-editor__themes");
  themes.forEach(function (theme) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cv-editor__theme";
    btn.style.background = "linear-gradient(135deg, " + theme.side + " 50%, " + theme.cyan + " 50%)";
    btn.addEventListener("click", function () {
      applyColors(theme);
      syncColorInputs(theme);
      scheduleSave();
    });
    themeWrap.appendChild(btn);
  });

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "cv-edit-toggle";
  toggle.textContent = t.edit;
  toolbar.appendChild(toggle);

  function colorField(name, label) {
    return (
      "<label class=\"cv-editor__swatch\">" +
        "<input type=\"color\" data-color=\"" + name + "\" value=\"" + defaults[name] + "\" />" +
        "<span>" + label + "</span>" +
      "</label>"
    );
  }

  function currentPhoto() {
    return document.querySelector(".side__photo");
  }

  function applyColors(colors) {
    const root = document.documentElement;
    root.style.setProperty("--side", colors.side || defaults.side);
    root.style.setProperty("--cyan", colors.cyan || defaults.cyan);
    root.style.setProperty("--paper", colors.paper || defaults.paper);
    root.style.setProperty("--ink", colors.ink || defaults.ink);
    root.style.setProperty("--bar", colors.bar || defaults.bar);
    if (colors.size) {
      sheet.style.fontSize = colors.size + "%";
      const range = panel.querySelector("[data-size]");
      if (range) range.value = colors.size;
    }
  }

  function syncColorInputs(colors) {
    panel.querySelectorAll("[data-color]").forEach(function (input) {
      if (colors[input.dataset.color]) input.value = colors[input.dataset.color];
    });
  }

  function readColors() {
    const colors = { size: panel.querySelector("[data-size]").value };
    panel.querySelectorAll("[data-color]").forEach(function (input) {
      colors[input.dataset.color] = input.value;
    });
    return colors;
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
    if (!raw) return;
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
      if (data.colors) {
        applyColors(data.colors);
        syncColorInputs(data.colors);
      }
    } catch (error) {
      /* ignore broken payload */
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
    syncColorInputs(defaults);
    panel.querySelector("[data-size]").value = defaults.size;
    sheet.style.fontSize = "";
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
  });

  panel.querySelectorAll("[data-color]").forEach(function (input) {
    input.addEventListener("input", function () {
      applyColors(readColors());
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

  restore();
  if (/[?&]edit=1(?:&|$)/.test(location.search)) {
    setEditing(true);
  }
})();
