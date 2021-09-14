"use strict";

const { parse } = require("./timespan");

const [, , timespan, unit = ""] = process.argv;

if (timespan) {
    console.log(parse(timespan, unit));
}
else {
    console.log(`Usage:
parse-timespan timespan [ unit="seconds" ]

Writes the number of seconds (or other unit, if specified) that are represented
by the provided timespan string

Examples:
$ parse-timespan "1 day"
86400
$ parse-timespan 3d7h6m15s minutes
4746.25`);
}
