<!-- markdownlint-disable-next-line no-inline-html -->
<h1 id="top">The useMachines module</h1>

**NOTE: This module has a dependency on the [PubSub](/src/services/pubsub/_DOCUMENTATION_/README.md) module.**

1. [The purpose of the useMachines hook](#the-purpose-of-the-useMachines-hook)
2. [The machines](#the-machines)
   1. [Nested](#createNestedMachineConfig)
   2. [Parallel](#createParallelMachineConfig)
   3. [Animation](#createAnimationMachineConfig)
   4. [Counter](#createCounterMachineConfig)
   5. [CSS Transition](#createCSSTransitionMachineConfig)
   6. [Focus](#createFocusMachineConfig)
   7. [Form](#createFormMachineConfig)
   8. [Input](#createInputMachineConfig)
   9. [Keyboard](#createKeyboardsMachineConfig)
   10. [Mask](#createMaskMachineConfig)
   11. **Pointer machines**
       1. [Down](#createPointerDownMachineConfig)
       2. [Enter](#createPointerEnterMachineConfig)
       3. [Move](#createPointerMoveMachineConfig)
       4. [Over](#createPointerOverMachineConfig)
   12. [Toggle](#createToggleMachineConfig)
   13. [Touch](#createTouchMachineConfig)
3. [How pubsub fits in](#how-pubsub-fits-in)
4. [composeActions](#composeActions)
5. [composeMachineConfigs](#composeMachineConfigs)
6. [composeStatuses](#composeStatuses)
7. [utilities](#utilities)
   1. [getPointer](#getPointer)
   2. [initializePointerContext](#initializePointerContext)
   3. [setPointerContext](#setPointerContext)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="the-purpose-of-the-useMachines-hook">The purpose of the <a href="./">useMachines</a> hook</h2>

The purpose of the [useMachines](/src/services/useMachines/index.tsx) hook is to permit React components to implement [XState]() state machines simply without having to create a complete XState configuration object from scratch. It accepts a *simplified* configuration that selects one or more machines from a limited set (see below) and then combines them in parallel, by nesting one in the other, or both.

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="the-machines">The machines</h2>

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="createNestedMachineConfig"><a href="composeMachineConfigs/createNestedMachineConfig/_DOCUMENTATION_/README.md">Nested machines</a></h3>

This is used to nest a machine inside another machine. See the [Nested machine documentation](composeMachineConfigs/createNestedMachineConfig/_DOCUMENTATION_/README.md) for more information.

[createNestedMachineConfig](composeMachineConfigs/createNestedMachineConfig/index.tsx) takes a configuration of type `NESTED` and configurations for **parent** and **child** machines, then calls [composeMachineConfigs](composeMachineConfigs/index.ts) on each and injects the child machine into the state of the parent machine determined by the `injectInto` configuration parameter. It also merges the **actions**, **contexts**, and **guards** of the machines and moves them to the top level (treating them as a single machine).

[![Nested machine state diagram](composeMachineConfigs/createNestedMachineConfig/_DOCUMENTATION_/nestedMachine.png)](https://stately.ai/viz/0f188474-67a6-4d19-a407-2e0560e4f915)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="createParallelMachineConfig"><a href="composeMachineConfigs/createParallelMachineConfig/_DOCUMENTATION_/README.md">Parallel machines</a></h3>

This is used to put two or more machines in parallel. See the [Parallel machine documentation](composeMachineConfigs/createParallelMachineConfig/_DOCUMENTATION_/README.md) for more information.

[createParallelMachineConfig](composeMachineConfigs/createParallelMachineConfig/index.ts) takes an array of **child** machine configurations to be placed in parallel, then creates a **parallel machine** with those individual machines by calling [composeMachineConfigs](composeMachineConfigs/index.ts) on each. As with the nested machine above, the **actions**, **contexts**, and **guards** are merged together and moved to the top level parallel machine.

[![Parallel machine state diagram](composeMachineConfigs/createParallelMachineConfig/_DOCUMENTATION_/parallelMachine.png)](https://stately.ai/viz/463812f5-a264-4e8a-916d-7dd47181bf63)

See [the general documentation](composeMachineConfigs/_DOCUMENTATION_/README.md) for more information on all the configuration functions.

The various machine types are as follows:

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="createAnimationMachineConfig"><a href="composeMachineConfigs/createAnimationMachineConfig/_DOCUMENTATION_/README.md">Animation machines</a></h3>

The Animation machine is used to track CSS animations. The number of iterations is tracked.

* Context
  * `iterations` (an integer, defaults to 0)
* States
  * `animating`
  * `animationCancelled`
  * `animationCompleted`
  * `animationReady`
* Transitions
  * `ANIMATION_CANCEL`: from `animating` &rarr; `animationCancelled`
  * `ANIMATION_END`: from `animating` &rarr; `animationCompleted`
  * `ANIMATION_ITERATION`: from `animating` &rarr; `animating` and increment `iterations` by one
  * `ANIMATION_RESET`: from `animationCancelled` or `animationCompleted` &rarr; `animationReady`
  * `ANIMATION_START`: from `animationReady` &rarr; `animating`

[![Animation machine state diagram](composeMachineConfigs/createAnimationMachineConfig/_DOCUMENTATION_/animationMachine.png)](https://stately.ai/viz/5b86b789-a70c-4e05-a664-46881853a1f2)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="createCounterMachineConfig"><a href="composeMachineConfigs/createCounterMachineConfig/_DOCUMENTATION_/README.md">Counter machines</a></h3>

The Counter machine tracks a counter. The initial value and number of transitions&mdash;which need not be zero&mdash; the size of the increment, the current value, and the number of transitions are all tracked.

* Context
  * `count` (a number, defaults to 0)
  * `increment` (a number, defaults to 1)
  * `transitions` (a number, defaults to 0)
* States
  * `counting`
  * `counterDone` (this is a **final** state and the machine is terminated)
  * `counterPaused`
* Transitions
  * `COUNTER_CLEAR`: from `counting` &rarr; `counting` or `counterPaused` &rarr; `counterPaused`; sets `count` to zero; increments `transitions` by 1
  * `COUNTER_DECREMENT`: from `counting` &rarr; `counting`; decrements `count` by `increment` amount; increments `transitions` by 1
  * `COUNTER_INCREMENT`: from `counting` &rarr; `counting`; increments `count` by `increment` amount; increments `transitions` by 1
  * `COUNTER_PAUSE`: from `counting` &rarr; `counterPaused`
  * `COUNTER_RESET`: from `counting` or `counterPaused` &rarr; `counting`; resets `count` to initial count and `transitions` to initial transitions
  * `COUNTER_RESUME`: from `counterPaused` to `counting`
  * `COUNTER_STOP`: from `counting` or `counterPaused` &rarr; `counterDone`: **final state**, cannot be resumed

[![Counter machine state diagram](composeMachineConfigs/createCounterMachineConfig/_DOCUMENTATION_/counterMachine.png)](https://stately.ai/viz/b9b4330d-ad12-4e88-ac7b-9983e459b695)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="createCSSTransitionMachineConfig"><a href="composeMachineConfigs/createCSSTransitionMachineConfig/_DOCUMENTATION_/README.md">CSS transition machines</a></h3>

The CSS transition machine tracks CSS transitions. The initial value and number of transitions&mdash;which need not be zero&mdash; the size of the increment, the current value, and the number of transitions are all tracked.

* Context
  * `iterations` (an integer, defaults to 0)
* States
  * `transitionCancelled`
  * `transitionCompleted`
  * `transitionReady`
  * `transitionRunning`
  * `transitioning`
* Transitions
  * `CSS_TRANSITION_CANCEL`: from `transitionReady` or `transitionRunning` or `transitioning` &rarr; `transitionCancelled`
  * `CSS_TRANSITION_END`: from `transitionReady` or `transitionRunning` or `transitioning` &rarr; `transitionCompleted`
  * `CSS_TRANSITION_RESET`: from `transitionCancelled` or `transitionCompleted` &rarr; `transitionReady`
  * `CSS_TRANSITION_RUN`: from `transitionReady` &rarr; `transitionRunning`
  * `CSS_TRANSITION_START`: from `transitionRunning` &rarr; `transitioning`; increments `iterations` by one

[![CSS Transition machine state diagram](composeMachineConfigs/createCSSTransitionMachineConfig/_DOCUMENTATION_/cssTransitionMachine.png)](https://stately.ai/viz/23997db9-29ef-498a-9a7d-38e218a24640)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="createFocusMachineConfig"><a href="composeMachineConfigs/createFocusMachineConfig/_DOCUMENTATION_/README.md">Focus machines</a></h3>

The Focus machine tracks element focus.

* Context (none)
* States
  * `blurred`
  * `focused`
* Transitions
  * `BLUR`: from `focused` &rarr; `blurred`
  * `FOCUS`: from `blurred` &rarr; `focused`

[![Focus machine state diagram](composeMachineConfigs/createFocusMachineConfig/_DOCUMENTATION_/focusMachine.png)](https://stately.ai/viz/bd6774bf-923d-40e9-ab5e-0ec5b29597e2)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="createFormMachineConfig"><a href="composeMachineConfigs/createFormMachineConfig/_DOCUMENTATION_/README.md">Form machines</a></h3>

The Form machine tracks HTML form behavior, including the state of associated fields **if** they are connected via the [PubSub](/src/services/pubsub/_DOCUMENTATION_/README.md) system.

* Context
  * `enabledEvents`: an optional array of the form transitions below. Determines which events are published, if any.
  * `error`: a string representing an error returned from form submission
  * `fields`: an optional object in which the keys are field names (retrieved from fields publishing events with the form's id as topic) and the values are the data objects passed in those published events; in this manner the form can track the state of any fields associated with it
  * `topic`: a topic to be used for this form; defaults to the form's ID
* States
  * `formFailed`
  * `formPending`
  * `formReady`
  * `formSucceeded`
  * `formSubmitted`
* Transitions
  * `FORM_DATA`: from `formSubmitted` &rarr; `formPending`; from the [HTML formdata event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/formdata_event) sent before submitting
  * `FORM_FAILURE`: from `formPending` &rarr; `formFailed`; sets the `error` in context
  * `FORM_INITIALIZE`: from `formReady` &rarr; `formReady`; updates the form state (first update to set fields)
  * `FORM_RESET`: from `formFailed` or `formSucceeded` &rarr; `formReady`; sets `error` to undefined and resets `fields` to the initial state
  * `FORM_SUBMIT`: from `formReady` &rarr; `formSubmitted`
  * `FORM_SUCCESS`: from `formPending` &rarr; `formSucceeded`
  * `FORM_UPDATE`: from `formReady` &rarr; `formReady`; updates the form state by merging `event.fields` into `context.fields`

[![Form machine state diagram](composeMachineConfigs/createFormMachineConfig/_DOCUMENTATION_/formMachine.png)](https://stately.ai/viz/a74bf027-5e60-4047-a60a-86833dac90c3)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="createInputMachineConfig"><a href="composeMachineConfigs/createInputMachineConfig/_DOCUMENTATION_/README.md">Input machines</a></h3>

The Input machine tracks HTML input (select, text, etc.) state. If a `validate` function is passed in the configuration, then a n `inputValidating` state will be included; otherwise the state will be `inputUpdating` (it's one or the other, not both).

* If the `inputValidating` state is provided, it includes a machine nested within `inputDirty` with two states: `inputValid` and `inputInvalid`
* Context
  * `errors`: an array of errors
  * `isInvalid`: a boolean indicating whether the field value is invalid
  * `value`: the current value of the field (defaults to the initial value)
  * Any other context passed to the field, including `id`, `initialValue`, and `name`
* States
  * `inputClean`
  * `inputDirty`
    * `inputDirty.inputValid` (only if `validate` function provided)
    * `inputDirty.inputInvalid` (only if `validate` function provided)
  * `inputUpdating`
  * `inputValidating`
* Transitions
  * `INPUT_CLEAR`: from `inputClean` or `inputDirty` &rarr; `inputValidating` if `validate` function present, else `inputUpdating`; runs `clear` which sets the value to an empty string
  * `INPUT_RESET`: from `inputClean` or `inputDirty` &rarr; `inputValidating` if `validate` function present, else `inputUpdating`; runs `reset` which sets the value to the `initialValue`, `isInvalid` to `false`, and `errors` to an empty array (`initialValue` is presumed valid)
  * `INPUT_UPDATE`: from `inputClean` or `inputDirty` &rarr; `inputValidating` if `validate` function present, else `inputUpdating`; runs `update` which sets the value to `event.value` (typically from the HTML `event.target.value`)
  * **NOTE:**
    * When the transition is to `inputUpdating` the `isClean` condition is run and the transition is to either `inputClean` or `inputDirty` as appropriate
    * When `validate` is present and the transition is to `inputValidating` then the `validate` function is automatically run on the current `value`, then one of three conditions exists:
      * The `isClean` condition returns true (field not dirty) and the transition is to `inputClean`
      * The `isValid` condition returns true (field dirty and valid) and the transition is to `inputDirty.inputValid`
      * The `isInvalid` condition returns true (field dirty and invalid) and the transition is to `inputDirty.inputInvalid`

[![Input machine state diagram](composeMachineConfigs/createInputMachineConfig/_DOCUMENTATION_/inputMachine.png)](https://stately.ai/viz/e3533a1a-d495-4d05-88b2-6656970b8a1b)

or with validation:

[![Input machine with validation state diagram](composeMachineConfigs/createInputMachineConfig/_DOCUMENTATION_/validatingInputMachine.png)](https://stately.ai/viz/290891a3-ed95-42f8-a04c-e20cfb607c3e)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="createKeyboardsMachineConfig"><a href="composeMachineConfigs/createKeyboardsMachineConfig/_DOCUMENTATION_/README.md">Keyboard machines</a></h3>

The Input machine tracks HTML input (select, text, etc.) state.

* The [Keyboard machine](composeMachineConfigs/createKeyboardsMachineConfig/_DOCUMENTATION_/README.md) tracks keyboard events (keyDown and keyUp, but not keyPress).
  * Context
    * `key`: an object with a key `key` with a string value
    * `redo`: an array of keystrokes
    * `undo`: an array of keystrokes
    * Any other context passed in
  * States
    * `keyboardReady`
    * `keyDown`
  * Transitions
    * `KEY_DOWN`: from `keyboardReady` &rarr; `keyDown`; runs `keydown` which updates the `key` value in context with the KeyEvent key (a KeyboardEvent matching the HTML event)
      * If `context.enableUndo` is truthy, `keydown` also pushes the previous `key` value onto the `undo` array
      * If `context.enableRedo` or `context.enableUndo` is truthy, `keydown` clears the `redo` array
    * `KEY_REDO`: from `keyboardReady` &rarr; `keyboardReady`
      * **Note**: only available if `context.enableRedo` and/or `context.enableUndo`  is truthy
      * Calls `redo`, which:
        * pops the top key off the `redo` stack and replaces the `key` value with it
        * pushes the current key onto the `undo` stack
    * `KEY_RESET`: from `keyboardReady` &rarr; `keyboardReady`; runs `reset` which sets the `key.key` value to undefined
      * If `context.enableUndo` is truthy, `reset` clears the `undo` array
      * If `context.enableRedo` is truthy, `reset` clears the `redo` array
    * `KEY_UNDO`: from `keyboardReady` &rarr; `keyboardReady`
      * **Note**: only available if `context.enableUndo`  is truthy
      * Calls `undo`, which:
        * pops the top key off the `undo` stack and replaces the `key` value with it
        * pushes the current key onto the `redo` stack
    * `KEY_UP`: from `keyDown` &rarr; `keyboardReady`

[![Keyboard machine state diagram](composeMachineConfigs/createKeyboardMachineConfig/_DOCUMENTATION_/keyboardMachine.png)](https://stately.ai/viz/0accb564-3584-491c-b588-d3c0c0ab2fe3)

or with undo/redo:

[![Keyboard machine state diagram](composeMachineConfigs/createKeyboardMachineConfig/_DOCUMENTATION_/keyboardMachineWithUndoRedo.png)](https://stately.ai/viz/7ba9606a-442a-4d0b-9fcb-b64483555783)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="createMaskMachineConfig"><a href="composeMachineConfigs/createMaskMachineConfig/_DOCUMENTATION_/README.md">Mask machines</a></h3>

The Mask machine tracks field (input or display) masking. Masking can be triggered on focus or on blur.

* Context
  * `maskTrigger`: "ON_BLUR" or "ON_FOCUS"
* States
  * `unmasked`
  * `masked`
* Transitions
  * `MASK`: from `unmasked` &rarr; `masked`
  * `UNMASK`: from `masked` &rarr; `unmasked`
  * `BLUR`: if `maskTrigger` is "ON_BLUR" then same as `MASK`; if "ON_FOCUS" then same as `UNMASK`
  * `FOCUS`: if `maskTrigger` is "ON_BLUR" then same as `UNMASK`; if "ON_FOCUS" then same as `MASK`

[![Mask machine state diagram](composeMachineConfigs/createMaskMachineConfig/_DOCUMENTATION_/maskMachineWithFocus.png)](https://stately.ai/viz/43407874-85a6-4745-abcc-ac45b2ee500d)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="createOperationMachineConfig"><a href="composeMachineConfigs/createOperationMachineConfig/_DOCUMENTATION_/README.md">Operation machines</a></h3>

The Operation machine tracks operations state: enabled or disabled. Typically, this is used in nested machines with another machine nested in the `enabled` state.

* Context (none)
* States
  * `disabled`
  * `enabled`
* Transitions
  * `DISABLE`: from `enabled` &rarr; `disabled`
  * `ENABLE`: from `disabled` &rarr; `enabled`

[![Operation machine state diagram](composeMachineConfigs/createOperationMachineConfig/_DOCUMENTATION_/operationMachine.png)](https://stately.ai/viz/1f9235cd-cff5-4ec3-bd33-24a8e1bd9480)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="createPointerDownMachineConfig"><a href="composeMachineConfigs/createPointerDownMachineConfig/_DOCUMENTATION_/README.md">Pointer Down machines</a></h3>

The Pointer Down machine tracks mouse or other pointer up or down state. Use of `pointer` events instead of `mouse` events is recommended as `pointer` covers many more input devices than the mouse. This is an accessibility issue. Use this instead of `MouseDown` or `MouseUp`.

* Context
  * `pointerTracking`: an array of pointer events to track; defaults to `["keys", "client"]`:
    * client
    * coords
    * keys
    * layer
    * movement
    * offset
    * page
    * pen
    * screen
    * tilt
    * type
  * `pointer`: the current pointer context (initially not set)
* States
  * `pointerDown`
  * `pointerUp`
* Transitions
  * `POINTER_DOWN`: from `pointerUp` &rarr; `pointerDown`; calls [setPointerContext](#setPointerContext) to set pointer context
  * `POINTER_UP`: from `pointerDown` &rarr; `pointerUp`; calls [setPointerContext](#setPointerContext) to set pointer context

[![Pointer Down machine state diagram](composeMachineConfigs/createPointerDownMachineConfig/_DOCUMENTATION_/pointerDownMachine.png)](https://stately.ai/viz/f0037197-9b16-4ee2-8fec-8e1056443ef8)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="createPointerEnterMachineConfig"><a href="composeMachineConfigs/createPointerEnterMachineConfig/_DOCUMENTATION_/README.md">Pointer Enter machines</a></h3>

The Pointer Enter machine tracks mouse or other pointer entered or left state. Use of `pointer` events instead of `mouse` events is recommended as `pointer` covers many more input devices than the mouse. This is an accessibility issue. Use this instead of `MouseDown` or `MouseUp`.

* Context
  * `pointerTracking`: an array of pointer events to track; defaults to `["keys", "client"]`:
    * client
    * coords
    * keys
    * layer
    * movement
    * offset
    * page
    * pen
    * screen
    * tilt
    * type
  * `pointer`: the current pointer context (initially not set)
* States
  * `pointerLeft`
  * `pointerEntered`
* Transitions
  * `POINTER_ENTER`: from `pointerLeft` &rarr; `pointerEntered`; calls [setPointerContext](#setPointerContext) to set pointer context
  * `POINTER_LEAVE`: from `pointerEntered` &rarr; `pointerLeft`; calls [setPointerContext](#setPointerContext) to set pointer context

[![Pointer Enter machine state diagram](composeMachineConfigs/createPointerEnterMachineConfig/_DOCUMENTATION_/pointerEnterMachine.png)](https://stately.ai/viz/f0037197-9b16-4ee2-8fec-8e1056443ef8)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="createPointerMoveMachineConfig"><a href="composeMachineConfigs/createPointerMoveMachineConfig/_DOCUMENTATION_/README.md">Pointer Move machines</a></h3>

The Pointer Move machine tracks mouse or other pointer movement (position state). Use of `pointer` events instead of `mouse` events is recommended as `pointer` covers many more input devices than the mouse. This is an accessibility issue. Use this instead of `MouseDown` or `MouseUp`.

* Context
  * `pointerTracking`: an array of pointer events to track; defaults to `["keys", "client"]`:
    * client
    * coords
    * keys
    * layer
    * movement
    * offset
    * page
    * pen
    * screen
    * tilt
    * type
  * `pointer`: the current pointer context (initially not set)
* States
  * `pointerMoveEnabled`
* Transitions
  * `POINTER_MOVE`: from `pointerMoveEnabled` &rarr; `pointerMoveEnabled`; calls [setPointerContext](#setPointerContext) to set pointer context

[![Pointer Move machine state diagram](composeMachineConfigs/createPointerMoveMachineConfig/_DOCUMENTATION_/pointerMoveMachine.png)](https://stately.ai/viz/053512eb-9b0c-418b-8f16-e422bb532d26)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="createPointerOverMachineConfig"><a href="composeMachineConfigs/createPointerOverMachineConfig/_DOCUMENTATION_/README.md">Pointer Over machines</a></h3>

The Pointer Over machine tracks mouse or other pointer over or out state. Use of `pointer` events instead of `mouse` events is recommended as `pointer` covers many more input devices than the mouse. This is an accessibility issue. Use this instead of `MouseDown` or `MouseUp`.

* Context
  * `pointerTracking`: an array of pointer events to track; defaults to `["keys", "client"]`:
    * client
    * coords
    * keys
    * layer
    * movement
    * offset
    * page
    * pen
    * screen
    * tilt
    * type
  * `pointer`: the current pointer context (initially not set)
* States
  * `pointerOut`
  * `pointerOver`
* Transitions
  * `POINTER_OUT`: from `pointerOver` &rarr; `pointerOut`; calls [setPointerContext](#setPointerContext) to set pointer context
  * `POINTER_OVER`: from `pointerOut` &rarr; `pointerOver`; calls [setPointerContext](#setPointerContext) to set pointer context

[![Pointer Over machine state diagram](composeMachineConfigs/createPointerOverMachineConfig/_DOCUMENTATION_/pointerOverMachine.png)](https://stately.ai/viz/9217d1be-6ba1-45fe-aef7-9a6e3ff69094)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="createToggleMachineConfig"><a href="composeMachineConfigs/createToggleMachineConfig/_DOCUMENTATION_/README.md">Toggle machines</a></h3>

The Toggle machine tracks a toggle between toggled and untoggled states. Like an on/off button or switch. Clearing sets the `toggleCount` to 0 while resetting sets it to whatever the initial toggle count was (passed in by the configuration optionally).

* Context
  * `toggleCount`: integer, defaults to 0
* States
  * `toggled`
  * `untoggled`
* Transitions
  * `TOGGLE`: from `untoggled` &rarr; `toggled` or from `toggled` &rarr; `untoggled`; calls `incrementCount` to increment the `toggleCount` by one
  * `TOGGLE_CLEAR`: from `untoggled` &rarr; `untoggled` or from `toggled` &rarr; `toggled`; calls `clear` to reset the `toggleCount` to zero
  * `TOGGLE_RESET`: from the current state to the initial state, whatever that is (initial states can be set in the configuration) and the `toggleCount` to the initial toggle count

[![Toggle machine state diagram](composeMachineConfigs/createToggleMachineConfig/_DOCUMENTATION_/toggleMachine.png)](https://stately.ai/viz/5267dcc9-5b06-48d5-9d73-bc311cabe741)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="createTouchMachineConfig"><a href="composeMachineConfigs/createTouchMachineConfig/_DOCUMENTATION_/README.md">Touch machines</a></h3>

The Touch machine toggles between `untouched` and `touched` states. This is for form fields to indicate that the user has "touched" the field. Typically, once touched the value is not reset, unlike blur and focus or masking which switch back and forth.

This machine is typically used in parallel with other machines such as the [Focus machine](#createFocusMachineConfig) and the [Input machine](#createInputMachineConfig). Transitions on these machines indicate that the user has "touched" the field, so they produce transitions here as well. These include "BLUR" and "FOCUS" from the Focus machine, and "INPUT_CLEAR" and "INPUT_UPDATE" from the Input machine. These four are the same as the "TOUCH" transition: they mark the field as `touched`.

In addition to the "UNTOUCH" transition to toggle back to the `untouched` mode, resetting the input with "INPUT_RESET" does the same thing. Normally only a form reset (or field reset) will "untouch" a field.

* Context (none)
* States
  * `touched`
  * `untouched`
* Transitions
  * `TOUCH`: from `untouched` &rarr; `touched`
  * `UNTOUCH`: from `touched` &rarr; `untouched`
  * `BLUR`: from `untouched` &rarr; `touched`
  * `FOCUS`: from `untouched` &rarr; `touched`
  * `INPUT_CLEAR`: from `untouched` &rarr; `touched`
  * `INPUT_RESET`: from `touched` &rarr; `untouched`
  * `INPUT_UPDATE`: from `untouched` &rarr; `touched`

[![Touch machine state diagram](composeMachineConfigs/createTouchMachineConfig/_DOCUMENTATION_/touchMachine.png)](https://stately.ai/viz/3667f380-f1ea-4c11-aa55-443482f1a82e)

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="how-pubsub-fits-in">How <a href="/src/services/pubsub/_DOCUMENTATION_/README.md">pubsub</a> fits in</h2>

The [PubSub module](/src/services/pubsub/_DOCUMENTATION_/README.md) provides a publish-subscribe event bus to permit communication between components. This can be used anywhere and is a separate module. However, the most common use case for it here is to allow machines to publish events *when they transition*.

Transitions can be to the same state, such as when a **Counter machine** in the `counting` state is cleared using `COUNTER_CLEAR`. This sets the count to zero, but does not change the state: it is still `counting`. But we might want to know that the count has been zeroed, so we need to publish events on *transitions, not state changes*.

An obvious case for the use of PubSub by the state machines is that of a form. A form may have a set of inputs for names, email address, etc. Those inputs will use inputs, textareas, selects, etc. and those components will use [useMachines](/src/services/useMachines/index.tsx) to maintain internal state by state machine.

The form will also have its own state machine and a unique ID. If we pass the form ID to the fields&mdash;a good idea anyway as those fields should have a `form` attribute set to that ID&mdash;we can pass it into the individual field state machines as the `topic`. When the fields publish events, they will publish to that topic.

Now the form can subscribe to events with that topic (its ID) and receive only those events relevant to itself. When a field is updated, it will (configurably) publish that update along with its context. The form can receive that update, update its own context with the field's context, and then publish its own event to let other components know that it has been updated.

If the pubsub system provides **BroadcastChannel** or **websocket/server-sent event** capability, then those events can be received in other tabs or even on other devices, respectively.

Each of the machine configurations (except nested and parallel) allows an **`enabledEvents`** parameter that is an array of the events for which the machine should publish its context. Here is an example from the [Animation machine](composeMachineConfigs/createAnimationMachineConfig/index.ts):

```ts
publishAnimationEvent: (context, event) => {
  const { enabledEvents = [], topic, ...rest } = context

  if ((enabledEvents as Array<Transitions>).includes(event.type)) {
    publish({ eventName: event.type, data: { ...rest } }, { topic: topic as string })
  }
}
```

[Read more about the PubSub module](/src/services/pubsub/_DOCUMENTATION_/README.md).

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="composeActions"><a href="/src/services/useMachines/composeActions/index.ts">composeActions</a></h2>

The `composeActions` function is used to merge the actions of multiple machines into a single actions object. These actions are **not** the actions used in the machines themselves, but the actions available from outside the machine to cause a transition using XState's `send` function.

When using [useMachines](/src/services/useMachines/index.tsx), one of the objects returns is an **actions** object. These actions can be used to transition the machine. They are meant to be used in, for example, HTML element event handlers.

For example, the [Focus machine](composeMachineConfigs/createFocusMachineConfig/_DOCUMENTATION_/README.md) returns an actions object with two actions:

```ts
{
  blur: () => void
  focus: () => void
}
```

These can be used in a React component thus:

```ts
<input onblur={blur} onfocus={focus} />
```

The actual functions look like this (from [componseActions](composeActions/index.ts)):

```ts
FOCUS: (send) => ({
  blur: () => send?.({ type: "BLUR" }),
  focus: () => send?.({ type: "FOCUS" }),
}),
```

Drop dead simple. OK, here's a more complicated one. Ya got me:

```ts
FORM: (send) => ({
  formData: () => send?.({ type: "FORM_DATA" }),
  formFailed: (error: string) => send?.({ type: "FORM_FAILURE", error }),
  formInitialize: (fields) =>
    send?.({
      type: "FORM_INITIALIZE",
      fields,
    }),
  formReset: () => send?.({ type: "FORM_RESET" }),
  formSubmit: () => send?.({ type: "FORM_SUBMIT" }),
  formSucceeded: () => send?.({ type: "FORM_SUCCESS" }),
  formUpdate: (fields) =>
    send?.({
      type: "FORM_UPDATE",
      fields,
    }),
}),
```

Note that **formFailed**, **formInitialize**, and **formUpdate** include data for the error or fields respectively.

Here is the total list of actions currently:

```ts
export type MachineControls = {
  animationCancel?: () => void
  animationEnd?: () => void
  animationIteration?: () => void
  animationReset?: () => void
  animationStart?: () => void
  blur?: () => void
  counterClear?: () => void
  counterDecrement?: () => void
  counterIncrement?: () => void
  counterPause?: () => void
  counterReset?: () => void
  counterResume?: () => void
  counterStop?: () => void
  cssTransitionCancel?: () => void
  cssTransitionEnd?: () => void
  cssTransitionReset?: () => void
  cssTransitionRun?: () => void
  cssTransitionStart?: () => void
  disable?: () => void
  enable?: () => void
  focus?: () => void
  formData?: () => void
  formFailed?: (error: string) => void
  formInitialize?: (fields: Fields) => void
  formReset?: () => void
  formSubmit?: () => void
  formSucceeded?: () => void
  formUpdate?: (fields: Fields) => void
  inputClear?: () => void
  inputReset?: () => void
  inputUpdate?: (value: string) => void
  keyDown?: (key: KeyboardEvent) => void
  keyRedo?: () => void
  keyReset?: () => void
  keyUndo?: () => void
  keyUp?: () => void
  mask?: () => void
  pointerDown?: (event: PointerEvent) => void
  pointerEnter?: (event: PointerEvent) => void
  pointerLeave?: (event: PointerEvent) => void
  pointerMove?: (event: PointerEvent) => void
  pointerOut?: (event: PointerEvent) => void
  pointerOver?: (event: PointerEvent) => void
  pointerUp?: (event: PointerEvent) => void
  reset?: () => void
  resume?: () => void
  toggle?: () => void
  toggleClear?: () => void
  toggleReset?: () => void
  touch?: () => void
  unmask?: () => void
  untouch?: () => void
}
```

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="composeMachineConfigs"><a href="/src/services/useMachines/composeMachineConfigs/index.ts">composeMachineConfigs</a></h2>

[composeMachineConfigs](/src/services/useMachines/composeMachineConfigs/index.ts) is a very simple function. It literally just gets the key associated with the simplified configuration then uses that to call the correct `createXxxMachineConfig` function and passes the simplified configuration to that.

From the response to that call it extracts the **actions**, **guards**, and **machine**. It then rearranges these in the return from the hook to form a tuple, with the machine in the first spot and an object containing the actions and guards in the second. This is pass by [useMachines](/src/services/useMachines/index.tsx) to the XState `useMachine` hook, which returns a machine. Simple.

Here is the entire function:

```ts
export default function composeMachineConfigs(
  config: CreateMachineParamsConfig,
): [Machine, Options] {
  const [[name, configuration]] = Object.entries(config)

  const { actions, guards, machine } = (machines[name as TypeOfMachine]?.(configuration)) as ComposeMachineConfig

  return [
    machine,
    {
      actions,
      guards,
    },
  ]
}
```

And here are all the possible keys and their equivalent `createMachineConfig` functions:

* ANIMATION: [createAnimationMachineConfig](/src/services/useMachines/composeMachineConfigs/createAnimationMachineConfig/_DOCUMENTATION_/README.md)
* COUNTER: [createCounterMachineConfig](/src/services/useMachines/composeMachineConfigs/createCounterMachineConfig/_DOCUMENTATION_/README.md)
* CSS_TRANSITION: [createCSSTransitionMachineConfig](/src/services/useMachines/composeMachineConfigs/createCSSTransitionMachineConfig/_DOCUMENTATION_/README.md)
* FOCUS: [createFocusMachineConfig](/src/services/useMachines/composeMachineConfigs/createFocusMachineConfig/_DOCUMENTATION_/README.md)
* FORM: [createFormMachineConfig](/src/services/useMachines/composeMachineConfigs/createFormMachineConfig/_DOCUMENTATION_/README.md)
* INPUT: [createInputMachineConfig](/src/services/useMachines/composeMachineConfigs/createInputMachineConfig/_DOCUMENTATION_/README.md)
* KEYBOARD: [createKeyboardMachineConfig](/src/services/useMachines/composeMachineConfigs/createKeyboardMachineConfig/_DOCUMENTATION_/README.md)
* MASK: [createMaskMachineConfig](/src/services/useMachines/composeMachineConfigs/createMaskMachineConfig/_DOCUMENTATION_/README.md)
* NESTED: [createNestedMachineConfig](/src/services/useMachines/composeMachineConfigs/createNestedMachineConfig/_DOCUMENTATION_/README.md)
* OPERATION: [createOperationMachineConfig](/src/services/useMachines/composeMachineConfigs/createOperationMachineConfig/_DOCUMENTATION_/README.md)
* PARALLEL: [createParallelMachineConfig](/src/services/useMachines/composeMachineConfigs/createParallelMachineConfig/_DOCUMENTATION_/README.md)
* POINTER_DOWN: [createPointerDownMachineConfig](/src/services/useMachines/composeMachineConfigs/createPointerDownMachineConfig/_DOCUMENTATION_/README.md)
* POINTER_ENTER: [createPointerEnterMachineConfig](/src/services/useMachines/composeMachineConfigs/createPointerEnterMachineConfig/_DOCUMENTATION_/README.md)
* POINTER_MOVE: [createPointerMoveMachineConfig](/src/services/useMachines/composeMachineConfigs/createPointerMoveMachineConfig/_DOCUMENTATION_/README.md)
* POINTER_OVER: [createPointerOverMachineConfig](/src/services/useMachines/composeMachineConfigs/createPointerOverMachineConfig/_DOCUMENTATION_/README.md)
* TOGGLE: [createToggleMachineConfig](/src/services/useMachines/composeMachineConfigs/createToggleMachineConfig/_DOCUMENTATION_/README.md)
* TOUCH: [createTouchMachineConfig](/src/services/useMachines/composeMachineConfigs/createTouchMachineConfig/_DOCUMENTATION_/README.md)

Given a simplified configuration object like this:

```json
{
  "NESTED": {
    "enabledEvents": ["BLUR", "DISABLE", "ENABLE", "FOCUS"],
    "topic": "mutation-id",
    "id": "nested-machine", // for demo purposes only; automatically set to generated short Base58 ID
    "injectInto": "enabled",
    "child": {
        "FOCUS": {
          "id": "focus-machine-id",
        },
      },
    },
    "parent": {
      "OPERATION": {
        "initial": "enabled",
      },
    },
  },
}
```

Returns an XState configuration like this:

```ts
{
  actions: {
    publishFocusEvent: (context, event) => {
      const { enabledEvents = [], topic, ...rest } = context

      if ((enabledEvents).includes(event.type)) {
        publish({ eventName: event.type, data: { ...rest } }, { topic: topic })
      }
    },
    publishOperationEvent: (context, event) => {
      const { enabledEvents = [], topic, ...rest } = context

      if ((enabledEvents).includes(event.type)) {
        publish({ eventName: event.type, data: { ...rest } }, { topic: topic })
      }
    },
  },
  guards: {},
  machine: {
    id: "nested-machine",
    initial: "enabled",
    context: {
      enabledEvents: ["BLUR", "DISABLE", "ENABLE", "FOCUS"],
      topic: "mutation-id",
    },
    states: {
      disabled: {
        on: {
          ENABLE: {
            actions: ["publishOperationEvent"],
            target: "enabled",
          },
        },
      },
      enabled: {
        on: {
          DISABLE: {
            actions: ["publishOperationEvent"],
            target: "disabled",
          },
        },
        states: {
          blurred: {
            on: {
              FOCUS: {
                actions: ["publishFocusEvent"],
                target: "focused",
              },
            },
          },
          focused: {
            on: {
              BLUR: {
                actions: ["publishFocusEvent"],
                target: "blurred",
              },
            },
          },
        },
        id: "focus-machine-id",
        initial: "blurred",
      },
    },
  }
}
```

Note especially the `publishOperationEvent` and `publishFocusEvent` actions. These use the [PubSub](#how-pubsub-fits-in) module (if enabled) to publish events on transitions. From the above configuration, we can see that all four transitions&mdash; `ENABLE`, `DISABLE`, `FOCUS`, and `BLUR`&mdash;are enabled and events will be published with the `topic` when any of these transitions occurs.

The above, when turned into a machine by the `useMachines hook`, looks like this:

[![Nested machine state diagram](composeMachineConfigs/createNestedMachineConfig/_DOCUMENTATION_/nestedMachine.png)](https://stately.ai/viz/0f188474-67a6-4d19-a407-2e0560e4f915)

Click on the image to play with it in the Stately Visualizer. You can use the Events tab to send events, and open the console to see which events are sent (the `publish` function is mocked with a function that simply logs the event to the console). You can also see how the state changes using the State tab.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="composeStatuses"><a href="/src/services/useMachines/composeStatuses/index.ts">composeStatuses</a></h2>

Like the [composeActions](#composeActions) function above, [composeStatuses](/src/services/useMachines/composeStatuses/index.ts) is a very simple function:

```ts
composeStatuses(
  config: CreateMachineParamsConfig,
): Array<MachineStatuses>
```

The array of MachineStatuses is really just an array of all the finite **states** the machine could be in (as strings). Here is the full list:

```ts
export type AnimationStates =
  | "animating"
  | "animationCancelled"
  | "animationCompleted"
  | "animationReady"

export type CounterStates =
  | "counting"
  | "counterDone"
  | "counterPaused"

export type CSSTransitionStates =
  | "transitionCancelled"
  | "transitionCompleted"
  | "transitionReady"
  | "transitionRunning"
  | "transitioning"

export type FocusStates =
  | "blurred"
  | "focused"

export type FormStates =
  | "formFailed"
  | "formPending"
  | "formReady"
  | "formSucceeded"
  | "formSubmitted"

export type InputStates =
  | "inputClean"
  | "inputDirty"
  | "inputUpdating"
  | "inputValidating"

export type KeyboardStates =
  | "keyboardReady"
  | "keyDown"

export type MaskStates =
  | "masked"
  | "unmasked"

export type OperationStates =
  | "disabled"
  | "enabled"

export type PointerDownStates =
  | "pointerDown"
  | "pointerUp"

export type PointerEnterStates =
  | "pointerEntered"
  | "pointerLeft"

export type PointerMoveStates = "pointerMoveEnabled"

export type PointerOutStates =
  | "pointerOut"
  | "pointerOver"

export type ToggleStates =
  | "untoggled"
  | "toggled"

export type TouchStates =
  | "touched"
  | "untouched"

export type MachineStatuses =
  | AnimationStates
  | CounterStates
  | CSSTransitionStates
  | FocusStates
  | FormStates
  | InputStates
  | KeyboardStates
  | MaskStates
  | OperationStates
  | PointerDownStates
  | PointerEnterStates
  | PointerOutStates
  | ToggleStates
  | TouchStates
  | ValidityStates
```

The `composeStatuses` function also merges statuses from **nested** and **parallel** machines.

This function is currently a bit too simple. The array of state names is used in [useMachines](/src/services/useMachines/index.tsx) to create functions that return a boolean: `true` if the machine is in that state, and `false` if it is not, but currently this simply stringifies the current state and looks for the state name:

```ts
// from useMachines/index.tsx
const status = composeStatuses(config).reduce((acc, name: MachineStatuses) => ({
  ...acc,
  [name]: () => JSON.stringify(state.value).includes(`"${name}"`),
}), {})
```

This is because `state.value` can be a string, but for nested states it is an object. Stringifying it flattens it out into a string, and then looking for the state name returns `true` not only for the most nested state, but for any state above it. This feels like it should be a bit brittle, but in practice it works well. YMMV.

These are particularly useful for adding or removing CSS class names from a component:

```ts
<div
  className={concatenateCssClasses({
    [css.stringField]: true,
    [css.stringFieldDisabled]: status.disabled?.(),
    [css.stringFieldFocused]: status.focused?.(),
  })}
/>
```

That's how they are used: `status.blur?.()`. Returns `true` if the state is `blurred`, `false` otherwise.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="utilities"><a href="/src/services/useMachines/utilities/">utilities</a></h2>

There are a few utility functions specific to the [useMachines hook](/src/services/useMachines/_DOCUMENTATION_/README.md), so they are included in a `utilities` folder.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="getPointer"><a href="/src/services/useMachines/utilities/getPointer/index.ts">getPointer</a></h3>

The [getPointer](/src/services/useMachines/utilities/getPointer/index.ts) function is *literally* just a wrapper around the HTMLPointerEvent. It wraps all of the following data and returns them in an object:

* altKey
* altitudeAngle
* azimuthAngle
* clientX
* clientY
* composed
* ctrlKey
* layerX
* layerY
* metaKey
* movementX
* movementY
* offsetX
* offsetY
* pageX
* pageY
* pointerType
* pressure
* screenX
* screenY
* shiftKey
* tangentialPressure
* tiltX
* tiltY
* twist
* x
* y

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="initializePointerContext"><a href="/src/services/useMachines/utilities/initializePointerContext/index.ts">initializePointerContext</a></h3>

[initializePointerContext](/src/services/useMachines/utilities/initializePointerContext/index.ts) takes an array of names of types of data from the HTMLPointerEvent (above) such as "client" or "keys" and returns an object with **only those properties**, each set to undefined.

WTF? Why? Because the keys are there even if the value associated with the key is undefined. Now we can use `Object.keys` on this object to see which keys are defined (even if their value is not) and then return *only those values* from the HTMLPointerEvent.

Here is a small part of that returned object:

```ts
return {
  ...(pointerTracking.includes("coords")
  ? {
    x: undefined,
    y: undefined,
  }
  : {}),
...(pointerTracking.includes("keys")
  ? {
    altKey: undefined,
    ctrlKey: undefined,
    metaKey: undefined,
    shiftKey: undefined,
  }
  : {}),
}
```

And here is the full list of "PointerTracking" types:

```ts
export type PointerTracking =
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

See the [simple code](/src/services/useMachines/utilities/initializePointerContext/index.ts) to see what keyword returns what data.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="setPointerContext"><a href="/src/services/useMachines/utilities/setPointerContext/index.ts">setPointerContext</a></h3>

```ts
setPointerContext(pointer: PointerEvent, event: PointerEvent): PointerEvent
```

[setPointerContext](/src/services/useMachines/utilities/setPointerContext/index.ts) takes a `PointerEvent` object as returned from [initializePointerContext](#initializePointerContext) above and an actual `PointerEvent` returned from some pointer event in the browser. Using the `keys` from this object (initialized to `undefined`), the initialized PointerEvent object (`pointer` above) used by the Pointer machines is updated with the *actual* data from the `event` above.

Here's how it's done:

```ts
return Object.keys(pointer).reduce((acc, key) => {
  return {
    ...acc,
    ...(Object.keys(event).includes(key)
      ? {
        [key]: event[key as keyof PointerEvent],
      }
      : {}),
  }
}, {})
```

That's all this does: updates the `pointer` in the context of the following machines:

* [createPointerDownMachine](#createPointerDownMachine)
* [createPointerEnterMachine](#createPointerEnterMachine)
* [createPointerMoveMachine](#createPointerMoveMachine)
* [createPointerOverMachine](#createPointerOverMachine)

[top](#top)
