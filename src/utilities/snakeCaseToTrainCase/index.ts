export default function snakeCaseToTrainCase(snakeCase = ""): string {
	function toTrainCase (str: string): string {
		return str.toLocaleLowerCase().replace(/_/g, "-").replace(/^[-]+|[-]+$/g, "")
	}

	return snakeCase.split(" ").map((w) => w.includes("_") ? toTrainCase(w) : w).join(" ")
}
