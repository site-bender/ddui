import getSubscriberCount from "../getSubscriberCount"

export default function hasSubscribers(
	options: {
		topic?: string
		onlyFromOnce?: boolean
	} = {},
): boolean {
	return Boolean(getSubscriberCount(options))
}
