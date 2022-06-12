# Composing state machine configurations

The `composeMachineConfigs` function takes a configuration object and then composes state machine configurations into a single state machine (tuple) that can be passed to `createMachine` thus:

```ts
const config = composeMachineConfigs({
  NESTED: {
    id: "bobs-machine",
    children: {
      PARALLEL: {
        children: {
          FOCUS: { id: "fanny" },
          MASK: { id: "marvin" },
          TOGGLE: { id: "theresa" },
          TOUCH: { id: "tommy" },
        },
      },
    },
    parent: {
      OPERATION: {
        id: "email-field-machine",
      },
    },
  },
})

const machine = createMachine(...config)
```

Here are the available machines:

- ANIMATION: [createAnimationMachineConfig](/src/services/useMachines/composeMachineConfigs/createAnimationMachineConfig/_DOCUMENTATION_/README.md)
- COUNTER: [createCounterMachineConfig](/src/services/useMachines/composeMachineConfigs/createCounterMachineConfig/_DOCUMENTATION_/README.md)
- CSS_TRANSITION: [createCSSTransitionMachineConfig](/src/services/useMachines/composeMachineConfigs/createCSSTransitionMachineConfig/_DOCUMENTATION_/README.md)
- INPUT: [createInputMachineConfig](/src/services/useMachines/composeMachineConfigs/createInputMachineConfig/_DOCUMENTATION_/README.md)
- FOCUS: [createFocusMachineConfig](/src/services/useMachines/composeMachineConfigs/createFocusMachineConfig/_DOCUMENTATION_/README.md)
- FORM: [createFormMachineConfig](/src/services/useMachines/composeMachineConfigs/createFormMachineConfig/_DOCUMENTATION_/README.md)
- KEYBOARD: [createKeyboardMachineConfig](/src/services/useMachines/composeMachineConfigs/createKeyboardMachineConfig/_DOCUMENTATION_/README.md)
- MASK: [createMaskMachineConfig](/src/services/useMachines/composeMachineConfigs/createMaskMachineConfig/_DOCUMENTATION_/README.md)
- NESTED: [createNestedMachineConfig](/src/services/useMachines/composeMachineConfigs/createNestedMachineConfig/_DOCUMENTATION_/README.md)
- OPERATION: [createOperationMachineConfig](/src/services/useMachines/composeMachineConfigs/createOperationMachineConfig/_DOCUMENTATION_/README.md)
- PARALLEL: [createParallelMachineConfig](/src/services/useMachines/composeMachineConfigs/createParallelMachineConfig/_DOCUMENTATION_/README.md)
- POINTER_DOWN: [createPointerMachineConfig](/src/services/useMachines/composeMachineConfigs/createPointerDownMachineConfig/_DOCUMENTATION_/README.md)
- POINTER_ENTER: [createPointerMachineConfig](/src/services/useMachines/composeMachineConfigs/createPointerEnterMachineConfig/_DOCUMENTATION_/README.md)
- POINTER_MOVE: [createPointerMachineConfig](/src/services/useMachines/composeMachineConfigs/createPointerMoveMachineConfig/_DOCUMENTATION_/README.md)
- POINTER_OVER: [createPointerMachineConfig](/src/services/useMachines/composeMachineConfigs/createPointerOverMachineConfig/_DOCUMENTATION_/README.md)
- TOGGLE: [createToggleMachineConfig](/src/services/useMachines/composeMachineConfigs/createToggleMachineConfig/_DOCUMENTATION_/README.md)
- TOUCH: [createTouchMachineConfig](/src/services/useMachines/composeMachineConfigs/createTouchMachineConfig/_DOCUMENTATION_/README.md)
