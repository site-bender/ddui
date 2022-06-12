import generateShortId from "./"

const re = /^[A-Za-z0-9]{21,22}$/

test("[generateShortId] generates a Base58 short id", () => {
	expect(generateShortId()).toMatch(re)
	expect(generateShortId()).toMatch(re)
	expect(generateShortId()).toMatch(re)
	expect(generateShortId()).toMatch(re)
})
