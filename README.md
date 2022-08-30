<!-- markdownlint-disable-next-line no-inline-html -->
<h1 id="top">DDUI (DDUI) Overview</h1>

**Note: this is a copy of the open-source-able portions of a proprietary app, hence the `App` folder with all the bespoke code is missing. What remains here is intended to be use "elsewhere". Also note, this is not fully implemented. Some code could not be finished before I moved on, so it was left for the next dev to complete.**

This was an experiment in best practices (but the code is currently in production at a private wealth bank).

If you're new to this code base, here is something important to understand: every single choice in this application&mdash;*every single one of them*&dash;was made for a well-considered reason. There were no arbitrary decisions. Nothing was done because "that's the way we've always done it". Everything was viewed with fresh eyes and a questioning attitude: Is this the best way? Can this be done better?

From the use of an event bus and decoupled modules/components to the choice of state machines for state management to the reduced dependence on other peoples' code all the way to decisions about formatting, coding paradigms, typing, etc. *everything* was carefully examined and an attempt at **best** practice was made.

This README (and the other documentation here) attempts to explain not only what was done but **why**. The next dev may change things back, but let's hope it is because there is clear evidence that his or her way is better, and not simply because that is what that dev is used to or "prefers". Consistency in a code base is essential, so if changes must be made, they should be *all or nothing*. The worst thing would be to mix and match random styles. There is enough code like that around (everywhere) already. No?

