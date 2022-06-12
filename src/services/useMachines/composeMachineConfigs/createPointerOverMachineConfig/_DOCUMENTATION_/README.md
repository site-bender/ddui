# Creating the PointerOver state machine

View the [Visualization](https://stately.ai/viz/9217d1be-6ba1-45fe-aef7-9a6e3ff69094). See the `index.test.tsx` file for examples of use.

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

These are set on transition (POINTER_OVER and POINTER_OUT).

You call `createPointerOverMachineConfig` like this:

```ts
createPointerOverMachineConfig({
  enabledEvents: [
    "POINTER_OUT",
    "POINTER_OVER",
  ],                            // will publish to event bus on these transitions
  id: "pointer-over-machine",   // defaults to generateShortId; should be unique
  initial: "pointerOver",       // defaults to pointerOut
  otherOption: "whatever",      // any other key-value pairs are simply passed to the context
  pointerTracking = [
    "pen",
    "screen",
  ],                            // defaults to ["keys", "client"]
  topic: "topicName",           // used by the publishPointerEvent action
})
```

Then returns this:

```ts
{
  machine: {
    context: {
      enabledEvents: ["POINTER_ENTER", "POINTER_LEAVE"],
      otherOption: "whatever",
      pointer: {
        altitudeAngle: undefined,
        azimuthAngle: undefined,
        pressure: undefined,
        screenX: undefined,
        screenY: undefined,
        tangentialPressure: undefined,
        twist: undefined,
      },
      pointerTracking: ["pen", "screen"],
      topic: "topicName",
    },
    id: "pointer-over-machine",
    initial: "pointerOver",
    states: {
      pointerOut: {
        on: {
          POINTER_OVER: {
            actions: ["setPointerContext", "publishPointerOverEvent"],
            target: "pointerOver",
          },
        },
      },
      pointerOver: {
        on: {
          POINTER_OUT: {
            actions: ["setPointerContext", "publishPointerOverEvent"],
            target: "pointerOut",
          },
        },
      },
    },
  },
  actions: {
    publishPointerEnterEvent: (context, event) => {
      const { enabledEvents = [], topic, ...rest } = context

      if (enabledEvents.includes(event.type)) {
        publish({ eventName: event.type, data: { ...rest } }, { topic })
      }
    },
    // updates the pointer context (screenX, etc.)
    setPointerContext: assign({
      pointer: (context, event) => setPointerContext(context.pointer, event)
    }),
  },
}
```

This can be passed to XState's `createMachine` function by separating the machine from the actions:

```ts
const { machine, actions } = createPointerMachineConfig()

const pointerStateMachine = createMachine(machine, { actions })
```

But see `useMachines` for how this is meant to be used with React and a configuration object.

Here is the machine as seen by the visualizer:

![Pointer Machine Visualization](./pointerOverMachine.png)
