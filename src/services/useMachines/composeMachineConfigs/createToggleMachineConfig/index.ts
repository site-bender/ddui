import type { AssignAction, MachineConfig } from "xstate"
import { assign } from "xstate"
import { publish } from "~services/pubsub"
import type {
	ToggleMachineContext,
	ToggleMachineEvent,
	ToggleMachineParams,
	ToggleMachineState,
	Transitions,
} from "~services/useMachines/types"
import generateShortId from "~utilities/generateShortId"

export default function createToggleMachineConfig({
	id = generateShortId(),
	initial = "untoggled",
	toggleCount = 0,
	...context
}: ToggleMachineParams): {
	actions: Record<
		string,
		| AssignAction<ToggleMachineContext, ToggleMachineEvent>
		| ((context: ToggleMachineContext, event: ToggleMachineEvent) => void)
	>
	machine: MachineConfig<ToggleMachineContext, ToggleMachineState, ToggleMachineEvent>
} {
	return {
		machine: {
			context: {
				toggleCount,
				...context,
			},
			id,
			initial,
			states: {
				untoggled: {
					on: {
						TOGGLE: {
							actions: ["incrementCount", "publishToggleEvent"],
							target: "toggled",
						},
						TOGGLE_CLEAR: {
							actions: ["clear", "publishToggleEvent"],
						},
						TOGGLE_RESET: {
							actions: ["reset", "publishToggleEvent"],
							target: initial,
						},
					},
				},
				toggled: {
					on: {
						TOGGLE: {
							actions: ["incrementCount", "publishToggleEvent"],
							target: "untoggled",
						},
						TOGGLE_CLEAR: {
							actions: ["clear", "publishToggleEvent"],
						},
						TOGGLE_RESET: {
							actions: ["reset", "publishToggleEvent"],
							target: initial,
						},
					},
				},
			},
		},
		actions: {
			clear: assign({
				toggleCount: (_) => 0,
			}),
			incrementCount: assign({
				toggleCount: (context: ToggleMachineContext) => context.toggleCount + 1,
			}),
			publishToggleEvent: (context: ToggleMachineContext, event: ToggleMachineEvent) => {
				const { enabledEvents = [], topic, ...rest } = context

				if ((enabledEvents as Array<Transitions>).includes(event.type)) {
					publish({ eventName: event.type, data: { ...rest } }, { topic: topic as string })
				}
			},
			reset: assign({
				toggleCount: (_) => toggleCount,
			}),
		},
	}
}
