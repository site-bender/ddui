import type { Topics } from "~services/pubsub/types"

const subscribers = {
	once: {} as Topics,
	always: {} as Topics,
}

export default subscribers
