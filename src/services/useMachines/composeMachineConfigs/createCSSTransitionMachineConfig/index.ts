import type { AssignAction, MachineConfig } from "xstate"
import { assign } from "xstate"
import { publish } from "~services/pubsub"
import type {
	CSSTransitionMachineContext,
	CSSTransitionMachineEvent,
	CSSTransitionMachineParams,
	CSSTransitionMachineState,
	Transitions,
} from "~services/useMachines/types"
import generateShortId from "~utilities/generateShortId"

export default function createCSSTransitionMachineConfig({
	id = generateShortId(),
	initial = "transitionReady",
	iterations = 0,
	...context
}: CSSTransitionMachineParams): {
	actions: Record<
		string,
		| AssignAction<CSSTransitionMachineContext, CSSTransitionMachineEvent>
		| ((context: CSSTransitionMachineContext, event: CSSTransitionMachineEvent) => void)
	>
	machine: MachineConfig<CSSTransitionMachineContext, CSSTransitionMachineState, CSSTransitionMachineEvent>
} {
	return {
		machine: {
			context: {
				iterations,
				...context,
			},
			id,
			initial,
			states: {
				transitionReady: {
					on: {
						CSS_TRANSITION_RUN: {
							actions: ["publishCSSTransitionEvent"],
							target: "transitionRunning",
						},
						CSS_TRANSITION_END: {
							actions: ["publishCSSTransitionEvent"],
							target: "transitionCompleted",
						},
						CSS_TRANSITION_CANCEL: {
							actions: ["publishCSSTransitionEvent"],
							target: "transitionCancelled",
						},
					},
				},
				transitionRunning: {
					on: {
						CSS_TRANSITION_START: {
							actions: ["incrementIterations", "publishCSSTransitionEvent"],
							target: "transitioning",
						},
						CSS_TRANSITION_END: {
							actions: ["publishCSSTransitionEvent"],
							target: "transitionCompleted",
						},
						CSS_TRANSITION_CANCEL: {
							actions: ["publishCSSTransitionEvent"],
							target: "transitionCancelled",
						},
					},
				},
				transitioning: {
					on: {
						CSS_TRANSITION_END: {
							actions: ["publishCSSTransitionEvent"],
							target: "transitionCompleted",
						},
						CSS_TRANSITION_CANCEL: {
							actions: ["publishCSSTransitionEvent"],
							target: "transitionCancelled",
						},
					},
				},
				transitionCancelled: {
					on: {
						CSS_TRANSITION_RESET: {
							actions: ["publishCSSTransitionEvent"],
							target: "transitionReady",
						},
					},
				},
				transitionCompleted: {
					on: {
						CSS_TRANSITION_RESET: {
							actions: ["publishCSSTransitionEvent"],
							target: "transitionReady",
						},
					},
				},
			},
		},
		actions: {
			incrementIterations: assign({
				iterations: (context: CSSTransitionMachineContext) => context.iterations + 1,
			}),
			publishCSSTransitionEvent: (context, event) => {
				const { enabledEvents = [], topic, ...rest } = context

				if ((enabledEvents as Array<Transitions>).includes(event.type)) {
					publish({ eventName: event.type, data: { ...rest } }, { topic: topic as string })
				}
			},
		},
	}
}
