import type { AssignAction, EventObject, MachineConfig, MachineOptions, StateSchema } from "xstate"

// ============ ENUMS ============
export type AnimationStates =
	| "animating"
	| "animationCancelled"
	| "animationCompleted"
	| "animationReady"

export type AnimationTransitions =
	| "ANIMATION_CANCEL"
	| "ANIMATION_END"
	| "ANIMATION_ITERATION"
	| "ANIMATION_RESET"
	| "ANIMATION_START"

export type CounterStates =
	| "counting"
	| "counterDone"
	| "counterPaused"

export type CounterTransitions =
	| "COUNTER_CLEAR"
	| "COUNTER_DECREMENT"
	| "COUNTER_INCREMENT"
	| "COUNTER_PAUSE"
	| "COUNTER_RESET"
	| "COUNTER_RESUME"
	| "COUNTER_STOP"

export type CSSTransitionStates =
	| "transitionCancelled"
	| "transitionCompleted"
	| "transitionReady"
	| "transitionRunning"
	| "transitioning"

export type CSSTransitionTransitions =
	| "CSS_TRANSITION_CANCEL"
	| "CSS_TRANSITION_END"
	| "CSS_TRANSITION_RESET"
	| "CSS_TRANSITION_RUN"
	| "CSS_TRANSITION_START"

export type FocusTransitions =
	| "BLUR"
	| "FOCUS"

export type FocusStates =
	| "blurred"
	| "focused"

export type FormStates =
	| "formFailed"
	| "formPending"
	| "formReady"
	| "formSucceeded"
	| "formSubmitted"

export type FormTransitions =
	| "FORM_DATA"
	| "FORM_FAILURE"
	| "FORM_INITIALIZE"
	| "FORM_RESET"
	| "FORM_SUBMIT"
	| "FORM_SUCCESS"
	| "FORM_UPDATE"

export type InputStates =
	| "inputClean"
	| "inputDirty"
	| "inputUpdating"
	| "inputValidating"

export type InputTransitions =
	| "INPUT_CLEAR"
	| "INPUT_RESET"
	| "INPUT_UPDATE"

export type KeyboardStates =
	| "keyboardReady"
	| "keyDown"

export type KeyboardTransitions =
	| "KEY_DOWN"
	| "KEY_REDO"
	| "KEY_RESET"
	| "KEY_UNDO"
	| "KEY_UP"

export type MaskStates =
	| "masked"
	| "unmasked"

export type MaskTransitions =
	| "BLUR"
	| "FOCUS"
	| "MASK"
	| "UNMASK"

export type MaskTrigger =
	| "ON_BLUR"
	| "ON_FOCUS"

export type OperationStates =
	| "disabled"
	| "enabled"

export type OperationTransitions =
	| "DISABLE"
	| "ENABLE"

export type PointerDownStates =
	| "pointerDown"
	| "pointerUp"

export type PointerDownTransitions =
	| "POINTER_DOWN"
	| "POINTER_UP"

export type PointerEnterStates =
	| "pointerEntered"
	| "pointerLeft"

export type PointerEnterTransitions =
	| "POINTER_ENTER"
	| "POINTER_LEAVE"

export type PointerMoveTransitions = "POINTER_MOVE"

export type PointerMoveStates = "pointerMoveEnabled"

export type PointerOutStates =
	| "pointerOut"
	| "pointerOver"

export type PointerOutTransitions =
	| "POINTER_OUT"
	| "POINTER_OVER"

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

export type PointerTransitions =
	| PointerDownTransitions
	| PointerEnterTransitions
	| PointerMoveTransitions
	| PointerOutTransitions

export type ToggleStates =
	| "untoggled"
	| "toggled"

export type ToggleTransitions =
	| "TOGGLE"
	| "TOGGLE_CLEAR"
	| "TOGGLE_RESET"

export type TouchStates =
	| "touched"
	| "untouched"

export type TouchTransitions =
	| "BLUR"
	| "FOCUS"
	| "INPUT_CLEAR"
	| "INPUT_RESET"
	| "INPUT_UPDATE"
	| "TOUCH"
	| "UNTOUCH"

