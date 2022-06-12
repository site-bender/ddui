export default function sentenceCaseToCamelCase(sentenceCase = ""): string {
	const [firstWord, ...remainingWords] = sentenceCase
		.replace(/[^A-Z ]+/ig, "")
		.split(/[^A-Z]+/ig)

	return [
		firstWord.toLocaleLowerCase(),
		...remainingWords
			.map((w) => `${w.charAt(0).toLocaleUpperCase()}${w.slice(1).toLocaleLowerCase()}`),
	].join("")
}
