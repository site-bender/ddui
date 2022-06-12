<!-- markdownlint-disable-next-line no-inline-html -->
<h1 id="top">Mutations</h1>

1. [Properties](#properties)
   1. [`args`](#args)
   2. [`buttonText`](#buttonText)
   3. [`elements`](#elements)
   4. [`enabledEvents`](#enabledEvents)
   5. [`id`](#id)
   6. [`isReadOnly`](#isReadOnly)
   7. [`label`](#label)
   8. [`machineConfig`](#machineConfig)
   9. [`mutableVariableNames`](#mutableVariableNames)
   10. [`mutation`](#mutation)
   11. [`name`](#name)
   12. [`url`](#url)
2. [How to update form state from field events](#how-to-update-form-state-from-field-events)
3. [How to submit the form on update action](#how-to-submit-the-form-on-update-action)

The [Mutation](/src/modules/getComponent/Mutation/index.tsx) component is essentially a `<form>` element used to mutate data on the server. Here is the configuration it expects:

```ts
export type MutationProps = ConditionalProps & MachineProps & {
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

Let's take this configuration one property at a time and see what each does.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="properties">Properties</h2>

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="args"><code>args</code></h3>

The `args` property is of type `Variables` and provides read-only variables to the mutation. If you are using the `actions` response from the GraphQL query, these are provided by the `suppliedArguments` property of GraphQL type `TransitionActionSuppliedArguments`:

```graphql
type TransitionActionSuppliedArgument {
  name: String!
  value: JSON!
}
```

For example, the `userId` might be a supplied argument. That would then be injected into the Mutation props like this:

```ts
{
  args: {
    userId,
  }
}
```

The mutable arguments from state should be merged into this object and then sent with the mutation as `varaibles` (more on this below).

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="buttonText"><code>buttonText?</code></h3>

This is the label for the button associated with this form, e.g., "Submit update". Optional, defaults to "Update".

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="elements"><code>elements</code></h3>

This is an array of configuration objects for the fields and other content in the Mutation form. It's optional, defaulting to an empty array. This is because the button is controlled by the Mutation, so you could have a Mutation that simply runs a GraphQL mutation when the button is clicked. It doesn't *have* to be a form.

This looks like any other `elements` array, but remember that to connect the fields, buttons, etc. to the Mutation, pass the `id` of the Mutation as the `mutationId` of the field, e.g.:

```ts
{
  datatype: "STRING_DATATYPE", // Creates a StringField component
  label: "Display name",
  id: generateShortId(), // Base58 v4 UUID
  initialValue: displayName,
  isRequired: true,
  mutationId, // Connects displayName StringField to the Mutation for which this is an `element`
  name: "displayName", // This will be the field name (key) in the Mutation context (state)
}
```

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="enabledEvents"><code>enabledEvents</code></h3>

This is a set of transitions for which the mutation's state machine should publish events. The default state machine is a [Form Machine](/src/services/useMachines/composeMachineConfigs/createFormMachineConfig/_DOCUMENTATION_/README.md), hence the possible `enabledEvents` are:

```ts
export type FormTransitions =
  | "FORM_DATA"
  | "FORM_FAILURE"
  | "FORM_INITIALIZE"
  | "FORM_RESET"
  | "FORM_SUBMIT"
  | "FORM_SUCCESS"
  | "FORM_UPDATE"
```

These are the events **published** by the mutation, *not the events to which it listens*, and they are published by the state machine. Simply pass the `enabledEvents` to the state machine in its configuration (`machineConfig`), and it will publish on those events. You may not need them.

The default form state machine looks like this:

[![Default form state machine](/src/services/useMachines/composeMachineConfigs/createFormMachineConfig/_DOCUMENTATION_/formMachine.png)](https://stately.ai/viz/a74bf027-5e60-4047-a60a-86833dac90c3)

[Try it out here](https://stately.ai/viz/a74bf027-5e60-4047-a60a-86833dac90c3)

You can see the seven possible transitions and that each of them calls `publishFormEvent`. That code looks like this:

```ts
publishFormEvent: (context: FormMachineContext, event: FormMachineEvent) => {
  const { enabledEvents = [], topic, ...rest } = context

  if ((enabledEvents as Array<FormTransitions>).includes(event.type)) {
    publish({ eventName: event.type, data: { ...rest } }, { topic: topic as string })
  }
}
```

The topic is currently set to the Mutation ID in the [Mutation component](/src/modules/getComponent/Mutation/index.tsx). The `rest` is all the rest of the Form Machine's `context`. Here's what that currently looks like:

```ts
export default function Mutation(props: MutationProps): JSX.Element {
  const {
    args,
    buttonText = "Update",
    elements,
    enabledEvents,
    id,
    isReadOnly,
    label,
    machineConfig,
    mutableVariableNames,
    mutation,
    name,
    url = "http://example.com/",
  } = props

  const config: CreateMachineParamsConfig = useMemo(
    () => (machineConfig as CreateMachineParamsConfig ?? makeMutationConfiguration({
      enabledEvents,
      isReadOnly,
      label,
      mutationId: props.id,
      name,
    })),
    [],
  )

  // ...
}

export type MutationProps = ConditionalProps & MachineProps & {
  args: Variables
  buttonText?: string
  elements: Array<ComponentConfig>
  enabledEvents?: Array<FormTransitions>
  id: string
  isReadOnly?: boolean
  label?: string
  mutableVariableNames?: Array<string>
  mutation?: string
  name: string
  url: string
}
```

These are passed to the default machine configuration:

```ts
export default function makeMutationMachineConfiguration({
  enabledEvents = ["FORM_FAILURE", "FORM_INITIALIZE", "FORM_RESET", "FORM_SUBMIT", "FORM_SUCCESS", "FORM_UPDATE"],
  initial = "enabled",
  injectInto = "enabled",
  isReadOnly,
  label,
  mutationId,
  name,
}: Props, type: MachineType = "DEFAULT"): CreateMachineParamsConfig {
  // ...
}
```

See also [How to update form state from field events](#how-to-update-form-state-from-field-events) below.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="id"><code>id</code></h3>

The `id` is the ID of the mutation/form. It is passed to the form fields as the `mutationId`. This is used in the HTML elements as the `form` attribute (and in the `<form>` element as the `id` attribute), which ties them to the form *even if they are not nested in the `<form>` tags* (which here they are not&mdash;the form tag sits alone).

This ID is also used as the `topic` for all published events from form fields, buttons, etc. This allows the `Mutation` to listen for events with topic equal to its `id` and to update its own state accordingly.

For example, a string field might publish an "INPUT_UPDATE" event with topic equal to the `mutationId` of a Mutation. The Mutation would then subscribe to events with topic its ID, receive the INPUT_UPDATE event, and merge the `data` from that event into its own `context.fields` property. In this way changes to field state are updated in form state.

When the form is submitted, it can then submit the current field state.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="isReadOnly"><code>isReadOnly</code></h3>

This sets the form to **read only** mode, which hides the submit button. If all fields are read-only but the form (Mutation) isn't, then the button will be displayed but disabled as it is disabled when none of the fields are dirty (and if all fields are read-only, then none can be dirty).

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="label"><code>label</code></h3>

Mutations can optionally be labelled. This label appears at the top of the form as an `<h3>` heading:

```ts
return label
 ? (
   <section className={css.mutation}>
     <h3>{label}</h3>
     {form}
   </section>
 )
 : (
   <div className={css.mutation}>
     {form}
   </div>
 )
```

Note also that labeling the form makes it a `<section>`&mdash;HTML sectioning content&mdash;which means that it appears in the HTML Document Outline with that heading. This is important for **accessibility** with screen readers.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="machineConfig"><code>machineConfig</code></h3>

This prop allows the Site Configuration object (from the [mapQueryResponseToSiteConfig](/src/Ddui/antiCorruptionLayer/mapQueryResponseToSiteConfig/index.ts) function) to specifiy *any* state machine configuration, which allows configuration from the back end in a data-driven UI situation.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="mutableVariableNames"><code>mutableVariableNames</code></h3>

The `mutableVariableNames` is an array of string names of those form fields that will be included in the mutation's `variables` object.

For example, if the props to the Mutation included:

```ts
{
  args: { id: "some-id" },
  mutableVariableNames: ["email", "name"],
  mutation: `mutation MyMutation($id: String!, $name: String, $email: String) {
    updateNameAndAddress(input: {
      id: $id
      name: $name
      email: $email
    }) {
      id
    }
  }`,
  name: "MyMutation",
}
```

Then when the mutation was submitted, the `args` object would be merged with the values from the mutable fields to create a `variables` object:

```ts
const {
 fields: {
   email: {
     value: email,
   },
   name: {
     value: name,
   },
 }
} = context

const variables = {
 ...args,
 email,
 name,
}
```

Then this would be supplied to the `mutate` function returned from the `useGraphQL` hook:

```ts
const { mutate } = useGraphQL(url)

const response = await mutate(name, mutation, variables) // name is the operationName
```

For the above, that would send something like this in a POST as a JSON body to the `url`:

```json
{
  "operationName":"MyMutation",
  "query":"mutation MyMutation($id: String!, $name: String, $address: String) {\n  updateNameAndAddress(input: {\n    id: $id\n    name: $name\n    address: $address\n  }) {\n    id\n  }\n}",
  "variables":{
    "id":"some-id",
    "email":"bob@dobbs.com",
    "name":"Bob Dobbs"
  }
}
```

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="mutation"><code>mutation</code></h3>

The `mutation` is the GraphQL mutation as a string. Typically it is stored in as a named export, e.g., MY_MUTATION, in a `constants.ts` file as close to where it is used as possible. It is then imported and used by the Mutation. However, this can be overridden using the `mutation` prop.

Care should be taken to ensure that the `name` props matches the name of the mutation.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="name"><code>name</code></h3>

The name of the mutation, passed as the `operationName` in the POST request to the GraphQL service. Must match the name of the `mutation` (see above example).

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="url"><code>url</code></h3>

The URL of the GraphQL service. This is passed to the `useGraphQL` hook to configure the `mutate` (or `query`) function used to communicate with the GraphQL service. It is set by the [Anti-Corruption Layer](/src/Ddui/antiCorruptionLayer/_DOCUMENTATION_/README.md).

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="how-to-update-form-state-from-field-events">How to update form state from field events</h2>

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="how-to-submit-the-form-on-update-action">How to submit the form on update action</h2>
