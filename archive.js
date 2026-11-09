"use strict";

var select = document.getElementById("archiveSelect");
var mount = document.getElementById("archiveCard");

ORACLE_CARDS.forEach(function (card, index) {
    var option = document.createElement("option");
    option.value = String(index);
    option.textContent = card.card_label;
    select.appendChild(option);
});

function show(index) {
    var card = ORACLE_CARDS[index];
    mount.hidden = false;
    mount.replaceChildren();
    function add(label, text) {
        var heading = document.createElement("h2");
        heading.textContent = label;
        var paragraph = document.createElement("p");
        paragraph.textContent = text;
        mount.appendChild(heading);
        mount.appendChild(paragraph);
    }
    add(card.card_label, card.element + " · " + card.verbesque_verb + " · " + card.direction);
    add("Oracle", card.oracle_text);
    add("Quote", card.quote);
    add("Mantra", card.mantra);
    add("Tiny action", card.tiny_action);
    add("Journal", card.journal_prompt);
    add("Body cue", card.body_cue);
    add("Verbesque", card.verbesque_cue);
    add("Word", card.word_of_the_day + " — " + card.word_meaning);
    add("Trivia", card.trivia + " (" + card.trivia_source + ")");
    var color = document.createElement("p");
    color.textContent = "2025 color name: " + card.color;
    mount.appendChild(color);
}

select.addEventListener("change", function () { show(Number(select.value)); });
show(0);
