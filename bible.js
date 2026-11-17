"use strict";

var BIBLE_KEY = "ix52-bible-v1";
var BIBLE_URL = "books/the-verbesque-bible-2026.pdf";

var bibleState = {
    pdf: null,
    page: 1,
    total: 0,
    mode: "page",
    spread: false,
    zoom: 1,
    rendering: false,
    token: 0,
    outline: [],
    booted: false
};

function biblePrefs() {
    try {
        return JSON.parse(localStorage.getItem(BIBLE_KEY) || "{}");
    } catch (error) {
        return {};
    }
}

function saveBiblePrefs() {
    localStorage.setItem(BIBLE_KEY, JSON.stringify({
        page: bibleState.page,
        mode: bibleState.mode,
        spread: bibleState.spread,
        zoom: bibleState.zoom
    }));
}

function bibleReduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function assetUrl(relative) {
    return new URL(relative, window.location.href).href;
}

function openBible() {
    var root = document.getElementById("bibleRoot");
    if (!root || bibleState.booted) {
        if (bibleState.pdf) renderBible();
        return;
    }
    bibleState.booted = true;
    var prefs = biblePrefs();
    bibleState.savedPage = prefs.page || 1;
    bibleState.page = 1;
    bibleState.mode = prefs.mode === "scroll" ? "scroll" : "page";
    bibleState.spread = typeof prefs.spread === "boolean" ? prefs.spread : window.innerWidth >= 1000;
    bibleState.zoom = prefs.zoom || 1;
    root.replaceChildren();
    root.appendChild(bibleChrome());
    if (typeof pdfjsLib === "undefined") {
        bibleFail("The reader library did not load.");
        return;
    }
    pdfjsLib.GlobalWorkerOptions.workerSrc = assetUrl("vendor/pdf.worker.min.js");
    var loading = document.getElementById("bibleStatus");
    loading.hidden = false;
    loading.textContent = "Opening the book…";
    pdfjsLib.getDocument(assetUrl(BIBLE_URL)).promise.then(function (pdf) {
        bibleState.pdf = pdf;
        bibleState.total = pdf.numPages;
        if (bibleState.page < 1 || bibleState.page > pdf.numPages) bibleState.page = 1;
        loading.hidden = true;
        loading.textContent = "";
        return pdf.getOutline();
    }).then(function (outline) {
        return outlineToList(outline || []);
    }).then(function (items) {
        bibleState.outline = items;
        renderBible();
        offerResume();
    }).catch(function () {
        bibleFail("The book could not be opened.");
    });
}

function bibleFail(message) {
    var loading = document.getElementById("bibleStatus");
    if (!loading) return;
    loading.hidden = false;
    loading.textContent = message;
}

