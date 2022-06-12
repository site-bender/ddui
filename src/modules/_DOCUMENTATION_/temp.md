# Datatype to form widget mapping

- Array
  - Sortable list component (add, remove, reorder)
- Boolean
  - binary
    - Single Checkbox
    - Radio with true/false
    - Select with two values (e.g., yes/no)
    - Toggle button
    - Switch
  - `permitIndeterminate` is true
    - Radio with true/false/neither
    - Radio with true/false initially unselected
      - Option to deselect?
    - Select with three values (e.g., sure/no/dunno)
- Calendar
  - Select from list of calendars
- Duration
  - Set of fields for entering `allowedUnits` (e.g., months, days)
- Fraction value
  - Integer inputs for numerator and denominator
- Instant
  - Probably never used, but same as choosing a complete zonedDateTime
- Integer
  - Integer number field
  - Select if limited set (depends on constraints)
- List
  - Same as array
  - Difference: Array is all same type, list mixed?
- Member (from a limited set)
  - Select
  - Lookup field (autocomplete)
  - Radio button group
- Map
  - Not sure. Is this like adding fields/values?
- MonthDay
  - Separate month and day fields (HTML provides)
- PlainDate
  - Date picker (no time)
  - Day, month, year selects
  - Simple text input
- PlainDateTime
  - As above, but with time selection
- Precision number
  - Number field with fixed decimal places
- Radian
  - Same as real
- Real
  - Plain number input
- Record (same as map?)
- Regular expression
  - When would we have an input for this? Never
  - But it would just be a text input
- Set
  - Checkbox group
  - Multi-select (these suck so no)
  - Autocomplete (e.g., tags)
- String
  - text input if `allowLineBreaks` is false
  - textarea if `allowLineBreaks` is true
- TimeZone
  - Select from list
  - Autocomplete (lookup)
  - Radio button group
- YearMonth
  - Separate year and month fields (HTML provides)
- ZonedDataTime
  - Same as PlainDateTime except TZ included (choose or use current)



# Components

BooleanField

- With indeterminate
- Without indeterminate

CompositeField

- Address (non-lookup)
- Phone
- Date
- DateTime
- Time
- Duration
- Fraction

DateField

- Picker
- MonthDayField
- YearMonthField

DateTimeField

- Picker

MemberField (ChooseOne)

- Radio group
- Select

- Lookup
- Calendar
- TimeZone

SetField (ChooseSome)

- Checkbox group

IntegerField (increment/decrement?)
PrecisionNumberField fixed decimal
RealNumberField

StringField

- No line breaks (input)
- Line breaks (textarea or contenteditable)
