import stringToBoolean from "./"

test("[stringToBoolean] converts TRUE to true case-insensitively, otherwise false", () => {
	expect(stringToBoolean("true")).toBe(true)
	expect(stringToBoolean("tRuE")).toBe(true)
	expect(stringToBoolean("uh, oh")).toBe(false)
	expect(stringToBoolean("false")).toBe(false)
})
