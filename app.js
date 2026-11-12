"use strict";

var STORE_KEY = "ix52-2026-v1";
var VIEWS = ["oracle", "artists", "practice", "about"];

var state = {
    suit: "",
    rank: "",
    cardCode: "",
    step: "sense",
    capacity: "ordinary",
    lowStim: false,
    saveLocal: false,
    sessionNote: "",
    invalid: false
};

var store = loadStore();

function loadStore() {
    try {
        var parsed = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
        parsed.notes = parsed.notes || {};
        parsed.cycles = parsed.cycles || {};
        if (!parsed.version && parsed.draws && Object.keys(parsed.draws).length) {
            var legacyId = "legacy-2026-11-17";
            parsed.cycles[legacyId] = {
                id: legacyId,
                start: "2026-11-17",
                created: "2026-11-17",
                draws: parsed.draws,
                notes: parsed.notes
            };
            parsed.activeCycleId = legacyId;
        }
        parsed.version = 2;
        delete parsed.draws;
        return parsed;
    } catch (error) {
        return { version: 2, notes: {}, cycles: {} };
    }
}

function activeCycle() {
    if (!store.activeCycleId) return null;
    return store.cycles[store.activeCycleId] || null;
}

function localToday() {
    var date = new Date();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
}

function saveStore() {
    try {
        localStorage.setItem(STORE_KEY, JSON.stringify(store));
    } catch (error) {
        /* Private browsing can block storage. The reading still works. */
    }
}

function addDays(iso, amount) {
    return addCalendarDays(iso, amount);
}

function dayNumber(iso) {
    var cycle = activeCycle();
    if (!cycle) return null;
    return practiceDayNumber(cycle.start, iso);
}

function formatDate(iso) {
    var parts = iso.split("-").map(Number);
    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC"
    }).format(new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])));
}

function parseCode(code) {
    var split = code.indexOf("_");
    var suitKey = code.slice(0, split);
    var rankKey = code.slice(split + 1);
    var rankMap = { ace: "Ace", jack: "Jack", queen: "Queen", king: "King" };
    return {
        suit: suitKey.charAt(0).toUpperCase() + suitKey.slice(1),
        rank: rankMap[rankKey] || rankKey
    };
}

function cardLabel(suit, rank) {
    return RANK_LABELS_2026[rank] + " of " + suit;
}

function codeFor(suit, rank) {
    var rankKey = { Ace: "ace", Jack: "jack", Queen: "queen", King: "king" }[rank] || rank;
    return suit.toLowerCase() + "_" + rankKey;
}

var oracleByCode = {};
ORACLE_2026.forEach(function (card) { oracleByCode[card.card_code] = card; });

var artistByCard = {};
var artistById = {};
ARTISTS_2026.forEach(function (artist) {
    artistById[artist.artist_id] = artist;
    if (artist.card_code) artistByCard[artist.card_code] = artist;
});

var assetByCard = {};
ASSETS_2026.forEach(function (asset) {
    if (asset.card_code) assetByCard[asset.card_code] = asset;
});

function getCard(code) {
    var oracle = oracleByCode[code];
    if (!oracle) return null;
    var parts = parseCode(code);
    var suit = SUITS_2026[parts.suit];
    var artist = artistByCard[code];
    var asset = assetByCard[code];
    return {
        code: code,
        suit: parts.suit,
        rank: parts.rank,
        label: cardLabel(parts.suit, parts.rank),
        suitMeta: suit,
        archetype: RANK_ARCHETYPES_2026[parts.rank],
        oracle: oracle,
        artist: artist,
        asset: asset
    };
}

function canShowImage(asset) {
    return Boolean(asset && asset.image_url);
}

function applyDeck() {
    if (typeof DECK_2026 === "undefined") return;
    var byAsset = {};
    ASSETS_2026.forEach(function (asset) { byAsset[asset.asset_id] = asset; });
    DECK_2026.forEach(function (row) {
        var artist = artistByCard[row.card_code];
        if (!artist) {
            artist = ARTISTS_2026.filter(function (item) {
                return item.artist_name === row.artist_name;
            })[0];
        }
        if (artist) {
            artist.artist_name = row.artist_name;
            artist.social_url = row.artist_social_url;
            artist.social_platform = "instagram";
            artist.social_verification_status = "verified";
        }
        var asset = assetByCard[row.card_code] || byAsset[row.card_code];
        if (asset) {
            asset.image_url = row.card_image_url;
            asset.display_permitted = true;
            asset.image_rights_status = "supplied";
            asset.image_alt = row.card_label + ", artwork by " + row.artist_name;
            asset.is_code_red_exclusive = row.is_code_red_exclusive;
        }
        if (oracleByCode[row.card_code]) oracleByCode[row.card_code].is_code_red_exclusive = row.is_code_red_exclusive;
    });
}

