export default function titleCaseToTrainCase(titleCase = ""): string {
	return titleCase
		.toLocaleLowerCase()
		.replace(/[^a-z]+/ig, "-")
		.replace(/^[-]+|[-]+$/g, "")
}
