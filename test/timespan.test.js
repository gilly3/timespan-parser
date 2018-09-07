"use strict";

const assert = require("assert");
const timespan = require("../timespan");

describe("parse", function () {
    it("parses all systemd.time sample formats correctly", function () {
        assert.strictEqual(timespan.parse("2 h"), 2 * 60 * 60, "2 h");
        assert.strictEqual(timespan.parse("2hours"), 2 * 60 * 60, "2hours");
        assert.strictEqual(timespan.parse("48hr"), 48 * 60 * 60, "48hr");
        assert.strictEqual(timespan.parse("1y 12month"), (365.25 * 24 * 60 * 60) + (12 * 30.44 * 24 * 60 * 60), "1y 12month");
        assert.strictEqual(timespan.parse("55s500ms"), 55.5, "55s500ms");
        assert.strictEqual(timespan.parse("300ms20s 5day"), 0.3 + 20 + (5 * 24 * 60 * 60), "300ms20s 5day");
    });
});

describe("getString", function () {
    it("returns parseable time strings", function () {
        const value = Math.floor(Math.random() * 5000000000);
        assert.strictEqual(timespan.parse(timespan.getString(value)), value);
    });
});