export type Transitions =
	| AnimationTransitions
	| CounterTransitions
	| CSSTransitionTransitions
	| FocusTransitions
	| FormTransitions
	| InputTransitions
	| KeyboardTransitions
	| MaskTransitions
	| OperationTransitions
	| PointerDownTransitions
	| PointerEnterTransitions
	| PointerMoveTransitions
	| PointerOutTransitions
	| ToggleTransitions
	| TouchTransitions

export type TypeOfMachine =
	| "ANIMATION"
	| "COUNTER"
	| "CSS_TRANSITION"
	| "FOCUS"
	| "FORM"
	| "INPUT"
	| "KEYBOARD"
	| "MASK"
	| "NESTED"
	| "OPERATION"
	| "PARALLEL"
	| "POINTER_DOWN"
	| "POINTER_ENTER"
	| "POINTER_MOVE"
	| "POINTER_OVER"
	| "TOGGLE"
	| "TOUCH"

export type ValidityStates =
	| "inputInvalid"
	| "inputValid"

// ============ TYPES ============

export type AnimationMachineContext = {
	enabledEvents?: Array<AnimationTransitions>
	iterations: number
	topic?: string
} & Record<string, RecursiveRecord>

export type AnimationMachineEvent = EventObject & {
	type: `${AnimationTransitions}`
}

export type AnimationMachineParams = {
	id?: string
	initial?: AnimationStates
	iterations?: number
} & Partial<AnimationMachineContext>

export type AnimationMachineState = {
	context: AnimationMachineContext
	states: Record<AnimationStates, StateSchema<AnimationMachineContext>>
}

export type Config = {
	actions?: Record<string, AssignAction<MachineContext, MachineEvent>>
	guards?: Record<string, (context: MachineContext, event: MachineEvent) => boolean>
	machine: Machine
}

export type CounterMachineContext = {
	count: number
	enabledEvents?: Array<CounterTransitions>
	increment: number
	topic?: string
	transitions: number
} & Record<string, RecursiveRecord>

export type CounterMachineEvent = EventObject & {
	type: `${CounterTransitions}`
}

export type CounterMachineParams = {
	id?: string
	increment?: number
	initial?: CounterStates
	count?: number
	transitions?: number
} & Partial<CounterMachineContext>

export type CounterMachineState = {
	context: CounterMachineContext
	states: Record<CounterStates, StateSchema<CounterMachineContext>>
}

export type CSSTransitionMachineContext = {
	enabledEvents?: Array<CSSTransitionTransitions>
	iterations: number
	topic?: string
} & Record<string, RecursiveRecord>

export type CSSTransitionMachineEvent = EventObject & {
	type: `${CSSTransitionTransitions}`
}

export type CSSTransitionMachineParams = {
	id?: string
	initial?: CSSTransitionStates
} & Partial<CSSTransitionMachineContext>

export type CSSTransitionMachineState = {
	context: CSSTransitionMachineContext
	states: Record<CSSTransitionStates, StateSchema<CSSTransitionMachineContext>>
}

export type EnabledState = {
	enabled: {
		focus?: FocusStates
		touch?: TouchStates
		mask?: MaskStates
		input?: InputStates
	}
}

export type FocusMachineContext = {
	enabledEvents?: Array<FocusTransitions>
	topic?: string
} & Record<string, RecursiveRecord>

export type FocusMachineEvent = EventObject & {
	type: `${FocusTransitions}`
	id?: string
}

export type FocusMachineParams = {
	id?: string
	initial?: FocusStates
} & Partial<FocusMachineContext>

export type FocusMachineState = {
	context: FocusMachineContext
	states: Record<FocusStates, StateSchema<FocusMachineContext>>
}

export type FormMachineContext = {
	enabledEvents?: Array<FormTransitions>
	error?: string
	fields?: {
		[name: string]: {
			[key: string]: RecursiveRecord
		}
	}
	topic?: string
} & Record<string, RecursiveRecord>

export type ErrorEvent = {
	type: "FORM_FAILURE"
	error: string
}

export type Fields = {
	[name: string]: {
		[key: string]: RecursiveRecord
	}
}