function handleFrom(url) {
    try {
        var path = new URL(url).pathname.replace(/\/+$/, "");
        var handle = path.split("/").filter(Boolean).pop();
        return handle ? "@" + handle : "";
    } catch (error) {
        return "";
    }
}

function socialAnchor(url) {
    var link = el("a", "social-link", "Instagram ↗");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
}

function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
}

function announce(message) {
    document.getElementById("live").textContent = message;
}

function toast(message) {
    var node = document.getElementById("toast");
    node.textContent = message;
    node.hidden = false;
    window.setTimeout(function () { node.hidden = true; }, 1800);
}

function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
            toast("Copied");
        }).catch(function () {
            fallbackCopy(text);
        });
        return;
    }
    fallbackCopy(text);
}

function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    try {
        document.execCommand("copy");
        toast("Copied");
    } catch (error) {
        toast("Copy did not work");
    }
    document.body.removeChild(area);
}

function currentView() {
    var name = (location.hash || "#oracle").replace("#", "");
    return VIEWS.indexOf(name) === -1 ? "oracle" : name;
}

function showView(name) {
    VIEWS.forEach(function (view) {
        var section = document.getElementById("view-" + view);
        var on = view === name;
        section.hidden = !on;
    });
    document.querySelectorAll("#siteNav a").forEach(function (link) {
        if (link.getAttribute("href") === "#" + name) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
    });
    var nav = document.getElementById("siteNav");
    nav.classList.remove("is-open");
    document.getElementById("navToggle").setAttribute("aria-expanded", "false");
    if (name === "oracle" && state.cardCode) renderOracle();
    if (name === "artists") renderGallery();
    if (name === "practice") renderPractice();
}

function setCard(code, options) {
    options = options || {};
    var card = getCard(code);
    state.invalid = false;
    if (!card) {
        state.cardCode = "";
        state.invalid = Boolean(code);
        renderOracle();
        return;
    }
    state.cardCode = code;
    state.suit = card.suit;
    state.rank = card.rank;
    state.step = "sense";
    state.closedReading = false;
    var cycle = activeCycle();
    state.sessionNote = "";
    if (cycle && cycle.notes && cycle.notes[code]) state.sessionNote = cycle.notes[code];
    else if (store.notes && store.notes[code]) state.sessionNote = store.notes[code];
    syncChoiceButtons();
    var url = new URL(location.href);
    url.searchParams.set("card", code);
    if (!url.hash) url.hash = "oracle";
    history.replaceState(null, "", url);
    renderOracle();
    announce(card.label + ". Artwork by " + card.artist.artist_name + ". Verb " + card.oracle.daily_verb + ".");
    if (options.reveal) {
        var art = document.querySelector(".plate-button");
        if (art) art.scrollIntoView({ block: "nearest" });
    }
}

function clearCard() {
    state.cardCode = "";
    state.suit = "";
    state.rank = "";
    state.invalid = false;
    state.sessionNote = "";
    syncChoiceButtons();
    var url = new URL(location.href);
    url.searchParams.delete("card");
    history.replaceState(null, "", url);
    renderOracle();
    announce("Card cleared. Choose a suit and rank.");
}

function syncChoiceButtons() {
    document.querySelectorAll("[data-suit]").forEach(function (button) {
        button.setAttribute("aria-checked", button.getAttribute("data-suit") === state.suit ? "true" : "false");
    });
    document.querySelectorAll("[data-rank]").forEach(function (button) {
        button.setAttribute("aria-checked", button.getAttribute("data-rank") === state.rank ? "true" : "false");
    });
}

function trySelection() {
    if (!state.suit || !state.rank) {
        renderOracle();
        return;
    }
    setCard(codeFor(state.suit, state.rank), { reveal: true });
}

