/* Artist registry for Bicycle Sari-Sari Code:RED.
   Social links marked verified were taken from the artist-name anchors on the official
   RunIt Decks product gallery on 2026-11-09. Unlinked artists stay unverified.
   IX:52 oracle text is not a statement by these artists. */
var ARTIST_SOURCE_PAGE = "https://runitdecks.com/collections/art-designer-decks/products/bicycle-sari-sari-code-red-playing-cards";
var ARTIST_CHECKED = "2026-11-09";

function artistRecord(fields) {
    return {
        artist_id: fields.artist_id,
        artist_name: fields.artist_name,
        card_code: fields.card_code || null,
        role: fields.role || "standard",
        contribution: fields.contribution || null,
        social_url: fields.social_url || null,
        social_platform: fields.social_url ? "instagram" : null,
        social_verification_status: fields.social_url ? "verified" : "unverified",
        social_source_url: fields.social_url ? ARTIST_SOURCE_PAGE : null,
        social_last_checked: ARTIST_CHECKED,
        artist_page_url: ARTIST_SOURCE_PAGE,
        bio: null,
        bio_source_url: null,
        gallery_heading: fields.gallery_heading || fields.artist_name,
        name_note: fields.name_note || null
    };
}

var ARTISTS_2026 = [
    artistRecord({ artist_id: "pollyanna", artist_name: "Pollyanna", card_code: "hearts_ace", social_url: "https://www.instagram.com/polly.anna.ph/" }),
    artistRecord({ artist_id: "crazy-vanny", artist_name: "Crazy Vanny", card_code: "hearts_2", social_url: "https://www.instagram.com/crazy_vanny/" }),
    artistRecord({ artist_id: "isad-diwa", artist_name: "Isad Diwa", card_code: "hearts_3", social_url: "https://www.instagram.com/isad.diwa/" }),
    artistRecord({ artist_id: "dan-fajardo", artist_name: "Dan Fajardo", card_code: "hearts_4", social_url: "https://www.instagram.com/danfajardoart/" }),
    artistRecord({ artist_id: "drin", artist_name: "Drin", card_code: "hearts_5", social_url: "https://www.instagram.com/im.drin_/" }),
    artistRecord({ artist_id: "tyang-karyel", artist_name: "Tyang Karyel", card_code: "hearts_6", social_url: "https://www.instagram.com/tyangkaryel/" }),
    artistRecord({ artist_id: "seeweirdo", artist_name: "Seeweirdo", card_code: "hearts_7", social_url: "https://www.instagram.com/seeweirdo/" }),
    artistRecord({ artist_id: "raki", artist_name: "Raki", card_code: "hearts_8", social_url: "https://www.instagram.com/raki.official.art/" }),
    artistRecord({ artist_id: "mark-weigh", artist_name: "Mark Weigh", card_code: "hearts_9", social_url: "https://www.instagram.com/markweigh/" }),
    artistRecord({ artist_id: "kookoo", artist_name: "Kookoo", card_code: "hearts_10", social_url: "https://www.instagram.com/kookoo.ramos/" }),
    artistRecord({ artist_id: "bitto", artist_name: "Bitto", card_code: "hearts_jack", social_url: "https://www.instagram.com/studio_bitto/" }),
    artistRecord({ artist_id: "jill-arteche", artist_name: "Jill Arteche", card_code: "hearts_queen", social_url: "https://www.instagram.com/jillarteche/" }),
    artistRecord({ artist_id: "wetworks", artist_name: "Wetworks", card_code: "hearts_king", social_url: "https://www.instagram.com/the.wetworks.studios/" }),

    artistRecord({ artist_id: "kim-borja", artist_name: "Kim Borja", card_code: "diamonds_ace", social_url: "https://www.instagram.com/art.kimborja/" }),
    artistRecord({ artist_id: "arvy-trinidad", artist_name: "Arvy Trinidad", card_code: "diamonds_2", social_url: "https://www.instagram.com/arvyt/" }),
    artistRecord({ artist_id: "gemart-ortega", artist_name: "Gemart Ortega", card_code: "diamonds_3", social_url: "https://www.instagram.com/gemart1715/" }),
    artistRecord({ artist_id: "marilou-solano", artist_name: "Marilou Solano", card_code: "diamonds_4", social_url: "https://www.instagram.com/mayuenaise/" }),
    artistRecord({ artist_id: "gabo-corpuz", artist_name: "Gabo Corpuz", card_code: "diamonds_5", social_url: "https://www.instagram.com/_gab.corpuz/" }),
    artistRecord({ artist_id: "lean-reboja", artist_name: "Lean Reboja", card_code: "diamonds_6", social_url: "https://www.instagram.com/leanreboja/" }),
    artistRecord({ artist_id: "jp-pining", artist_name: "JP Pining", card_code: "diamonds_7", social_url: "https://www.instagram.com/jppining/" }),
    artistRecord({ artist_id: "blic", artist_name: "Blic", card_code: "diamonds_8", social_url: "https://www.instagram.com/blicpinas/" }),
    artistRecord({ artist_id: "wham", artist_name: "Wham", card_code: "diamonds_9", social_url: "https://www.instagram.com/whambenimble/?hl=en" }),
    artistRecord({ artist_id: "anika-marie-loquite", artist_name: "Anika Marie Loquite", card_code: "diamonds_10", social_url: "https://www.instagram.com/anikawithamarie/" }),
    artistRecord({ artist_id: "kapitan", artist_name: "Kapitan", card_code: "diamonds_jack", social_url: "https://www.instagram.com/_kapitan.studio/" }),
    artistRecord({ artist_id: "nicolo-nimor", artist_name: "Nicolo Nimor", card_code: "diamonds_queen", social_url: "https://www.instagram.com/nicolonimor/" }),
    artistRecord({ artist_id: "lei-melendres", artist_name: "Lei Melendres", card_code: "diamonds_king", social_url: "https://www.instagram.com/leimelendres/" }),

    artistRecord({ artist_id: "alldefs", artist_name: "Alldefs", card_code: "clubs_ace", social_url: "https://www.instagram.com/all.defs/" }),
    artistRecord({ artist_id: "selah-viee", artist_name: "Selah Viee", card_code: "clubs_2", social_url: "https://www.instagram.com/selah_viee/" }),
    artistRecord({ artist_id: "kempis-ang", artist_name: "Kempis Ang", card_code: "clubs_3", social_url: "https://www.instagram.com/akosikempis/" }),
    artistRecord({ artist_id: "rups-kiddo", artist_name: "Rups Kiddo", card_code: "clubs_4", social_url: "https://www.instagram.com/rupskiddo/", gallery_heading: "Rupskiddo", name_note: "The card list credits Rups Kiddo. The product gallery heading reads Rupskiddo." }),
    artistRecord({ artist_id: "peter-apuyan", artist_name: "Peter Apuyan", card_code: "clubs_5", social_url: "https://www.instagram.com/koda___lang/" }),
    artistRecord({ artist_id: "russel-rust", artist_name: "Russel Rust", card_code: "clubs_6", social_url: "https://www.instagram.com/rust.russel/" }),
    artistRecord({ artist_id: "chase", artist_name: "Chase", card_code: "clubs_7", social_url: "https://www.instagram.com/chasephl/" }),
    artistRecord({ artist_id: "ivnarts", artist_name: "Ivnarts", card_code: "clubs_8", social_url: "https://www.instagram.com/ivnarts/", gallery_heading: "Ivan Aratas", name_note: "The card list credits Ivnarts. The product gallery heading reads Ivan Aratas and links to instagram.com/ivnarts." }),
    artistRecord({ artist_id: "mimaaaaaaaaw", artist_name: "Mimaaaaaaaaw", card_code: "clubs_9", social_url: "https://www.instagram.com/mimaaaaaaaaw/" }),
    artistRecord({ artist_id: "mustache-boii", artist_name: "Mustache Boii", card_code: "clubs_10", social_url: "https://www.instagram.com/mustache.boii/", name_note: "The participating-artist roster and gallery heading use Mustache Boii. One card-list line on the RunIt page reads Mustache Bpo, which is treated here as a typo." }),
    artistRecord({ artist_id: "jethro-olba", artist_name: "Jethro Olba", card_code: "clubs_jack", social_url: "https://www.instagram.com/jethro.olba/", gallery_heading: "Jeth Olba", name_note: "The card list credits Jethro Olba. The product gallery heading reads Jeth Olba." }),
    artistRecord({ artist_id: "mall", artist_name: "Mall", card_code: "clubs_queen", social_url: "https://www.instagram.com/shardula/" }),
    artistRecord({ artist_id: "mr-s", artist_name: "Mr. S", card_code: "clubs_king", social_url: "https://www.instagram.com/mister_sasquatch/" }),

    artistRecord({ artist_id: "jj-zamoranos", artist_name: "JJ Zamoranos", card_code: "spades_ace", social_url: "https://www.instagram.com/exldmnl/", gallery_heading: "JJ Zamonaros", name_note: "The card list spells this name JJ Zamoranos. The product gallery heading reads JJ Zamonaros." }),
    artistRecord({ artist_id: "eman-alconera", artist_name: "Eman Alconera", card_code: "spades_2", social_url: "https://www.instagram.com/eman_alconera/" }),
    artistRecord({ artist_id: "jannleen", artist_name: "Jannleen", card_code: "spades_3", social_url: "https://www.instagram.com/jannleen/" }),
    artistRecord({ artist_id: "john-loyd-benz-de-leon", artist_name: "John Loyd Benz De Leon", card_code: "spades_4", social_url: "https://www.instagram.com/amongus_the_cat/", gallery_heading: "John Loyd DeLeon", name_note: "The card list uses John Loyd Benz De Leon. The gallery heading shortens this to John Loyd DeLeon and links the tile to instagram.com/amongus_the_cat." }),
    artistRecord({ artist_id: "kino", artist_name: "Kino", card_code: "spades_5", social_url: "https://www.instagram.com/hi__kino/" }),
    artistRecord({ artist_id: "curse-gift", artist_name: "Curse/Gift", card_code: "spades_6", social_url: "https://www.instagram.com/cursegift/" }),
    artistRecord({ artist_id: "jay-francisco", artist_name: "Jay Francisco", card_code: "spades_7", social_url: "https://www.instagram.com/jayfrancisco11/" }),
    artistRecord({ artist_id: "garapata", artist_name: "Garapata", card_code: "spades_8", social_url: "https://www.instagram.com/garapata_/" }),
    artistRecord({ artist_id: "cabnov", artist_name: "Cabnov", card_code: "spades_9", social_url: "https://www.instagram.com/cab_nov/" }),
    artistRecord({ artist_id: "barc", artist_name: "Barc", card_code: "spades_10", social_url: "https://www.instagram.com/barcthedog/" }),
    artistRecord({ artist_id: "jappy-agoncillo", artist_name: "Jappy Agoncillo", card_code: "spades_jack", social_url: "https://www.instagram.com/jappyagoncillo/" }),
    artistRecord({ artist_id: "raisehell", artist_name: "Raisehell", card_code: "spades_queen", social_url: "https://www.instagram.com/goraisehell/" }),
    artistRecord({ artist_id: "raco-ruiz", artist_name: "Raco Ruiz", card_code: "spades_king", social_url: "https://www.instagram.com/racobell/", name_note: "The official gallery links Raco Ruiz to instagram.com/racobell. A different candidate handle was not used." }),

    artistRecord({ artist_id: "jade-suayan", artist_name: "Jade Suayan", role: "beyond", contribution: "Code:RED box and card-back design", social_url: "https://www.instagram.com/syn.too/" }),
    artistRecord({ artist_id: "doktor-karayom", artist_name: "Doktor Karayom", role: "beyond", contribution: "Joker", social_url: "https://www.instagram.com/doktorkarayom/" }),
    artistRecord({ artist_id: "omok", artist_name: "Omok", role: "beyond", contribution: "Joker", social_url: "https://www.instagram.com/____omok/" })
];
