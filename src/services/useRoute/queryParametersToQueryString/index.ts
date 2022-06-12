export default function queryParametersToQueryString(
	params: Record<string, string>,
): string {
	return new URLSearchParams(Object.entries(params)).toString()
}
