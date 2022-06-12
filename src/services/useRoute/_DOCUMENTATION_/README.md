<!-- markdownlint-disable-next-line no-inline-html -->
<h1 id="top">The useRoute hook</h1>

The [useRoute](/src/services/useRoute/index.tsx) hook is a very simple React hook that gets the current window.location.href, splits it up, and returns:

```ts
type {
  hash: string
  path: Array<string>
  route: URL
}
```

More importantly, it sets an HTML event listener to listen for **hashchange** events, and whenever the hash changes, it updates the route output.

This is used for **hash-based routing** in this application.
