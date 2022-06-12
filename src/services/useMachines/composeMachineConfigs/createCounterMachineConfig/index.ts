import type { AssignAction, MachineConfig } from "xstate"
import { assign } from "xstate"
import { publish } from "~services/pubsub"
import type {
	CounterMachineContext,
	CounterMachineEvent,
	CounterMachineParams,
	CounterMachineState,
	Transitions,
} from "~services/useMachines/types"
import generateShortId from "~utilities/generateShortId"

export default function createCounterMachineConfig({
	count = 0,
	id = generateShortId(),
	increment = 1,
	initial = "counting",
	transitions = 0,
	...context
}: CounterMachineParams): {
	actions: Record<
		string,
		| AssignAction<CounterMachineContext, CounterMachineEvent>
		| ((context: CounterMachineContext, event: CounterMachineEvent) => void)
	>
	machine: MachineConfig<CounterMachineContext, CounterMachineState, CounterMachineEvent>
} {
	return {
		machine: {
			context: {
				count,
				increment,
				transitions,
				...context,
			},
			id,
			initial,
			states: {
				counting: {
					on: {
						COUNTER_CLEAR: {
							actions: ["clear", "publishCounterEvent"],
							target: "counting",
							internal: true,
						},
						COUNTER_DECREMENT: {
							actions: ["decrement", "publishCounterEvent"],
							target: "counting",
							internal: true,
						},
						COUNTER_INCREMENT: {
							actions: ["increment", "publishCounterEvent"],
							target: "counting",
							internal: true,
						},
						COUNTER_PAUSE: {
							actions: ["publishCounterEvent"],
							target: "counterPaused",
						},
						COUNTER_RESET: {
							actions: ["reset", "publishCounterEvent"],
							target: "counting",
							internal: true,
						},
						COUNTER_STOP: {
							actions: ["publishCounterEvent"],
							target: "counterDone",
						},
					},
				},
				counterPaused: {
					on: {
						COUNTER_CLEAR: {
							actions: ["clear", "publishCounterEvent"],
							target: "counterPaused",
							internal: true,
						},
						COUNTER_STOP: {
							actions: ["publishCounterEvent"],
							target: "counterDone",
						},
						COUNTER_RESUME: {
							actions: ["publishCounterEvent"],
							target: "counting",
							internal: true,
						},
						COUNTER_RESET: {
							actions: ["reset", "publishCounterEvent"],
							target: "counting",
							internal: true,
						},
					},
				},
				counterDone: {
					type: "final",
				},
			},
		},
		actions: {
			clear: assign({
				count: (_) => 0,
				transitions: (context) => context.transitions + 1,
			}),
			decrement: assign({
				count: (context) => context.count - context.increment,
				transitions: (context) => context.transitions + 1,
			}),
			increment: assign({
				count: (context) => context.count + context.increment,
				transitions: (context) => context.transitions + 1,
			}),
			publishCounterEvent: (context, event) => {
				const { enabledEvents = [], topic, ...rest } = context

				if ((enabledEvents as Array<Transitions>).includes(event.type)) {
					publish({ eventName: event.type, data: { ...rest } }, { topic: topic as string })
				}
			},
			reset: assign({
				count: (_) => count,
				transitions: (_) => transitions,
			}),
		},
	}
}
