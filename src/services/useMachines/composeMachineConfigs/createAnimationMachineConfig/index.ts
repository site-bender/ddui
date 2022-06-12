import type { AssignAction, MachineConfig } from "xstate"
import { assign } from "xstate"
import { publish } from "~services/pubsub"
import type {
	AnimationMachineContext,
	AnimationMachineEvent,
	AnimationMachineParams,
	AnimationMachineState,
	Transitions,
} from "~services/useMachines/types"
import generateShortId from "~utilities/generateShortId"

export default function createAnimationMachineConfig({
	id = generateShortId(),
	initial = "animationReady",
	iterations = 0,
	...context
}: AnimationMachineParams): {
	actions: Record<
		string,
		| AssignAction<AnimationMachineContext, AnimationMachineEvent>
		| ((context: AnimationMachineContext, event: AnimationMachineEvent) => void)
	>
	machine: MachineConfig<AnimationMachineContext, AnimationMachineState, AnimationMachineEvent>
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
				animationReady: {
					on: {
						ANIMATION_START: {
							actions: ["publishAnimationEvent"],
							target: "animating",
						},
					},
				},
				animating: {
					on: {
						ANIMATION_END: {
							actions: ["publishAnimationEvent"],
							target: "animationCompleted",
						},
						ANIMATION_CANCEL: {
							actions: ["publishAnimationEvent"],
							target: "animationCancelled",
						},
						ANIMATION_ITERATION: {
							actions: ["incrementIterations", "publishAnimationEvent"],
							target: "animating",
							internal: true,
						},
					},
				},
				animationCancelled: {
					on: {
						ANIMATION_RESET: {
							actions: ["publishAnimationEvent"],
							target: "animationReady",
						},
					},
				},
				animationCompleted: {
					on: {
						ANIMATION_RESET: {
							actions: ["publishAnimationEvent"],
							target: "animationReady",
						},
					},
				},
			},
		},
		actions: {
			incrementIterations: assign({
				iterations: (context: AnimationMachineContext) => context.iterations + 1,
			}),
			publishAnimationEvent: (context, event) => {
				const { enabledEvents = [], topic, ...rest } = context

				if ((enabledEvents as Array<Transitions>).includes(event.type)) {
					publish({ eventName: event.type, data: { ...rest } }, { topic: topic as string })
				}
			},
		},
	}
}
