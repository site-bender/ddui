import setPointerContext from "./"

test("[setPointerContext] sets the correct context", () => {
	expect(setPointerContext({
		clientX: 5,
		clientY: 7,
		screenX: 100,
		screenY: 200,
	}, {
		screenX: 42,
		screenY: 84,
		layerX: 77,
		layerY: 144,
	})).toEqual({
		clientX: undefined,
		clientY: undefined,
		screenX: 42,
		screenY: 84,
	})
})
