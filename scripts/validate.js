"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var root = path.join(__dirname, "..");
var failures = [];
var unresolved = [];

function fail(message) {
    failures.push(message);
}

function load(relative, names) {
    var code = fs.readFileSync(path.join(root, relative), "utf8");
    var context = {};
    vm.createContext(context);
    vm.runInContext(code + "\n" + names.map(function (name) {
        return "globalThis." + name + " = " + name + ";";
    }).join("\n"), context);
    return context;
}

function normalize(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

var meta = load("data/editions/2026/meta.js", ["EDITION_2026", "SUITS_2026", "RANK_ORDER_2026"]);
var artistsFile = load("data/editions/2026/artists.js", ["ARTISTS_2026"]);
var assetsFile = load("data/editions/2026/assets.js", ["ASSETS_2026", "IMAGE_POLICY_2026"]);
var oracleFile = load("data/editions/2026/oracle.js", ["ORACLE_2026"]);
var archive = load("data.js", ["ORACLE_CARDS"]);

var oracle = oracleFile.ORACLE_2026;
var artists = artistsFile.ARTISTS_2026;
var assets = assetsFile.ASSETS_2026;
var suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
var ranks = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];
var required = [
    "daily_verb", "oracle_text", "intention_cue", "incantation", "micro_action",
    "low_capacity_alternative", "journal_prompt", "restoration_cue", "artist_observation_prompt",
    "word_of_the_day", "word_meaning", "learning_note", "learning_source", "learning_source_name",
    "capacity_note"
];

var expected = {
    hearts_ace: ["Pollyanna", "Receive", false],
    hearts_2: ["Crazy Vanny", "Accompany", false],
    hearts_3: ["Isad Diwa", "Validate", false],
    hearts_4: ["Dan Fajardo", "Shelter", false],
    hearts_5: ["Drin", "Disarm", false],
    hearts_6: ["Tyang Karyel", "Reassure", false],
    hearts_7: ["Seeweirdo", "Belong", true],
    hearts_8: ["Raki", "Celebrate", false],
    hearts_9: ["Mark Weigh", "Confide", false],
    hearts_10: ["Kookoo", "Forgive", false],
    hearts_jack: ["Bitto", "Welcome", false],
    hearts_queen: ["Jill Arteche", "Nurture", false],
    hearts_king: ["Wetworks", "Cherish", true],
    diamonds_ace: ["Kim Borja", "Inventory", false],
    diamonds_2: ["Arvy Trinidad", "Balance", false],
    diamonds_3: ["Gemart Ortega", "Assemble", false],
    diamonds_4: ["Marilou Solano", "Maintain", false],
    diamonds_5: ["Gabo Corpuz", "Simplify", false],
    diamonds_6: ["Lean Reboja", "Exchange", false],
    diamonds_7: ["JP Pining", "Prune", false],
    diamonds_8: ["Blic", "Practice", false],
    diamonds_9: ["Wham", "Provision", false],
    diamonds_10: ["Anika Marie Loquite", "Document", false],
    diamonds_jack: ["Kapitan", "Measure", false],
    diamonds_queen: ["Nicolo Nimor", "Cultivate", true],
    diamonds_king: ["Lei Melendres", "Steward", false],
    clubs_ace: ["Alldefs", "Prototype", false],
    clubs_2: ["Selah Viee", "Select", false],
    clubs_3: ["Kempis Ang", "Collaborate", false],
    clubs_4: ["Rups Kiddo", "Frame", false],
    clubs_5: ["Peter Apuyan", "Play", false],
    clubs_6: ["Russel Rust", "Amplify", false],
    clubs_7: ["Chase", "Persist", false],
    clubs_8: ["Ivnarts", "Iterate", false],
    clubs_9: ["Mimaaaaaaaaw", "Edit", false],
    clubs_10: ["Mustache Boii", "Integrate", false],
    clubs_jack: ["Jethro Olba", "Announce", false],
    clubs_queen: ["Mall", "Mentor", true],
    clubs_king: ["Mr. S", "Release", false],
    spades_ace: ["JJ Zamoranos", "Observe", false],
    spades_2: ["Eman Alconera", "Distinguish", false],
    spades_3: ["Jannleen", "Question", false],
    spades_4: ["John Loyd Benz De Leon", "Filter", false],
    spades_5: ["Kino", "Reconsider", false],
    spades_6: ["Curse/Gift", "Decant", false],
    spades_7: ["Jay Francisco", "Prioritize", false],
    spades_8: ["Garapata", "Constrain", false],
    spades_9: ["Cabnov", "Name", false],
    spades_10: ["Barc", "Conclude", false],
    spades_jack: ["Jappy Agoncillo", "Investigate", true],
    spades_queen: ["Raisehell", "Clarify", false],
    spades_king: ["Raco Ruiz", "Decide", false]
};

if (oracle.length !== 52) fail("Expected 52 oracle cards, found " + oracle.length);
if (archive.ORACLE_CARDS.length !== 52) fail("2025 archive does not contain 52 cards.");

