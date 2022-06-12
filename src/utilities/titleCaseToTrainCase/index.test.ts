import titleCaseToTrainCase from "./"

test("[titleCaseToTrainCase] converts Title case to train-case", () => {
	expect(titleCaseToTrainCase("We be sentence case")).toBe("we-be-sentence-case")
	expect(titleCaseToTrainCase("We Be Title Case")).toBe("we-be-title-case")
	expect(titleCaseToTrainCase("we Don't know What we Are?")).toBe("we-don-t-know-what-we-are")
	expect(titleCaseToTrainCase()).toBe("")
})
