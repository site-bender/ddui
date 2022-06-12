import nullToUndefined from "./"

test("[nullToUndefined] returns undefined for null, otherwise the value unchanged", () => {
	expect(nullToUndefined(0)).toBe(0)
	expect(nullToUndefined("")).toBe("")
	expect(nullToUndefined(undefined)).toBeUndefined()
	expect(nullToUndefined(null)).toBeUndefined()
	expect(nullToUndefined(false)).toBe(false)
	expect(nullToUndefined({ key: "value" })).toEqual({ key: "value" })
	expect(nullToUndefined(["x", 9, true])).toEqual(["x", 9, true])
})