export type FormMachineEvent = {
	error?: string
	fields?: Fields
	type: `${FormTransitions}`
}

export type FormMachineParams = {
	id?: string
	initial?: FormStates
} & Partial<FormMachineContext>

export type FormMachineState = {
	context: FormMachineContext
	states: Record<FormStates, StateSchema<FormMachineContext>>
}

export type InputMachineContext = {
	enabledEvents?: Array<InputTransitions>
	errors?: Array<string>
	humanizedName?: string
	id: string
	initialValue: string
	isInvalid: boolean
	label?: string
	name: string
	topic?: string
	validate?: (validation: Validation) => Validation
	value: string
}

export type InputEvent = EventObject & {
	value: string
}

export type InputMachineEvent =
	& EventObject
	& (NoValueEvent | ValueEvent)

export type InputMachineParams = {
	errorText?: string
	humanizedName?: string
	id?: string
	initial?: InputStates
} & Partial<Omit<InputMachineContext, "value">>

export type InputMachineState = {
	context: InputMachineContext
	states: Partial<Record<InputStates, StateSchema<InputMachineContext>>>
}

export type KeyboardEvent = {
	altKey?: boolean
	code?: string
	ctrlKey?: boolean
	isComposing?: boolean
	key?: string
	locale?: string
	location?: number
	metaKey?: boolean
	redo?: Array<KeyboardEvent>
	repeat?: boolean
	shiftKey?: boolean
	undo?: Array<KeyboardEvent>
}

export type KeyboardMachineContext = {
	enabledEvents?: Array<KeyboardTransitions>
	key: KeyboardEvent
	redo: Array<KeyboardEvent>
	topic?: string
	undo: Array<KeyboardEvent>
} & Record<string, RecursiveRecord>

export type KeyboardMachineEvent = EventObject & (KeyEvent | NoKeyEvent)

export type KeyboardMachineParams = {
	enableRedo?: boolean
	enableUndo?: boolean
	id?: string
	initial?: KeyboardStates
} & Partial<KeyboardMachineContext>

export type KeyboardMachineState = {
	context: KeyboardMachineContext
	states: Record<KeyboardStates, StateSchema<KeyboardMachineContext>>
}

export type KeyEvent = EventObject & {
	type: "KEY_DOWN"
	key: KeyboardEvent
}

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

export type MachineType = "parallel" | "atomic" | "compound" | "final" | "history" | undefined

export type MaskMachineContext = {
	enabledEvents?: Array<MaskTransitions>
	topic?: string
} & Record<string, RecursiveRecord>

export type MaskMachineEvent = EventObject & {
	type: `${MaskTransitions}`
}

export type MaskMachineParams = {
	id?: string
	initial?: MaskStates
	maskTrigger?: MaskTrigger
} & Partial<MaskMachineContext>

export type MaskMachineState = {
	context: MaskMachineContext
	states: Record<MaskStates, StateSchema<MaskMachineContext>>
}

export type NestedMachineContext = {
	enabledEvents: Array<Transitions>
	topic?: string
}

export type NestedMachineParams = {
	id?: string
	child: CreateMachineParamsConfig
	parent: CreateMachineParamsConfig
	injectInto: StateNames
} & Partial<NestedMachineContext>

export type NoKeyEvent = EventObject & {
	type: `${Exclude<KeyboardTransitions, "KEY_DOWN">}`
}

export type NoValueEvent = {
	type: `${Exclude<InputTransitions, "INPUT_UPDATE">}`
}

export type OperationMachineContext = {
	enabledEvents?: Array<OperationTransitions>
	topic?: string
} & Record<string, RecursiveRecord>

export type OperationMachineEvent = EventObject & {
	type: `${OperationTransitions}`
}

export type OperationMachineParams = {
	id?: string
	initial?: OperationStates
} & Partial<OperationMachineContext>

export type OperationMachineState = {
	context: OperationMachineContext
	states: Record<OperationStates, StateSchema<OperationMachineContext>>
}

export type ParallelMachineContext = {
	enabledEvents: Array<Transitions>
	pointer?: PointerEvent
	pointerTracking?: Array<PointerTracking>
	topic?: string
}

