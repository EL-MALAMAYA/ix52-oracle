/* IX:52 2026 edition constants. Suit colors are an edition theme, not colors sampled from card artwork. */
var EDITION_2026 = {
    id: "2026",
    title: "IX:52 — The Hermit Returns",
    subtitle: "A 52-day Verbesque practice of intention, art, and renewal.",
    statement: "Live in verbs. Move with care. Know how to return.",
    window_start: "2026-11-17",
    window_end: "2027-01-07",
    epilogue: "2027-01-08",
    timezone: "Asia/Manila",
    deck_name: "Bicycle Sari-Sari Code:RED",
    producer: "RunIt Decks",
    deck_url: "https://runitdecks.com/products/bicycle-sari-sari-code-red-playing-cards",
    instagram_url: "https://www.instagram.com/runitdecks/",
    instagram_handle: "@RunItDecks",
    uncut_url: "https://runitdecks.com/products/bicycle-sari-sari-code-red-uncut-sheet",
    publisher: "Maiba Studio"
};

var COLOR_SOURCE_2026 = "IX:52 2026 edition theme for this suit. Not sampled from the individual artwork and not an artist-designated palette.";

var SUITS_2026 = {
    Hearts: {
        element: "Water",
        domain: "Relating",
        direction: "West",
        symbol: "♥",
        color_name: "Code Red",
        color_hex: "#E32625",
        color_source: COLOR_SOURCE_2026
    },
    Diamonds: {
        element: "Earth",
        domain: "Stewardship",
        direction: "North",
        symbol: "♦",
        color_name: "Electric Yellow",
        color_hex: "#FFD721",
        color_source: COLOR_SOURCE_2026
    },
    Clubs: {
        element: "Fire",
        domain: "Making",
        direction: "South",
        symbol: "♣",
        color_name: "Violet",
        color_hex: "#8246C8",
        color_source: COLOR_SOURCE_2026
    },
    Spades: {
        element: "Air",
        domain: "Discernment",
        direction: "East",
        symbol: "♠",
        color_name: "Verbish Teal",
        color_hex: "#205B63",
        color_source: COLOR_SOURCE_2026
    }
};

var RANK_ORDER_2026 = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];

var RANK_LABELS_2026 = {
    Ace: "Ace",
    "2": "Two",
    "3": "Three",
    "4": "Four",
    "5": "Five",
    "6": "Six",
    "7": "Seven",
    "8": "Eight",
    "9": "Nine",
    "10": "Ten",
    Jack: "Jack",
    Queen: "Queen",
    King: "King"
};

var RANK_ARCHETYPES_2026 = {
    Ace: "A beginning small enough to start",
    "2": "Two parts held in relation",
    "3": "A third strand that weaves",
    "4": "A structure that can rest",
    "5": "Friction that asks for a change of grip",
    "6": "An exchange that steadies",
    "7": "A test of staying power",
    "8": "Rhythm earned by repetition",
    "9": "Refinement near the end",
    "10": "A cycle ready to be set down",
    Jack: "A message carried outward",
    Queen: "Care that keeps something alive",
    King: "Responsibility held without hoarding it"
};

var PRACTICE_STEPS_2026 = [
    { id: "sense", label: "Sense", prompt: "What is true about this moment?" },
    { id: "choose", label: "Choose", prompt: "What movement is worth making?" },
    { id: "enact", label: "Enact", prompt: "How will intention encounter reality?" },
    { id: "restore", label: "Restore", prompt: "What must remain protected?" },
    { id: "renew", label: "Renew", prompt: "What did reality teach me?" }
];

var CAPACITY_MODES_2026 = [
    { id: "expansive", label: "Expansive", note: "There is spare attention. You may widen the action, and you may also stop early." },
    { id: "ordinary", label: "Ordinary", note: "A regular day. One proportionate action is enough." },
    { id: "constrained", label: "Constrained", note: "Attention, time, or energy is limited. The smaller action is a complete practice." },
    { id: "recovery", label: "Recovery", note: "Rest, food, quiet, or care may be the meaningful movement. Nothing here has to be productive." }
];
