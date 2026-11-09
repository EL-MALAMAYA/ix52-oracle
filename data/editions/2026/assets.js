/* Image manifest identified from the RunIt Decks Code:RED artist gallery on 2026-11-09.
   Filename prefixes (AOH, 7OS, QOD, and so on) match the card printed beside that artist.
   display_permitted is false: public availability is not a license to reproduce the art here.
   Do not point two cards at one composite product photograph. */
var IMAGE_POLICY_2026 = {
    display_permitted: false,
    rights_status: "unconfirmed",
    reason: "Each standard card face, the two jokers, the box, and the card back are published as separate files on the official RunIt Decks gallery. IX:52 has not confirmed a license to reproduce, crop, cache, or export those files, so the interface does not embed them.",
    source_page: "https://runitdecks.com/products/bicycle-sari-sari-code-red-playing-cards"
};

var IMAGE_CDN_2026 = "https://runitdecks.com/cdn/shop/files/";

function assetRecord(fields) {
    var file = fields.file;
    return {
        asset_id: fields.asset_id,
        card_code: fields.card_code || null,
        artist_id: fields.artist_id,
        image_url: IMAGE_CDN_2026 + file,
        image_source_url: IMAGE_POLICY_2026.source_page,
        image_asset_type: fields.image_asset_type,
        image_verification_status: "identified",
        image_rights_status: "unconfirmed",
        display_permitted: false,
        image_alt: fields.image_alt,
        image_width: fields.image_width || 800,
        image_height: fields.image_height || 1120,
        is_code_red_exclusive: Boolean(fields.is_code_red_exclusive),
        file_name: file
    };
}

