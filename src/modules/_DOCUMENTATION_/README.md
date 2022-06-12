<!-- markdownlint-disable-next-line no-inline-html -->
<h1 id="top">The <a href="./">modules</a> folder</h1>

The `modules` folder is for React components that are not specific to this application, though specific to company. These could easily be moved into an npm or Deno module and loaded as a dependency.

There are currently two modules here.

## [icons module](icons/)

The **icons** module is essentially just the Material Design icons used by company as SVG elements, but wrapped in React components to allow easy passing of props and use of CSS modules.

## [getComponent](getComponent/_DOCUMENTATION_/README.md)

The [getComponent](getComponent/index.tsx) module provides a rendering function (`getComponent`) that takes a component configuration object (see type below). It then returns the configured component, recursing down through any child components to return the entire component tree. A site, page, a section, or an individual component can be returned from this function.

The `ComponentConfig` type:

```ts
export type ComponentConfig =
  | ActionConfig
  | AddressDatatypeConfig
  | BooleanDatatypeConfig
  | CompositeConfig
  | ContentConfig
  | ElementDatatypeConfig
  | EmailDatatypeConfig
  | ExternalLinkConfig
  | FullNameDatatypeConfig
  | GroupConfig
  | HelpOrErrorConfig
  | ImportantNoteConfig
  | MutationConfig
  | PhoneDatatypeConfig
  | SetDatatypeConfig
  | StringDatatypeConfig
```

And examples of individual configurations...

An **Action**:

```ts
export type ActionConfig = ActionProps & {
  readonly datatype: Extract<TypesOfComponent, "ACTION">
}

export type ActionProps = MachineProps & ModificationProps & {
  actionType: TypesOfAction
  buttonVariant?: ActionButtonVariants
  dataset?: Dataset
  id: string
  isReadOnly?: boolean
  label?: string
  mutationId: string
}
```

A **StringField**:

```ts
export type StringDatatypeConfig = StringDatatypeProps & {
  readonly datatype: Extract<TypesOfComponent, "STRING_DATATYPE">
}

export type StringDatatypeProps = Autocomplete & FieldProps & {
  type?: TypesOfInput
}

export type Autocomplete = {
  autoComplete?: "string"
}

export type FieldProps = ConditionalProps & MachineProps & ModificationProps & {
  allowDelete?: boolean
  dataset?: Dataset
  description?: string
  enabledEvents?: Array<Transitions>
  errorText?: string
  format?: Record<string, string> | string
  id: string
  initial?: StateNames
  initialMaskState?: MaskStates
  initialValue?: string
  injectInto?: StateNames
  isReadOnly?: boolean
  isRequired?: boolean
  label?: string
  labelId?: string
  mutationId?: string
  name: string
  placeholder?: string
  validate?: (validation: Validation) => Validation
  variant?: FieldVariants
}

export type ConditionalProps = {
  showWhen?: ActivationState
  topic?: string
}

export type MachineProps = {
  machine?: Record<string, unknown>
  machineConfig?: CreateMachineParamsConfig
  maskTrigger?: "ON_BLUR" | "ON_FOCUS"
}

export type ModificationProps = {
  mutation?: string
  mutationId?: string
  variables?: Variables
}
```

A **Mutation**:

```ts
export type MutationConfig = MutationProps & {
  readonly datatype: Extract<TypesOfComponent, "MUTATION">
}

export type MutationProps = ConditionalProps & MachineProps & {
  args: Variables
  buttonText?: string
  enabledEvents?: Array<Transitions>
  id: string
  isReadOnly?: boolean
  label?: string
  machineConfig?: CreateMachineParamsConfig
  mutation?: string
  name: string
  elements: Array<ComponentConfig>
  url: string
  variables?: Array<string>
}
```

[top](#top)
