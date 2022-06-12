import identity from "./"

test("[identity] returns the value unchanged", () => {
	expect(identity(0)).toBe(0)
	expect(identity("")).toBe("")
	expect(identity(undefined)).toBeUndefined()
	expect(identity(null)).toBeNull()
	expect(identity(false)).toBe(false)
	expect(identity({ key: "value" })).toEqual({ key: "value" })
	expect(identity(["x", 9, true])).toEqual(["x", 9, true])
})