function bibleChrome() {
    var shell = el("div", "bible-shell");
    var bar = el("div", "bible-bar");
    var title = el("div", "bible-title");
    title.appendChild(el("p", "kicker", "The Verbesque Bible"));
    title.appendChild(el("p", "bible-name", "A Philosophy of Sustainable Motion"));
    bar.appendChild(title);
    var tools = el("div", "bible-tools");
    tools.appendChild(bibleButton("Contents", "bibleTocToggle", function () {
        document.getElementById("bibleToc").hidden = !document.getElementById("bibleToc").hidden;
    }));
    tools.appendChild(bibleButton("Display", "bibleSettingsToggle", function () {
        document.getElementById("bibleSettings").hidden = !document.getElementById("bibleSettings").hidden;
    }));
    var back = el("a", "ghost bible-back", "Back to Oracle");
    back.href = "#oracle";
    tools.appendChild(back);
    bar.appendChild(tools);
    shell.appendChild(bar);

    var settings = el("div", "bible-settings panel");
    settings.id = "bibleSettings";
    settings.hidden = true;
    settings.appendChild(settingChoice("Reading", "bibleMode", [
        ["page", "Page"],
        ["scroll", "Scroll"]
    ], function (value) {
        bibleState.mode = value;
        saveBiblePrefs();
        renderBible();
    }));
    settings.appendChild(settingChoice("Layout", "bibleSpread", [
        ["single", "One page"],
        ["spread", "Two pages"]
    ], function (value) {
        bibleState.spread = value === "spread";
        saveBiblePrefs();
        renderBible();
    }));
    var zoom = el("div", "bible-zoom");
    zoom.appendChild(el("span", "meta", "Zoom"));
    zoom.appendChild(bibleButton("Smaller", "", function () { setZoom(bibleState.zoom - 0.15); }));
    zoom.appendChild(bibleButton("Larger", "", function () { setZoom(bibleState.zoom + 0.15); }));
    settings.appendChild(zoom);
    shell.appendChild(settings);

    var toc = el("nav", "bible-toc panel");
    toc.id = "bibleToc";
    toc.hidden = true;
    toc.setAttribute("aria-label", "Table of contents");
    shell.appendChild(toc);

    var resume = el("div", "bible-resume panel");
    resume.id = "bibleResume";
    resume.hidden = true;
    shell.appendChild(resume);

    var status = el("p", "hint");
    status.id = "bibleStatus";
    status.hidden = true;
    shell.appendChild(status);

    var stage = el("div", "bible-stage");
    stage.id = "bibleStage";
    stage.tabIndex = 0;
    stage.setAttribute("aria-label", "Book pages");
    shell.appendChild(stage);

    var nav = el("div", "bible-nav");
    nav.appendChild(bibleButton("Previous", "biblePrev", function () { turnBible(-1); }));
    var indicator = el("p", "bible-indicator");
    indicator.id = "bibleIndicator";
    nav.appendChild(indicator);
    var jump = document.createElement("input");
    jump.id = "bibleJump";
    jump.type = "number";
    jump.min = "1";
    jump.inputMode = "numeric";
    jump.setAttribute("aria-label", "Jump to page");
    jump.addEventListener("change", function () {
        goToBiblePage(parseInt(jump.value, 10));
    });
    nav.appendChild(jump);
    nav.appendChild(bibleButton("Next", "bibleNext", function () { turnBible(1); }));
    shell.appendChild(nav);
    var progress = el("div", "bible-progress");
    progress.id = "bibleProgress";
    progress.setAttribute("role", "progressbar");
    progress.setAttribute("aria-label", "Reading progress");
    shell.appendChild(progress);
    bindBibleGestures(stage);
    return shell;
}

function bibleButton(label, id, onClick) {
    var button = el("button", "ghost", label);
    button.type = "button";
    if (id) button.id = id;
    button.addEventListener("click", onClick);
    return button;
}

function settingChoice(label, name, options, onChange) {
    var wrap = el("div", "bible-setting");
    wrap.appendChild(el("span", "meta", label));
    var row = el("div", "choice-row");
    options.forEach(function (option) {
        var button = el("button", "choice", option[1]);
        button.type = "button";
        button.setAttribute("data-setting", name);
        button.setAttribute("data-value", option[0]);
        button.addEventListener("click", function () { onChange(option[0]); });
        row.appendChild(button);
    });
    wrap.appendChild(row);
    return wrap;
}

function syncSettingButtons() {
    document.querySelectorAll("[data-setting='bibleMode']").forEach(function (button) {
        button.setAttribute("aria-pressed", button.getAttribute("data-value") === bibleState.mode ? "true" : "false");
    });
    document.querySelectorAll("[data-setting='bibleSpread']").forEach(function (button) {
        var on = (button.getAttribute("data-value") === "spread") === bibleState.spread;
        button.setAttribute("aria-pressed", on ? "true" : "false");
    });
}

function setZoom(value) {
    bibleState.zoom = Math.max(0.7, Math.min(1.8, Math.round(value * 100) / 100));
    saveBiblePrefs();
    renderBible();
}

