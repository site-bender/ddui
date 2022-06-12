import type { MachineConfig } from "xstate"
import { publish } from "~services/pubsub"
import type {
	FocusMachineContext,
	FocusMachineEvent,
	FocusMachineParams,
	FocusMachineState,
	Transitions,
} from "~services/useMachines/types"
import generateShortId from "~utilities/generateShortId"

export default function createFocusMachineConfig({
	id = generateShortId(),
	initial = "blurred",
	...context
}: FocusMachineParams): {
	actions: Record<string, (context: FocusMachineContext, event: FocusMachineEvent) => void>
	machine: MachineConfig<FocusMachineContext, FocusMachineState, FocusMachineEvent>
} {
	return {
		machine: {
			context,
			id,
			initial,
			states: {
				blurred: {
					on: {
						FOCUS: {
							actions: ["publishFocusEvent"],
							target: "focused",
						},
					},
				},
				focused: {
					on: {
						BLUR: {
							actions: ["publishFocusEvent"],
							target: "blurred",
						},
					},
				},
			},
		},
		actions: {
			publishFocusEvent: (context, event) => {
				const { enabledEvents = [], topic, ...rest } = context

				if ((enabledEvents as Array<Transitions>).includes(event.type)) {
					publish({ eventName: event.type, data: { ...rest } }, { topic: topic as string })
				}
			},
		},
	}
}
