# Creating the PointerMove state machine

View the [Visualization](https://stately.ai/viz/053512eb-9b0c-418b-8f16-e422bb532d26). See the `index.test.tsx` file for examples of use.

Here are the pointer tracking options:

```ts
type PointerTracking =
  | "client"
  | "coords"
  | "keys"
  | "layer"
  | "movement"
  | "offset"
  | "page"
  | "pen"
  | "screen"
  | "tilt"
  | "type"
```

Here is what they track:

```ts
type Pointer = {
  // client
  clientX?: number
  clientY?: number

  // coords
  x?: number
  y?: number

  // keys
  altKey?: boolean
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean

  // layer
  layerX?: number
  layerY?: number

  // movement
  movementX?: number
  movementY?: number

  // offset
  offsetX?: number
  offsetY?: number

  // page
  pageX?: number
  pageY?: number

  // pen
  altitudeAngle?: number
  azimuthAngle?: number
  pressure?: number
  tangentialPressure?: number
  twist?: number

  // screen
  screenX?: number
  screenY?: number

  // tilt
  tiltX?: number
  tiltY?: number

  // type
  composed?: boolean
  pointerType?: "mouse" | "pen" | "touch"
}
```

These are set on transition (POINTER_MOVE).

You call `createPointerMoveMachineConfig` like this:

```ts
createPointerMoveMachineConfig({
  enabledEvents: ["POINTER_MOVE"],   // will publish to event bus on these transitions
  id: "pointer-move-machine",        // defaults to generateShortId; should be unique
  otherOption: "whatever",           // any other key-value pairs are simply passed to the context
  pointerTracking = [
    "offset",
    "pen",
  ],                                 // defaults to ["keys", "client"]
  topic: "topicName",                // used by the publishPointerEvent action
})
```

Then returns this:

```ts
{
  machine: {
    context: {
      enabledEvents: ["POINTER_MOVE"],
      otherOption: "whatever",
      pointer: {
        altitudeAngle: undefined,
        azimuthAngle: undefined,
        pressure: undefined,
        offsetX: undefined,
        offsetY: undefined,
        tangentialPressure: undefined,
        twist: undefined,
      },
      pointerTracking: ["offset", "pen"],
      topic: "topicName",
    },
    id: "pointer-move-machine",
    initial: "pointerMoveEnabled",
    states: {
      pointerMoveEnabled: {
        on: {
          POINTER_MOVE: {
            actions: ["setPointerContext", "publishPointerMoveEvent"],
          },
        },
      },
    },
  },
  actions: {
    publishPointerMoveEvent: (context, event) => {
      const { enabledEvents = [], topic, ...rest } = context

      if ((enabledEvents as Array<Transitions>).includes(event.type)) {
        publish({ eventName: event.type, data: { ...rest } }, { topic })
      }
    },
    // updates the pointer context (offsetX, etc.)
    setPointerContext: assign({
      pointer: (context, event) => setPointerContext(context.pointer, event)
    }),
  },
}
```

This can be passed to XState's `createMachine` function by separating the machine from the actions:

```ts
const { machine, actions } = createPointerMoveMachineConfig()

const pointerStateMachine = createMachine(machine, { actions })
```

But see `useMachines` for how this is meant to be used with React and a configuration object.

Here is the machine as seen by the visualizer:

![PointerMove Machine Visualization](./pointerMoveMachine.png)
