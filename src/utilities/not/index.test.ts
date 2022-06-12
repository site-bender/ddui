import not from "./"

test("[not] converts falsy to true", () => {
	expect(not(0)).toBe(true)
	expect(not("")).toBe(true)
	expect(not(undefined)).toBe(true)
	expect(not(null)).toBe(true)
	expect(not(false)).toBe(true)
})

test("[not] converts truthy to false", () => {
	expect(not(1)).toBe(false)
	expect(not("yes")).toBe(false)
	expect(not([])).toBe(false)
	expect(not({})).toBe(false)
	expect(not(true)).toBe(false)
})
