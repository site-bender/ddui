import { Temporal } from "@js-temporal/polyfill"
import type { PubSubEvent } from "~services/pubsub/types"
import generateShortId from "~utilities/generateShortId"
import not from "~utilities/not"
import { PUBSUB_ALL_TOPICS } from "../constants"
import subscribers from "../subscribers"

export default function publish(
	event: PubSubEvent,
	options: {
		topic?: string
	} = {},
): Temporal.ZonedDateTime | Error {
	if (not(event?.eventName)) {
		return new Error(`Published events must have a topic (event name).`)
	}

	// FIXME: For testing purposes (view all events in the console)
	if (sessionStorage?.getItem("DEBUG")) {
		console.info("> EVENT:", event.eventName, options.topic, JSON.stringify(event, null, 2))
	}

	const { topic } = options
	const timestamp = Temporal.Now.zonedDateTimeISO()
	const fullEvent = {
		id: generateShortId(),
		...event,
		timestamp,
	}

	Object.values(subscribers?.always?.[PUBSUB_ALL_TOPICS] || {}).forEach((f: (event: PubSubEvent) => void) =>
		f(fullEvent)
	)
	Object.values(subscribers?.once?.[PUBSUB_ALL_TOPICS] || {}).forEach((f: (event: PubSubEvent) => void) =>
		f(fullEvent)
	)

	delete subscribers.once?.[PUBSUB_ALL_TOPICS] && delete subscribers.once?.[PUBSUB_ALL_TOPICS]

	if (topic) {
		Object.values(subscribers?.always?.[topic] || {}).forEach((f: (event: PubSubEvent) => void) => f(fullEvent))
		Object.values(subscribers?.once?.[topic] || {}).forEach((f: (event: PubSubEvent) => void) => f(fullEvent))

		subscribers.once?.[topic] && delete subscribers.once?.[topic]
	}

	return timestamp
}