function offerResume() {
    var prefs = biblePrefs();
    var banner = document.getElementById("bibleResume");
    if (!banner || !bibleState.savedPage || bibleState.savedPage <= 1) return;
    banner.hidden = false;
    banner.replaceChildren();
    banner.appendChild(el("p", "", "Resume page " + bibleState.savedPage + "?"));
    var actions = el("div", "actions");
    actions.appendChild(bibleButton("Resume", "", function () {
        banner.hidden = true;
        goToBiblePage(bibleState.savedPage);
    }));
    actions.appendChild(bibleButton("Start at the beginning", "", function () {
        banner.hidden = true;
        goToBiblePage(1);
    }));
    banner.appendChild(actions);
}

function outlineToList(items) {
    var jobs = [];
    function walk(list, depth) {
        (list || []).forEach(function (item) {
            jobs.push(pageForDest(item.dest).then(function (page) {
                return { title: item.title, page: page, depth: depth };
            }));
            if (item.items && item.items.length) walk(item.items, depth + 1);
        });
    }
    walk(items, 0);
    return Promise.all(jobs);
}

function pageForDest(dest) {
    if (!dest) return Promise.resolve(null);
    var resolved = typeof dest === "string" ? bibleState.pdf.getDestination(dest) : Promise.resolve(dest);
    return resolved.then(function (explicit) {
        if (!explicit || !explicit[0]) return null;
        return bibleState.pdf.getPageIndex(explicit[0]).then(function (index) { return index + 1; });
    }).catch(function () { return null; });
}

function renderToc() {
    var toc = document.getElementById("bibleToc");
    if (!toc) return;
    var list = el("div", "bible-toc-list");
    bibleState.outline.forEach(function (item) {
        if (!item.page) return;
        var button = el("button", "text-btn bible-toc-item", item.title);
        button.type = "button";
        button.style.paddingLeft = (0.4 + item.depth * 0.8) + "rem";
        button.addEventListener("click", function () {
            toc.hidden = true;
            goToBiblePage(item.page);
        });
        list.appendChild(button);
    });
    toc.replaceChildren(el("p", "meta", "Contents"), list);
}

function pagesInView() {
    if (bibleState.mode === "scroll" || !bibleState.spread || window.innerWidth < 900) return [bibleState.page];
    if (bibleState.page === 1) return [1];
    var left = bibleState.page % 2 === 0 ? bibleState.page : bibleState.page - 1;
    var pages = [left];
    if (left + 1 <= bibleState.total) pages.push(left + 1);
    return pages;
}

function renderBible() {
    if (!bibleState.pdf) return;
    renderToc();
    syncSettingButtons();
    var stage = document.getElementById("bibleStage");
    var indicator = document.getElementById("bibleIndicator");
    var jump = document.getElementById("bibleJump");
    var progress = document.getElementById("bibleProgress");
    var prev = document.getElementById("biblePrev");
    var next = document.getElementById("bibleNext");
    if (jump) {
        jump.max = String(bibleState.total);
        jump.value = String(bibleState.page);
    }
    if (progress) {
        progress.setAttribute("aria-valuemin", "1");
        progress.setAttribute("aria-valuemax", String(bibleState.total));
        progress.setAttribute("aria-valuenow", String(bibleState.page));
        progress.style.setProperty("--progress", (bibleState.page / bibleState.total * 100) + "%");
    }
    if (bibleState.mode === "scroll") {
        if (prev) prev.disabled = true;
        if (next) next.disabled = true;
        if (indicator) indicator.textContent = bibleState.total + " pages";
        renderBibleScroll(stage);
        return;
    }
    var shown = pagesInView();
    if (prev) prev.disabled = shown[0] <= 1;
    if (next) next.disabled = shown[shown.length - 1] >= bibleState.total;
    if (indicator) indicator.textContent = "Page " + shown.join("–") + " of " + bibleState.total;
    stage.replaceChildren();
    var spread = el("div", shown.length > 1 ? "bible-spread is-pair" : "bible-spread");
    stage.appendChild(spread);
    shown.forEach(function (number) { spread.appendChild(pageShell(number)); });
    paintPages(shown);
}