function buildChoices() {
    var suits = document.getElementById("suitGroup");
    var ranks = document.getElementById("rankGroup");
    Object.keys(SUITS_2026).forEach(function (suit) {
        var button = el("button", "choice", suit + " " + SUITS_2026[suit].symbol);
        button.type = "button";
        button.setAttribute("role", "radio");
        button.setAttribute("data-suit", suit);
        button.setAttribute("aria-checked", "false");
        button.addEventListener("click", function () {
            state.suit = suit;
            syncChoiceButtons();
            trySelection(false);
        });
        suits.appendChild(button);
    });
    RANK_ORDER_2026.forEach(function (rank) {
        var button = el("button", "choice", rank === "Ace" ? "A" : rank === "Jack" ? "J" : rank === "Queen" ? "Q" : rank === "King" ? "K" : rank);
        button.type = "button";
        button.setAttribute("role", "radio");
        button.setAttribute("data-rank", rank);
        button.setAttribute("aria-checked", "false");
        button.setAttribute("aria-label", RANK_LABELS_2026[rank]);
        button.addEventListener("click", function () {
            state.rank = rank;
            syncChoiceButtons();
            trySelection(false);
        });
        ranks.appendChild(button);
    });
    arrowGroup(suits);
    arrowGroup(ranks);
    var rankFilter = document.getElementById("galleryRank");
    var all = el("option", "", "All ranks");
    all.value = "";
    rankFilter.appendChild(all);
    RANK_ORDER_2026.forEach(function (rank) {
        var option = el("option", "", RANK_LABELS_2026[rank]);
        option.value = rank;
        rankFilter.appendChild(option);
    });
}

function arrowGroup(group) {
    group.addEventListener("keydown", function (event) {
        if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].indexOf(event.key) === -1) return;
        var buttons = Array.prototype.slice.call(group.querySelectorAll("button"));
        var index = buttons.indexOf(document.activeElement);
        if (index === -1) return;
        event.preventDefault();
        var direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
        var next = buttons[(index + direction + buttons.length) % buttons.length];
        next.focus();
        next.click();
    });
}

function plateNode(card, interactive) {
    var frame = el("div", "art-frame");
    if (!canShowImage(card.asset)) {
        frame.appendChild(el("p", "withheld", "Image unavailable"));
        return frame;
    }
    var image = document.createElement("img");
    image.className = "art-image";
    image.src = card.asset.image_url;
    image.alt = card.asset.image_alt || (card.label + " by " + card.artist.artist_name);
    if (interactive) image.setAttribute("fetchpriority", "high");
    else image.loading = "lazy";
    image.addEventListener("error", function () {
        frame.replaceChildren(el("p", "withheld", "Image unavailable"));
    });
    frame.appendChild(image);
    return frame;
}

function openViewer(card) {
    state.viewerReturn = document.activeElement;
    var body = document.getElementById("viewerBody");
    body.replaceChildren();
    body.appendChild(plateNode(card, true));
    body.appendChild(el("p", "", card.label + ". Artwork by " + card.artist.artist_name + "."));
    var dialog = document.getElementById("viewer");
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.hidden = false;
    document.getElementById("viewerClose").focus();
}

function actionPair(card) {
    var small = state.capacity === "constrained" || state.capacity === "recovery";
    if (small) {
        return {
            primaryLabel: "A complete smaller action",
            primary: card.oracle.low_capacity_alternative,
            secondaryLabel: "If you have more room",
            secondary: card.oracle.micro_action
        };
    }
    return {
        primaryLabel: "One action",
        primary: card.oracle.micro_action,
        secondaryLabel: "A smaller valid action",
        secondary: card.oracle.low_capacity_alternative
    };
}

function shareCaption(card) {
    var today = localToday();
    var number = dayNumber(today);
    var lines = [];
    lines.push(number ? "IX:52 — Day " + number : "IX:52");
    lines.push(card.label + " · " + card.oracle.daily_verb.toUpperCase());
    lines.push("");
    lines.push("Artwork by " + card.artist.artist_name);
    var handle = handleFrom(card.artist.social_url || "");
    if (handle) lines.push(handle);
    lines.push("");
    lines.push("Today's reflection: " + (state.shareReflection && state.shareReflection.trim() ? state.shareReflection.trim() : "[personal text]"));
    lines.push("");
    lines.push("Bicycle Sari-Sari Code:RED by RunIt Decks");
    lines.push("");
    lines.push("#IX52 #Verbesque #CodeRED");
    return lines.join("\n");
}

function cycleDraws() {
    var cycle = activeCycle();
    return cycle && cycle.draws ? cycle.draws : {};
}

function otherDays(code, exceptDate) {
    return Object.keys(cycleDraws()).filter(function (date) {
        return cycleDraws()[date].card_code === code && date !== exceptDate;
    });
}

