import { Temporal } from "@js-temporal/polyfill"
import { publish, publishToAllTopicsOnly, subscribe, subscribeToAllTopics, unsubscribe } from "../"

const idPattern = /^[A-Z0-9]{21,22}$/i

test("[publishToAllTopicsOnly] publishes to All Topics only correctly", () => {
	const id = "my-id"
	const topic = "blue"
	const eventName = "PUBLISHED"
	const data = {
		color: "cyan",
	}
	const cb = vi.fn()
	const cbAllTopics = vi.fn()

	subscribe("jane", cb, { topic })
	subscribeToAllTopics("bob", cbAllTopics)

	const t1 = publishToAllTopicsOnly({
		eventName,
		data,
	})

	const t2 = publish(
		{
			id,
			eventName,
			data,
		},
		{
			topic,
		},
	)

	const one = cbAllTopics.mock.calls[0][0]
	const two = cb.mock.calls[0][0]

	expect(t1 instanceof Temporal.ZonedDateTime).toBe(true)
	expect(idPattern.test(one.id)).toBe(true)
	expect(one.eventName).toBe(eventName)
	expect(one.timestamp instanceof Temporal.ZonedDateTime).toBe(true)
	expect(one.data).toEqual(data)

	expect(t2 instanceof Temporal.ZonedDateTime).toBe(true)
	expect(two.id).toBe(id)
	expect(two.eventName).toBe(eventName)
	expect(two.timestamp instanceof Temporal.ZonedDateTime).toBe(true)
	expect(two.data).toEqual(data)
	unsubscribe()

	vi.resetAllMocks()
})

test("[publishToAllTopicsOnly] returns an error when no event name", () => {
	const topic = "blue"
	const data = {}

	const cbAllTopics = vi.fn()

	subscribeToAllTopics("bob", cbAllTopics)

	const err: Error = publishToAllTopicsOnly(
		/* eslint-disable @typescript-eslint/ban-ts-comment */
		// @ts-ignore: for testing purposes
		{
			data,
		},
		{
			topic,
		},
		/* eslint-enable @typescript-eslint/ban-ts-comment */
	) as Error

	expect(err).toBeInstanceOf(Error)
	expect(err.message).toBe("Published events must have a topic (event name).")

	vi.resetAllMocks()
})
