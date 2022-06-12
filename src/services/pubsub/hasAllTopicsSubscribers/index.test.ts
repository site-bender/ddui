import { hasAllTopicsSubscribers, subscribe, subscribeToAllTopics, unsubscribe } from "../"

test("[hasAllTopicsSubscribers] from an empty cache is false", () => {
	subscribe("jane", () => null, { topic: "blue" })

	expect(hasAllTopicsSubscribers()).toBe(false)
	unsubscribe()
})

test("[hasAllTopicsSubscribers] from all topics cache is true", () => {
	subscribeToAllTopics("bob", () => null)

	expect(hasAllTopicsSubscribers()).toBe(true)
	unsubscribe()
})

test("[hasAllTopicsSubscribers] from an empty once cache is false", () => {
	subscribeToAllTopics("bob", () => null)

	expect(hasAllTopicsSubscribers({ onlyFromOnce: true })).toBe(false)
	expect(hasAllTopicsSubscribers()).toBe(true)
	unsubscribe()
})

test("[hasAllTopicsSubscribers] from all topics once cache is true", () => {
	subscribeToAllTopics("sam", () => null, { once: true })

	expect(hasAllTopicsSubscribers({ onlyFromOnce: true })).toBe(true)
	unsubscribe()
})

test("[hasAllTopicsSubscribers] from an empty always cache is false", () => {
	subscribeToAllTopics("sam", () => null, { once: true })

	expect(hasAllTopicsSubscribers({ onlyFromOnce: false })).toBe(false)
	unsubscribe()
})

test("[hasAllTopicsSubscribers] from all topics always cache is true", () => {
	subscribeToAllTopics("bob", () => null)

	expect(hasAllTopicsSubscribers({ onlyFromOnce: false })).toBe(true)
	unsubscribe()
})
