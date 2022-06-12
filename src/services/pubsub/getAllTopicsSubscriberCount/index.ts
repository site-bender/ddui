import { PUBSUB_ALL_TOPICS } from "../constants"
import getSubscriberCount from "../getSubscriberCount"

export default function getAllTopicsSubscriberCount(
	options: {
		onlyFromOnce?: boolean
	} = {},
): number {
	return getSubscriberCount({
		...options,
		topic: PUBSUB_ALL_TOPICS,
	})
}
