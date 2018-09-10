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

```bash
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

### `timespan.getString(value [, unit])`
*Converts a numeric value to a timespan string.  The timespan string produced uses the shortest label available.*\
**`value`** - *number* - The number of `unit`s to convert to a timespan string.\
**`unit`** - *string* - The unit that `value` represents.  Defaults to `"seconds"`.\
**Return Value** - *string* - A timespan string.

### `timespan(unit)`
*Returns a new `timespan` object with the default unit changed from `"seconds"` to `unit`.*\
**`unit`** - *string* - The new default unit.\
**Return Value** - *object* - The same functions as above, with the default unit set to `unit`.

## Examples

```javascript
timespan.parse("4 hours 30 seconds");           // returns 14430
timespan.parse("4 hours 30 seconds", "hours");  // returns 4.008333333333334
timespan.parse("4 hours 30 seconds", "msec");   // returns 14430000
timespan.parse("300ms20s5day");                 // returns 432020.3
timespan.parse("300ms20s5day", "y");            // returns 0.013689897203843131
timespan.getString(456789);                     // returns "5d 6h 53m 9s"
timespan.getString(0.013689897203843131, "y");  // returns "5d 20s 300ms"
```

Changing the default unit:

```javascript
const timespan = require("timespan-parser")("msec");  // Use milliseconds as the default unit

timespan.parse("4 hours 30 seconds");   // returns 14430000
timespan.parse("300ms20s5day");         // returns 432020300
timespan.getString(456789);             // returns "7m 36s 789ms"
```
