import type { MachineConfig } from "xstate"
import { publish } from "~services/pubsub"
import type {
	OperationMachineContext,
	OperationMachineEvent,
	OperationMachineParams,
	OperationMachineState,
	Transitions,
} from "~services/useMachines/types"

export default function createOperationMachineConfig({
	id = "operation-machine",
	initial = "enabled",
	...context
}: OperationMachineParams): {
	actions: Record<string, (context: OperationMachineContext, event: OperationMachineEvent) => void>
	machine: MachineConfig<OperationMachineContext, OperationMachineState, OperationMachineEvent>
} {
	return {
		machine: {
			context,
			id,
			initial,
			states: {
				disabled: {
					on: {
						ENABLE: {
							actions: ["publishOperationEvent"],
							target: "enabled",
						},
					},
				},
				enabled: {
					on: {
						DISABLE: {
							actions: ["publishOperationEvent"],
							target: "disabled",
						},
					},
				},
			},
		},
		actions: {
			publishOperationEvent: (context, event) => {
				const { enabledEvents = [], topic, ...rest } = context

				if ((enabledEvents as Array<Transitions>).includes(event.type)) {
					publish({ eventName: event.type, data: { ...rest } }, { topic: topic as string })
				}
			},
		},
	}
}
