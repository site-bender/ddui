import sentenceCaseToCamelCase from "./"

test("[sentenceCaseToCamelCase] converts camelCase to Sentence case", () => {
	expect(sentenceCaseToCamelCase("Le camel case")).toBe("leCamelCase")
	expect(sentenceCaseToCamelCase("Le-camel  case")).toBe("lecamelCase")
	expect(sentenceCaseToCamelCase("Le Camel Case")).toBe("leCamelCase")
	expect(sentenceCaseToCamelCase("$#@%%Le Camel %%%Case")).toBe("leCamelCase")
})

test("[sentenceCaseToCamelCase] returns an empty string if called with no arguments", () => {
	expect(sentenceCaseToCamelCase()).toBe("")
})
