import type { AssignAction, MachineConfig } from "xstate"
import { assign } from "xstate"
import { publish } from "~services/pubsub"
import type {
	PointerOverMachineContext,
	PointerOverMachineEvent,
	PointerOverMachineParams,
	PointerOverMachineState,
	Transitions,
} from "~services/useMachines/types"
import generateShortId from "~utilities/generateShortId"
import initializePointerContext from "../../utilities/initializePointerContext"
import setPointerContext from "../../utilities/setPointerContext"

export default function createPointerOverMachineConfig({
	id = generateShortId(),
	initial = "pointerOut",
	pointerTracking = ["keys", "client"],
	...context
}: PointerOverMachineParams): {
	actions: Record<
		string,
		| AssignAction<PointerOverMachineContext, PointerOverMachineEvent>
		| ((context: PointerOverMachineContext, event: PointerOverMachineEvent) => void)
	>
	machine: MachineConfig<PointerOverMachineContext, PointerOverMachineState, PointerOverMachineEvent>
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
				pointerOut: {
					on: {
						POINTER_OVER: {
							actions: ["setPointerContext", "publishPointerOverEvent"],
							target: "pointerOver",
						},
					},
				},
				pointerOver: {
					on: {
						POINTER_OUT: {
							actions: ["setPointerContext", "publishPointerOverEvent"],
							target: "pointerOut",
						},
					},
				},
			},
		},
		actions: {
			publishPointerOverEvent: (context: PointerOverMachineContext, event: PointerOverMachineEvent) => {
				const { enabledEvents = [], topic, ...rest } = context

				if ((enabledEvents as Array<Transitions>).includes(event.type)) {
					publish({ eventName: event.type, data: { ...rest } }, { topic: topic as string })
				}
			},
			setPointerContext: assign({
				pointer: (context, event: PointerOverMachineEvent) => setPointerContext(context.pointer, event),
			}),
		},
	}
}
