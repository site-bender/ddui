import type { Temporal } from "@js-temporal/polyfill"
import type { PubSubEvent } from "~services/pubsub/types"
import { publish } from "../"
import { PUBSUB_ALL_TOPICS } from "./../constants"

export default function publishToAllTopicsOnly(
	event: PubSubEvent,
	options = {},
): Temporal.ZonedDateTime | Error {
	return publish(event, {
		...options,
		topic: PUBSUB_ALL_TOPICS,
	})
}
