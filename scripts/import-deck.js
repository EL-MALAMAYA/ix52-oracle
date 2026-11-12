"use strict";

var fs = require("fs");
var path = require("path");

var root = path.join(__dirname, "..");
var source = process.argv[2] || path.join(root, "data", "editions", "2026", "deck.csv");
var text = fs.readFileSync(source, "utf8").replace(/^\uFEFF/, "");
var rows = [];
var row = [];
var cell = "";
var quoted = false;
for (var i = 0; i < text.length; i += 1) {
    var char = text.charAt(i);
    if (quoted) {
        if (char === "\"") {
            if (text.charAt(i + 1) === "\"") {
                cell += "\"";
                i += 1;
            } else quoted = false;
        } else cell += char;
    } else if (char === "\"") quoted = true;
    else if (char === ",") {
        row.push(cell);
        cell = "";
    } else if (char === "\n") {
        row.push(cell.replace(/\r$/, ""));
        if (row.some(function (value) { return value !== ""; })) rows.push(row);
        row = [];
        cell = "";
    } else cell += char;
}
if (cell.length || row.length) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
}

var headers = rows.shift().map(function (header) { return header.trim(); });
var records = rows.map(function (values) {
    var record = {};
    headers.forEach(function (header, index) {
        record[header] = (values[index] || "").trim();
    });
    record.is_code_red_exclusive = record.is_code_red_exclusive === "Yes";
    return record;
});

var output = "/* Generated from data/editions/2026/deck.csv. Re-run: node scripts/import-deck.js */\nvar DECK_2026 = " + JSON.stringify(records, null, 4) + ";\n";
fs.writeFileSync(path.join(root, "data", "editions", "2026", "deck.js"), output);
console.log("Wrote " + records.length + " deck records.");