function renderOracle() {
    var welcome = document.getElementById("welcome");
    var invalid = document.getElementById("invalid");
    var mount = document.getElementById("oracleMount");
    mount.replaceChildren();
    if (!state.cardCode) {
        welcome.hidden = state.invalid;
        invalid.hidden = !state.invalid;
        return;
    }
    welcome.hidden = true;
    invalid.hidden = true;
    var card = getCard(state.cardCode);
    var layout = el("div", "oracle-layout");
    var title = el("h2", "card-title", card.label);
    title.id = "cardTitle";
    layout.appendChild(title);
    var left = el("div", "art-col");
    var opener = el("button", "plate-button");
    opener.type = "button";
    opener.appendChild(plateNode(card, true));
    opener.setAttribute("aria-label", "Enlarge the artwork for " + card.label);
    opener.addEventListener("click", function () { openViewer(card); });
    left.appendChild(opener);
    layout.appendChild(left);

    var right = el("div", "read-col");
    var credit = el("div", "credit");
    credit.appendChild(el("p", "meta", "Artwork by"));
    credit.appendChild(el("p", "artist-name", card.artist.artist_name));
    if (card.artist.social_url) credit.appendChild(socialAnchor(card.artist.social_url));
    if (card.oracle.is_code_red_exclusive) {
        credit.appendChild(el("p", "exclusive", "Code:RED Exclusive"));
        if (card.oracle.exclusive_title) credit.appendChild(el("p", "fine", card.oracle.exclusive_title));
    }
    right.appendChild(credit);
    right.appendChild(el("p", "verb", card.oracle.daily_verb));
    right.appendChild(el("p", "archetype", card.archetype));

    var steps = el("div", "steps");
    steps.setAttribute("role", "tablist");
    steps.setAttribute("aria-label", "Fivefold practice");
    PRACTICE_STEPS_2026.forEach(function (step) {
        var button = el("button", "step", step.label);
        button.type = "button";
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", state.step === step.id ? "true" : "false");
        button.addEventListener("click", function () {
            var y = window.scrollY;
            state.step = step.id;
            renderOracle();
            window.scrollTo(0, y);
        });
        steps.appendChild(button);
    });
    right.appendChild(steps);

    var stepMeta = PRACTICE_STEPS_2026.filter(function (step) { return step.id === state.step; })[0];
    var panel = el("div", "panel");
    panel.setAttribute("role", "tabpanel");
    panel.appendChild(el("h3", "prompt", stepMeta.prompt));
    panel.appendChild(stepBody(card, state.step));
    right.appendChild(panel);

    var color = el("div", "swatch-row");
    color.appendChild(el("span", "meta", "Day’s color"));
    var swatch = el("span", "swatch");
    swatch.style.background = card.suitMeta.color_hex;
    swatch.setAttribute("role", "img");
    swatch.setAttribute("aria-label", card.suitMeta.color_name);
    color.appendChild(swatch);
    color.appendChild(el("span", "", card.suitMeta.color_name));
    right.appendChild(color);
    right.appendChild(el("p", "fine", "Edition theme. Not sampled from the artwork."));

    var share = el("div", "panel");
    share.appendChild(el("h3", "", "Share the Day"));
    var reflection = document.createElement("textarea");
    reflection.value = state.shareReflection || "";
    reflection.setAttribute("aria-label", "Reflection for the caption");
    reflection.placeholder = "Optional reflection for the caption";
    reflection.addEventListener("input", function () {
        state.shareReflection = reflection.value;
        preview.textContent = shareCaption(card);
    });
    share.appendChild(reflection);
    var preview = el("pre", "note");
    preview.textContent = shareCaption(card);
    share.appendChild(preview);
    var shareActions = el("div", "actions");
    var copyShare = el("button", "solid", "Copy caption");
    copyShare.type = "button";
    copyShare.addEventListener("click", function () { copyText(shareCaption(card)); });
    shareActions.appendChild(copyShare);
    if (navigator.share) {
        var nativeShare = el("button", "ghost", "Share");
        nativeShare.type = "button";
        nativeShare.addEventListener("click", function () {
            navigator.share({ text: shareCaption(card) }).catch(function () {});
        });
        shareActions.appendChild(nativeShare);
    }
    share.appendChild(shareActions);
    right.appendChild(share);

    var record = recordPanel(card);
    right.appendChild(record);
    layout.appendChild(right);
    mount.appendChild(layout);
}