export type ParallelMachineParams = {
	children: {
		ANIMATION?: AnimationMachineParams
		COUNTER?: CounterMachineParams
		CSS_TRANSITION?: CSSTransitionMachineParams
		FOCUS?: FocusMachineParams
		FORM?: FormMachineParams
		INPUT?: InputMachineParams
		KEYBOARD?: KeyboardMachineParams
		MASK?: MaskMachineParams
		NESTED?: NestedMachineParams
		OPERATION?: OperationMachineParams
		PARALLEL?: ParallelMachineParams
		POINTER_DOWN?: PointerDownMachineParams
		POINTER_ENTER?: PointerEnterMachineParams
		POINTER_MOVE?: PointerMoveMachineParams
		POINTER_OVER?: PointerOverMachineParams
		TOGGLE?: ToggleMachineParams
		TOUCH?: TouchMachineParams
	}
	id?: string
} & Partial<ParallelMachineContext>

export type PointerEvent = {
	altKey?: boolean | null
	altitudeAngle?: number | null
	azimuthAngle?: number | null
	clientX?: number | null
	clientY?: number | null
	composed?: boolean | null
	ctrlKey?: boolean | null
	layerX?: number | null
	layerY?: number | null
	metaKey?: boolean | null
	movementX?: number | null
	movementY?: number | null
	offsetX?: number | null
	offsetY?: number | null
	pageX?: number | null
	pageY?: number | null
	pointerType?: "mouse" | "pen" | "touch" | null
	pressure?: number | null
	screenX?: number | null
	screenY?: number | null
	shiftKey?: boolean | null
	tangentialPressure?: number | null
	tiltX?: number | null
	tiltY?: number | null
	twist?: number | null
	x?: number | null
	y?: number | null
}

export type PointerMoveMachineContext = {
	enabledEvents?: Array<PointerMoveTransitions>
	pointer: PointerEvent
	pointerTracking?: Array<PointerTracking>
	topic?: string
} & Record<string, RecursiveRecord>

export type PointerOverMachineContext = {
	enabledEvents?: Array<PointerOutTransitions>
	pointer: PointerEvent
	pointerTracking?: Array<PointerTracking>
	topic?: string
} & Record<string, RecursiveRecord>

export type PointerDownMachineContext = {
	enabledEvents?: Array<PointerDownTransitions>
	pointer: PointerEvent
	pointerTracking?: Array<PointerTracking>
	topic?: string
} & Record<string, RecursiveRecord>

export type PointerDownMachineEvent =
	& EventObject
	& { type: PointerDownTransitions }
	& Partial<PointerEvent>

export type PointerDownMachineParams = {
	id?: string
	initial?: PointerDownStates
} & Partial<PointerDownMachineContext>

export type PointerEnterMachineContext = {
	enabledEvents?: Array<PointerEnterTransitions>
	pointer: PointerEvent
	pointerTracking?: Array<PointerTracking>
	topic?: string
} & Record<string, RecursiveRecord>

export type PointerEnterMachineEvent =
	& EventObject
	& { type: PointerEnterTransitions }
	& Partial<PointerEvent>

export type PointerEnterMachineParams = {
	id?: string
	initial?: PointerEnterStates
} & Partial<PointerEnterMachineContext>

export type PointerMoveMachineEvent =
	& EventObject
	& { type: PointerMoveTransitions }
	& Partial<PointerEvent>

export type PointerOverMachineEvent =
	& EventObject
	& { type: PointerOutTransitions }
	& Partial<PointerEvent>

export type PointerMoveMachineParams = {
	id?: string
	initial?: PointerMoveStates
} & Partial<PointerMoveMachineContext>

export type PointerOverMachineParams = {
	id?: string
	initial?: PointerOutStates
} & Partial<PointerOverMachineContext>

export type PointerEnterMachineState = {
	context: PointerEnterMachineContext
	states: Record<PointerEnterStates, StateSchema<PointerEnterMachineContext>>
}

export type PointerMoveMachineState = {
	context: PointerMoveMachineContext
	states: Record<PointerMoveStates, StateSchema<PointerMoveMachineContext>>
}

