export default function snakeCaseToSentenceCase(snakeCase = ""): string {
	const [first, ...rest] = snakeCase.toLocaleLowerCase().replace(/[_ ]+/g, " ").trim().split("")

	return `${first?.toLocaleUpperCase() || ""}${rest.join("")}`
}
