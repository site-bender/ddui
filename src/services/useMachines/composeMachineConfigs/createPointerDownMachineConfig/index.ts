import type { AssignAction, MachineConfig } from "xstate"
import { assign } from "xstate"
import { publish } from "~services/pubsub"
import type {
	PointerDownMachineContext,
	PointerDownMachineEvent,
	PointerDownMachineParams,
	PointerDownMachineState,
	Transitions,
} from "~services/useMachines/types"
import generateShortId from "~utilities/generateShortId"
import initializePointerContext from "../../utilities/initializePointerContext"
import setPointerContext from "../../utilities/setPointerContext"

export default function createPointerDownMachineConfig({
	id = generateShortId(),
	initial = "pointerUp",
	pointerTracking = ["keys", "client"],
	...context
}: PointerDownMachineParams): {
	actions: Record<
		string,
		| AssignAction<PointerDownMachineContext, PointerDownMachineEvent>
		| ((context: PointerDownMachineContext, event: PointerDownMachineEvent) => void)
	>
	machine: MachineConfig<PointerDownMachineContext, PointerDownMachineState, PointerDownMachineEvent>
} {
	return {
		machine: {
			context: {
				pointerTracking,
				pointer: initializePointerContext(pointerTracking),
				...context,
			},
			id,
			initial,
			states: {
				pointerUp: {
					on: {
						POINTER_DOWN: {
							actions: ["setPointerContext", "publishPointerDownEvent"],
							target: "pointerDown",
						},
					},
				},
				pointerDown: {
					on: {
						POINTER_UP: {
							actions: ["setPointerContext", "publishPointerDownEvent"],
							target: "pointerUp",
						},
					},
				},
			},
		},
		actions: {
			publishPointerDownEvent: (context: PointerDownMachineContext, event: PointerDownMachineEvent) => {
				const { enabledEvents = [], topic, ...rest } = context

				if ((enabledEvents as Array<Transitions>).includes(event.type)) {
					publish({ eventName: event.type, data: { ...rest } }, { topic: topic as string })
				}
			},
			setPointerContext: assign({
				pointer: (context, event: PointerDownMachineEvent) => setPointerContext(context.pointer, event),
			}),
		},
	}
}
