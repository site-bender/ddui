import initializePointerContext from "./"

test("[initializePointerContext] correctly initializes the pointer", () => {
	expect(initializePointerContext([
		"client",
		"coords",
		"keys",
		"layer",
		"movement",
		"offset",
		"page",
		"pen",
		"screen",
		"tilt",
		"type",
	])).toEqual({
		clientX: null,
		clientY: null,
		x: null,
		y: null,
		altKey: null,
		ctrlKey: null,
		metaKey: null,
		shiftKey: null,
		layerX: null,
		layerY: null,
		movementX: null,
		movementY: null,
		offsetX: null,
		offsetY: null,
		pageX: null,
		pageY: null,
		altitudeAngle: null,
		azimuthAngle: null,
		pressure: null,
		tangentialPressure: null,
		twist: null,
		screenX: null,
		screenY: null,
		tiltX: null,
		tiltY: null,
		composed: null,
		pointerType: null,
	})
})

test("[initializePointerContext] returns empty for no trackers", () => {
	expect(initializePointerContext([])).toEqual({})
})
