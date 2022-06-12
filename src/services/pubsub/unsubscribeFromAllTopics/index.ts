import { PUBSUB_ALL_TOPICS } from "./../constants"
import unsubscribe from "../unsubscribe"

export default function unsubscribeFromAllTopics(
	token?: string,
	options?: {
		onlyFromOnce?: boolean
	},
): void {
	return unsubscribe(token, PUBSUB_ALL_TOPICS, options)
}
