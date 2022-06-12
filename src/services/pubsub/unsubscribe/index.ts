import type { Topics } from "~services/pubsub/types"
import not from "~utilities/not"
import subscribers from "../subscribers"

export default function unsubscribe(
	token?: string,
	topic?: string,
	options: {
		onlyFromOnce?: boolean
	} = {},
): void {
	const { onlyFromOnce } = options

	if (token && topic) {
		unsubscribeByTopicAndToken(topic, token, onlyFromOnce)
	}

	if (token && !topic) {
		unsubscribeByToken(token, onlyFromOnce)
	}

	if (!token && topic) {
		unsubscribeByTopic(topic, onlyFromOnce)
	}

	if (!token && !topic) {
		unsubscribeAll(onlyFromOnce)
	}
}

function removeToken (token: string, subs: Topics): Topics {
	return Object.keys(subs).reduce((acc, key) => {
		/* eslint-disable @typescript-eslint/no-unused-vars */
		const { [token]: _ignore, ...rest } = subs[key]
		/* eslint-enable @typescript-eslint/no-unused-vars */

		return {
			...acc,
			[key]: rest,
		}
	}, {})
}

function unsubscribeAll (onlyFromOnce?: boolean): void {
	if (onlyFromOnce || typeof onlyFromOnce === "undefined") {
		subscribers.once = {}
	}

	if (not(onlyFromOnce) || typeof onlyFromOnce === "undefined") {
		subscribers.always = {}
	}
}

function unsubscribeByTopic (topic: string, onlyFromOnce?: boolean): void {
	if (onlyFromOnce || typeof onlyFromOnce === "undefined") {
		/* eslint-disable @typescript-eslint/no-unused-vars */
		const { [topic]: _once, ...otherOnce } = subscribers.once
		/* eslint-enable @typescript-eslint/no-unused-vars */

		subscribers.once = otherOnce
	}

	if (not(onlyFromOnce) || typeof onlyFromOnce === "undefined") {
		/* eslint-disable @typescript-eslint/no-unused-vars */
		const { [topic]: _always, ...otherAlways } = subscribers.always
		/* eslint-enable @typescript-eslint/no-unused-vars */

		subscribers.always = otherAlways
	}
}

function unsubscribeByToken (token: string, onlyFromOnce?: boolean): void {
	if (onlyFromOnce || typeof onlyFromOnce === "undefined") {
		subscribers.once = removeToken(token, subscribers.once)
	}

	if (not(onlyFromOnce) || typeof onlyFromOnce === "undefined") {
		subscribers.always = removeToken(token, subscribers.always)
	}
}

function unsubscribeByTopicAndToken (
	topic: string,
	token: string,
	onlyFromOnce?: boolean,
): void {
	if (onlyFromOnce || typeof onlyFromOnce === "undefined") {
		/* eslint-disable @typescript-eslint/no-unused-vars */
		const { [token]: _once, ...otherOnce } = subscribers.once[topic] || {}
		/* eslint-enable @typescript-eslint/no-unused-vars */

		subscribers.once[topic] = otherOnce
	}

	if (not(onlyFromOnce) || typeof onlyFromOnce === "undefined") {
		/* eslint-disable @typescript-eslint/no-unused-vars */
		const { [token]: _always, ...otherAlways } = subscribers.always[topic]
		/* eslint-enable @typescript-eslint/no-unused-vars */

		subscribers.always[topic] = otherAlways
	}
}
