import makeDataAttributes from "./"

test("[makeDataAttributes] returns a an object with 'data-' prepended to keys", () => {
	expect(makeDataAttributes({
		color: "blue",
		age: 33,
		isHandsome: true,
	})).toMatchObject({ "data-color": "blue", "data-age": 33, "data-isHandsome": true })
})

test("[makeDataAttributes] returns an empty object for no input", () => {
	expect(makeDataAttributes()).toEqual({})
})

test("[makeDataAttributes] returns an empty object for bad input", () => {
	expect(makeDataAttributes({
		// @ts-ignore: for testing purposes
		bob: {
			alice: "ted",
		},
	})).toEqual({})
})
