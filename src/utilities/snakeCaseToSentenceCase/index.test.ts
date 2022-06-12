import snakeCaseToSentenceCase from "./"

test("[snakeCaseToSentenceCase] converts snake_case to Sentence case", () => {
	expect(snakeCaseToSentenceCase("my_snake_case")).toBe("My snake case")
	expect(snakeCaseToSentenceCase("___my_snake_case__")).toBe("My snake case")
	expect(snakeCaseToSentenceCase("yo snake_case bro")).toBe("Yo snake case bro")
	expect(snakeCaseToSentenceCase()).toBe("")
})
