import type { AssignAction, MachineConfig } from "xstate"
import { assign } from "xstate"
import { publish } from "~services/pubsub"
import type {
	PointerMoveMachineContext,
	PointerMoveMachineEvent,
	PointerMoveMachineParams,
	PointerMoveMachineState,
	Transitions,
} from "~services/useMachines/types"
import generateShortId from "~utilities/generateShortId"
import initializePointerContext from "../../utilities/initializePointerContext"
import setPointerContext from "../../utilities/setPointerContext"

export default function createPointerMoveMachineConfig({
	id = generateShortId(),
	pointerTracking = ["keys", "client"],
	...context
}: PointerMoveMachineParams): {
	actions: Record<
		string,
		| AssignAction<PointerMoveMachineContext, PointerMoveMachineEvent>
		| ((context: PointerMoveMachineContext, event: PointerMoveMachineEvent) => void)
	>
	machine: MachineConfig<PointerMoveMachineContext, PointerMoveMachineState, PointerMoveMachineEvent>
} {
	return {
		machine: {
			context: {
				pointerTracking,
				pointer: initializePointerContext(pointerTracking),
				...context,
			},
			id,
			initial: "pointerMoveEnabled",
			states: {
				pointerMoveEnabled: {
					on: {
						POINTER_MOVE: {
							actions: ["setPointerContext", "publishPointerMoveEvent"],
						},
					},
				},
			},
		},
		actions: {
			publishPointerMoveEvent: (context: PointerMoveMachineContext, event: PointerMoveMachineEvent) => {
				const { enabledEvents = [], topic, ...rest } = context

				if ((enabledEvents as Array<Transitions>).includes(event.type)) {
					publish({ eventName: event.type, data: { ...rest } }, { topic: topic as string })
				}
			},
			setPointerContext: assign({
				pointer: (context, event: PointerMoveMachineEvent) => setPointerContext(context.pointer, event),
			}),
		},
	}
}
