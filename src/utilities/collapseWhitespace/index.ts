export default function collapseWhitespace(str = ""): string {
	return str.replace(/\s+/ig, " ")
}