export type PointerOverMachineState = {
	context: PointerOverMachineContext
	states: Record<PointerOutStates, StateSchema<PointerOverMachineContext>>
}

export type PointerDownMachineState = {
	context: PointerDownMachineContext
	states: Record<PointerDownStates, StateSchema<PointerDownMachineContext>>
}

export type RecursiveRecord =
	| string
	| number
	| boolean
	| undefined
	| {
		[key: string]: RecursiveRecord
	}
	| Array<RecursiveRecord>
	| ((validation: Validation) => Validation)

export type ToggleMachineContext = {
	enabledEvents?: Array<ToggleTransitions>
	toggleCount: number
	topic?: string
} & Record<string, RecursiveRecord>

export type ToggleMachineEvent = EventObject & {
	type: `${ToggleTransitions}`
}

export type ToggleMachineParams = {
	id?: string
	initial?: ToggleStates
	toggleCount?: number
} & Partial<ToggleMachineContext>

export type ToggleMachineState = {
	context: ToggleMachineContext
	states: Record<ToggleStates, StateSchema<ToggleMachineContext>>
}

export type TouchMachineContext = {
	enabledEvents?: Array<TouchTransitions>
	topic?: string
} & Record<string, RecursiveRecord>

export type TouchMachineEvent = EventObject & {
	type: `${TouchTransitions}`
}

export type TouchMachineParams = {
	id?: string
	initial?: TouchStates
} & Partial<TouchMachineContext>

export type TouchMachineState = {
	context: TouchMachineContext
	states: Record<TouchStates, StateSchema<TouchMachineContext>>
}

export type UseMachineOptions = {
	enabledEvents?: Array<Transitions>
	errorText?: string
	id?: string
	initial: string
	initialMaskState?: MaskStates
	initialValue?: string
	maskTrigger?: "ON_BLUR" | "ON_FOCUS"
	name?: string
	topic?: string
	history?: "deep" | "shallow"
	useMask?: MaskTrigger
	validate?: (validation: Validation) => Validation
}

export type UseMachinesReturn = {
	actions: MachineControls
	context: MachineContext
	state: RecursiveRecord
	status: Partial<Record<MachineStatuses, () => boolean>>
}

export type Validation = {
	errors?: Array<string>
	isInvalid?: boolean
	value: string
}

export type ValueEvent = {
	type: `${Exclude<InputTransitions, "INPUT_CLEAR" | "RESET">}`
	value: string
}

export type ValueTarget = EventTarget & {
	value: string
}

// ============ UNIONS ============
export type MachineContext =
	| AnimationMachineContext
	| CounterMachineContext
	| CSSTransitionMachineContext
	| FormMachineContext
	| InputMachineContext
	| KeyboardMachineContext
	| PointerDownMachineContext
	| PointerEnterMachineContext
	| PointerMoveMachineContext
	| PointerOverMachineContext
	| ToggleMachineContext

export type MachineEvent =
	| AnimationMachineEvent
	| CounterMachineEvent
	| CSSTransitionMachineEvent
	| FocusMachineEvent
	| FormMachineEvent
	| InputMachineEvent
	| KeyboardMachineEvent
	| MaskMachineEvent
	| OperationMachineEvent
	| PointerDownMachineEvent
	| PointerEnterMachineEvent
	| PointerMoveMachineEvent
	| PointerOverMachineEvent
	| ToggleMachineEvent
	| TouchMachineEvent

export type MachineParams =
	| AnimationMachineParams
	| CounterMachineParams
	| CSSTransitionMachineParams
	| FocusMachineParams
	| FormMachineParams
	| InputMachineParams
	| KeyboardMachineParams
	| MaskMachineParams
	| NestedMachineParams
	| OperationMachineParams
	| ParallelMachineParams
	| PointerDownMachineParams
	| PointerEnterMachineParams
	| PointerMoveMachineParams
	| PointerOverMachineParams
	| ToggleMachineParams
	| TouchMachineParams