1. [Links to other documentation](#links-to-other-documentation)
2. [The application](#the-application)
   1. [Using pnpm](#using-pnpm)
   2. [An important note on reusability](#an-important-note-on-reusability)
   3. [Accessibility and responsiveness](#accessibility-and-responsiveness)
3. [The application hierarchy](#the-application-hierarchy)
   1. [How we didn't do it](#how-we-didnt-do-it)
   2. [How we did do it and why](#how-we-did-do-it-and-why)
4. [The `modules` folder](#the-modules-folder)
   1. [The `getComponent` renderer](#the-getcomponent-renderer)
      1. [Mutations](#mutations)
   2. [The `icons` module](#the-icons-module)
5. [The `services` folder](#the-services-folder)
   1. [The `pubsub` module](#the-pubsub-module)
   2. [The `useGraphQL` hook](#the-usegraphql-hook)
   3. [The `useMachines` hook](#the-usemachines-hook)
   4. [The `useRoute` hook](#the-useroute-hook)
6. [The `utilities` folder](#the-utilities-folder)
7. [Miscellaneous](#miscellaneous)
   1. [Semicolons](#semicolons)
   2. [Tabs](#tabs)
   3. [Quotation marks](#quotation-marks)
   4. [Why not types.d.ts?](#why-not-types-d-ts)
   5. [Where are the enums?](#where-are-the-enums)

This is a **micro-app**.

It stands alone and has a single responsibility.

When we began work on this standalone app, the decision was to use this small application to achieve several goals:

1. To experiment with advanced practices, such as micro-apps and data-driven UIs.
2. To provide an example app of best practices so that some of these practices could be adopted in other code bases.
3. To provide proofs of concept for:
   1. **Micro-apps**: small, standalone apps that allow us to experiment with new ideas and practices and provide many benefits in terms of security, reduced tech debt, scalability, etc.
   2. **Data-driven UIs**: a generic front end pulling enough metadata from the back end to be able to build the complete front end interface *without hard-coding any business logic in the client*. The advantages of this are that there is a single source of truth, and that the front end can be updated without touching it simply by updating the results returned from a query: build once, use over and over again: a high-level DRY.
   3. **Loose coupling**: use of a **PubSub** module to allow components to communicate through an event bus, similar to the actor model.
   4. **State machines**: use of [XState](https://xstate.js.org/) state machines in the components to strictly control state, limiting states to a finite set and preventing indeterminate states.
   5. **Vanilla**: as close to vanilla code as possible, limiting dependencies to a bare minimum to reduce reliance on code over which we have no control and by doing so to improve security, ensure that devs understand *all* the code, and reduce tech debt.
   6. **[Modular CSS](https://m-css.com/)** to keep CSS next to the code it affects. See [typescript-plugin-css-modules](https://github.com/mrmckeb/typescript-plugin-css-modules#readme). [CSS Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference) are used to provide simple theme-ability. See [theme.css](src/Ddui/theme.css).

Not everyone participated in every decision, so blame the dev.

More on these decisions below.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="links-to-other-documentation">Links to other documentation</h2>

There is a great deal more documentation explaining every aspect of this application. **Please keep all documentation current and synchronized with the code!** Obsolete and out-of-date documentation is worse than no documentation and wastes the considerable effort to write this documentation.

1. [modules](/src/modules/_DOCUMENTATION_/README.md)
   1. [getComponent](/src/modules/getComponent/_DOCUMENTATION_/README.md)
      1. [Mutation](/src/modules/getComponent/Mutation/_DOCUMENTATION_/README.md)
      2. [StringField](/src/modules/getComponent/StringField/_DOCUMENTATION_/README.md)
2. **services**
   1. [pubsub](/src/services/pubsub/_DOCUMENTATION_/README.md)
   2. [useGraphQL](/src/services/useGraphQL/_DOCUMENTATION_/README.md)
   3. [useMachines](/src/services/useMachines/_DOCUMENTATION_/README.md)
      1. [composeMachineConfigs](/src/services/useMachines/composeMachineConfigs/_DOCUMENTATION_/README.md)
         1. [createAnimationMachineConfig](/src/services/useMachines/composeMachineConfigs/createAnimationMachineConfig/_DOCUMENTATION_/README.md)
         2. [createCounterMachineConfig](/src/services/useMachines/composeMachineConfigs/createCounterMachineConfig/_DOCUMENTATION_/README.md)
         3. [createCSSTransitionMachineConfig](/src/services/useMachines/composeMachineConfigs/createCSSTransitionMachineConfig/_DOCUMENTATION_/README.md)
         4. [createFocusMachineConfig](/src/services/useMachines/composeMachineConfigs/createFocusMachineConfig/_DOCUMENTATION_/README.md)
         5. [createFormMachineConfig](/src/services/useMachines/composeMachineConfigs/createAnimationMachineConfig/_DOCUMENTATION_/README.md)
         6. [createInputMachineConfig](/src/services/useMachines/composeMachineConfigs/createInputMachineConfig/_DOCUMENTATION_/README.md)
         7. [createKeyboardMachineConfig](/src/services/useMachines/composeMachineConfigs/createKeyboardMachineConfig/_DOCUMENTATION_/README.md)
         8. [createMaskMachineConfig](/src/services/useMachines/composeMachineConfigs/createMaskMachineConfig/_DOCUMENTATION_/README.md)
         9. [createNestedMachineConfig](/src/services/useMachines/composeMachineConfigs/createNestedMachineConfig/_DOCUMENTATION_/README.md)
         10. [createOperationMachineConfig](/src/services/useMachines/composeMachineConfigs/createOperationMachineConfig/_DOCUMENTATION_/README.md)
         11. [createParallelMachineConfig](/src/services/useMachines/composeMachineConfigs/createParallelMachineConfig/_DOCUMENTATION_/README.md)
         12. [createPointerDownMachineConfig](/src/services/useMachines/composeMachineConfigs/createPointerDownMachineConfig/_DOCUMENTATION_/README.md)
         13. [createPointerEnterMachineConfig](/src/services/useMachines/composeMachineConfigs/createPointerEnterMachineConfig/_DOCUMENTATION_/README.md)
         14. [createPointerMoveMachineConfig](/src/services/useMachines/composeMachineConfigs/createPointerMoveMachineConfig/_DOCUMENTATION_/README.md)
         15. [createPointerOverMachineConfig](/src/services/useMachines/composeMachineConfigs/createPointerOverMachineConfig/_DOCUMENTATION_/README.md)
         16. [createToggleMachineConfig](/src/services/useMachines/composeMachineConfigs/createToggleMachineConfig/_DOCUMENTATION_/README.md)
         17. [createTouchMachineConfig](/src/services/useMachines/composeMachineConfigs/createTouchMachineConfig/_DOCUMENTATION_/README.md)
   4. [useRoute](/src/services/useRoute/_DOCUMENTATION_/README.md)
3. [utilities](/src/utilities/_DOCUMENTATION_/README.md)

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="the-application">The application</h2>

DDUI is a very simple app, and this is deliberate. Every effort has been made to **keep dependencies to a minimum**. This makes it easy to update the app and to keep it current with the latest security releases and patches.

The build system is [ViteJS](https://vitejs.dev/). The base application was generated using the [react-ts](https://stackblitz.com/edit/vitejs-vite-vqdgfd?file=index.html&terminal=dev) template. [vite-aliases](https://github.com/subwaytime/vite-aliases#readme) is used to allow top-down importing and portability.

Testing is [Vitest](https://vitest.dev/) with [@testing-library/react](https://testing-library.com/). [Playwright](https://playwright.dev/) is planned for end-to-end testing, but not yet implemented. [Storybook](https://storybook.js.org/docs/react/get-started/introduction) is also in the works, but not yet implemented. [c8](https://github.com/bcoe/c8#readme) is used for code coverage reports by Vitest.

State is handled via [XState](https://xstate.js.org/) state machines. Routing is simple hash routing using HTML anchor tags, nothing fancy. GraphQL is handled with nothing more than [fetch and a POST request](src/services/useGraphQL/index.tsx).

Polyfills for [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl), [Temporal](https://tc39.es/proposal-temporal/docs/cookbook.html), [UUIDs](https://github.com/uuidjs/uuid#readme), and [fetch](https://github.com/lquixada/cross-fetch#readme) allow use of the latest code. Hopefully, these can be removed soon.

The app was built using [pnpm](https://pnpm.io/installation), but the scripts are set to run `npm` so future devs are not limited to using pnpm. But you really should.

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="using-pnpm">Using <a href="https://pnpm.io">pnpm</a></h3>

If you want to continue with `pnpm` (recommended), here is how.

The back end (e.g., kubernetes), as of this writing, uses `npm`. So the trick to using `pnpm` locally is:

1. Delete the node_modules folder and use `pnpm i` to reinstall everything. [`pnpm` does `node_modules` differently](https://pnpm.io/motivation#creating-a-non-flat-node_modules-directory).
2. `pnpm-lock.yaml` is the lock file for `pnpm`. It is in the `.gitignore` file so it will be local only.
3. Use `pnpm` commands normally.
4. When pushing to GitHub for a PR:
   1. Delete the `node_modules` directory.
   2. Install the dependencies again, but with `npm i` to generate an up-to-date `package-lock.json` file. This will be committed to the repo.
   3. Do the push and the PR normally.
   4. Once that's done, delete `node_modules` again and reinstall with `pnpm i`.
   5. All set.

Better still, get the kubernetes container to  use `pnpm`. Then you have the best of all worlds. If `pnpm` becomes available on the server, just:

1. Change the script commands from `npm` and `npx` to the `pnpm` and `pnpx` equivalents.
2. Remove `pnpm-lock.yaml` from the `.gitignore` file and add in `package-lock.json`.
3. Delete the `node_modules` folder and `package-lock.json` and run `pnpm i` to install everything again with `pnpm`
4. Update this documentation.
5. You should be good to go. Test it on the server.

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="an-important-note-on-reusability">An important note on reusability</h3>

Throughout this documentation, we refer to code as "generic". In some cases, the code is truly generic in that it could be used on any web application for any organization.

But in general, "generic" means simply *not specific to the DDUI functionality*. For example, the components in the [modules/getComponent](src/modules/getComponent/) folder are intended for use on company apps. They follow the company design specification. They might include company-specific items such as logos, brand colors, etc. But they are *not* specific to Ddui.

The goal of moving anything not specific to DDUI outside of the [Ddui](src/Ddui/) folder was to make this micro-app reusable *across company*, not to create a generic wiki or CMS.

Still, for example, the [useGraphQL](src/services/useGraphQL/index.tsx) hook does *not* hard code the microservice URLs. Instead, those are passed in from within the [Ddui](src/Ddui/) folder. This is because *not all company apps will require access to all micro-services*. Other company apps have hard-coded connections to client, profile, contract, etc. There is no advantage to this. The [useGraphQL](src/services/useGraphQL/index.tsx) hook can be configured on the fly&mdash;even from the response to a GraphQL query. So `useGraphQL` is truly generic.

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="accessibility-and-responsiveness">Accessibility and responsivenesss</h3>

We've attempted to follow the [WCAG 2.1 guidelines](https://www.w3.org/WAI/WCAG21/Understanding/) as closely as possible. There is still plenty of work to do. Please be aware of accessibility issues when updating this code.

The [axe DevTools](https://deque.com/axe/devtools/) from Deque were used to keep accessibility errors to zero. The Chrome Lighthouse extension was also used to keep **performance**, **accessibility**, **best practices**, and **SEO** as close to 100% as possible. (Performance is the difficult one&mdash;the others were all 100% as of this writing).

**Responsiveness** is accomplished in the Ddui app entirely with CSS. As the app acts differently on a smart phone&mdash;the user can view the sidebar navigation or the main page, but not both simultaneously&mdash;there is a snippet of code that differentiates between `/` and `/#`. `/` shows only the navigation (for use by a phone). `/#` automatically redirects to the first page, e.g., `/#` -> `/#/bob-dobbs/personal-details`. That redirect is performed in the [App](src/Ddui/App/index.tsx) component:

```ts
if (not(window.location.hash) && site?.pathName && site?.page?.[0]?.pathName) {
  window.location.href = `/#/${site?.pathName}/${site?.page?.[0]?.pathName}`
}
```

The goal was to avoid using React hacks to determine viewport size. This may be a bit brittle. Time will tell.

The `Back` link appears only in smartphone mode. The code is in the [Interface](src/Ddui/App/Main/Page/Interface/index.tsx) component and is shown or hidden by CSS:

```ts
<nav className={css.backLink}>
  <ChevronLeftIcon height="0.75rem" width="0.75rem" />
  <a href="#">Back</a>
</nav>
```

Other than that, responsiveness is by CSS media query.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="the-application-hierarchy">The application hierarchy</h2>

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="how-we-didnt-do-it">How we didn't do it</h3>

Most developers organize their code into folders and files haphazardly. If they group files and folders, they tend to do so by type of code or file. For example, this was a common way to organize folders not too long ago:

- actions
- api
- components
- containers
- reducers
- shared
- App.js
- store.js

Why? What is the advantage of this system? For example, why the `shared` folder if items in the other folders are also shared? What makes those in the `shared` folder different? What could "shared" mean in this context?

Also, these folders are in *parallel*, so one might expect that their functions are parallel. But are they? Aren't `containers` wrappers around `components`? How is that hierarchical relationship expressed here? It isn't. Just the reverse, it is hidden and the folders are misleading.

Similarly, what does the `api` do? Does it do anything by itself? Or is it used by individual components or maybe the store? Doesn't it make more sense to include the API calls *where they are needed?* If there is anything in this folder, then it should be generic, in which instance it doesn't belong in with the application but should be outside of it.

As for `actions` and `reducers`, aren't these specific to where they are used in the application? Or if they are generic and used by the store, then why are they *siblings* of the store instead of children?

In short, this is no *hierarchy* at all. It is flattened without regard for the *relationships* between the various functions and components. Furthermore, it makes distinctions, such as `action` or `reducer` that are irrelevant. What *is* relevant is what a *specific* action and a *specific* reducer do *in the context of a component or the store*. So that's where they belong.

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="how-we-did-do-it-and-why">How we did do it and why</h3>

The code in Ddui is organized using the *self-contained apps* pattern. Under the `src` folder there are four sub-folders:

- Ddui
- modules
- services
- utilities

These folders are organized for three purposes:

1. To pull generic code out into modules that could easily be moved into npm or deno and shared.
2. To put the code *as close as possible* to where it is used.
3. To create a folder hierarchy that **mirrors** the hierarchy of the application itself.

The most important rule of this taxonomy is:

**Put every piece of code&mdash;function, component, constant&mdash;as close as possible to where it is used.**

In practice, this means to put utility functions inside the folders of the code that uses them.

**If a piece of code is used by two or more other piece of code, *then it rises in the folder hierarchy only to the node at which the branches using that code converge*.** See below.

**Folders are treated as modules in this system.** The name of the Component or function is the name of the module, hence of the folder. The *file* containing the actual Component or function is always named `index` (or `mod` in Deno) to avoid useless redundancy.

**All files associated with a module belong in that module's folder.** Hence:

```
Header/
  index.tsx
  index.test.tsx
  index.module.css
  index.stories.ts
  README.md
```

The exception to the index rule is `README.md` for documentation so that it is shown *by default* when that folder is opened on GitHub.

This hierarchical arrangement is true for components, constants, and utility functions as well. If they are used only in a single module, then they belong in that module's folder, and remember, *every folder is treated as a module*. So modules can be nested to any depth.

If the header has a Navbar that is used only in the Header, then this is where it goes:

```
Header
  Navbar
```

And if the Navbar has a Link that is used only on that navbar, then that's where it goes:

```
Header
  Navbar
    Link
```

And so on. But suppose that the Navbar is reused in several places:

```
src
  App
    Header
      Navbar
    Main
      Sidebar
        Navbar
      Article
    Footer
      Navbar
```

In this case, the Navbar should be moved up to a `shared` folder *in the same node where the branches that use the Navbar meet*:

```
src
  App
    Header
    Main
      Sidebar
      Article
    Footer
    shared
      Navbar
```

`Navbar` is used in `Header`, `Main/Sidebar`, and `Footer`, so its `shared` folder should be a *sibling* to those folders. And now the "shared" name has real meaning: shared among modules or submodules in this folder.

Finally, **one function or component per file, exported as the default export**. Typically, no re-exporting. For example, [Page](src/Ddui/App/Main/Page/index.tsx) imports [Interface](src/Ddui/App/Main/Page/Interface/index.tsx) and [Navbar](src/Ddui/App/Main/Page/Navbar/index.tsx). As these are not re-used elsewhere, they are in the same folder and are imported thus:

```ts
import Interface from "./Interface"
import Navbar from "./Navbar"
```

By naming the file `index` we avoid this pointless redundancy, seen often:

```ts
import Interface from "./Interface/Interface"
import Navbar from "./Navbar/Navbar"
```

And by putting the component name on the Folder instead of the file, we can group (and hide) all the extra files&mdash;test, CSS, documentation, stories, etc.&mdash;instead of clogging up a folder with dozens of files for different modules. Each folder holds the files for **one module**. Submodules are folders in that module's folder.

This keeps both the imports and the folder/file structure neat and clean. Sometimes it means that files are very short. I have heard some complaints about this (not at company), but seriously, so what? Short files are easiest to read. Why this fear of files? In modern IDEs, you can open as many as you like at once and juxtapose them. Short files make this easier, not harder. Here is an example of a [very useful utility](src/utilities/noOp/index.ts) and a very short file:

```ts
export default function noOp<T>(_?: T): void {
  return undefined
}
```

Essentially, **zero cognitive load**. Beauty.

The one complaint regularly voiced about this&mdash;that you can't see the folder names on the tabs in the IDE if you have many of them open at once&mdash;is a canard. If you can't see the folder names, *then you have way too many files open at once*. Close a few! It's absurd to make a mess of your folders and files just so you can see the filenames when you have too many tabs open at once. Seriously?

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="the-modules-folder">The <code>modules</code> folder</h2>

The [modules](src/modules/) folder contains various generic (to company) components ([getComponent](src/modules/getComponent/)) and icons ([icons](src/modules/icons/)). All of this is wired up using the output of the [antiCorruptionLayer](src/Ddui/antiCorruptionLayer/mapQueryResponseToSiteConfig/index.ts) mapper.

[Read more about the modules folder](src/modules/_DOCUMENTATION_/README.md).

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="the-getcomponent-renderer">The <code>getComponent</code> renderer</h3>

In the `modules` folder is a [getComponent](src/modules/getComponent/) function that takes a configuration object and returns a React component, recursing down through any children to build the child components as well. **This is the function that builds the site**. It is remarkably simple:

```tsx
export default function getComponent(component: ComponentConfig): JSX.Element | null {
  const { datatype, ...props } = component
  const Component = components[datatype as TypesOfComponent] as () => JSX.Element

  return Component ? <Component key={props.id} {...props} /> : null
}

const components: Partial<Record<TypesOfComponent, unknown>> = {
  ACTION: Action,
  CONTENT: Content,
  ELEMENT_DATATYPE: ElementField,
  EMAIL_DATATYPE: EmailField,
  EXTERNAL_LINK: ExternalLink,
  NAME_DATATYPE: FullNameField,
  GROUP: Group,
  IMPORTANT_NOTE: ImportantNote,
  MUTATION: Mutation,
  PHONE_DATATYPE: PhoneField,
  STRING_DATATYPE: StringField,
}
```

The list of components can easily be extended to add new components, such as an `AddressFinder`. Many components, however, can simply be configured rather than coded.

Because this is intended to be a *data-driven UI*, the components are named after the **datatype** they handle. The reasoning is that what is important is not the widget, but the data that is being displayed or edited. In some instances&mdash;email, phone&mdash;the datatype is the same as the HTML Input type. But often it is not. For example:

- [Action](src/modules/getComponent/Action/index.tsx) represents an event that causes a change of state. It might be a form submission or linking to another view. Generally, it is represented by a `button` or an `a` element.
- [Content](src/modules/getComponent/Content/index.tsx) represents HTML content, such as paragraphs, lists, etc. It uses `dangerouslySetInnerHTML`, so be careful!
- [ElementField](src/modules/getComponent/ElementField/index.tsx) handles a single element in a set of elements, essentially meaning "choose one" from an enumerated set. This could be represented by radio buttons or an HTML select element or a combobox. Which it uses could be controlled by passing an argument such as `preferSelect` or could be controlled by the data itself, for example, use radio buttons for up to five options, a select for more. This is a WIP.
- [FullNameField](src/modules/getComponent/FullNameField/index.tsx) an example of a field based on an **algebraic datatype**, in this instance a person's full name. This could be modified to include prefixes, suffixes, etc.
- [Group](src/modules/getComponent/Group/index.tsx) is used to group fields together. If a `title` is included, then it returns a titled section for semantic purposes (HTML Outline for accessibility), otherwise a div.
- [Mutation](src/modules/getComponent/Mutation/index.tsx) represents a form, generally. Passed an `operationName`, a GraphQL `query` string, and a `variables` object, it will provide a form and a submit button and will use the [useGraphQL](src/services/useGraphQL/index.tsx) hook to send a GraphQL mutation to the micro-service. This, too, is a WIP.
- [StringField](src/modules/getComponent/StringField/index.tsx) handles string input. It can use an HTML input of type `text` or an HTML textarea, depending on the length of text expected. (Could be extended to handle `contenteditable` divs as well.)

And so on.

The idea behind, for example, the `StringField` is that it is **the shape of the data**&mdash;whether it contains newlines, its max length, etc.&mdash;that should determine the type of widget used. This is the thinking behind **all** of these components: they are not **types of widget** but **views into the data**.

Here is an example configuration for a [StringField](src/modules/getComponent/StringField/index.tsx) component. Note that it is mostly just the props for the component:

```ts
{
  datatype: "STRING_DATATYPE",
  label: "Display name",
  id: generateShortId(),
  initialValue: displayName,
  isReadOnly: true,
  isRequired: true,
  mutationId, // the form ID
  name: "displayName",
}
```

The `getComponent` function simply passes this configuration to the component as its props. It's that simple.

[Read more about the getComponent renderer](src/modules/getComponent/_DOCUMENTATION_/README.md).

<!-- markdownlint-disable-next-line no-inline-html -->
<h4 id="top">Mutations</h4>

The [Mutation](/src/modules/getComponent/Mutation/index.tsx) component is essentially a `<form>` element used to mutate data on the server. Here is the configuration it expects:

```ts
export type MutationProps = {
  args: Variables
  buttonText?: string
  enabledEvents?: Array<FormTransitions>
  id: string
  isReadOnly?: boolean
  label?: string
  machineConfig?: CreateMachineParamsConfig
  mutation?: string
  name: string
  elements: Array<ComponentConfig>
  url: string
  mutableVariableNames?: Array<string>
}
```

See the [Mutation documentation](/src/modules/getComponent/Mutation/_DOCUMENTATION_/README.md) for more information.

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="the-icons-module">The <code>icons</code> module</h3>

The [icons](src/modules/icons/) folder contains Icon components (SVG wrapped in a React component) organized by type. These are the generic Material Design icons used in all the company apps.

In contrast, the icons that are *specific* to the DDUI app are defined where they are used, in [src/Ddui/App/Main/Page/Navbar/NavLink/Icons/](src/Ddui/App/Main/Page/Navbar/NavLink/Icons/).

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="the-services-folder">The <code>services</code> folder</h2>

The `services` folder contains generic services used by the front end. It does not contain *any* information related to the specific back end services it uses (other than that it uses Auth0), neither does it know anything about the front end that uses it. It is as decoupled as it can be.

There are:

- [pubsub](src/modules/pubsub/) (a pub-sub event bus)
- [useGraphQL](src/modules/useGraphQL/) (for making GraphQL queries to any back end)
- [useMachines](src/modules/useMachines) (for composing various state machines)
- [useRoute](src/modules/useRoute) (for looking up the window.location.href)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="the-pubsub-module">The <a href="src/services/pubsub/">pubsub</a> module</h3>

The [PubSub module](src/services/pubsub/) provides an easy way for components, etc. to communicate with each other in a **decoupled** way.

Each component that raises events may optionally publish those events to the Event Bus. The event contains an `eventName` (e.g., `BLUR`, or `INPUT_UPDATED`), a unique ID, a timestamp, and a data object that can contain any event-related data. Events can be associated with a **topic**.

Other components can subscribe to events, either all events ([subscribeToAllTopics](src/services/pubsub/subscribeToAllTopics/index.ts)) or only to a specific topic ([subscribe](src/services/pubsub/subscribe/index.ts)). Subscriptions may also be "once" (one time only then unsubscribed) or continual ("always").

So, for example, a [StringField](src/modules/getComponent/StringField/index.tsx) might publish events such as `FIELD_FOCUS`, `FIELD_UPDATE`, or `FIELD_BLUR` together with a topic that is the ID of the field's associated form. [Note: these are published by the field's [state machine](src/services/useMachines/composeMachineConfigs/createInputMachineConfig/index.ts) on state transitions, not by the field itself.]

Meanwhile a form might subscribe to all events with its ID as the topic. It would then receive the `FIELD_FOCUS`, `FIELD_UPDATE` and `FIELD_BLUR` events from the individual fields associated with that form along with event data, and could update it's own state accordingly. **Because it uses its ID as the `topic`, it would respond to events only from its own fields**.

Form fields then only need to know the ID of the form with which they're associated (this is handled in the anti-corruption layer mapping), but otherwise they are completely decoupled from their associated form. *They don't even need to sit inside the &lt;form&gt; element.* From anywhere on the page you can add an [Action](src/modules/getComponent/Action/index.tsx) element with the associated form ID and it will publish events (such as `SUBMIT_ACTION`) that the form ([Mutation](src/modules/getComponent/Mutation/index.tsx)) can listen for and respond to. This is remarkably flexible.

The [Mutation](src/modules/getComponent/Mutation/index.tsx) also publishes "form" events, but as with the string field, from its [state machine](src/services/useMachines/composeMachineConfigs/createFormMachineConfig/index.ts), for example on `FORM_SUBMIT` or `FORM_UDATE`.

This publish-subscribe pattern can be used for communication between any components in the app. This module could also be extended with [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) or websockets or [Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) to pass events between browser tabs or even devices (planned but not yet implemented).

The PubSub system is used by the state machines automatically. See `useMachines` below.

[Read more about the PubSub module](src/services/pubsub/_DOCUMENTATION_/README.md).

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="the-usegraphql-hook">The <a href="src/services/useGraphQL/index.tsx">useGraphQL</a> hook</h3>

The [useGraphQL](src/services/useGraphQL/index.tsx) hook takes a URL for the GraphQL service and returns `mutate` and `query` functions.

The `query` function takes three arguments:

1. An `operationName` (a string)
2. A `query` (a GraphQL query or mutation as a string)
3. A `variables` object with the variables needed for the query/mutation, if any

It does a POST of this data to the URL of the GraphQL service, then returns the response as a JSON object. Easy peasy.

The `mutate` function is simply an alias for the `query` function to make code using the function clearer to the dev.

All information specific to the queries (and the URL of the service) is to be found exactly where it is needed in the self-contained app that uses it. See [mapQueryResponseToSiteConfig](src/Ddui/antiCorruptionLayer/mapQueryResponseToSiteConfig/index.ts) or [Mutation](src/modules/getComponent/Mutation/index.tsx).

Who needs the bloated Apollo? This simple system works fine and is easy to troubleshoot. Need a cache? Here's one: `export const cache = {}`.

[Read more about the useGraphQL hook](src/services/useGraphQL/_DOCUMENTATION_/README.md).

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="the-usemachines-hook">The <a href="src/services/useMachines/">useMachines</a> hook</h3>

The [useMachines](src/services/useMachines/index.ts) hook takes a **simple** configuration object and on the basis of that constructs an XState state machine configuration, then passes that to the `@xstate/react` `useMachine` hook to create an actual machine. It also creates a set of **actions** that can be used to transition the machine(s) and **statuses** to check the current state.

The output can be a single machine or **nested** or **parallel** machines. For example, this configuration will create a nested, parallel machine for a form field:

```ts
{
  NESTED: {
    id: nanoid(),
    children: {
      PARALLEL: {
        children: {
          HISTORY: { history: "deep" }, // Currently, not implemented but planned
          FOCUS: { id: nanoid() },
          MASK: { id: nanoid(), initial: options.initialMaskState },
          TOUCH: { id: nanoid() },
          INPUT: {
            id: nanoid(),
            initialValue: options.initialValue,
            name: options.name,
            validate: options.validate,
          },
        },
      },
    },
    injectInto: "enabled",
    parent: {
      OPERATION: {
        id: "email-field-machine",
      },
    },
  },
}
```

The above creates a *parent* machine that provides `enabled` and `disabled` states, and within the `enabled` state a *nested parallel* machine that handles focus, masking, touch, and changes to input. How does it know to insert the parallel states into `enabled` and not `disabled`? Good question. We just need to pass the `injectInto` parameter set to the name of the state into which we want to inject the child state(s).

Can we inject machines into multiple child states? Um, no. But feel free to extend this.

The [useMachines](src/services/useMachines/index.tsx) function calls [composeMachineConfigs](src/services/useMachines/composeMachineConfigs/index.ts) and passes it the machine configuration, and the `composeMachineConfigs` function passes back a configuration for an XState state machine that can be passed to XState's `createMachine`. As `createMachine` takes *two* parameters, the configuration is a tuple&mdash;the machine and an object with the guards and actions&mdash;that can be spread as the arguments to `createMachine`.

For example, this configuration:

```ts
const config = {
  "enabledEvents": [
    "MASK",
    "UNMASK",
  ],
  "id": "mask-machine",
  "initial": "masked"
}
```

Returns this XState *machine* configuration:

```ts
{
  machine: {
    context: {
      enabledEvents: [
        "MASK",
        "UNMASK",
      ],
      topic: "topic",
    },
    id: "mask-machine",
    initial: "masked",
    states: {
      unmasked: {
        on: {
          MASK: {
            actions: ["publishMaskEvent"],
            target: "masked",
          },
        },
      },
      masked: {
        on: {
          UNMASK: {
            actions: ["publishUnmaskEvent"],
            target: "unmasked",
          },
        },
      },
    },
  },
},
{
  actions: {
    publishMaskEvent: (context, event) => {
      const { enabledEvents = [], topic, ...rest } = context;

      if (enabledEvents.includes(event.type)) {
        publish({ eventName: "MASK", data: { ...rest } }, { topic: topic });
      }
    },
    publishUnmaskEventEvent: (context, event) => {
      const { enabledEvents = [], topic, ...rest } = context;

      if (enabledEvents.includes(event.type)) {
        publish({ eventName: "UNMASK", data: { ...rest } }, { topic: topic });
      }
    },
  },
}
```

These objects provide the arguments to `useMachine`:

```ts
const { machine, actions } = createMaskMachineConfig(config)

const maskStateMachine = createMachine(machine, { actions })
```

[top](#top)

The [useMachines](src/services/useMachines/index.tsx) function also calls [composeActions](src/services/useMachines/composeActions/index.ts) with the same configuration plus the `send` method returned from the XState `useMachine` (React) hook. The [composeActions](src/services/useMachines/composeActions/index.ts) function then returns an object with various actions, such as `focus`, `blur`, `update`, `over` (pointerover), etc. **that can be used as event handlers**.

**When the action is triggered, it will send a transition to the state machine.**

It's pretty simple. For example, these are the actions associated with the [OperationMachine](src/services/useMachines/composeMachineConfigs/createOperationMachineConfig/index.ts) (enabled/disabled):

```ts
  OPERATION: (send) => ({
    disable: () => send?.({ type: "DISABLE" }),
    enable: () => send?.({ type: "ENABLE" }),
    reset: () => send?.({ type: "RESET" }),
    resume: () => send?.({ type: "RESUME" }),
  }),
```

Some require data, such as this one for the [InputMachine](src/services/useMachines/composeMachineConfigs/createInputMachineConfig/index.ts):

```ts
  INPUT: (send) => ({
    update: (value: string) =>
      send?.({
        type: "INPUT_UPDATE",
        value,
      }),
  }),
```

In the component using the `update` action, you might add it like this:

```tsx
  onBlur={actions.blur}
  onInput={function(event: React.ChangeEvent<HTMLInputElement>) {
    actions.update?.((event.currentTarget as HTMLInputElement).value)
  }}
  onFocus={actions.focus}
```

Here is how this works in the [StringField](src/modules/getComponent/StringField/index.tsx):

```ts
export default function StringField(props: StringDatatypeProps): JSX.Element {
  const {
    autoComplete,
    dataset = {},
    mutationId,
    description,
    label,
    id,
    labelId = generateShortId(),
    machineConfig,
    name,
    type = "text",
    variant,
  } = props

  const config: CreateMachineParamsConfig = useMemo(
    () => (machineConfig as CreateMachineParamsConfig ?? makeStringFieldConfiguration(props)),
    [],
  )

  const { actions, context, status } = useMachines(config)

  return (
    <div
      key={id}
      {...makeDataAttributes(dataset)}
      className={concatenateCssClasses({
        [css.stringField]: true,
        [css.stringFieldDisabled]: status.disabled?.(),
        [css.stringFieldFocused]: status.focused?.(),
      })}
    >
      <label
        htmlFor={id}
        id={labelId}
        className={concatenateCssClasses({
          [css.labelError]: status.inputInvalid?.(),
        })}
        onClick={actions?.disable}
      >
        {label}
      </label>
      <input
        aria-labelledby={labelId}
        autoComplete={autoComplete}
        className={concatenateCssClasses({
          [css.inputError]: status.inputInvalid?.(),
          [css.inputDense]: variant === "DENSE",
        })}
        disabled={status.disabled?.()}
        form={mutationId}
        id={id}
        name={name}
        onBlur={actions?.blur}
        onInput={function(event: React.ChangeEvent<HTMLInputElement>) {
          actions?.inputUpdate?.((event.currentTarget as HTMLInputElement).value)
        }}
        onFocus={actions?.focus}
        type={type}
        value={(context as Record<string, unknown>).value as string || ""}
      />
      <HelpOrError
        errors={context.errors as Array<string>}
        description={description}
        id={`${id}-help-or-error`}
      />
    </div>
  )
}
```

(This could probably use a bit of refactoring...)

You can [check out the various machines here](src/services/useMachines/composeMachineConfigs/_DOCUMENTATION_/.md).

[Read more about the useMachines hook](src/services/useMachines/_DOCUMENTATION_/README.md).

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="the-useroute-hook">The <a href="src/services/useRoute/index.tsx">useRoute</a> hook</h3>

The [useRoute hook](src/services/useRoute/index.tsx) simply provides components with access to the hash, path, and full route of the current URL (window.location.href), and provides an event listener to listen for hash changes which are used by Ddui's hash-based internal routing.

It's quite simple:

```ts
export default function useRoute(): {
 hash: string
 path: Array<string>
 route: URL
} {
 const [route, setRoute] = useState<URL>(new URL(self.location.href))

 const updateRoute = useCallback(
  () => setRoute(new URL(self.location.href)),
  [],
 )

 useEffect(() => {
  self.addEventListener("hashchange", updateRoute, false)

  updateRoute()
 }, [updateRoute])

 return {
  hash: route.hash,
  path: route.hash.replace(/^#\//, "").split("/"),
  route,
 }
}
```

[Read more about the useRoute hook](src/services/useRoute/_DOCUMENTATION_/README.md).

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="the-utilities-folder">The <a href="src/utilities/">utilities</a> folder</h2>

The top-level utilities folder provides simple utilities functions. Rather than importing yet another dependency (e.g., Ramda, Lodash) for just a few functions, we've added them here as Vanilla JS/TS.

Do we really need yet another library for functions like this:

```ts
export default function identity<T>(value: T): T {
  return value
}
```

Or to do nothing more than join classnames that return truthy (what the npm `classnames` library does):

```ts
export default function concatenateCssClasses(classNames: {
  [className: string]: boolean | undefined
}): string {
  return Object.entries(classNames)
    .reduce(
      (classList: Array<string>, [className, include]) => [...classList, ...(include ? [className] : [])],
      [],
    )
    .join(" ")
}
```

Hope not. An entire dependency eliminated with ten lines of code. What a concept.

[Read more about the Utilities module](src/utilities/_DOCUMENTATION_/README.md).

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="miscellaneous">Miscellaneous</h2>

As mentioned above, **no decision was made arbitrarily regarding this application**. There is a *reason* for every choice, and that includes **formatting**, linting, choice of dependencies (or to avoid them), organization of files/folders, etc.

This application does not use ESLint or Prettier, choosing to use the much faster Deno options, [deno_lint](https://github.com/denoland/deno_lint) and [dprint](https://dprint.dev/). The formatting options are configured in `./dprint.json`. Tabs, no semiscolons, double quotations, etc. were deliberate choices, the reasoning for them provided below.

This application was also built with `pnpm` instead of `npm`. It's faster, smarter, and more secure. And they're nice people, not an enormous, faceless, sociopathic corporation. If that means anything to you.

You'll need [Deno installed](https://deno.land/manual/getting_started/installation) and [dprint](https://dprint.dev/install/), too. Then you just run them as you'd expect:

```sh
pnpm lint
pnpm fmt
```

Or, of course:

```sh
npm run lint
npm run fmt
```

See [package.json](package.json) for more scripts.

OK, an explanation for the choices likely to be controversial.

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="semicolons">Semicolons</h3>

Automatic Semicolon Insertion (ASI) works beautifully. In more than a decade of not using semicolons, this dev has *never once encountered a problem*. Not once. The exceptions that require a semicolon are rare, and are easily corrected by inserting a single semicolon at the beginning of the line.

That makes semicolons in TS/JS code nothing more than **noise**. They do nothing except add cognitive load. Or give a false sense of security. The code is much cleaner and easier to read without them. So semicolons, begone. TypeScript is going to add them back in anyway.

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="tabs">Tabs</h3>

This might be even more controversial than semicolons, as everyone has been told that we *must use spaces for indentation* for close to two decades now.

And initially that made sense. Back in the day, IDEs weren't all that clever and often you had to look at your code using the browser's "View Page", which insisted on 8-space (!) tabs for some ungodly reason. It was awful.

But over time, things have improved, and now anyone can easily set their tab size to whatever they prefer: 1, 2, 3, 4, 6, 8 spaces. Whatever! But if we use spaces instead, we're forcing other devs to use our settings rather than their own (converting spaces is a giant pain). This is what leads to so much bikeshedding about indent sizes&mdash;the very thing formatters like Prettier were designed to avoid. So why add a formatter *and then force everyone to the same indentation?*

By using tabs instead of spaces:

1. We use *one* character instead of 2-8. *This is what tabs are for!*
2. Everyone can choose their own indentation size, and no one is upset by it.

So try it before you switch it back. You're not really too old to learn new tricks. :-P

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="quotation-marks">Quotation marks</h3>

The biggest surprise for most devs arriving here might be the use of double quotation marks instead of single.

The question they might ask is, *Why?* The answer is, *Why not?*

Despite how that might sound, it is a sincere&mdash;not a snarky&mdash;response. Why not?

In short, why do we mostly use single quotation marks in JS? Are they less weight? No. Single or double, it's still one character.

So why? The real reason is habit. People came to JS from other languages where the single and double quotation marks had different properties. They were used to preferring single, so they made that standard practice.

But in JavaScript and TypeScript, *there is no difference between single and double quotation marks other than visual*.

And that visual difference is **important**. *Double quotation marks are easier to see, thus harder to miss.* That's a very good reason to prefer them over single quotation marks. And Dprint (or prettier) can make this a simple conversion until you get used to them. Once you do, single quotation marks will look funny and pointless.

This argument, by the way, is the same as the argument for using `not` instead of `!`. The bang (`!`) is *very easy to miss*. And as it completely negates its operand, it's pretty damn important.

The philosophy used here is *not* "save as many keystrokes as possible". It is **make the code as easy to read and understand as possible**. Your brain has to do the conversion `! === not`. Use `not` and no converting necessary. Less cognitive load means easier work, fewer bugs, etc.

There is another reason for preferring **double quotation marks**: apostrophes are far more common in English language than quotations:

```ts
"We don't need no stinkin' single quotation marks!"
'We don\'t need no stinkin\' single quotation marks!'
```

Which one is cleaner? 'Nuff said.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="why-not-types-d-ts">Why not <code>types.d.ts</code>?</h3>

In several of the types used in this application, we use imported types from various polyfills, most often from `Temporal`.

If you import types into a types file, then you must export types from that file. You can no longer use it as a default types file.

As most of the other types file needed to use the types from the files that could not be default types files, it just became confusing to have some files from which the types had to be imported and others from which they were available by default. And the `import type` statement at the top of the file made it easy to see at a glance where those types were.

So we went for importing all types from `import type`. We also gathered types into `types.ts` files at or near the top level in many cases instead of following the `lowest level` practice we did with everything else. This was to make it easy to see the types in the same file and to limit the number of `types.ts` files. Types are viewed far less often than code, so this seemed a good compromise. But, of course, we regularly considered dispersing the types. We'll leave it to future devs to decide.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="where-are-the-enums">Where are the <code>enum</code>s?</h3>

The OD (original developer) of DDUI is a big fan of enumerations. They are great ways to limit options to a specified set.

Unfortunately, it turns out that the way the `enum` is implemented in TypeScript makes using them painful. Perhaps this is because they are the one thing that is TypeScript-only but is preserved after compilation. Whatever the reason, after much pain and suffering, we switched to union types. Sad, but nothing is perfect.

So there are no TS enums in this application.

Shortly after making this decision, we started seeing posts online recommending against using enums. Go figure.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="where-are-the-enums">Where, in the name of all that is holy, are the <b><code>interface</code>s</b>?</h3>

The TypeScript `interface` is mutable. You can reopen it elsewhere in the code and change it.

That's just crazy talk. We don't do mutable.

The `interface` is **OOP code**. This is an entirely **FP** applications. We don't need no [stinkin'](https://www.youtube.com/watch?v=VqomZQMZQCQ) interfaces and we don't got no stinkin' interfaces.

`type` works just fine for all our purposes.