function renderBibleScroll(stage) {
    if (stage.querySelector(".bible-scroll")) {
        paintVisibleSheets();
        return;
    }
    stage.replaceChildren();
    var scroller = el("div", "bible-scroll");
    stage.appendChild(scroller);
    for (var number = 1; number <= bibleState.total; number++) {
        scroller.appendChild(pageShell(number));
    }
    if (!bibleState.scrollObserver) {
        bibleState.scrollObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var sheet = entry.target;
                var number = parseInt(sheet.getAttribute("data-page"), 10);
                if (entry.isIntersecting) paintPages([number]);
                else releaseSheet(sheet);
            });
        }, { root: null, rootMargin: "600px 0px" });
    }
    scroller.querySelectorAll(".bible-sheet").forEach(function (sheet) {
        bibleState.scrollObserver.observe(sheet);
    });
    var target = scroller.querySelector('[data-page="' + bibleState.page + '"]');
    if (target) target.scrollIntoView({ block: "start" });
}

function paintVisibleSheets() {
    var scroller = document.querySelector(".bible-scroll");
    if (!scroller) return;
    paintPages([bibleState.page]);
}

function pageShell(number) {
    var existing = document.querySelector('.bible-sheet[data-page="' + number + '"]');
    if (existing && existing.parentNode) return existing;
    var sheet = el("div", "bible-sheet");
    sheet.setAttribute("data-page", String(number));
    sheet.style.aspectRatio = "540 / 756";
    var frame = el("div", "bible-frame");
    var canvas = document.createElement("canvas");
    canvas.setAttribute("aria-label", "Page " + number);
    frame.appendChild(canvas);
    var textLayer = el("div", "textLayer");
    frame.appendChild(textLayer);
    var links = el("div", "bible-links");
    frame.appendChild(links);
    sheet.appendChild(frame);
    return sheet;
}

function releaseSheet(sheet) {
    var canvas = sheet.querySelector("canvas");
    var textLayer = sheet.querySelector(".textLayer");
    var links = sheet.querySelector(".bible-links");
    if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
    }
    if (textLayer) textLayer.replaceChildren();
    if (links) links.replaceChildren();
    sheet.removeAttribute("data-painted");
}

function paintPages(numbers) {
    var token = ++bibleState.token;
    var width = pageWidth(numbers.length);
    numbers.forEach(function (number) {
        bibleState.pdf.getPage(number).then(function (page) {
            if (token !== bibleState.token && bibleState.mode === "page") return;
            var sheet = document.querySelector('.bible-sheet[data-page="' + number + '"]');
            if (!sheet || sheet.getAttribute("data-painted") === "1") return;
            var unscaled = page.getViewport({ scale: 1 });
            var scale = (width / unscaled.width) * bibleState.zoom;
            var viewport = page.getViewport({ scale: scale });
            var canvas = sheet.querySelector("canvas");
            var textLayer = sheet.querySelector(".textLayer");
            var links = sheet.querySelector(".bible-links");
            var ratio = window.devicePixelRatio || 1;
            canvas.width = Math.floor(viewport.width * ratio);
            canvas.height = Math.floor(viewport.height * ratio);
            canvas.style.width = Math.floor(viewport.width) + "px";
            canvas.style.height = Math.floor(viewport.height) + "px";
            sheet.style.aspectRatio = "auto";
            var context = canvas.getContext("2d");
            var transform = ratio === 1 ? null : [ratio, 0, 0, ratio, 0, 0];
            return page.render({ canvasContext: context, viewport: viewport, transform: transform }).promise.then(function () {
                return page.getTextContent();
            }).then(function (textContent) {
                textLayer.replaceChildren();
                textLayer.style.width = canvas.style.width;
                textLayer.style.height = canvas.style.height;
                return pdfjsLib.renderTextLayer({
                    textContent: textContent,
                    container: textLayer,
                    viewport: viewport,
                    textDivs: []
                }).promise;
            }).then(function () {
                return page.getAnnotations();
            }).then(function (annotations) {
                paintLinks(links, annotations, viewport, number);
                sheet.setAttribute("data-painted", "1");
            });
        }).catch(function () {});
    });
}

function pageWidth(count) {
    var stage = document.getElementById("bibleStage");
    var available = stage ? stage.clientWidth : 720;
    var gap = count > 1 ? 16 : 0;
    var each = count > 1 ? (available - gap) / 2 : available;
    return Math.max(240, Math.min(each - 8, 760));
}