export type MachineState =
	| AnimationMachineState
	| CounterMachineState
	| CSSTransitionMachineState
	| FocusMachineState
	| FormMachineState
	| InputMachineState
	| KeyboardMachineState
	| MaskMachineState
	| OperationMachineState
	| PointerDownMachineState
	| PointerEnterMachineState
	| PointerMoveMachineState
	| PointerOverMachineState
	| ToggleMachineState
	| TouchMachineState

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

export type StateNames =
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
	| PointerMoveStates
	| PointerOutStates
	| ToggleStates
	| TouchStates

export type Machine =
	| MachineConfig<AnimationMachineContext, AnimationMachineState, AnimationMachineEvent>
	| MachineConfig<CounterMachineContext, CounterMachineState, CounterMachineEvent>
	| MachineConfig<CSSTransitionMachineContext, CSSTransitionMachineState, CSSTransitionMachineEvent>
	| MachineConfig<FocusMachineContext, FocusMachineState, FocusMachineEvent>
	| MachineConfig<FormMachineContext, FormMachineState, FormMachineEvent>
	| MachineConfig<InputMachineContext, InputMachineState, InputMachineEvent>
	| MachineConfig<KeyboardMachineContext, KeyboardMachineState, KeyboardMachineEvent>
	| MachineConfig<MaskMachineContext, MaskMachineState, MaskMachineEvent>
	| MachineConfig<OperationMachineContext, OperationMachineState, OperationMachineEvent>
	| MachineConfig<PointerDownMachineContext, PointerDownMachineState, PointerDownMachineEvent>
	| MachineConfig<PointerEnterMachineContext, PointerEnterMachineState, PointerEnterMachineEvent>
	| MachineConfig<PointerMoveMachineContext, PointerMoveMachineState, PointerMoveMachineEvent>
	| MachineConfig<PointerOverMachineContext, PointerOverMachineState, PointerOverMachineEvent>
	| MachineConfig<ToggleMachineContext, ToggleMachineState, ToggleMachineEvent>
	| MachineConfig<TouchMachineContext, TouchMachineState, TouchMachineEvent>

export type CreateMachineParamsConfig =
	| { ANIMATION: AnimationMachineParams }
	| { COUNTER: CounterMachineParams }
	| { CSS_TRANSITION: CSSTransitionMachineParams }
	| { FOCUS: FocusMachineParams }
	| { FORM: FormMachineParams }
	| { INPUT: InputMachineParams }
	| { KEYBOARD: KeyboardMachineParams }
	| { MASK: MaskMachineParams }
	| { NESTED: NestedMachineParams }
	| { OPERATION: OperationMachineParams }
	| { PARALLEL: ParallelMachineParams }
	| { POINTER_DOWN: PointerDownMachineParams }
	| { POINTER_ENTER: PointerEnterMachineParams }
	| { POINTER_MOVE: PointerMoveMachineParams }
	| { POINTER_OVER: PointerOverMachineParams }
	| { TOGGLE: ToggleMachineParams }
	| { TOUCH: TouchMachineParams }

export type Options =
	| MachineOptions<AnimationMachineContext, AnimationMachineEvent>
	| MachineOptions<CounterMachineContext, CounterMachineEvent>
	| MachineOptions<CSSTransitionMachineContext, CSSTransitionMachineEvent>
	| MachineOptions<FocusMachineContext, FocusMachineEvent>
	| MachineOptions<FormMachineContext, FormMachineEvent>
	| MachineOptions<InputMachineContext, InputMachineEvent>
	| MachineOptions<KeyboardMachineContext, KeyboardMachineEvent>
	| MachineOptions<MaskMachineContext, MaskMachineEvent>
	| MachineOptions<OperationMachineContext, OperationMachineEvent>
	| MachineOptions<PointerDownMachineContext, PointerDownMachineEvent>
	| MachineOptions<PointerEnterMachineContext, PointerEnterMachineEvent>
	| MachineOptions<PointerMoveMachineContext, PointerMoveMachineEvent>
	| MachineOptions<PointerOverMachineContext, PointerOverMachineEvent>
	| MachineOptions<ToggleMachineContext, ToggleMachineEvent>
	| MachineOptions<TouchMachineContext, TouchMachineEvent>
