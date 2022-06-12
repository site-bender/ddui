import snakeCaseToTrainCase from "./"

test("[snakeCaseToTrainCase] converts snake_case to train-case", () => {
	expect(snakeCaseToTrainCase("my_snake_case")).toBe("my-snake-case")
	expect(snakeCaseToTrainCase("___my_snake_case__")).toBe("my-snake-case")
	expect(snakeCaseToTrainCase("yo snake_case bro")).toBe("yo snake-case bro")
	expect(snakeCaseToTrainCase()).toBe("")
	expect(snakeCaseToTrainCase("There is this_value and that_value and yet_another_value.")).toBe(
		"There is this-value and that-value and yet-another-value.",
	)
})
