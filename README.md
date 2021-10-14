# timespan-parser
Node package for parsing timespans like [systemd.time(7)](https://www.freedesktop.org/software/systemd/man/systemd.time.html).  The following is adapted from its man page:

> ## PARSING TIME SPANS
> When parsing, systemd will accept the same time span syntax.
> Separating spaces may be omitted. The following time units are
> understood:
>
> * msec, ms
> * seconds, second, sec, s
> * minutes, minute, min, m
> * hours, hour, hr, h
> * days, day, d
> * weeks, week, w
> * months, month, M (defined as 30.44 days)
> * years, year, y (defined as 365.25 days)
>
> If no time unit is specified, seconds are assumed.
>
> Examples for valid time span specifications:
>
>     2 h
>     2hours
>     48hr
>     1y 12month
>     55s500ms
>     300ms20s 5day

Parsing microseconds (`usec`, `us`) is not supported.

## Install

```sh
$ npm install timespan-parser
```

## Usage

```javascript
const timespan = require("timespan-parser");

timespan.parse("17y 4w 6d 3h 45m 12s"); // returns 539430312
timespan.getString(539430312); // returns "17y 4w 6d 3h 45m 12s"
```

## API
### `timespan.parse(timespan [, unit])`
*Converts a timespan string into a number of `unit`s.*\
**`timespan`** - *string* - The timespan string to be parsed.\
**`unit`** - *string* - The unit to use for the conversion.  Defaults to `"seconds"`.\
**Return Value** - *number* - The number of `unit`s represented by `timespan`.

### `timespan.getString(value [, opts])`
*Converts a numeric value to a timespan string.  The timespan string produced uses the shortest label available.*\
**`value`** - *number* - The number of `unit`s to convert to a timespan string.\
**`opts`** - *object* - Options object specifying any of the following values:\
**`opts.unit`** - *string* - The unit that `value` represents.  Defaults to `"seconds"`.\
**`opts.abbv`** - *boolean* - Whether to abbreviate the unit labels in the resulting string.  Defaults to `true`.\
**`opts.capitalize`** - *boolean* - Whether to set the first letter of each unit label to upper case in the resulting string.  Defaults to `false`.\
**`opts.unitSep`** - *string* - This string will be placed between each number and unit label in the resulting string.  Defaults to `""` when `abbv` is `true`.  Defaults to `" "` when `abbv` is `false`.\
**`opts.valueSep`** - *string* - This string will be placed between each value in the resulting string.  Defaults to `" "`.\
**Return Value** - *string* - A timespan string.

### `timespan(defaults)`
*Returns a new `timespan` object with the defaults modified.*\
**`defaults.unit`** - *string* - The new default unit.\
**`defaults.abbv`** - *boolean* - The value to use for `opts.abbv` when no value is provided while calling `timespan.getString()`.\
**`defaults.capitalize`** - *boolean* - The value to use for `opts.capitalize` when no value is provided while calling `timespan.getString()`.\
**`defaults.unitSep`** - *string* - The value to use for `opts.unitSep` when no value is provided while calling `timespan.getString()`.\
**`defaults.valueSep`** - *string* - The value to use for `opts.valueSep` when no value is provided while calling `timespan.getString()`.\
**Return Value** - *object* - The same functions as above, with the default unit set to `unit`.

## Examples

```javascript
timespan.parse("4 hours 30 seconds");                        // returns 14430
timespan.parse("4 hours 30 seconds", "hours");               // returns 4.008333333333334
timespan.parse("4 hours 30 seconds", "msec");                // returns 14430000
timespan.parse("300ms20s5day");                              // returns 432020.3
timespan.parse("300ms20s5day", "y");                         // returns 0.013689897203843131
timespan.getString(456789);                                  // returns "5d 6h 53m 9s"
timespan.getString(0.013689897203843131, { unit:"y" });      // returns "5d 20s 300ms"
timespan.getString(456789, { abbv: false });                 // returns "5 days 6 hours 53 minutes 9 seconds"
timespan.getString(456789, { unitSep: " " });                // returns "5 d 6 h 53 m 9 s"
timespan.getString(456789, { valueSep: "" });                // returns "5d6h53m9s"
timespan.getString(456789, {
    capitalize: true,
    unit: "ms"
});                                                          // returns "7M 36S 789Ms"
timespan.getString(456789, {
    abbv: false,
    capitalize: true,
    valueSep: ", "
});                                                          // returns "5 Days, 6 Hours, 53 Minutes, 9 Seconds"
```

Changing the default unit:

```javascript
const timespan = require("timespan-parser")({ unit: "ms" }); // Use milliseconds as the default unit

timespan.parse("4 hours 30 seconds");                        // returns 14430000
timespan.parse("300ms20s5day");                              // returns 432020300
timespan.getString(456789);                                  // returns "7m 36s 789ms"
```

Changing the default formatting options:

```javascript
const timespan = require("timespan-parser")({
    abbv: false,
    capitalize: true,
    valueSep: ", "
});

timespan.getString(456789);                                  // returns "5 Days, 6 Hours, 53 Minutes, 9 Seconds"
timespan.getString(456789, {
    abbv: true,
    capitalize: false,
    valueSep: " "
});                                                          // returns "5d 6h 53m 9s"
```

## CLI
When installed globally, two command line interfaces are available.
```sh
$ npm install --global timespan-parser
```
### `parse-timespan`
```sh
$ parse-timespan timespan [ unit="seconds" ]
```
Writes the number of seconds (or other unit, if specified) that are represented
by the provided timespan string
### `get-timespan`
```sh
$ get-timespan value [ unit="seconds" ]
```
Writes a timespan string that represents the number of seconds (or other unit,
if specified) provided by value
## CLI Examples
```sh
$ parse-timespan "17y 4w 6d 3h 45m 12s"
539430312
$ parse-timespan "4 hours 30 seconds"
14430
$ parse-timespan "4 hours 30 seconds" hours
4.008333333333334
$ parse-timespan "4 hours 30 seconds" msec
14430000
$ parse-timespan 300ms20s5day
432020.3
$ parse-timespan "300ms20s5day" y
0.013689897203843131
$ get-timespan 539430312
17y 4w 6d 3h 45m 12s
$ get-timespan 456789 
5d 6h 53m 9s
$ get-timespan 0.013689897203843131 y
5d 20s 300ms
```