function stepBody(card, step) {
    var wrap = el("div");
    var oracle = card.oracle;
    if (step === "sense") {
        wrap.appendChild(el("p", "", oracle.artist_observation_prompt));
    }
    if (step === "choose") {
        wrap.appendChild(el("p", "", oracle.intention_cue));
    }
    if (step === "enact") {
        if (state.capacity === "recovery") wrap.appendChild(el("p", "callout", "Rest may be the action."));
        wrap.appendChild(el("p", "", oracle.oracle_text));
        wrap.appendChild(el("h3", "", "Intention"));
        wrap.appendChild(el("p", "", oracle.incantation));
        var pair = actionPair(card);
        wrap.appendChild(el("h3", "", pair.primaryLabel));
        wrap.appendChild(el("p", "", pair.primary));
        wrap.appendChild(el("h3", "", pair.secondaryLabel));
        wrap.appendChild(el("p", "", pair.secondary));
        var actions = el("div", "actions");
        actions.appendChild(copyButton("Copy intention", oracle.incantation));
        actions.appendChild(copyButton("Copy action", pair.primary));
        wrap.appendChild(actions);
    }
    if (step === "restore") {
        wrap.appendChild(el("p", "", oracle.restoration_cue));
        wrap.appendChild(el("p", "", oracle.capacity_note));
        wrap.appendChild(capacityControl());
    }
    if (step === "renew") {
        wrap.appendChild(el("p", "", oracle.journal_prompt));
        var field = document.createElement("textarea");
        field.value = state.sessionNote;
        field.setAttribute("aria-label", "Private note");
        field.placeholder = "Optional note. It stays on this device.";
        field.addEventListener("input", function () {
            state.sessionNote = field.value;
            store.notes[card.code] = field.value;
            var cycle = activeCycle();
            if (cycle) {
                cycle.notes = cycle.notes || {};
                cycle.notes[card.code] = field.value;
            }
            saveStore();
        });
        wrap.appendChild(field);
        var close = el("button", "solid", "Close today’s practice");
        close.type = "button";
        close.addEventListener("click", function () {
            var today = localToday();
            var draws = cycleDraws();
            state.closedReading = true;
            if (draws[today] && draws[today].card_code) {
                draws[today].closed = true;
                saveStore();
            }
            toast("Closed");
            var y = window.scrollY;
            renderOracle();
            window.scrollTo(0, y);
        });
        wrap.appendChild(close);
        var word = el("p", "");
        word.appendChild(el("strong", "", oracle.word_of_the_day + ". "));
        word.appendChild(document.createTextNode(oracle.word_meaning));
        wrap.appendChild(word);
        var learn = el("p", "");
        learn.appendChild(document.createTextNode(oracle.learning_note + " "));
        var source = el("a", "", oracle.learning_source_name);
        source.href = oracle.learning_source;
        source.target = "_blank";
        source.rel = "noopener noreferrer";
        learn.appendChild(source);
        wrap.appendChild(learn);
    }
    return wrap;
}

function copyButton(label, text) {
    var button = el("button", "ghost", label);
    button.type = "button";
    button.addEventListener("click", function () { copyText(text); });
    return button;
}

function capacityControl() {
    var group = el("div", "choice-row");
    group.setAttribute("role", "radiogroup");
    group.setAttribute("aria-label", "Capacity");
    CAPACITY_MODES_2026.forEach(function (mode) {
        var button = el("button", "choice", mode.label);
        button.type = "button";
        button.setAttribute("role", "radio");
        button.setAttribute("aria-checked", state.capacity === mode.id ? "true" : "false");
        button.addEventListener("click", function () {
            var y = window.scrollY;
            state.capacity = mode.id;
            store.capacity = mode.id;
            saveStore();
            renderOracle();
            window.scrollTo(0, y);
            if (currentView() === "practice") renderPractice();
        });
        group.appendChild(button);
    });
    var note = CAPACITY_MODES_2026.filter(function (mode) { return mode.id === state.capacity; })[0];
    var wrap = el("div");
    wrap.appendChild(el("p", "meta", "Capacity"));
    wrap.appendChild(group);
    wrap.appendChild(el("p", "", note.note));
    return wrap;
}

function startCycle(start) {
    var id = "c" + Date.now();
    store.cycles[id] = { id: id, start: start, created: localToday(), draws: {}, notes: {} };
    store.activeCycleId = id;
    saveStore();
}

function recordDraw(card, date) {
    var cycle = activeCycle();
    if (!cycle) return;
    var existing = cycle.draws[date];
    if (existing && existing.card_code && existing.card_code !== card.code) {
        if (!window.confirm("Replace the card already recorded for " + formatDate(date) + "?")) return;
    }
    cycle.draws[date] = {
        card_code: card.code,
        capacity: state.capacity,
        closed: existing ? Boolean(existing.closed) : false
    };
    saveStore();
    toast("Recorded");
}

