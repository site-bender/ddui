import type { AssignAction, MachineConfig } from "xstate"
import { assign } from "xstate"
import { publish } from "~services/pubsub"
import type {
	PointerEnterMachineContext,
	PointerEnterMachineEvent,
	PointerEnterMachineParams,
	PointerEnterMachineState,
	Transitions,
} from "~services/useMachines/types"
import generateShortId from "~utilities/generateShortId"
import initializePointerContext from "../../utilities/initializePointerContext"
import setPointerContext from "../../utilities/setPointerContext"

export default function createPointerEnterMachineConfig({
	id = generateShortId(),
	initial = "pointerLeft",
	pointerTracking = ["keys", "client"],
	...context
}: PointerEnterMachineParams): {
	actions: Record<
		string,
		| AssignAction<PointerEnterMachineContext, PointerEnterMachineEvent>
		| ((context: PointerEnterMachineContext, event: PointerEnterMachineEvent) => void)
	>
	machine: MachineConfig<PointerEnterMachineContext, PointerEnterMachineState, PointerEnterMachineEvent>
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
				pointerLeft: {
					on: {
						POINTER_ENTER: {
							actions: ["setPointerContext", "publishPointerEnterEvent"],
							target: "pointerEntered",
						},
					},
				},
				pointerEntered: {
					on: {
						POINTER_LEAVE: {
							actions: ["setPointerContext", "publishPointerEnterEvent"],
							target: "pointerLeft",
						},
					},
				},
			},
		},
		actions: {
			publishPointerEnterEvent: (context: PointerEnterMachineContext, event: PointerEnterMachineEvent) => {
				const { enabledEvents = [], topic, ...rest } = context

				if ((enabledEvents as Array<Transitions>).includes(event.type)) {
					publish({ eventName: event.type, data: { ...rest } }, { topic: topic as string })
				}
			},
			setPointerContext: assign({
				pointer: (context, event: PointerEnterMachineEvent) => setPointerContext(context.pointer, event),
			}),
		},
	}
}
