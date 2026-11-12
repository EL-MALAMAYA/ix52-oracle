/* Date-only practice math. Day numbers use calendar dates, not elapsed milliseconds. */
function addCalendarDays(iso, amount) {
    var parts = String(iso).split("-").map(Number);
    var date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + amount));
    return date.toISOString().slice(0, 10);
}

function practiceOffset(start, iso) {
    var startMs = Date.parse(start + "T00:00:00Z");
    var dayMs = Date.parse(iso + "T00:00:00Z");
    return Math.round((dayMs - startMs) / 86400000);
}

function practiceDayNumber(start, iso) {
    var number = practiceOffset(start, iso) + 1;
    if (number < 1 || number > 52) return null;
    return number;
}
