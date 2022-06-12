import type { PubSubEvent } from "~services/pubsub/types"
import { subscribe } from "../"
import { PUBSUB_ALL_TOPICS } from "./../constants"

export default function subscribeToAllTopics(
	token: string,
	callback: (event: PubSubEvent) => void,
	options: {
		once?: boolean
	} = {},
): string | Error {
	return subscribe(token, callback, {
		...options,
		topic: PUBSUB_ALL_TOPICS,
	})
}