var codes = {};
oracle.forEach(function (card) {
    if (codes[card.card_code]) fail("Duplicate card_code " + card.card_code);
    codes[card.card_code] = true;
    required.forEach(function (field) {
        if (!card[field] || !String(card[field]).trim()) fail(card.card_code + " missing " + field);
    });
    if (!/^https:\/\/[^\s]+$/.test(card.learning_source)) fail(card.card_code + " has a bad learning source");
});

suits.forEach(function (suit) {
    ranks.forEach(function (rank) {
        var rankKey = { Ace: "ace", Jack: "jack", Queen: "queen", King: "king" }[rank] || rank;
        var code = suit.toLowerCase() + "_" + rankKey;
        if (!codes[code]) fail("Missing " + code);
    });
});

Object.keys(expected).forEach(function (code) {
    var card = oracle.filter(function (item) { return item.card_code === code; })[0];
    var artist = artists.filter(function (item) { return item.card_code === code; })[0];
    var asset = assets.filter(function (item) { return item.card_code === code; })[0];
    var spec = expected[code];
    if (!card || !artist || !asset) {
        fail(code + " is missing from oracle, artists, or assets");
        return;
    }
    if (artist.artist_name !== spec[0]) fail(code + " artist is " + artist.artist_name + ", expected " + spec[0]);
    if (card.daily_verb !== spec[1]) fail(code + " verb is " + card.daily_verb);
    if (Boolean(card.is_code_red_exclusive) !== spec[2]) fail(code + " exclusive flag mismatch");
    if (Boolean(asset.is_code_red_exclusive) !== spec[2]) fail(code + " asset exclusive flag mismatch");
    if (artist.artist_name.indexOf("Mustache Bpo") !== -1) fail("Typo Mustache Bpo used as display name");
    if (!artist.social_verification_status) fail(code + " missing social status");
    if (artist.social_verification_status === "verified") {
        if (!/^https:\/\/www\.instagram\.com\/[A-Za-z0-9_.]+\/?(?:\?.*)?$/.test(artist.social_url || "")) {
            fail(code + " verified social URL is not a profile link");
        }
    } else if (artist.social_verification_status === "unverified") {
        if (artist.social_url) fail(code + " unverified artist has a social URL");
        unresolved.push(artist.artist_name + " (" + code + "): no social profile on the official gallery");
    } else {
        fail(code + " has unknown social status " + artist.social_verification_status);
    }
    if (asset.image_url.indexOf("DSCF") !== -1 || asset.image_url.indexOf("UNCUT") !== -1) {
        fail(code + " uses a composite product photo");
    }
    if (!/\.(png|jpe?g|webp)(\?|$)/i.test(asset.image_url)) fail(code + " image format unsupported");
    if (asset.image_rights_status !== "licensed") {
        unresolved.push(code + " image rights: " + asset.image_rights_status + " (" + asset.file_name + ")");
    }
    if (asset.display_permitted && asset.image_rights_status !== "licensed") {
        fail(code + " is displayed without a confirmed license");
    }
});

var urls = {};
assets.forEach(function (asset) {
    if (urls[asset.image_url]) fail("Duplicate image URL " + asset.image_url);
    urls[asset.image_url] = true;
});

var words = {};
oracle.forEach(function (card) {
    var word = normalize(card.word_of_the_day);
    if (words[word]) fail("Duplicate 2026 word " + card.word_of_the_day);
    words[word] = true;
});

var oldText = {};
["oracle_text", "quote", "mantra", "tiny_action", "journal_prompt", "body_cue", "verbesque_cue", "trivia", "word_of_the_day"].forEach(function (field) {
    archive.ORACLE_CARDS.forEach(function (card) {
        oldText[normalize(card[field])] = field;
    });
});
oracle.forEach(function (card) {
    required.forEach(function (field) {
        if (oldText[normalize(card[field])]) fail(card.card_code + " " + field + " duplicates 2025 " + oldText[normalize(card[field])]);
    });
    if (oldText[normalize(card.daily_verb)] && oldText[normalize(card.daily_verb)] === "word_of_the_day") {
        fail(card.card_code + " verb duplicates a 2025 word");
    }
});

if (artists.filter(function (artist) { return artist.role !== "beyond"; }).length !== 52) {
    fail("Expected 52 standard artists");
}
["Jade Suayan", "Doktor Karayom", "Omok"].forEach(function (name) {
    if (!artists.some(function (artist) { return artist.artist_name === name && artist.role === "beyond"; })) {
        fail("Missing beyond-the-deck credit " + name);
    }
});

var queen = artists.filter(function (artist) { return artist.card_code === "diamonds_queen"; })[0];
var jack = artists.filter(function (artist) { return artist.card_code === "spades_jack"; })[0];
if (!queen || queen.artist_id === "jade-suayan") fail("Queen of Diamonds must not use Jade Suayan");
if (!jack || jack.artist_id === "nicolo-nimor") fail("Jack of Spades must not use Nicolo Nimor");

