<!-- markdownlint-disable-next-line no-inline-html -->
<h1 id="top">The useGraphQL hook</h1>

The [useGraphQL](/src/services/useGraphQL/index.tsx) hook accepts a GraphQL endpoint URL and returns an object with two functions:

* `mutate`, which performs mutations, and
* `query`, which performs queries

Under the covers, these are actually the same function. The different names are intended simply to make it clearer what the developer's intent is.

```ts
function useGraphQL<T,>(url: string): GraphQLService<T> // T is the optional return type
```

Hence, each of the functions accepts three parameters:

```ts
function (
  operationName: string,
  query: string,
  variables: Variables,
): Promise<T>
```

Where `Variables` is defined:

```ts
type Variables = {
 [key: string]: undefined | boolean | number | string | Variables | Array<Variables>
}
```

So it's pretty flexible.

The `mutate` or `query` functions (identical under the covers) stringify an object containing the `operationName`, `query`, and `variables` and pass it to a fetch POST request as the body. It also gets the user token, sets an Authorization header, and sets the Content-Type to `application/json`.

And that's all it takes. The response is converted to JSON and returned.

Simple and effective.