var ASSETS_2026 = [
    assetRecord({ asset_id: "hearts_ace", card_code: "hearts_ace", artist_id: "pollyanna", file: "AOH_3c2b183c-6959-4e01-a5e6-d8ee5b3a0348.png", image_asset_type: "card-face", image_alt: "Ace of Hearts artwork by Pollyanna from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "hearts_2", card_code: "hearts_2", artist_id: "crazy-vanny", file: "2OH_03ef5080-d6dd-4d9f-b532-4be4cce5650d.png", image_asset_type: "card-face", image_alt: "Two of Hearts artwork by Crazy Vanny from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "hearts_3", card_code: "hearts_3", artist_id: "isad-diwa", file: "3OH_b14c4cb1-e17a-45fa-bf7a-4c12f3f01327.png", image_asset_type: "card-face", image_alt: "Three of Hearts artwork by Isad Diwa from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "hearts_4", card_code: "hearts_4", artist_id: "dan-fajardo", file: "4OH_7cf33cad-412d-443b-af0d-ef1d979569f3.png", image_asset_type: "card-face", image_alt: "Four of Hearts artwork by Dan Fajardo from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "hearts_5", card_code: "hearts_5", artist_id: "drin", file: "5OH_2435d61f-17a9-40e5-b0c4-391d689ac416.png", image_asset_type: "card-face", image_alt: "Five of Hearts artwork by Drin from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "hearts_6", card_code: "hearts_6", artist_id: "tyang-karyel", file: "6OH_d1a6bd52-ccbf-4c61-b604-2a8937cabd17.png", image_asset_type: "card-face", image_alt: "Six of Hearts artwork by Tyang Karyel from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "hearts_7", card_code: "hearts_7", artist_id: "seeweirdo", file: "7OH_e35fdd3f-ebd0-490a-b90e-86de60af9afd.png", image_asset_type: "card-face", image_alt: "Seven of Hearts artwork, Heart Hunter, by Seeweirdo from Bicycle Sari-Sari Code:RED, published by RunIt Decks.", is_code_red_exclusive: true }),
    assetRecord({ asset_id: "hearts_8", card_code: "hearts_8", artist_id: "raki", file: "8OH_75640ccf-3d51-4b53-ae2d-67de44ecf352.png", image_asset_type: "card-face", image_alt: "Eight of Hearts artwork by Raki from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "hearts_9", card_code: "hearts_9", artist_id: "mark-weigh", file: "9OH_b87af9b2-cf0d-4d80-b3e7-9b0ed1253c41.png", image_asset_type: "card-face", image_alt: "Nine of Hearts artwork by Mark Weigh from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "hearts_10", card_code: "hearts_10", artist_id: "kookoo", file: "10OH.png", image_asset_type: "card-face", image_alt: "Ten of Hearts artwork by Kookoo from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "hearts_jack", card_code: "hearts_jack", artist_id: "bitto", file: "JOH_e04bd6a8-700d-47e6-9038-d75f47924cf8.png", image_asset_type: "card-face", image_alt: "Jack of Hearts artwork by Bitto from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "hearts_queen", card_code: "hearts_queen", artist_id: "jill-arteche", file: "QOH_61a1d808-51ad-4514-8af6-6bae6d3cdb73.png", image_asset_type: "card-face", image_alt: "Queen of Hearts artwork by Jill Arteche from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "hearts_king", card_code: "hearts_king", artist_id: "wetworks", file: "KOH_be4d5c80-2832-4824-8720-3ab312ebba99.png", image_asset_type: "card-face", image_alt: "King of Hearts artwork, King of Hearts I, by Wetworks from Bicycle Sari-Sari Code:RED, published by RunIt Decks.", is_code_red_exclusive: true }),

    assetRecord({ asset_id: "diamonds_ace", card_code: "diamonds_ace", artist_id: "kim-borja", file: "AOD_b1bfe75a-72ee-433c-a765-d722e4ac984d.png", image_asset_type: "card-face", image_alt: "Ace of Diamonds artwork by Kim Borja from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "diamonds_2", card_code: "diamonds_2", artist_id: "arvy-trinidad", file: "2OD_ee3d1fcb-6b5d-4629-aace-18f9e53a1108.png", image_asset_type: "card-face", image_alt: "Two of Diamonds artwork by Arvy Trinidad from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "diamonds_3", card_code: "diamonds_3", artist_id: "gemart-ortega", file: "3OD_57b9aa1e-d7c9-4e18-a418-55195a8d5d5a.png", image_asset_type: "card-face", image_alt: "Three of Diamonds artwork by Gemart Ortega from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "diamonds_4", card_code: "diamonds_4", artist_id: "marilou-solano", file: "4OD_06316e4b-59b0-4382-aa7d-7472d0fbda35.png", image_asset_type: "card-face", image_alt: "Four of Diamonds artwork by Marilou Solano from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "diamonds_5", card_code: "diamonds_5", artist_id: "gabo-corpuz", file: "5OD_9d2edceb-7eba-44c3-8e22-e6f91c9edf93.png", image_asset_type: "card-face", image_alt: "Five of Diamonds artwork by Gabo Corpuz from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "diamonds_6", card_code: "diamonds_6", artist_id: "lean-reboja", file: "6OD_1744cb04-bf18-4576-bc3b-ef8776d574df.png", image_asset_type: "card-face", image_alt: "Six of Diamonds artwork by Lean Reboja from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "diamonds_7", card_code: "diamonds_7", artist_id: "jp-pining", file: "7OD_52dadb9e-1a61-414c-86af-55c8e3884a04.png", image_asset_type: "card-face", image_alt: "Seven of Diamonds artwork by JP Pining from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "diamonds_8", card_code: "diamonds_8", artist_id: "blic", file: "8OD_33c1ee58-e3db-459f-ad87-9cbebcbf9d35.png", image_asset_type: "card-face", image_alt: "Eight of Diamonds artwork by Blic from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "diamonds_9", card_code: "diamonds_9", artist_id: "wham", file: "9OD_e9ead069-4f83-4276-b0c6-4e104215d560.png", image_asset_type: "card-face", image_alt: "Nine of Diamonds artwork by Wham from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "diamonds_10", card_code: "diamonds_10", artist_id: "anika-marie-loquite", file: "10OD_ceddd2d7-f34e-46da-b66d-bfcfaae8b71a.png", image_asset_type: "card-face", image_alt: "Ten of Diamonds artwork by Anika Marie Loquite from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "diamonds_jack", card_code: "diamonds_jack", artist_id: "kapitan", file: "JOD_c09e9420-1270-4c10-99c4-734ac2d8e55f.png", image_asset_type: "card-face", image_alt: "Jack of Diamonds artwork by Kapitan from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "diamonds_queen", card_code: "diamonds_queen", artist_id: "nicolo-nimor", file: "QOD_777944ae-e025-4808-b7d7-bee5477e54f6.png", image_asset_type: "card-face", image_alt: "Queen of Diamonds artwork, Queen of Blood Diamonds, by Nicolo Nimor from Bicycle Sari-Sari Code:RED, published by RunIt Decks.", is_code_red_exclusive: true }),
    assetRecord({ asset_id: "diamonds_king", card_code: "diamonds_king", artist_id: "lei-melendres", file: "KOD_7e0d8953-b1c5-4bbb-a641-2b42e3f611c1.png", image_asset_type: "card-face", image_alt: "King of Diamonds artwork by Lei Melendres from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),

    assetRecord({ asset_id: "clubs_ace", card_code: "clubs_ace", artist_id: "alldefs", file: "AOC_1f19cb48-2622-44cd-a902-f5639f61f7b7.png", image_asset_type: "card-face", image_alt: "Ace of Clubs artwork by Alldefs from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "clubs_2", card_code: "clubs_2", artist_id: "selah-viee", file: "2OC_dfc13351-ca7e-43df-a5f2-637cb63904ec.png", image_asset_type: "card-face", image_alt: "Two of Clubs artwork by Selah Viee from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "clubs_3", card_code: "clubs_3", artist_id: "kempis-ang", file: "3OC_4ba745ec-5f21-43c2-8b1d-d61a1d18177f.png", image_asset_type: "card-face", image_alt: "Three of Clubs artwork by Kempis Ang from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "clubs_4", card_code: "clubs_4", artist_id: "rups-kiddo", file: "4OC_f9528580-3174-4088-bdfa-98aa31fac1ba.png", image_asset_type: "card-face", image_alt: "Four of Clubs artwork by Rups Kiddo from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "clubs_5", card_code: "clubs_5", artist_id: "peter-apuyan", file: "5OC_7e8437d7-91f5-40f2-8b8b-b28c518076d8.png", image_asset_type: "card-face", image_alt: "Five of Clubs artwork by Peter Apuyan from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "clubs_6", card_code: "clubs_6", artist_id: "russel-rust", file: "6OC_d1499499-5d78-4376-90be-80ff53d11d37.png", image_asset_type: "card-face", image_alt: "Six of Clubs artwork by Russel Rust from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "clubs_7", card_code: "clubs_7", artist_id: "chase", file: "7OC_725f0f01-04cf-4ffc-8282-08d928bc83c5.png", image_asset_type: "card-face", image_alt: "Seven of Clubs artwork by Chase from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "clubs_8", card_code: "clubs_8", artist_id: "ivnarts", file: "8OC_dc45d8dd-7de2-402f-8097-bc2460cd413d.png", image_asset_type: "card-face", image_alt: "Eight of Clubs artwork by Ivnarts from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "clubs_9", card_code: "clubs_9", artist_id: "mimaaaaaaaaw", file: "9OC_4c1478f8-5534-4ae2-a2dd-1062d8cc9f21.png", image_asset_type: "card-face", image_alt: "Nine of Clubs artwork by Mimaaaaaaaaw from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "clubs_10", card_code: "clubs_10", artist_id: "mustache-boii", file: "10OC_8a9df6c0-e759-4a0e-8d92-d6bd8e110124.png", image_asset_type: "card-face", image_alt: "Ten of Clubs artwork by Mustache Boii from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "clubs_jack", card_code: "clubs_jack", artist_id: "jethro-olba", file: "JOC_8544d706-e937-47e5-830e-6da92f695f2a.png", image_asset_type: "card-face", image_alt: "Jack of Clubs artwork by Jethro Olba from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "clubs_queen", card_code: "clubs_queen", artist_id: "mall", file: "QOC_56df92b5-0eb6-4315-91ee-3cc18eb44ca6.png", image_asset_type: "card-face", image_alt: "Queen of Clubs artwork, Club Queen II, by Mall from Bicycle Sari-Sari Code:RED, published by RunIt Decks.", is_code_red_exclusive: true }),
    assetRecord({ asset_id: "clubs_king", card_code: "clubs_king", artist_id: "mr-s", file: "KOC_90b75c90-08c0-49eb-be32-e0938ecc5e32.png", image_asset_type: "card-face", image_alt: "King of Clubs artwork by Mr. S from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),

    assetRecord({ asset_id: "spades_ace", card_code: "spades_ace", artist_id: "jj-zamoranos", file: "AOS_56ab1317-5fc2-4680-acfb-3341d5967e9c.png", image_asset_type: "card-face", image_alt: "Ace of Spades artwork by JJ Zamoranos from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "spades_2", card_code: "spades_2", artist_id: "eman-alconera", file: "2OS_5472dc11-e84c-4a95-a51d-b48557064682.png", image_asset_type: "card-face", image_alt: "Two of Spades artwork by Eman Alconera from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "spades_3", card_code: "spades_3", artist_id: "jannleen", file: "3OS_d0c07261-c5c3-4172-85b2-ce7a8379931e.png", image_asset_type: "card-face", image_alt: "Three of Spades artwork by Jannleen from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "spades_4", card_code: "spades_4", artist_id: "john-loyd-benz-de-leon", file: "4OS_619fbea6-5f30-41d3-9521-5be8e13e1ae0.png", image_asset_type: "card-face", image_alt: "Four of Spades artwork by John Loyd Benz De Leon from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "spades_5", card_code: "spades_5", artist_id: "kino", file: "5OS_3a8c1a90-29bd-4782-8d54-9c7267ad71de.png", image_asset_type: "card-face", image_alt: "Five of Spades artwork by Kino from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "spades_6", card_code: "spades_6", artist_id: "curse-gift", file: "6OS_b3fb5a5f-b322-4dbe-93d5-4d19b7991533.png", image_asset_type: "card-face", image_alt: "Six of Spades artwork by Curse/Gift from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "spades_7", card_code: "spades_7", artist_id: "jay-francisco", file: "7OS_b3e35d8e-5222-4689-bd34-7e52532790af.png", image_asset_type: "card-face", image_alt: "Seven of Spades artwork by Jay Francisco from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "spades_8", card_code: "spades_8", artist_id: "garapata", file: "8OS_26294cd4-7951-4304-89a9-a1ba325f12e0.png", image_asset_type: "card-face", image_alt: "Eight of Spades artwork by Garapata from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "spades_9", card_code: "spades_9", artist_id: "cabnov", file: "9OS_10e3f4a6-0ce4-4248-a1c2-71684968854d.png", image_asset_type: "card-face", image_alt: "Nine of Spades artwork by Cabnov from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "spades_10", card_code: "spades_10", artist_id: "barc", file: "10OS_6346edae-1fdf-4b03-9a1e-8a4091576984.png", image_asset_type: "card-face", image_alt: "Ten of Spades artwork by Barc from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "spades_jack", card_code: "spades_jack", artist_id: "jappy-agoncillo", file: "JOS_bd8992fb-15de-4da3-9e19-05d78a114039.png", image_asset_type: "card-face", image_alt: "Jack of Spades artwork, The Sour Knight, by Jappy Agoncillo from Bicycle Sari-Sari Code:RED, published by RunIt Decks.", is_code_red_exclusive: true }),
    assetRecord({ asset_id: "spades_queen", card_code: "spades_queen", artist_id: "raisehell", file: "QOS_8b1a69aa-ee0a-4d83-8b5b-9c0f4fcbcdc5.png", image_asset_type: "card-face", image_alt: "Queen of Spades artwork by Raisehell from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "spades_king", card_code: "spades_king", artist_id: "raco-ruiz", file: "KOS_32477648-4021-42a4-ac20-90ee5126a8cf.png", image_asset_type: "card-face", image_alt: "King of Spades artwork by Raco Ruiz from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),

    assetRecord({ asset_id: "box", artist_id: "jade-suayan", file: "BOX_80fa6ba8-1bc9-471e-aa88-7e17400ba9ea.png", image_asset_type: "box", image_alt: "Code:RED tuck box design by Jade Suayan, published by RunIt Decks." }),
    assetRecord({ asset_id: "back", artist_id: "jade-suayan", file: "CODE-RED-BACK.png", image_asset_type: "card-back", image_alt: "Code:RED card-back design by Jade Suayan, published by RunIt Decks." }),
    assetRecord({ asset_id: "joker_doktor_karayom", artist_id: "doktor-karayom", file: "J1.png", image_asset_type: "joker", image_alt: "Joker artwork by Doktor Karayom from Bicycle Sari-Sari Code:RED, published by RunIt Decks." }),
    assetRecord({ asset_id: "joker_omok", artist_id: "omok", file: "J2.png", image_asset_type: "joker", image_alt: "Joker artwork by Omok from Bicycle Sari-Sari Code:RED, published by RunIt Decks." })
];
