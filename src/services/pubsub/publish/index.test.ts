import { Temporal } from "@js-temporal/polyfill"
import { publish, subscribe, subscribeToAllTopics, unsubscribe } from "../"

const idPattern = /^[A-Z0-9]{21,22}$/i

test("[publish] returns an error when no event name", () => {
	const topic = "blue"

	const err: Error = publish(
		/* eslint-disable @typescript-eslint/ban-ts-comment */
		// @ts-ignore: for testing purposes
		undefined,
		{
			topic,
		},
		/* eslint-enable @typescript-eslint/ban-ts-comment */
	) as Error

	expect(err).toBeInstanceOf(Error)
	expect(err.message).toBe("Published events must have a topic (event name).")
})

test("[publish] publishes correctly with topic", () => {
	const id = "my-id"
	const topic = "blue"
	const eventName = "PUBLISHED"
	const data = {
		color: "cyan",
	}
	const cb = vi.fn()
	const cbOnce = vi.fn()

	subscribe("jane", cb, { topic })
	subscribe("julie", cbOnce, { topic, once: true })

	publish(
		{
			eventName,
			data,
		},
		{
			topic,
		},
	)

	publish(
		{
			id,
			eventName,
			data,
		},
		{
			topic,
		},
	)

	publish(
		{
			id,
			eventName,
			data,
		},
		{
			topic: "green",
		},
	)

	const one = cb.mock.calls[0][0]
	const two = cb.mock.calls[1][0]

	expect(idPattern.test(one.id)).toBe(true)
	expect(one.eventName).toBe(eventName)
	expect(one.timestamp instanceof Temporal.ZonedDateTime).toBe(true)
	expect(one.data).toEqual(data)

	expect(two.id).toBe(id)
	expect(two.eventName).toBe(eventName)
	expect(two.timestamp instanceof Temporal.ZonedDateTime).toBe(true)
	expect(two.data).toEqual(data)

	expect(cbOnce).toHaveBeenCalledTimes(1)
	unsubscribe()

	vi.resetAllMocks()
})

test("[publish] publishes correctly without topic", () => {
	const id = "my-id"
	const eventName = "PUBLISHED"
	const data = {
		color: "cyan",
	}
	const cb = vi.fn()
	const cbOnce = vi.fn()

	subscribeToAllTopics("jane", cb, {})
	subscribeToAllTopics("julie", cbOnce, { once: true })

	publish(
		{
			eventName,
			data,
		},
		{},
	)

	publish({
		id,
		eventName,
		data,
	})

	const one = cb.mock.calls[0][0]
	const two = cb.mock.calls[1][0]

	expect(idPattern.test(one.id)).toBe(true)
	expect(one.eventName).toBe(eventName)
	expect(one.timestamp instanceof Temporal.ZonedDateTime).toBe(true)
	expect(one.data).toEqual(data)

	expect(two.id).toBe(id)
	expect(two.eventName).toBe(eventName)
	expect(two.timestamp instanceof Temporal.ZonedDateTime).toBe(true)
	expect(two.data).toEqual(data)
	unsubscribe()

	vi.resetAllMocks()
})
