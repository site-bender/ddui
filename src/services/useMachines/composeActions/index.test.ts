import composeActions from "./"

const f = () => null

test("[composeActions] properly composes actions", () => {
	expect(Object.keys(composeActions({ ANIMATION: {} }, f))).toEqual([
		"animationCancel",
		"animationEnd",
		"animationIteration",
		"animationReset",
		"animationStart",
	])

	expect(Object.keys(composeActions({ COUNTER: {} }, f))).toEqual([
		"counterClear",
		"counterDecrement",
		"counterIncrement",
		"counterPause",
		"counterReset",
		"counterResume",
		"counterStop",
	])
	expect(Object.keys(composeActions({ CSS_TRANSITION: {} }, f))).toEqual([
		"cssTransitionCancel",
		"cssTransitionEnd",
		"cssTransitionReset",
		"cssTransitionRun",
		"cssTransitionStart",
	])
	expect(Object.keys(composeActions({ FOCUS: {} }, f))).toEqual(["blur", "focus"])
	expect(Object.keys(composeActions({ FORM: {} }, f))).toEqual([
		"formData",
		"formFailed",
		"formInitialize",
		"formReset",
		"formSubmit",
		"formSucceeded",
		"formUpdate",
	])
	expect(Object.keys(composeActions({ INPUT: {} }, f))).toEqual(["inputClear", "inputReset", "inputUpdate"])
	expect(Object.keys(composeActions({ KEYBOARD: {} }, f))).toEqual([
		"keyDown",
		"keyRedo",
		"keyReset",
		"keyUndo",
		"keyUp",
	])
	expect(Object.keys(composeActions({ MASK: {} }, f))).toEqual(["blur", "focus", "mask", "unmask"])
	expect(Object.keys(composeActions({
		NESTED: {
			child: { TOGGLE: {} },
			injectInto: "enabled",
			parent: { OPERATION: {} },
		},
	}, f))).toEqual(["disable", "enable", "toggle", "toggleClear", "toggleReset"])
	expect(Object.keys(composeActions({ OPERATION: { history: "deep" } }, f))).toEqual([
		"disable",
		"enable",
		// "reset",
		// "resume",
	])
	expect(Object.keys(composeActions({
		PARALLEL: {
			children: {
				TOGGLE: {},
				FOCUS: {},
			},
		},
	}, f))).toEqual(["toggle", "toggleClear", "toggleReset", "blur", "focus"])
	expect(Object.keys(composeActions({ POINTER_DOWN: {} }, f))).toEqual(["pointerDown", "pointerUp"])
	expect(Object.keys(composeActions({ POINTER_ENTER: {} }, f))).toEqual(["pointerEnter", "pointerLeave"])
	expect(Object.keys(composeActions({ POINTER_MOVE: {} }, f))).toEqual(["pointerMove"])
	expect(Object.keys(composeActions({ POINTER_OVER: {} }, f))).toEqual(["pointerOut", "pointerOver"])
	expect(Object.keys(composeActions({ TOGGLE: {} }, f))).toEqual(["toggle", "toggleClear", "toggleReset"])
	expect(Object.keys(composeActions({ TOUCH: {} }, f))).toEqual([
		"blur",
		"focus",
		"inputClear",
		"inputReset",
		"inputUpdate",
		"touch",
		"untouch",
	])
})
