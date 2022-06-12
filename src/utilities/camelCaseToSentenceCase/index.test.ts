import camelCaseToSentenceCase from "./"

const one = "this"
const two = "thisIs"
const three = "thisIsReally"
const four = "thisIsReally-something"
const five = "thisIsReally-something Else"
const six = "This is a sentence."

test("[camelCaseToSentenceCase] given camelCase returns Sentence case", () => {
	expect(camelCaseToSentenceCase(one)).toBe("This")
	expect(camelCaseToSentenceCase(two)).toBe("This is")
	expect(camelCaseToSentenceCase(three)).toBe("This is really")
	expect(camelCaseToSentenceCase(four)).toBe("This is really-something")
	expect(camelCaseToSentenceCase(five)).toBe("This is really-something  else")
	expect(camelCaseToSentenceCase(six)).toBe(six)
})

test("[camelCaseToSentenceCase] given camelCase returns an empty string for null input", () => {
	// @ts-ignore: for testing purposes
	expect(camelCaseToSentenceCase()).toBe("")
	expect(camelCaseToSentenceCase("")).toBe("")
})