var exclusives = oracle.filter(function (card) { return card.is_code_red_exclusive; }).map(function (card) { return card.card_code; }).sort();
var expectedExclusives = ["clubs_queen", "diamonds_queen", "hearts_7", "hearts_king", "spades_jack"];
if (exclusives.join() !== expectedExclusives.join()) fail("Exclusive set mismatch: " + exclusives.join(", "));

["index.html", "app.js", "styles.css"].forEach(function (file) {
    var text = fs.readFileSync(path.join(root, file), "utf8");
    if (text.indexOf("rchetypex") !== -1) fail(file + " still contains rchetypex");
    if (file === "index.html" && /©\s*2026/.test(text)) fail("Footer year is hardcoded");
});

var deckFile = load("data/editions/2026/deck.js", ["DECK_2026"]);
var cycleFile = load("data/editions/2026/cycle.js", ["addCalendarDays", "practiceDayNumber"]);
var deck = deckFile.DECK_2026;
if (deck.length !== 56) fail("Expected 56 deck records, got " + deck.length);
var standard = deck.filter(function (row) { return row.card_type === "standard"; });
var jokers = deck.filter(function (row) { return row.card_type === "joker"; });
var packaging = deck.filter(function (row) { return row.card_type === "packaging"; });
if (standard.length !== 52) fail("Expected 52 standard records");
if (jokers.length !== 2) fail("Expected 2 jokers");
if (packaging.length !== 2) fail("Expected 2 packaging records");
var names = {};
deck.forEach(function (row) { names[row.artist_name] = true; });
if (Object.keys(names).length !== 55) fail("Expected 55 unique artists, got " + Object.keys(names).length);
var codes = {};
deck.forEach(function (row) {
    if (codes[row.card_code]) fail("Duplicate deck card_code " + row.card_code);
    codes[row.card_code] = true;
    if (!row.artist_social_url) fail(row.card_code + " missing social URL");
    if (!row.card_image_url || row.card_image_url.indexOf("https://") !== 0) fail(row.card_code + " missing image URL");
    if (row.card_image_url.indexOf("width=") === -1) fail(row.card_code + " dropped image query");
});
["hearts", "diamonds", "clubs", "spades"].forEach(function (suit) {
    var count = standard.filter(function (row) { return row.card_code.indexOf(suit + "_") === 0; }).length;
    if (count !== 13) fail(suit + " has " + count + " cards");
});
var deckExclusives = standard.filter(function (row) { return row.is_code_red_exclusive; }).map(function (row) { return row.card_code; }).sort();
if (deckExclusives.join() !== expectedExclusives.join()) fail("Deck exclusive mismatch: " + deckExclusives.join(", "));
var jade = deck.filter(function (row) { return row.artist_name === "Jade Suayan"; });
if (jade.length !== 2) fail("Jade Suayan should have 2 artworks");
if (cycleFile.addCalendarDays("2026-12-01", 51) !== "2027-01-21") fail("Day 52 from 1 Dec 2026");
if (cycleFile.addCalendarDays("2026-12-01", 52) !== "2027-01-22") fail("Epilogue from 1 Dec 2026");
if (cycleFile.addCalendarDays("2024-02-28", 1) !== "2024-02-29") fail("Leap day");
if (cycleFile.addCalendarDays("2023-02-28", 1) !== "2023-03-01") fail("Non-leap February");
if (cycleFile.practiceDayNumber("2026-12-01", "2027-01-21") !== 52) fail("Day number across years");
if (cycleFile.practiceDayNumber("2026-11-17", "2026-11-16") !== null) fail("Day before start should be empty");
["index.html", "app.js"].forEach(function (file) {
    var body = fs.readFileSync(path.join(root, file), "utf8");
    if (/bipolar/i.test(body)) fail(file + " still contains a bipolar note");
    if (body.indexOf("outside the 52-day window") !== -1) fail(file + " still locks the practice window");
});

var archived = fs.readFileSync(path.join(root, "data/editions/2025/oracle.js"));
var original = fs.readFileSync(path.join(root, "data.js"));
if (!archived.equals(original)) fail("2025 archive does not match data.js");

console.log("IX:52 2026 validation");
console.log("Cards: " + oracle.length);
console.log("Standard artists: " + artists.filter(function (artist) { return artist.card_code; }).length);
console.log("Verified social links: " + artists.filter(function (artist) { return artist.social_verification_status === "verified"; }).length);
console.log("Unverified social links: " + artists.filter(function (artist) { return artist.social_verification_status === "unverified"; }).length);
console.log("Deck records: " + deck.length);
console.log("Unique artists: " + Object.keys(names).length);
console.log("Deck images: " + deck.filter(function (row) { return row.card_image_url; }).length);
console.log("Deck social links: " + deck.filter(function (row) { return row.artist_social_url; }).length);
console.log("Unresolved items: " + unresolved.length);
unresolved.forEach(function (item) { console.log(" - " + item); });

if (failures.length) {
    console.error("\nFailures:");
    failures.forEach(function (item) { console.error(" - " + item); });
    process.exit(1);
}

console.log("\nData layer is internally consistent.");
