import type { MachineConfig } from "xstate"
import { publish } from "~services/pubsub"
import type {
	TouchMachineContext,
	TouchMachineEvent,
	TouchMachineParams,
	TouchMachineState,
	Transitions,
} from "~services/useMachines/types"

export default function createTouchMachineConfig({
	id = "touch-machine",
	initial = "untouched",
	...context
}: TouchMachineParams): {
	actions: Record<string, (context: TouchMachineContext, event: TouchMachineEvent) => void>
	machine: MachineConfig<TouchMachineContext, TouchMachineState, TouchMachineEvent>
} {
	return {
		machine: {
			context,
			id,
			initial,
			states: {
				untouched: {
					on: {
						BLUR: {
							actions: ["publishTouchEvent"],
							target: "touched",
						},
						FOCUS: {
							actions: ["publishTouchEvent"],
							target: "touched",
						},
						INPUT_CLEAR: {
							actions: ["publishTouchEvent"],
							target: "touched",
						},
						INPUT_UPDATE: {
							actions: ["publishTouchEvent"],
							target: "touched",
						},
						TOUCH: {
							actions: ["publishTouchEvent"],
							target: "touched",
						},
					},
				},
				touched: {
					on: {
						INPUT_RESET: {
							actions: ["publishTouchEvent"],
							target: "untouched",
						},
						UNTOUCH: {
							actions: ["publishTouchEvent"],
							target: "untouched",
						},
					},
				},
			},
		},
		actions: {
			publishTouchEvent: (context, event) => {
				const { enabledEvents = [], topic, ...rest } = context

				if ((enabledEvents as Array<Transitions>).includes(event.type)) {
					publish(
						{
							eventName: ["UNTOUCH", "INPUT_RESET"].includes(event.type) ? "UNTOUCH" : "TOUCH",
							data: { ...rest },
						},
						{ topic: topic as string },
					)
				}
			},
		},
	}
}
