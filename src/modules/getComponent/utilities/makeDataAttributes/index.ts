import type { Dataset } from "~getComponent/types"

export default function makeDataAttributes(dataset: Dataset = {}) {
	return Object.entries(dataset).reduce((acc, [key, value]) => ({
		...acc,
		...(typeof value !== "object" ? { [`data-${key}`]: value } : {}),
	}), {})
}