function paintLinks(layer, annotations, viewport, number) {
    layer.replaceChildren();
    layer.style.width = viewport.width + "px";
    layer.style.height = viewport.height + "px";
    annotations.forEach(function (note) {
        if (note.subtype !== "Link" || !note.rect) return;
        var rect = viewport.convertToViewportRectangle(note.rect);
        var left = Math.min(rect[0], rect[2]);
        var top = Math.min(rect[1], rect[3]);
        var anchor = document.createElement("a");
        anchor.style.left = left + "px";
        anchor.style.top = top + "px";
        anchor.style.width = Math.abs(rect[0] - rect[2]) + "px";
        anchor.style.height = Math.abs(rect[1] - rect[3]) + "px";
        if (note.url) {
            anchor.href = note.url;
            anchor.target = "_blank";
            anchor.rel = "noopener noreferrer";
            anchor.setAttribute("aria-label", "Link on page " + number);
        } else if (note.dest) {
            anchor.href = "#bible";
            anchor.setAttribute("aria-label", "Page link");
            anchor.addEventListener("click", function (event) {
                event.preventDefault();
                pageForDest(note.dest).then(function (page) { if (page) goToBiblePage(page); });
            });
        } else return;
        layer.appendChild(anchor);
    });
}

function goToBiblePage(number) {
    if (!bibleState.total) return;
    var next = Math.max(1, Math.min(bibleState.total, number || 1));
    bibleState.page = next;
    saveBiblePrefs();
    if (bibleState.mode === "scroll") {
        var sheet = document.querySelector('.bible-sheet[data-page="' + next + '"]');
        if (sheet) sheet.scrollIntoView({ block: "start" });
        var indicator = document.getElementById("bibleIndicator");
        if (indicator) indicator.textContent = "Page " + next + " of " + bibleState.total;
        return;
    }
    renderBible();
    announce("Page " + next + " of " + bibleState.total);
}

function turnBible(delta) {
    var shown = pagesInView();
    var next = delta > 0 ? shown[shown.length - 1] + 1 : shown[0] - 1;
    if (next < 1 || next > bibleState.total) return;
    var stage = document.getElementById("bibleStage");
    if (!stage || bibleReduced()) {
        goToBiblePage(next);
        return;
    }
    stage.classList.remove("is-turning-next", "is-turning-prev");
    stage.classList.add(delta > 0 ? "is-turning-next" : "is-turning-prev");
    window.setTimeout(function () {
        stage.classList.remove("is-turning-next", "is-turning-prev");
        goToBiblePage(next);
    }, 180);
}

function bindBibleGestures(stage) {
    var pointer = null;
    stage.addEventListener("pointerdown", function (event) {
        if (bibleState.mode !== "page") return;
        pointer = { id: event.pointerId, x: event.clientX };
    });
    stage.addEventListener("pointerup", function (event) {
        if (!pointer || pointer.id !== event.pointerId) return;
        var dx = event.clientX - pointer.x;
        pointer = null;
        if (Math.abs(dx) < 48) return;
        turnBible(dx < 0 ? 1 : -1);
    });
    stage.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight" || event.key === "PageDown") {
            event.preventDefault();
            turnBible(1);
        }
        if (event.key === "ArrowLeft" || event.key === "PageUp") {
            event.preventDefault();
            turnBible(-1);
        }
    });
}

document.addEventListener("keydown", function (event) {
    if (typeof currentView !== "function" || currentView() !== "bible" || bibleState.mode !== "page") return;
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        turnBible(1);
    }
    if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        turnBible(-1);
    }
});

var bibleResizeTimer = 0;
window.addEventListener("resize", function () {
    if (!bibleState.pdf || currentView() !== "bible") return;
    window.clearTimeout(bibleResizeTimer);
    bibleResizeTimer = window.setTimeout(function () {
        document.querySelectorAll(".bible-sheet").forEach(function (sheet) { sheet.removeAttribute("data-painted"); });
        renderBible();
    }, 150);
});
