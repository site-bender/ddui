<!-- markdownlint-disable-next-line no-inline-html -->
<h1 id="top">The StringField</h1>

At the time of this writing, this and most of the other components here are incomplete. Rapid and contradictory changes to the DDUI application and back end interfered. So this documentation is as much about **what these components are supposed to be** as it is about what they currently are.

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="the-thinking-behind-these-fields">The thinking behind these fields</h2>

The "StringField concept" is similar to the concept behind **all the other components** in this module. The primary goal is this:

**These components are typed by the *datatype* they handle, rather than the widget(s) they produce.**

Let us repeat:

**These components are typed by the DATATYPE they handle, rather than the widget(s) they produce.**

*The `StringField` is the component intended to handle display and modification of strings of characters.*

Things to consider:

1. The string could be of any character set, not just UTF-8 or UTF-16. It should work with any charset (e.g., use `toLocaleLowerCase` rather than `toLowerCase`).
   1. Consider `dir`: `ltr` or `rtl`.
   2. What about [Ruby](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby)? Or code? Syntax highlighting?
2. The string could be of any length, and might contain newlines.
3. Eventually, this could also include HTML, XML, or rich text.
4. What about autocomplete? Auto-capitalization? Spell checking? Language? Translations? HTML has many untapped capabilities. Build them in once; use them for years.
5. The string could have limitations (as expressed, for example, with max or min lengths or a RegExp pattern match).
6. The string could require masking in certain situations (e.g., a password or a bank account or credit card number).
7. The string could be read-only.
8. It could have metadata associated with it, such as that it is a book title, or author's name, or ISBN.
9. The field itself could be conditionally displayed based on conditions from outside the field or even outside the form or application (e.g., by fetch).

The original version of this module was designed to address many of these considerations and contained a prototype of an `operations` module that allowed the use of a JSON/JS configuration to:

1. Create a wide variety of validation functions, such as:
   1. Min and max character count
   2. `<,` `>,` `<=,` `>=,` `===,` `!==`
   3. Set functions: membership, disjoint, subset, superset, equivalent set, etc.
   4. Static checks: isBoolean, isString, isInteger, etc.
   5. RegExp matching
   6. Ordering (forward and reverse lists, after alphabetically, etc.)
   7. Dates and date-times (before, between, etc.)
   8. And many more.
2. Compose and nest validators using AND and OR to any depth
3. Create formatters from a JSON/JS config, such as functions to insert or remove characters, mask text, express as currency or percent, etc.
4. Create operators to do functions to be used for conditional display and other functionality, such as:
   1. Add, subtract, multiply, or divide integers, real numbers, precision numbers, and fractions
   2. Find minimums, maximums, modulo, and remainder
   3. Negate, find the absolute value, get exponents and roots, etc.
   4. NoOp for composition with conditionals
5. Use a JSON/JS configuration to inject values to be used in the above calculations, validations, etc. from:
   1. State
   2. Local or session storage
   3. The query string or path segments
   4. Cookies
   5. A fetch call (async)

This module was largely created as a proof of concept on another project for company (OpX&mdash;during the "pause" of 2021), but was never finished and contained bugs. As we never got far enough to implement it in DDUI, it was removed, but you can still find it in [older commits](https://github.com/company-digital/edit-profile/tree/3bebda2aabdd650b0ec2bfc63f63bb9fed48974e/src/operations).

Here is an example of what that **would have looked like**. **NOT IMPLEMENTED**

```ts
const config = {
  constraint: {
    constraintType: "AND_CONSTRAINT",
    tests: [
      {
        constraintType: "IS_INTEGER_CONSTRAINT",
      },
      {
        constraintType: "OR_CONSTRAINT",
        tests: [
          {
            constraintType: "AND_CONSTRAINT",
            tests: [
              {
                constraintType: "AT_LEAST_N_CONSTRAINT",
                operand: 7,
              },
              {
                constraintType: "LESS_THAN_N_CONSTRAINT",
                operand: 43,
              },
            ],
          },
          {
            constraintType: "AND_CONSTRAINT",
            tests: [
              {
                constraintType: "MORE_THAN_N_CONSTRAINT",
                operand: 660,
              },
              {
                constraintType: "AT_MOST_N_CONSTRAINT",
                operand: 669,
              },
            ],
          },
        ],
      },
    ],
  },
  datatype: "INTEGER_DATATYPE",
  id: "22JrDrbu1nvofGWmctoBm5",
  initialValue: "666",
  isRequired: true,
  label: "Bad number",
  mutationId,
  name: "badNumber",
}
```

The above would create an IntegerField with initial value of `666` and a validator that would check that the value was an integer AND was at least 7 but less than 43 OR more than 660 but at most 669. Or `(badNumber >= 7 && badNumber < 43) || (badNumber > 660 && badNumber <= 669)`.

This required creating boxed types for integers, precision numbers, real numbers, fractions, booleans, trileans, sets, characters, strings, etc. Inputs are boxed and the operators operate on the boxed versions and return boxed versions (which can be unboxed). Unfortunately, this was never finished, but could be picked up again.

The same idea can be applied to formatting, maskimg, conditional display, and value injection. All composable.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="stringfields-and-dduis">StringFields and data-driven UIs</h2>

The essential idea behind a **data-driven UI** (DDUI) is that the response from the server contains enough information about the data to build the UI for it.

The framework of the site might be hard-coded (though this, too, could be generated from queries to the back end, and EP was originally set up to work that way). But the forms, etc. are generated from the responses to queries to the GraphQL layer (or could be a REST API). These queries need to include enough information to permit the user agent to know what widget to use.

For example, if the back end tells the front end that the string includes newlines, then we know that the correct widget is most likely the `<textarea>` rather than `<input type="text">`. If it includes, say a media type such as `application/json` or `text/html`, then we can display the correct text editor. If it includes the name of the field we can humanize that for the label, or we can look for a `label` in the returned data. (It is not unreasonable for data to provide a human-readable label and/or description of itself as metadata.)

Help and error messages also make sense as part of the overall `shape` of the data (provided as "meta" data). By returning not only the data, but the schema and metadata from the domain layer, the front end can simply display the appropriate widgets. If the metadata includes actions (think HATEOAS), then the forms, etc. can configure themselves.

To some extent, that's how DDUI works.
