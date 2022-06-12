import type { Temporal } from "@js-temporal/polyfill"

export type PubSubEvent = {
	id?: string
	eventName: string
	timestamp?: Temporal.ZonedDateTime
	data?: {
		[key: string]: unknown
	}
}

export type Subscriptions = {
	[token: string]: (event: PubSubEvent) => void
}

export type Topics = {
	[topic: string]: Subscriptions
}

export type Subscribers = {
	once?: Topics
	always?: Topics
}
