# IX:52 — The Hermit Returns

A static site for the 2026 IX:52 practice, published by Maiba Studio. Draw a physical card from Bicycle Sari-Sari Code:RED, choose its suit and rank, and follow a five-part Verbesque reading: Sense, Choose, Enact, Restore, Renew.

The 2025 readings are unchanged in `data.js` and `data/editions/2025/oracle.js`. Open `archive.html` to read them. They are not the default edition.

## Use

Open `index.html` in a browser, or serve the folder:

```
npx serve .
```

A direct link looks like `index.html?card=hearts_7`.

Notes and draw history stay in the browser’s local storage. Export and delete them from The Practice page. Share the Day never includes private notes.

## Check the data

```
node scripts/validate.js
```

The script confirms the 52-card Code:RED roster, refuses unlicensed image display, and reports social profiles the official gallery did not link.

Artist names, profile links, and card images come from `data/editions/2026/deck.csv`. After editing that file, run `node scripts/import-deck.js` and refresh. A practice cycle starts on a date you choose. Draws stay in this browser.

## Stack

HTML, CSS, and vanilla JavaScript. No build step and no account.
