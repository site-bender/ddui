import { hasSubscribers, subscribe, unsubscribe } from "../"

test("[hasSubscribers] from an empty cache is false", () => {
	expect(hasSubscribers()).toBe(false)
})

test("[hasSubscribers] from empty topic is false", () => {
	subscribe("bob", () => null, { topic: "red" })

	expect(hasSubscribers({ topic: "blue" })).toBe(false)
	unsubscribe()
})

test("[hasSubscribers] from full topic is true", () => {
	subscribe("bob", () => null, { topic: "red" })

	expect(hasSubscribers({ topic: "red" })).toBe(true)
	unsubscribe()
})

test("[hasSubscribers] from an empty once cache is false", () => {
	subscribe("bob", () => null, { topic: "red" })
	subscribe("bill", () => null, { topic: "blue" })
	subscribe("betty", () => null, { topic: "green", once: true })

	expect(hasSubscribers({ topic: "red", onlyFromOnce: true })).toBe(false)
	expect(hasSubscribers({ topic: "red" })).toBe(true)
	unsubscribe()
})

test("[hasSubscribers] from a full once cache is true", () => {
	subscribe("bob", () => null, { topic: "red", once: true })

	expect(hasSubscribers({ topic: "red", onlyFromOnce: true })).toBe(true)
	expect(hasSubscribers({ topic: "red" })).toBe(true)
	expect(hasSubscribers({ topic: "red", onlyFromOnce: false })).toBe(false)
	unsubscribe()
})
