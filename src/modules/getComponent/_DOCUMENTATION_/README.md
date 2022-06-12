<!-- markdownlint-disable-next-line no-inline-html -->
<h1 id="top">The <a href="./">getComponent</a> module and function</h1>

[getComponent](/src/modules/getComponent/index.tsx) is a rendering function that takes a JSON or JS configuration object matching the [allowed types](/src/modules/getComponent/types.ts) that returns a component or component **tree** using the React components provided in this module.

The individual components as of this writing are:

* ACTION: [Action](Action/index.tsx)
* CONTENT: [Content](Content/index.tsx)
* ELEMENT_DATATYPE: [ElementField](ElementField/index.tsx)
* EMAIL_DATATYPE: [StringField](StringField/index.tsx)
* EXTERNAL_LINK: [ExternalLink](ExternalLink/index.tsx)
* NAME_DATATYPE: [FullNameField](FullNameField/index.tsx)
* GROUP: [Group](Group/index.tsx)
* IMPORTANT_NOTE: [ImportantNote](ImportantNote/index.tsx)
* MUTATION: [Mutation](Mutation/index.tsx)
* PHONE_DATATYPE: [PhoneField](PhoneField/index.tsx)
* STRING_DATATYPE: [StringField](StringField/index.tsx)

**PLEASE UPDATE THIS DOCUMENTATION  AS COMPONENTS ARE ADDED!**

The function itself couldn't be much simpler. It just takes the `datatype` from the configuration, looks up the correct React Component from the `components` record, then returns that component passing it the remaining configuration (less the `datatype`) as `props`.

**NOTE**: Components are based on the **datatype** they are meant to render and mutate, not on the widget. This is because this system was originally intended to be used as a **[Data-Driven UI](/src/Ddui/antiCorruptionLayer/_DOCUMENTATION_/README.md)** (DDUI). So it is:

* `Action` not `Button` or `Link`
* `Mutation` not `Form`
* `ElementField` not `RadioButtons` or `Select`
* `StringField` not `TextInput` or `TextArea`

Etc.

Here is the code:

```ts
export default function getComponent(component: ComponentConfig): JSX.Element | null {
  const { datatype, ...props } = component
  const Component = components[datatype as TypesOfComponent] as () => JSX.Element

  return Component ? <Component key={props.id} {...props} /> : null
}

const components: Partial<Record<TypesOfComponent, unknown>> = {
  ACTION: Action,
  CONTENT: Content,
  ELEMENT_DATATYPE: ElementField,
  EMAIL_DATATYPE: StringField,
  EXTERNAL_LINK: ExternalLink,
  NAME_DATATYPE: FullNameField,
  GROUP: Group,
  IMPORTANT_NOTE: ImportantNote,
  MUTATION: Mutation,
  PHONE_DATATYPE: PhoneField,
  STRING_DATATYPE: StringField,
}
```

As you can see:

1. The `datatype` is extracted from the `component` configuration and the remaining key-value pairs are collected into `props`.
2. The `datatype` is used to get the corresponding React component from the `components` record.
3. If the `Component` is found, it is returned and the `props` are passed to it.
4. If the `Component` is undefined, then `null` is returned.

And that's it.

At the time of this writing, this was still a WIP, so there are many improvements still to be made. Most of the components are only partially complete. With luck, this will in time become a state-of-the-art component library for company that can be reused everywhere.
