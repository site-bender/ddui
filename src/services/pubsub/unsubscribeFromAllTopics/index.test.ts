import { getSubscriberCount, subscribe, subscribeToAllTopics, unsubscribe, unsubscribeFromAllTopics } from "../"

test("[unsubscribeFromAllTopics] unsubscribes without token", () => {
	subscribe("jane", () => null, { topic: "blue" })
	subscribe("jane", () => null, { topic: "red" })
	subscribeToAllTopics("julie", () => null)

	expect(getSubscriberCount()).toBe(3)

	unsubscribeFromAllTopics()

	expect(getSubscriberCount()).toBe(2)
	unsubscribe()
})