function recordPanel(card) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Record this draw"));
    var cycle = activeCycle();
    var today = localToday();
    if (!cycle) {
        panel.appendChild(el("p", "", "Start a practice when you want these draws kept."));
        var begin = el("a", "", "Begin your IX:52");
        begin.href = "#practice";
        panel.appendChild(begin);
        return panel;
    }
    var number = dayNumber(today);
    if (today < cycle.start) {
        panel.appendChild(el("p", "", "Your practice begins " + formatDate(cycle.start) + "."));
        return panel;
    }
    if (!number) {
        panel.appendChild(el("p", "", "This cycle has finished. You can start another from the practice page."));
        return panel;
    }
    panel.appendChild(el("p", "", "Day " + number + " of 52 · " + formatDate(today)));
    var button = el("button", "solid", cycle.draws[today] ? "Update today" : "Record for today");
    button.type = "button";
    button.addEventListener("click", function () {
        recordDraw(card, today);
        var y = window.scrollY;
        renderOracle();
        window.scrollTo(0, y);
    });
    panel.appendChild(button);
    return panel;
}

function statusFor(date) {
    var cycle = activeCycle();
    var today = localToday();
    var draw = cycle && cycle.draws[date];
    if (draw && draw.card_code) return "Recorded";
    if (date === today) return "Current day";
    if (date > today) return "Upcoming";
    return "Not recorded";
}

function renderGallery() {
    var suit = document.getElementById("gallerySuit").value;
    var rank = document.getElementById("galleryRank").value;
    var query = document.getElementById("gallerySearch").value.trim().toLowerCase();
    var exclusive = document.getElementById("galleryExclusive").checked;
    var grid = document.getElementById("galleryGrid");
    grid.replaceChildren();
    var count = 0;
    ORACLE_2026.forEach(function (oracle) {
        var card = getCard(oracle.card_code);
        if (suit && card.suit !== suit) return;
        if (rank && card.rank !== rank) return;
        if (exclusive && !oracle.is_code_red_exclusive) return;
        if (query && card.artist.artist_name.toLowerCase().indexOf(query) === -1) return;
        count += 1;
        var tile = el("button", "tile");
        tile.type = "button";
        tile.appendChild(plateNode(card, false));
        var caption = el("div", "tile-caption");
        caption.appendChild(el("strong", "", card.label));
        caption.appendChild(el("div", "", card.artist.artist_name));
        if (oracle.is_code_red_exclusive) caption.appendChild(el("div", "exclusive", "Code:RED exclusive"));
        tile.appendChild(caption);
        tile.addEventListener("click", function () {
            setCard(card.code, { reveal: true });
            location.hash = "oracle";
        });
        grid.appendChild(tile);
    });
    document.getElementById("galleryEmpty").hidden = count !== 0;
    renderBeyond();
}

function renderBeyond() {
    var mount = document.getElementById("beyond");
    mount.replaceChildren();
    mount.appendChild(el("h2", "", "Beyond the fifty-two"));
    mount.appendChild(el("p", "", "Jokers and packaging sit outside the 52 practice days. Jade Suayan made both the box and the card back."));
    ARTISTS_2026.filter(function (artist) { return artist.role === "beyond"; }).forEach(function (artist) {
        var block = el("section", "artist-spot");
        var heading = el("h3", "", artist.artist_name);
        block.appendChild(heading);
        if (artist.social_url) block.appendChild(socialAnchor(artist.social_url));
        var grid = el("div", "gallery beyond-grid");
        ASSETS_2026.filter(function (asset) { return asset.artist_id === artist.artist_id; }).forEach(function (asset) {
            var tile = el("article", "tile");
            var frame = el("div", "art-frame");
            if (canShowImage(asset)) {
                var image = document.createElement("img");
                image.className = "art-image";
                image.src = asset.image_url;
                image.alt = asset.image_alt;
                image.loading = "lazy";
                image.addEventListener("error", function () {
                    frame.replaceChildren(el("p", "withheld", "Image unavailable"));
                });
                frame.appendChild(image);
            } else frame.appendChild(el("p", "withheld", "Image unavailable"));
            tile.appendChild(frame);
            var caption = el("div", "tile-caption");
            caption.appendChild(el("strong", "", asset.image_asset_type === "box" ? "Box" : asset.image_asset_type === "card-back" ? "Card back" : "Joker"));
            tile.appendChild(caption);
            grid.appendChild(tile);
        });
        block.appendChild(grid);
        mount.appendChild(block);
    });
}

