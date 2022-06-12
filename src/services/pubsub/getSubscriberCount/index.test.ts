import { getSubscriberCount, subscribe, subscribeToAllTopics, unsubscribe } from "../"

test("[getSubscriberCount] from an empty cache is zero", () => {
	expect(getSubscriberCount()).toBe(0)
})

test("[getSubscriberCount] from a full cache is correct", () => {
	subscribeToAllTopics("bob", () => null)
	subscribeToAllTopics("bill", () => null)
	subscribeToAllTopics("sam", () => null, { once: true })
	subscribe("jane", () => null, { topic: "blue" })
	subscribe("sally", () => null, { topic: "blue", once: true })

	expect(getSubscriberCount()).toBe(5)
	expect(getSubscriberCount({ onlyFromOnce: false })).toBe(3)
	expect(getSubscriberCount({ onlyFromOnce: true })).toBe(2)
	unsubscribe()
})
