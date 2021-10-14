"use strict";

const { getString } = require("./timespan");

const [,, value = "", unit = ""] = process.argv;

if (value != "") {
    console.log(getString(value, unit));
}
else {
    console.log(`Usage:
get-timespan value [ unit="seconds" ]

Writes a timespan string that represents the number of seconds (or other unit,
if specified) provided by value

Examples:
$ get-timespan 86400
1d
$ parse-timespan 4746.25 minutes
3d 7h 6m 15s`);
}
