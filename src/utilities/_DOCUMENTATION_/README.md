<!-- markdownlint-disable-next-line no-inline-html -->
<h1 id="top">General utility functions (<a href="src/utilities">utilities</a>)</h1>

This module contains utility functions that are not specific to this application or even this organization. They could be used anywehre.

Some of these were written for code that has since been removed, but may return. We've left them here so they don't need to be rewritten. They will be tree-shaken out, so they add no weight to the app, and all are tested.

Check the tests for examples of how to use them and expected output.

1. [camelCaseToSentenceCase](#camelCaseToSentenceCase)
2. [collapseWhitespace](#collapseWhitespace)
3. [concatenateCssClasses](#concatenateCssClasses)
4. [generateShortId](#generateShortId)
5. [identity](#identity)
6. [noOp](#noOp)
7. [not](#not)
8. [nullToUndefined](#nullToUndefined)
9. [pipe](#pipe)
10. [sentenceCaseToCamelCase](#sentenceCaseToCamelCase)
11. [snakeCaseToSentenceCase](#snakeCaseToSentenceCase)
12. [snakeCaseToTrainCase](#snakeCaseToTrainCase)
13. [stringToBoolean](#stringToBoolean)
14. [titleCaseToTrainCase](#titleCaseToTrainCase)
15. [unique](#unique)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="camelCaseToSentenceCase"><a href="src/utilities/camelCaseToSentenceCase/index.ts">camelCaseToSentenceCase</a></h2>

Passed a string in *camelCase*, returns a string in *Sentence case*. Uses `toLocaleLowerCase()`. Does not check that the input is actually camelCase.

```ts
camelCaseToSentenceCase("bobsYerUncle") // returns "Bobs yer uncle"
```

Returns an empty string if argument is undefined.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="collapseWhitespace"><a href="src/utilities/collapseWhitespace/index.ts">collapseWhitespace</a></h2>

Passed in a string, trims whitespace and converts multiple whitespace characters to a single space.

```ts
collapseWhitespace(`Buffalo Bill's
defunct
        who used to
        ride a watersmooth-silver
                                  stallion
and break onetwothreefourfive pigeonsjustlikethat
                                                  Jesus`) // e.e. cummings

// returns "Buffalo Bill's defunct who used to ride a watersmooth-silver stallion and break onetwothreefourfive pigeonsjustlikethat Jesus"
```

Returns an empty string if argument is undefined.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="concatenateCssClasses"><a href="src/utilities/concatenateCssClasses/index.ts">concatenateCssClasses</a></h2>

Passed an object where the keys are CSS classnames and the values are booleans, returns a space-separated string of classnames whose values were truthy:

```ts
concatenateCssClasses({
  red: true,
  green: false,
  blue: true,
  "burnt-sienna": true,
}) // returns "red blue burnt-sienna"
```

Returns an empty string if argument is undefined. This replaces the node `classnames` library dependency... with ten lines of code.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="generateShortId"><a href="src/utilities/generateShortId/index.ts">generateShortId</a></h2>

Generates a version 4 UUID and converts it to Base58 (letters and digits only) for ease of use in URIs, etc.

Currently this uses v4 from the node [uuid](https://github.com/uuidjs/uuid#readme) package, but really it should use node's [crypto.randomUUID](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) function. Sadly, at the time of this writing that proved to be difficult as it is only available in secure contexts (HTTPS) in some browsers. If it is workable now, you can switch to that instead and delete the `uuid` dependency.

```ts
export default function generateShortId(): string {
  return encode(crypto.randomUUID())
}
```

Word is that it is very, very fast. But we haven't found a way around the secure context limitation yet...

Here is typical use:

```ts
generateShortId() // returns "FN9wANp7ZVQ5qXjS2PdwfN" (randomly)
generateShortId() // returns "4jgXGt67MHNbC4sggL2rDN"
generateShortId() // returns "BsBpid7ujSsyAM4N9ti1Nt"
// etc.
```

This is used to generate short unique IDs all throughout the application, especially in the [mapQueryResponseToSiteConfig](/src/Ddui/antiCorruptionLayer/mapQueryResponseToSiteConfig/) mapper.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="identity"><a href="src/utilities/identity/index.ts">identity</a></h2>

Passed any argument it simply returns the argument unchanged:

```ts
identity() // returns undefined
identity("") // returns ""
identity(666) // returns 666
// etc.
```

This can be used to strip falsy values from an array:

```ts
; [0, 1, 2, 3, 4].filter(identity) // returns [ 1, 2, 3, 4 ]
```

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="noOp"><a href="src/utilities/noOp/index.ts">noOp</a></h2>

This is useful when you need to pass in a function, but you don't want it to do anything.

```ts
noOp() // returns undefined
```

Note: if you want it to return the first argument unchanged, use `identity` above.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="not"><a href="src/utilities/not/index.ts">not</a></h2>

This function takes an argument of any datatype, determines if it's truthy or false, and negates that to return a boolean value. It is used in place of the bang (`!`) for readability and visibility. It is also useful in `pipe` (below) when composing functions.

```ts
not("true") // false
not(true)   // false
not(1)      // false
not([])     // false
not({})     // false

not()       // true
not(0)      // true
not("")     // true
not(null)   // true
```

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="nullToUndefined"><a href="src/utilities/nullToUndefined/index.ts">nullToUndefined</a></h2>

Given an actual `null` value, returns undefined. For any other value, returns the value unchanged (as with `idenity` above).

```ts
nullToUndefined("true") // "true"
nullToUndefined(true)   // true
nullToUndefined(1)      // 1
nullToUndefined([])     // []
nullToUndefined({})     // {}
nullToUndefined()       // undefined
nullToUndefined(0)      // 0
nullToUndefined("")     // ''
nullToUndefined(null)   // undefined
```

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="pipe"><a href="src/utilities/pipe/index.ts">pipe</a></h2>

This is the classic function for composing other functions working from right to left (the alternative, left to right, is typically called `compose`, but `pipe` is easier for devs to understand). From the [tests](pipe/index.test.ts), here is an example:

```ts
const add = (x: number) => (y: number): number => x + y
const multiply = (x: number) => (y: number): number => x * y
const subtract = (x: number) => (y: number): number => y - x
const divide = (x: number) => (y: number): number => y / x

const doTheMath = pipe([add(5), multiply(4), subtract(10), divide(2)])

doTheMath(0) // returns 5 because ((0 + 5) * 4 - 10) / 2 === 5
```

If the input argument is missing or an empty array, then the function returned by `pipe` is essentially `identity` (see above): it returns the argument unchanged. Note, the functions composed must have arity of 1.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="sentenceCaseToCamelCase"><a href="src/utilities/sentenceCaseToCamelCase/index.ts">sentenceCaseToCamelCase</a></h2>

The reverse of [cameCaseToSentenceCase](#camelCaseToSentenceCase) above.

Passed a string in *Sentence case*, returns that string in *camelCase*. Removes non-alphanumeric characters. From the [tests](sentenceCaseToCamelCase/index.test.ts):

```ts
sentenceCaseToCamelCase("Le camel case")         // returns leCamelCase
sentenceCaseToCamelCase("Le-camel  case")        // returns lecamelCase (note lowercase c)
sentenceCaseToCamelCase("Le Camel Case")         // returns leCamelCase
sentenceCaseToCamelCase("$#@%%Le Camel %%%Case") // returns leCamelCase
```

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="snakeCaseToSentenceCase"><a href="src/utilities/snakeCaseToSentenceCase/index.ts">snakeCaseToSentenceCase</a></h2>

Passed a string in *snake_case*, returns that string in *Sentence case*. Returns an empty string for no input.

From the [tests](snakeCaseToSentenceCase/index.test.ts):

```ts
snakeCaseToSentenceCase("my_snake_case")      // returns "My snake case"
snakeCaseToSentenceCase("___my_snake_case__") // returns "My snake case"
snakeCaseToSentenceCase("yo snake_case bro")  // returns "Yo snake case bro"
snakeCaseToSentenceCase()                     // returns ""
```

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="snakeCaseToTrainCase"><a href="src/utilities/snakeCaseToTrainCase/index.ts">snakeCaseToTrainCase</a></h2>

Passed a string in *train-case*, returns that string in *Sentence case*. Returns an empty string for no input.

From the [tests](snakeCaseToTrainCase/index.test.ts):

```ts
snakeCaseToTrainCase("my_snake_case")      // returns "my-snake-case"
snakeCaseToTrainCase("___my_snake_case__") // returns "my-snake-case"
snakeCaseToTrainCase("yo snake_case bro")  // returns "yo snake-case bro" (note spaces)
snakeCaseToTrainCase()                     // returns ""
```

Note that non-snake-case words are left alone, so you could conceivably do this:

```tså
snakeCaseToTrainCase("There is this_value and that_value and yet_another_value.")

// returns "There is this-value and that-value and yet-another-value."
```

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="stringToBoolean"><a href="src/utilities/stringToBoolean/index.ts">stringToBoolean</a></h2>

Passed some variant on the string "true" (case insensitive), returns `true`, otherwise `false`. From the [tests](stringToBoolean/index.test.ts):

```ts
stringToBoolean("true")   // returns true
stringToBoolean("tRuE")   // returns true

stringToBoolean("uh, oh") // returns false
stringToBoolean("false")  // returns false
```

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="titleCaseToTrainCase"><a href="src/utilities/titleCaseToTrainCase/index.ts">titleCaseToTrainCase</a></h2>

Converts *Title Case* (or *Sentence case*, to be fair) to *train-case*. Returns an empty string for no input. From the [tests](titleCaseToTrainCase/index.test.ts):

```ts
titleCaseToTrainCase("We be sentence case") // "we-be-sentence-cas"
titleCaseToTrainCase("We Be Title Case") // "we-be-title-case"
titleCaseToTrainCase("we Don't know What we Are?") // "we-don-t-know-what-we-are"
titleCaseToTrainCase() // ""
```

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="unique"><a href="src/utilities/unique/index.ts">unique</a></h2>

Passed an array with duplicate items, returns the array with all duplicates removed, leaving the *first* instance of an item in the array. Example:

```ts

const input = [1, 4, "red", 5, 1, "blue", 6, 1, "red", "green", true, "green"]

unique(input) // returns [1, 4, "red", 5, "blue", 6, "green", trueå]
```
