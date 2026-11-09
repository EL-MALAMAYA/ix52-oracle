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
        parsed.draws = parsed.draws || {};
        parsed.notes = parsed.notes || {};
        return parsed;
    } catch (error) {
        return { draws: {}, notes: {} };
    }
}

function saveStore() {
    try {
        localStorage.setItem(STORE_KEY, JSON.stringify(store));
    } catch (error) {
        /* Private browsing can block storage. The reading still works. */
    }
}

function manilaToday() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());
}

function addDays(iso, amount) {
    var parts = iso.split("-").map(Number);
    var date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + amount));
    return date.toISOString().slice(0, 10);
}

function dayNumber(iso) {
    var start = Date.parse(EDITION_2026.window_start + "T00:00:00Z");
    var current = Date.parse(iso + "T00:00:00Z");
    var diff = Math.round((current - start) / 86400000) + 1;
    if (diff < 1 || diff > 52) return null;
    return diff;
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
    return Boolean(asset && asset.display_permitted === true && asset.image_rights_status === "licensed");
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
    state.sessionNote = store.saveLocal && store.notes[code] ? store.notes[code] : "";
    syncChoiceButtons();
    var url = new URL(location.href);
    url.searchParams.set("card", code);
    if (!url.hash) url.hash = "oracle";
    history.replaceState(null, "", url);
    renderOracle();
    announce(card.label + ". Artwork by " + card.artist.artist_name + ". Verb " + card.oracle.daily_verb + ".");
    if (options.focus) {
        var title = document.getElementById("cardTitle");
        if (title) title.focus();
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

function trySelection(focus) {
    if (!state.suit || !state.rank) {
        renderOracle();
        return;
    }
    setCard(codeFor(state.suit, state.rank), { focus: focus });
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
            trySelection(true);
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
            trySelection(true);
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
    var asset = card.asset;
    if (canShowImage(asset)) {
        var image = document.createElement("img");
        image.className = "art-image";
        image.src = asset.image_url;
        image.alt = asset.image_alt;
        image.width = asset.image_width;
        image.height = asset.image_height;
        if (!interactive) image.loading = "lazy";
        return image;
    }
    var plate = el("div", "plate");
    var top = el("div");
    top.appendChild(el("div", "plate-rank", RANK_LABELS_2026[card.rank]));
    top.appendChild(el("p", "plate-suit", card.suit + " " + card.suitMeta.symbol));
    plate.appendChild(top);
    var bottom = el("div");
    bottom.appendChild(el("p", "meta", "Artwork not shown"));
    bottom.appendChild(el("p", "withheld", "The illustration by " + card.artist.artist_name + " is not reproduced on this site."));
    plate.appendChild(bottom);
    return plate;
}

function openViewer(card) {
    var body = document.getElementById("viewerBody");
    body.replaceChildren();
    body.appendChild(plateNode(card, true));
    var caption = el("p", "", card.label + ". Artwork by " + card.artist.artist_name + ".");
    body.appendChild(caption);
    if (!canShowImage(card.asset)) {
        body.appendChild(el("p", "fine", "Enlarging this frame does not reveal the artwork. See the official deck page to view the published gallery."));
    }
    var link = el("a", "", "Official deck page");
    link.href = EDITION_2026.deck_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    body.appendChild(link);
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
    var today = manilaToday();
    var draw = store.draws[today];
    var lines = [];
    if (draw && draw.card_code === card.code && dayNumber(today)) {
        var number = String(dayNumber(today)).padStart(2, "0");
        lines.push("IX:52 / Day " + number);
    } else {
        lines.push("IX:52");
    }
    lines.push(card.label + " — " + card.oracle.daily_verb.toUpperCase());
    lines.push("");
    lines.push("Artwork by " + card.artist.artist_name);
    if (card.artist.social_verification_status === "verified" && card.artist.social_url) {
        lines.push(card.artist.social_url);
    } else {
        lines.push("Social profile not confirmed.");
        lines.push("Deck source: " + EDITION_2026.deck_url);
    }
    lines.push("From Bicycle Sari-Sari Code:RED by RunIt Decks");
    lines.push("");
    lines.push("Today's reflection: [your own words]");
    lines.push("");
    lines.push("#IX52 #Verbesque #CodeRED");
    lines.push("");
    lines.push("IX:52 interpretation by Maiba Studio. The credited artist made the card artwork, not this reading.");
    return lines.join("\n");
}

function otherDays(code, exceptDate) {
    return Object.keys(store.draws).filter(function (date) {
        return store.draws[date].card_code === code && date !== exceptDate;
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
    var left = el("div");
    var opener = el("button", "plate-button");
    opener.type = "button";
    opener.appendChild(plateNode(card, true));
    opener.setAttribute("aria-label", "Enlarge the card frame for " + card.label);
    opener.addEventListener("click", function () { openViewer(card); });
    left.appendChild(opener);
    var credit = el("div", "credit");
    var name = el("h2", "", card.label);
    name.id = "cardTitle";
    name.tabIndex = -1;
    credit.appendChild(name);
    credit.appendChild(el("p", "meta", "Artwork by"));
    credit.appendChild(el("p", "artist-name", card.artist.artist_name));
    if (card.artist.social_verification_status === "verified" && card.artist.social_url) {
        var social = el("a", "", "Instagram");
        social.href = card.artist.social_url;
        social.target = "_blank";
        social.rel = "noopener noreferrer";
        credit.appendChild(social);
    } else {
        credit.appendChild(el("p", "", "Social profile not confirmed."));
        var source = el("a", "", "Official deck page");
        source.href = card.artist.artist_page_url;
        source.target = "_blank";
        source.rel = "noopener noreferrer";
        credit.appendChild(source);
    }
    credit.appendChild(el("p", "fine", "Part of Bicycle Sari-Sari Code:RED by RunIt Decks"));
    if (card.oracle.is_code_red_exclusive) {
        var badge = el("p", "exclusive", "Code:RED exclusive");
        credit.appendChild(badge);
        if (card.oracle.exclusive_title) {
            credit.appendChild(el("p", "", "Edition title: " + card.oracle.exclusive_title));
        }
    }
    if (card.artist.name_note) credit.appendChild(el("p", "fine", card.artist.name_note));
    left.appendChild(credit);
    layout.appendChild(left);

    var right = el("div");
    right.appendChild(el("p", "meta", card.suitMeta.element + " · " + card.suitMeta.domain));
    right.appendChild(el("p", "verb", card.oracle.daily_verb));
    right.appendChild(el("p", "", card.archetype));

    var steps = el("div", "steps");
    steps.setAttribute("role", "tablist");
    steps.setAttribute("aria-label", "Fivefold practice");
    PRACTICE_STEPS_2026.forEach(function (step) {
        var button = el("button", "step", step.label);
        button.type = "button";
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", state.step === step.id ? "true" : "false");
        button.addEventListener("click", function () {
            state.step = step.id;
            renderOracle();
            var selected = document.querySelector('.step[aria-selected="true"]');
            if (selected) selected.focus();
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
    share.appendChild(el("p", "", "A caption you can copy. Your private note is not included. No image is exported, because the artwork’s reproduction rights are unconfirmed."));
    var preview = el("pre", "note");
    preview.textContent = shareCaption(card);
    share.appendChild(preview);
    var copyShare = el("button", "solid", "Copy caption");
    copyShare.type = "button";
    copyShare.addEventListener("click", function () { copyText(shareCaption(card)); });
    share.appendChild(copyShare);
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
        wrap.appendChild(el("p", "", card.suitMeta.element + " is this suit’s traditional element. It is a prompt for attention, not a claim about the picture."));
    }
    if (step === "choose") {
        wrap.appendChild(el("p", "", oracle.intention_cue));
        wrap.appendChild(el("p", "fine", "The verb is an IX:52 interpretation. It is not a message from " + card.artist.artist_name + "."));
    }
    if (step === "enact") {
        if (state.capacity === "recovery") {
            wrap.appendChild(el("p", "callout", "Rest may be the action. You do not have to perform the suggestion below."));
        }
        wrap.appendChild(el("p", "", oracle.oracle_text));
        wrap.appendChild(el("h3", "", "Intention"));
        wrap.appendChild(el("p", "", oracle.incantation));
        var pair = actionPair(card);
        wrap.appendChild(el("h3", "", pair.primaryLabel));
        wrap.appendChild(el("p", "", pair.primary));
        wrap.appendChild(el("h3", "", pair.secondaryLabel));
        wrap.appendChild(el("p", "", pair.secondary));
        wrap.appendChild(el("p", "fine", "Neither action ranks your worth. You can skip both."));
        var actions = el("div", "actions");
        actions.appendChild(copyButton("Copy intention", oracle.incantation));
        actions.appendChild(copyButton("Copy action", pair.primary));
        wrap.appendChild(actions);
    }
    if (step === "restore") {
        wrap.appendChild(el("p", "", oracle.restoration_cue));
        wrap.appendChild(el("p", "", oracle.capacity_note));
        wrap.appendChild(capacityControl());
        var details = el("details");
        var summary = el("summary", "", "Optional bipolar-aware note");
        details.appendChild(summary);
        details.appendChild(el("p", "", "This is not a diagnosis or a treatment plan. If you live with bipolar disorder, follow the care plan you already made with a clinician. Do not treat extra output, a color, or a card as evidence of an episode. Protect sleep. If warning signs show up, contact the person or clinician you already trust."));
        wrap.appendChild(details);
    }
    if (step === "renew") {
        wrap.appendChild(el("p", "", oracle.journal_prompt));
        wrap.appendChild(el("p", "", "What happened? What did I learn? What should I protect or change next?"));
        var field = document.createElement("textarea");
        field.value = state.sessionNote;
        field.setAttribute("aria-label", "Private note");
        field.placeholder = "Optional. This note is private.";
        field.addEventListener("input", function () {
            state.sessionNote = field.value;
            if (store.saveLocal) {
                store.notes[card.code] = field.value;
                saveStore();
            }
        });
        wrap.appendChild(field);
        var saveLabel = el("label", "");
        var saveBox = document.createElement("input");
        saveBox.type = "checkbox";
        saveBox.checked = Boolean(store.saveLocal);
        saveBox.addEventListener("change", function () {
            store.saveLocal = saveBox.checked;
            state.saveLocal = saveBox.checked;
            if (saveBox.checked) store.notes[card.code] = state.sessionNote;
            saveStore();
        });
        saveLabel.appendChild(saveBox);
        saveLabel.appendChild(document.createTextNode(" Save this note on this device only"));
        wrap.appendChild(saveLabel);
        wrap.appendChild(el("p", "fine", "Notes stay in this browser. They are not added to Share the Day, and they are not sent to Maiba Studio."));
        var close = el("button", "solid", "Close today’s practice");
        close.type = "button";
        close.addEventListener("click", function () {
            var today = manilaToday();
            state.closedReading = true;
            if (store.draws[today] && store.draws[today].card_code) {
                store.draws[today].closed = true;
                if (store.saveLocal && state.sessionNote) store.notes[card.code] = state.sessionNote;
                saveStore();
            }
            toast("Closed when you decided to close it");
            renderOracle();
        });
        wrap.appendChild(close);
        wrap.appendChild(el("p", "", state.closedReading
            ? "You have closed this reading. You can still open it again."
            : "Today’s practice is complete when you decide to close it."));
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
            state.capacity = mode.id;
            store.capacity = mode.id;
            saveStore();
            renderOracle();
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

function recordPanel(card) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Record this draw"));
    var today = manilaToday();
    var number = dayNumber(today);
    if (!number) {
        panel.appendChild(el("p", "", "Today, " + formatDate(today) + ", is outside the 52-day window. You can still read the card. Recording opens on " + formatDate(EDITION_2026.window_start) + "."));
        return panel;
    }
    panel.appendChild(el("p", "", "Practice day " + number + " · " + formatDate(today) + ", Asia/Manila."));
    var clashes = otherDays(card.code, today);
    if (clashes.length) {
        panel.appendChild(el("p", "warning", "This card is already recorded for " + clashes.map(formatDate).join(", ") + ". You can still correct today’s record. Nothing here is marked as missed or failed."));
    }
    var button = el("button", "solid", "Record for today");
    button.type = "button";
    button.addEventListener("click", function () {
        store.draws[today] = {
            card_code: card.code,
            capacity: state.capacity,
            closed: store.draws[today] ? Boolean(store.draws[today].closed) : false
        };
        saveStore();
        toast("Recorded");
        renderOracle();
    });
    panel.appendChild(button);
    panel.appendChild(el("p", "fine", "The app does not claim you physically drew a card unless you record it."));
    return panel;
}

function statusFor(date) {
    var draw = store.draws[date];
    if (!draw || !draw.card_code) return "Not recorded";
    if (draw.capacity === "recovery") return "In recovery";
    if (draw.closed) return "Completed reflection";
    var number = dayNumber(date);
    if (number && number > 1 && !(store.draws[addDays(date, -1)] && store.draws[addDays(date, -1)].card_code)) return "Returned";
    return "Recorded";
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
            setCard(card.code, { focus: true });
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
    mount.appendChild(el("h2", "", "Beyond the Fifty-Two"));
    mount.appendChild(el("p", "", "These contributors are part of the deck and are not counted as the fifty-two practice days."));
    var grid = el("div", "gallery");
    ARTISTS_2026.filter(function (artist) { return artist.role === "beyond"; }).forEach(function (artist) {
        var assets = ASSETS_2026.filter(function (asset) { return asset.artist_id === artist.artist_id; });
        assets.forEach(function (asset) {
            var tile = el("article", "tile");
            var plate = el("div", "plate");
            plate.appendChild(el("p", "meta", asset.image_asset_type.replace("-", " ")));
            plate.appendChild(el("p", "withheld", "Artwork not reproduced."));
            tile.appendChild(plate);
            var caption = el("div", "tile-caption");
            caption.appendChild(el("strong", "", artist.artist_name));
            caption.appendChild(el("div", "", artist.contribution));
            if (artist.social_url) {
                var link = el("a", "", "Instagram");
                link.href = artist.social_url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                caption.appendChild(link);
            }
            tile.appendChild(caption);
            grid.appendChild(tile);
        });
    });
    mount.appendChild(grid);
    var producer = el("p", "");
    producer.appendChild(document.createTextNode("Produced by "));
    var link = el("a", "", "RunIt Decks");
    link.href = EDITION_2026.deck_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    producer.appendChild(link);
    producer.appendChild(document.createTextNode(". Photography and styling of the commercial deck are credited by RunIt to Kandou."));
    mount.appendChild(producer);
}

function renderPractice() {
    var mount = document.getElementById("practiceMount");
    mount.replaceChildren();
    var today = manilaToday();
    var number = dayNumber(today);
    var banner = el("div", "panel");
    if (number) banner.appendChild(el("p", "", "Today is practice day " + number + ", " + formatDate(today) + "."));
    else if (today < EDITION_2026.window_start) banner.appendChild(el("p", "", "The window opens " + formatDate(EDITION_2026.window_start) + ". You can explore the deck before then."));
    else if (today === EDITION_2026.epilogue) banner.appendChild(el("p", "", "8 January 2027 is an optional epilogue. It is not a fifty-third card."));
    else banner.appendChild(el("p", "", "The fifty-two days have passed. You can still return to any card."));
    if (state.cardCode) {
        var card = getCard(state.cardCode);
        var jump = el("a", "", "Continue with " + card.label);
        jump.href = "#oracle";
        banner.appendChild(jump);
        banner.appendChild(el("p", "", "Today’s verb, if you keep this card: " + card.oracle.daily_verb + "."));
    } else {
        banner.appendChild(el("p", "", "Choose a card from the oracle when you have drawn one."));
    }
    banner.appendChild(capacityControl());
    mount.appendChild(banner);

    mount.appendChild(el("h2", "", "Fifty-two days"));
    var calendar = el("div", "calendar");
    for (var index = 0; index < 52; index += 1) {
        var date = addDays(EDITION_2026.window_start, index);
        var draw = store.draws[date];
        var cell = el("div", "day");
        cell.appendChild(el("strong", "", "Day " + (index + 1)));
        cell.appendChild(el("span", "", formatDate(date)));
        cell.appendChild(el("div", "", statusFor(date)));
        if (draw && draw.card_code && getCard(draw.card_code)) {
            var recorded = getCard(draw.card_code);
            cell.appendChild(el("div", "", recorded.label));
            cell.appendChild(el("div", "", recorded.artist.artist_name + " · " + recorded.oracle.daily_verb));
        }
        calendar.appendChild(cell);
    }
    mount.appendChild(calendar);
    var epilogue = el("p", "fine", formatDate(EDITION_2026.epilogue) + " — optional integration. Not a standard card.");
    mount.appendChild(epilogue);

    mount.appendChild(el("h2", "", "History"));
    var list = el("ul", "history");
    var dates = Object.keys(store.draws).filter(function (date) {
        return store.draws[date].card_code;
    }).sort();
    if (!dates.length) list.appendChild(el("li", "", "Nothing is recorded yet."));
    dates.forEach(function (date) {
        var draw = store.draws[date];
        var card = getCard(draw.card_code);
        if (!card) return;
        var item = el("li");
        var noteMark = store.notes[card.code] ? " · note kept on this device" : "";
        item.textContent = formatDate(date) + " · Day " + (dayNumber(date) || "—") + " · " + card.label + " · " + card.artist.artist_name + " · " + card.oracle.daily_verb + " · " + statusFor(date) + noteMark;
        list.appendChild(item);
    });
    mount.appendChild(list);

    var privacy = el("div", "panel");
    privacy.appendChild(el("h2", "", "Privacy"));
    privacy.appendChild(el("p", "", "Draws and notes are stored in this browser only. They are not included in Share the Day. Export makes a file you keep. Delete removes them from this device."));
    var row = el("div", "actions");
    var exportButton = el("button", "ghost", "Export");
    exportButton.type = "button";
    exportButton.addEventListener("click", exportData);
    var deleteButton = el("button", "ghost", "Delete saved practice");
    deleteButton.type = "button";
    deleteButton.addEventListener("click", function () {
        if (!window.confirm("Delete saved draws and notes from this browser?")) return;
        localStorage.removeItem(STORE_KEY);
        store = { draws: {}, notes: {} };
        state.sessionNote = "";
        toast("Deleted");
        renderPractice();
    });
    row.appendChild(exportButton);
    row.appendChild(deleteButton);
    privacy.appendChild(row);
    mount.appendChild(privacy);
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

function init() {
    state.capacity = store.capacity || "ordinary";
    state.lowStim = Boolean(store.lowStim);
    state.saveLocal = Boolean(store.saveLocal);
    document.body.classList.toggle("quiet", state.lowStim);
    document.getElementById("lowStimToggle").setAttribute("aria-pressed", state.lowStim ? "true" : "false");
    document.getElementById("lowStimToggle").textContent = state.lowStim ? "Quiet view on" : "Quiet view";
    buildChoices();
    var requested = new URLSearchParams(location.search).get("card");
    if (requested) setCard(requested, { focus: false });
    else renderOracle();
    showView(currentView());
    document.getElementById("randomBtn").addEventListener("click", function () {
        var index = Math.floor(Math.random() * ORACLE_2026.length);
        setCard(ORACLE_2026[index].card_code, { focus: true });
    });
    document.getElementById("clearBtn").addEventListener("click", clearCard);
    document.getElementById("navToggle").addEventListener("click", function () {
        var nav = document.getElementById("siteNav");
        var open = !nav.classList.contains("is-open");
        nav.classList.toggle("is-open", open);
        this.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.getElementById("lowStimToggle").addEventListener("click", function () {
        state.lowStim = !state.lowStim;
        store.lowStim = state.lowStim;
        saveStore();
        document.body.classList.toggle("quiet", state.lowStim);
        this.setAttribute("aria-pressed", state.lowStim ? "true" : "false");
        this.textContent = state.lowStim ? "Quiet view on" : "Quiet view";
    });
    ["gallerySearch", "gallerySuit", "galleryRank", "galleryExclusive"].forEach(function (id) {
        document.getElementById(id).addEventListener("input", renderGallery);
        document.getElementById(id).addEventListener("change", renderGallery);
    });
    document.getElementById("viewerClose").addEventListener("click", function () {
        var dialog = document.getElementById("viewer");
        if (typeof dialog.close === "function" && dialog.open) dialog.close();
        else dialog.hidden = true;
    });
    window.addEventListener("hashchange", function () { showView(currentView()); });
}

init();
