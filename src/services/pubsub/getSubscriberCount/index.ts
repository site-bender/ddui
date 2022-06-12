import subscribers from "../subscribers"

export default function getSubscriberCount(
	options: {
		topic?: string
		onlyFromOnce?: boolean
	} = {},
): number {
	const { onlyFromOnce, topic } = options

	return (
		(onlyFromOnce !== false
			? Object.keys(subscribers.once)
				.filter((t) => !topic || t === topic)
				.reduce(
					(sum, key) => sum + Object.values(subscribers.once[key]).length,
					0,
				)
			: 0) +
		(onlyFromOnce !== true
			? Object.keys(subscribers.always)
				.filter((t) => !topic || t === topic)
				.reduce(
					(sum, key) => sum + Object.values(subscribers.always[key]).length,
					0,
				)
			: 0)
	)
}
