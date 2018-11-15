"use strict";

const assert = require("assert");

const ms = 1;
const s = 1000 * ms;
const m = 60 * s;
const h = 60 * m;
const d = 24 * h;
const w = 7 * d;
const M = 30.44 * d;
const y = 365.25 * d;

const UNITS = {
    msec: ms,
    ms,
    seconds: s,
    second: s,
    sec: s,
    "": s,
    s,
    minutes: m,
    minute: m,
    min: m,
    m,
    hours: h,
    hour: h,
    hr: h,
    h,
    days: d,
    day: d,
    d,
    weeks: w,
    week: w,
    w,
    months: M,
    month: M,
    M,
    years: y,
    year: y,
    y
};

function init(defaultUnit) {
    const units = Object.assign({}, UNITS);
    if (defaultUnit) {
        assert.strictEqual(typeof defaultUnit, "string", `Invalid unit, expected string but got ${typeof defaultUnit}`);
        const val = units[defaultUnit];
        assert.ok(val, `Unknown unit ${defaultUnit}`);
        units[""] = val;
    }

    return {
        parse,
        getString
    };

    function parse(timespan, unit) {
        assert.ok(timespan, "Expected timespan");
        if (typeof timespan === "number") {
            timespan += "";
        }
        assert.strictEqual(typeof timespan, "string", `Invalid timespan, expected string but got ${typeof timespan}`);
        if (unit == null) {
            unit = "";
        }
        assert.strictEqual(typeof unit, "string", `Invalid unit, expected string but got ${typeof unit}`);
        const divider = units[unit];
        assert.ok(divider, `Unknown unit ${unit}`);
        const tss = /^\s*-?(\d+\s*[a-z]*\s*)+$/.test(timespan) && timespan.match(/\d+\s*[a-z]*\s*/g);
        assert.ok(tss, `Invalid format for timespan ${timespan}`);
        const sign = timespan.trim().startsWith("-") ? -1 : 1;
        const value = tss.reduce((sum, ts) => sum + getValue(ts), 0);
        return sign * (value / divider);
    }

    function getValue(ts) {
        const n = parseInt(ts, 10);
        const suf = ts.replace(/[\d\s-]/g, "");
        const mutliplier = units[suf];
        assert.ok(mutliplier, `Invalid timespan, unknown unit ${suf}`);
        return n * mutliplier;
    }

    function getString(value, unit) {
        if (typeof value === "string" && /^-?\d+(\.\d+)?$/.test(value)) {
            value = +value;
        }
        assert.strictEqual(typeof value, "number", `Invalid value, expected number but got ${typeof value}`);
        assert.ok(isFinite(value), `Invalid value ${value}`);
        if (unit == null) {
            unit = "";
        }
        assert.strictEqual(typeof unit, "string", `Invalid unit, expected string but got ${typeof unit}`);
        assert.ok(units[unit], `Unknown unit ${unit}`);
        const tss = [];
        const sign = value < 0 ? "-" : "";
        value = Math.abs(Math.round(value * units[unit]));
        const writeValue = unitName => {
            const unitVal = units[unitName];
            if (value >= unitVal) {
                tss.push(Math.floor(value / unitVal) + unitName);
                value %= unitVal;
            }
        };
        writeValue("y");
        writeValue("w");
        writeValue("d");
        writeValue("h");
        writeValue("m");
        writeValue("s");
        writeValue("ms");
        return sign + tss.join(" ");
    }
}

module.exports = Object.assign(init, init());
