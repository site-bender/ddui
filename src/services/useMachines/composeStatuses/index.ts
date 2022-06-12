import type {
	CreateMachineParamsConfig,
	MachineParams,
	MachineStatuses,
	TypeOfMachine,
} from "~services/useMachines/types"

const statuses: Record<string, Array<MachineStatuses>> = {
	ANIMATION: [
		"animating",
		"animationCancelled",
		"animationCompleted",
		"animationReady",
	],
	COUNTER: [
		"counting",
		"counterDone",
		"counterPaused",
	],
	CSS_TRANSITION: [
		"transitionCancelled",
		"transitionCompleted",
		"transitionReady",
		"transitionRunning",
		"transitioning",
	],
	FOCUS: [
		"blurred",
		"focused",
	],
	FORM: [
		"formFailed",
		"formPending",
		"formReady",
		"formSucceeded",
		"formSubmitted",
	],
	INPUT: [
		"inputClean",
		"inputDirty",
		"inputUpdating",
		"inputValidating",
		"inputInvalid",
		"inputValid",
	],
	KEYBOARD: [
		"keyboardReady",
		"keyDown",
	],
	MASK: [
		"masked",
		"unmasked",
	],
	NESTED: [],
	OPERATION: [
		"disabled",
		"enabled",
	],
	POINTER_DOWN: [
		"pointerDown",
		"pointerUp",
	],
	POINTER_ENTER: [
		"pointerEntered",
		"pointerLeft",
	],
	POINTER_MOVE: [],
	POINTER_OVER: [
		"pointerOut",
		"pointerOver",
	],
	PARALLEL: [],
	TOGGLE: [
		"untoggled",
		"toggled",
	],
	TOUCH: [
		"touched",
		"untouched",
	],
}

function composeNestedStatuses (config: Record<TypeOfMachine, MachineParams>): Array<MachineStatuses> {
	return Object.entries(config).reduce((acc, [key, value]) => [
		...acc,
		...composeStatuses({ [key]: value } as CreateMachineParamsConfig),
	], [] as Array<MachineStatuses>)
}

export default function composeStatuses(
	config: CreateMachineParamsConfig,
): Array<MachineStatuses> {
	const [[key, mach]] = Object.entries(config)

	switch (key) {
		case "NESTED":
			return [...composeStatuses(mach.parent), ...composeNestedStatuses(mach.child)]
		case "PARALLEL":
			return composeNestedStatuses(mach.children)
		default:
			return statuses[key]
	}
}
