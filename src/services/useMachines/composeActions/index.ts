import type {
	CreateMachineParamsConfig,
	KeyboardEvent,
	MachineControls,
	MachineEvent,
	MachineParams,
	PointerEvent,
	TypeOfMachine,
} from "~services/useMachines/types"
import getPointer from "../utilities/getPointer"

export default function composeActions(
	config: CreateMachineParamsConfig,
	send: (e: MachineEvent) => void,
): MachineControls {
	const [[key, mach]] = Object.entries(config)

	switch (key) {
		case "NESTED":
			return {
				...composeActions(mach.parent, send),
				...composeNestedActions(mach.child, send),
			}
		case "PARALLEL":
			return composeNestedActions(mach.children, send)
		default:
			return actions[key](send)
	}
}

const actions: Record<string, (send?: (e: MachineEvent) => void) => MachineControls> = {
	ANIMATION: (send) => ({
		animationCancel: () => send?.({ type: "ANIMATION_CANCEL" }),
		animationEnd: () => send?.({ type: "ANIMATION_END" }),
		animationIteration: () => send?.({ type: "ANIMATION_ITERATION" }),
		animationReset: () => send?.({ type: "ANIMATION_RESET" }),
		animationStart: () => send?.({ type: "ANIMATION_START" }),
	}),
	COUNTER: (send) => ({
		counterClear: () => send?.({ type: "COUNTER_CLEAR" }),
		counterDecrement: () => send?.({ type: "COUNTER_DECREMENT" }),
		counterIncrement: () => send?.({ type: "COUNTER_INCREMENT" }),
		counterPause: () => send?.({ type: "COUNTER_PAUSE" }),
		counterReset: () => send?.({ type: "COUNTER_RESET" }),
		counterResume: () => send?.({ type: "COUNTER_RESUME" }),
		counterStop: () => send?.({ type: "COUNTER_STOP" }),
	}),
	CSS_TRANSITION: (send) => ({
		cssTransitionCancel: () => send?.({ type: "CSS_TRANSITION_CANCEL" }),
		cssTransitionEnd: () => send?.({ type: "CSS_TRANSITION_END" }),
		cssTransitionReset: () => send?.({ type: "CSS_TRANSITION_RESET" }),
		cssTransitionRun: () => send?.({ type: "CSS_TRANSITION_RUN" }),
		cssTransitionStart: () => send?.({ type: "CSS_TRANSITION_START" }),
	}),
	FOCUS: (send) => ({
		blur: () => send?.({ type: "BLUR" }),
		focus: () => send?.({ type: "FOCUS" }),
	}),
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
	INPUT: (send) => ({
		inputClear: () => send?.({ type: "INPUT_CLEAR" }),
		inputReset: () => send?.({ type: "INPUT_RESET" }),
		inputUpdate: (value: string) =>
			send?.({
				type: "INPUT_UPDATE",
				value,
			}),
	}),
	KEYBOARD: (send) => ({
		keyDown: (key: KeyboardEvent) => send?.({ type: "KEY_DOWN", key }),
		keyRedo: () => send?.({ type: "KEY_REDO" }),
		keyReset: () => send?.({ type: "KEY_RESET" }),
		keyUndo: () => send?.({ type: "KEY_UNDO" }),
		keyUp: () => send?.({ type: "KEY_UP" }),
	}),
	MASK: (send) => ({
		blur: () => send?.({ type: "BLUR" }),
		focus: () => send?.({ type: "FOCUS" }),
		mask: () => send?.({ type: "MASK" }),
		unmask: () => send?.({ type: "UNMASK" }),
	}),
	OPERATION: (send) => ({
		disable: () => send?.({ type: "DISABLE" }),
		enable: () => send?.({ type: "ENABLE" }),
	}),
	POINTER_DOWN: (send) => ({
		pointerDown: (event: PointerEvent) =>
			send?.({
				type: "POINTER_DOWN",
				...getPointer(event),
			}),
		pointerUp: (event: PointerEvent) =>
			send?.({
				type: "POINTER_UP",
				...getPointer(event),
			}),
	}),
	POINTER_ENTER: (send) => ({
		pointerEnter: (event: PointerEvent) =>
			send?.({
				type: "POINTER_ENTER",
				...getPointer(event),
			}),
		pointerLeave: (event: PointerEvent) =>
			send?.({
				type: "POINTER_LEAVE",
				...getPointer(event),
			}),
	}),
	POINTER_MOVE: (send) => ({
		pointerMove: (event: PointerEvent) =>
			send?.({
				type: "POINTER_MOVE",
				...getPointer(event),
			}),
	}),
	POINTER_OVER: (send) => ({
		pointerOut: (event: PointerEvent) =>
			send?.({
				type: "POINTER_OUT",
				...getPointer(event),
			}),
		pointerOver: (event: PointerEvent) =>
			send?.({
				type: "POINTER_OVER",
				...getPointer(event),
			}),
	}),
	TOGGLE: (send) => ({
		toggle: () => send?.({ type: "TOGGLE" }),
		toggleClear: () => send?.({ type: "TOGGLE_CLEAR" }),
		toggleReset: () => send?.({ type: "TOGGLE_RESET" }),
	}),
	TOUCH: (send) => ({
		blur: () => send?.({ type: "BLUR" }),
		focus: () => send?.({ type: "FOCUS" }),
		inputClear: () => send?.({ type: "INPUT_CLEAR" }),
		inputReset: () => send?.({ type: "INPUT_RESET" }),
		inputUpdate: (value: string) =>
			send?.({
				type: "INPUT_UPDATE",
				value,
			}),
		touch: () => send?.({ type: "TOUCH" }),
		untouch: () => send?.({ type: "UNTOUCH" }),
	}),
}

function composeNestedActions (
	config: Record<TypeOfMachine, MachineParams>,
	send: (e: MachineEvent) => void,
): MachineControls {
	return Object.entries(config).reduce((acc, [key, value]) => ({
		...acc,
		...composeActions({ [key]: value } as CreateMachineParamsConfig, send),
	}), {} as MachineControls)
}
