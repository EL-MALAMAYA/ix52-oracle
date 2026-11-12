"use strict";

var fs = require("fs");
var https = require("https");
var path = require("path");
var vm = require("vm");

var root = path.join(__dirname, "..");
var context = {};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "data/editions/2026/deck.js"), "utf8") + "\nglobalThis.DECK_2026 = DECK_2026;", context);

function get(url) {
    return new Promise(function (resolve) {
        var req = https.get(url, {
            headers: { "User-Agent": "Mozilla/5.0", "Accept": "image/avif,image/webp,image/*,*/*" }
        }, function (res) {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                res.resume();
                resolve(get(res.headers.location));
                return;
            }
            res.resume();
            resolve(res.statusCode);
        });
        req.setTimeout(20000, function () {
            req.destroy();
            resolve("timeout");
        });
        req.on("error", function () { resolve("error"); });
    });
}

(async function () {
    var records = context.DECK_2026;
    var failed = [];
    var index = 0;
    async function worker() {
        while (index < records.length) {
            var current = records[index];
            index += 1;
            var status = await get(current.card_image_url);
            if (status !== 200) failed.push(current.card_code + " " + status);
            else process.stdout.write(".");
        }
    }
    var workers = [];
    for (var i = 0; i < 6; i += 1) workers.push(worker());
    await Promise.all(workers);
    process.stdout.write("\n");
    console.log("Checked " + records.length + " images. Failed: " + failed.length);
    failed.forEach(function (item) { console.log(item); });
    if (failed.length) process.exit(1);
})();