function renderPractice() {
    var mount = document.getElementById("practiceMount");
    mount.replaceChildren();
    var today = localToday();
    var cycle = activeCycle();
    var banner = el("div", "panel");
    if (!cycle) {
        banner.appendChild(el("h2", "", "Begin your IX:52"));
        banner.appendChild(el("p", "", "The deck is open now. Recording starts on the day you choose."));
        var todayButton = el("button", "solid", "Start today");
        todayButton.type = "button";
        todayButton.addEventListener("click", function () {
            startCycle(localToday());
            renderPractice();
        });
        banner.appendChild(todayButton);
        var dateField = document.createElement("input");
        dateField.type = "date";
        dateField.value = localToday();
        dateField.setAttribute("aria-label", "Practice start date");
        banner.appendChild(dateField);
        var choose = el("button", "ghost", "Choose this date");
        choose.type = "button";
        choose.addEventListener("click", function () {
            if (!dateField.value) return;
            startCycle(dateField.value);
            renderPractice();
        });
        banner.appendChild(choose);
        mount.appendChild(banner);
    } else {
        var number = dayNumber(today);
        var recordedCount = Object.keys(cycle.draws).filter(function (date) {
            return cycle.draws[date].card_code;
        }).length;
        var summary = el("p", "progress");
        if (today < cycle.start) summary.textContent = "Begins " + formatDate(cycle.start) + ".";
        else if (number) summary.textContent = "Day " + number + " of 52 · " + recordedCount + (recordedCount === 1 ? " draw recorded" : " draws recorded") + " · Next: Day " + Math.min(number + 1, 52);
        else summary.textContent = "Day 52 was " + formatDate(addDays(cycle.start, 51)) + ". " + recordedCount + " draws recorded.";
        banner.appendChild(summary);
        if (state.cardCode) {
            var openCard = getCard(state.cardCode);
            var jump = el("a", "", "Continue with " + openCard.label);
            jump.href = "#oracle";
            banner.appendChild(jump);
        }
        banner.appendChild(capacityControl());
        mount.appendChild(banner);

        mount.appendChild(el("h2", "", "Fifty-two days"));
        var calendar = el("div", "calendar");
        for (var index = 0; index < 52; index += 1) {
            var date = addDays(cycle.start, index);
            var cell = el("button", "day");
            cell.type = "button";
            cell.appendChild(el("strong", "", String(index + 1)));
            cell.setAttribute("aria-label", "Day " + (index + 1) + ", " + formatDate(date) + ", " + statusFor(date));
            if (cycle.draws[date] && cycle.draws[date].card_code) cell.classList.add("is-recorded");
            if (date === today) cell.classList.add("is-today");
            if (date > today) cell.classList.add("is-upcoming");
            cell.addEventListener("click", function (chosen) {
                return function () { showPracticeDay(chosen); };
            }(date));
            calendar.appendChild(cell);
        }
        mount.appendChild(calendar);
        var detail = el("div", "panel");
        detail.id = "practiceDetail";
        mount.appendChild(detail);
        if (state.practiceDate) showPracticeDay(state.practiceDate);
        banner.appendChild(el("p", "fine", "Optional epilogue: " + formatDate(addDays(cycle.start, 52)) + "."));

        var settings = el("div", "panel");
        settings.appendChild(el("h2", "", "Practice dates"));
        settings.appendChild(el("p", "", "Started " + formatDate(cycle.start) + ". A new start keeps this cycle and opens another."));
        var nextDate = document.createElement("input");
        nextDate.type = "date";
        nextDate.value = cycle.start;
        nextDate.setAttribute("aria-label", "New start date");
        settings.appendChild(nextDate);
        var change = el("button", "ghost", "Start another cycle");
        change.type = "button";
        change.addEventListener("click", function () {
            if (!nextDate.value) return;
            var hasDraws = Object.keys(cycle.draws).some(function (date) { return cycle.draws[date].card_code; });
            if (hasDraws && !window.confirm("Keep this cycle and start a new one on " + formatDate(nextDate.value) + "? Saved draws stay in the previous cycle.")) return;
            if (!hasDraws) {
                cycle.start = nextDate.value;
                saveStore();
            } else startCycle(nextDate.value);
            state.practiceDate = "";
            renderPractice();
        });
        settings.appendChild(change);
        mount.appendChild(settings);
    }

    var privacy = el("div", "panel");
    privacy.appendChild(el("h2", "", "On this device"));
    privacy.appendChild(el("p", "", "Draws and notes stay in this browser. Export keeps a file. Delete removes the saved cycles from this device."));
    var row = el("div", "actions");
    var exportButton = el("button", "ghost", "Export");
    exportButton.type = "button";
    exportButton.addEventListener("click", exportData);
    var deleteButton = el("button", "ghost", "Delete saved practice");
    deleteButton.type = "button";
    deleteButton.addEventListener("click", function () {
        if (!window.confirm("Delete saved cycles and notes from this browser?")) return;
        localStorage.removeItem(STORE_KEY);
        store = { version: 2, notes: {}, cycles: {}, theme: store.theme, capacity: store.capacity };
        state.sessionNote = "";
        state.practiceDate = "";
        saveStore();
        toast("Deleted");
        renderPractice();
    });
    row.appendChild(exportButton);
    row.appendChild(deleteButton);
    privacy.appendChild(row);
    mount.appendChild(privacy);
}

