import type { PubSubEvent } from "~services/pubsub/types"
import not from "~utilities/not"
import subscribers from "../subscribers"

export default function subscribe(
	token: string,
	callback: (event: PubSubEvent) => void,
	options: {
		topic: string
		once?: boolean
	},
): string | Error {
	const { once, topic } = options || {}

	if (not(token && callback && topic)) {
		/* eslint-disable @typescript-eslint/ban-ts-comment */
		// @ts-ignore: this is a guard
		const errors: Array<string> = [
			token || "token",
			callback || "callback",
			topic || "topic",
		].filter((e) => e)
		/* eslint-enable @typescript-eslint/ban-ts-comment */

		return new Error(
			`Must provide a ${listFormatter.format(errors)} to subscribe.`,
		)
	}

	if (once) {
		subscribers.once[topic] = {
			...(subscribers.once[topic] || {}),
			[token]: callback,
		}
	} else {
		subscribers.always[topic] = {
			...(subscribers.always[topic] || {}),
			[token]: callback,
		}
	}

	return token
}

declare namespace Intl {
	type ListFormatOptions = { style: string; type: string }
	class ListFormat {
		constructor(locales?: string | string[], options?: Intl.ListFormatOptions)
		public format: (items: string[]) => string
	}
}

const listFormatter = new Intl.ListFormat("en", {
	style: "long",
	type: "conjunction",
})