function showPracticeDay(date) {
    state.practiceDate = date;
    var detail = document.getElementById("practiceDetail");
    if (!detail) return;
    var cycle = activeCycle();
    detail.replaceChildren();
    var number = practiceDayNumber(cycle.start, date);
    detail.appendChild(el("h3", "", "Day " + number + " · " + formatDate(date)));
    detail.appendChild(el("p", "", statusFor(date)));
    var draw = cycle.draws[date];
    if (draw && draw.card_code && getCard(draw.card_code)) {
        var recorded = getCard(draw.card_code);
        detail.appendChild(el("p", "", recorded.label + " · " + recorded.artist.artist_name + " · " + recorded.oracle.daily_verb));
    }
    if (date <= localToday() && state.cardCode) {
        var card = getCard(state.cardCode);
        var button = el("button", "solid", "Record " + card.label + " for this day");
        button.type = "button";
        button.addEventListener("click", function () {
            recordDraw(card, date);
            renderPractice();
            showPracticeDay(date);
        });
        detail.appendChild(button);
    }
}

function exportData() {
    var blob = new Blob([JSON.stringify(store, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = el("a", "", "");
    link.href = url;
    link.download = "ix52-2026-practice.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function applyTheme(theme) {
    var next = theme === "dark" ? "dark" : "light";
    document.body.setAttribute("data-theme", next);
    document.getElementById("themeLight").setAttribute("aria-pressed", next === "light" ? "true" : "false");
    document.getElementById("themeDark").setAttribute("aria-pressed", next === "dark" ? "true" : "false");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "dark" ? "#121110" : "#F5F2EB");
    store.theme = next;
}

function init() {
    applyDeck();
    state.capacity = store.capacity || "ordinary";
    state.saveLocal = Boolean(store.saveLocal);
    applyTheme(store.theme || "light");
    buildChoices();
    var requested = new URLSearchParams(location.search).get("card");
    if (requested) setCard(requested, { focus: false });
    else renderOracle();
    showView(currentView());
    document.getElementById("randomBtn").addEventListener("click", function () {
        var index = Math.floor(Math.random() * ORACLE_2026.length);
        setCard(ORACLE_2026[index].card_code, { reveal: true });
    });
    document.getElementById("clearBtn").addEventListener("click", clearCard);
    document.getElementById("navToggle").addEventListener("click", function () {
        var nav = document.getElementById("siteNav");
        var open = !nav.classList.contains("is-open");
        nav.classList.toggle("is-open", open);
        this.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll("[data-theme-choice]").forEach(function (button) {
        button.addEventListener("click", function () {
            applyTheme(button.getAttribute("data-theme-choice"));
            saveStore();
        });
    });
    ["gallerySearch", "gallerySuit", "galleryRank", "galleryExclusive"].forEach(function (id) {
        document.getElementById(id).addEventListener("input", renderGallery);
        document.getElementById(id).addEventListener("change", renderGallery);
    });
    document.getElementById("viewerClose").addEventListener("click", function () {
        var dialog = document.getElementById("viewer");
        if (typeof dialog.close === "function" && dialog.open) dialog.close();
        else dialog.hidden = true;
        if (state.viewerReturn && state.viewerReturn.focus) state.viewerReturn.focus();
    });
    var filterToggle = document.getElementById("filterToggle");
    if (filterToggle) {
        filterToggle.addEventListener("click", function () {
            var more = document.getElementById("filterMore");
            var open = !more.classList.contains("is-open");
            more.classList.toggle("is-open", open);
            filterToggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }
    var navClose = document.getElementById("navClose");
    if (navClose) {
        navClose.addEventListener("click", function () {
            document.getElementById("siteNav").classList.remove("is-open");
            document.getElementById("navToggle").setAttribute("aria-expanded", "false");
            document.getElementById("navToggle").focus();
        });
    }
    window.addEventListener("hashchange", function () { showView(currentView()); });
}

init();
