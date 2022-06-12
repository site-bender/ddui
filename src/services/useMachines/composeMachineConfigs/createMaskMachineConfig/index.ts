import type { MachineConfig } from "xstate"
import { publish } from "~services/pubsub"
import type {
	MaskMachineContext,
	MaskMachineEvent,
	MaskMachineParams,
	MaskMachineState,
	Transitions,
} from "~services/useMachines/types"
import generateShortId from "~utilities/generateShortId"

export default function createMaskMachineConfig({
	id = generateShortId(),
	initial = "unmasked",
	maskTrigger,
	...context
}: MaskMachineParams): {
	actions: Record<string, (context: MaskMachineContext, event: MaskMachineEvent) => void>
	machine: MachineConfig<MaskMachineContext, MaskMachineState, MaskMachineEvent>
} {
	return {
		machine: {
			context: {
				maskTrigger,
				...context,
			},
			id,
			initial,
			states: {
				unmasked: {
					on: {
						MASK: {
							actions: ["publishMaskEvent"],
							target: "masked",
						},
						...(maskTrigger === "ON_BLUR"
							? {
								BLUR: {
									actions: ["publishMaskEvent"],
									target: "masked",
								},
							}
							: {}),
						...(maskTrigger === "ON_FOCUS"
							? {
								FOCUS: {
									actions: ["publishMaskEvent"],
									target: "masked",
								},
							}
							: {}),
					},
				},
				masked: {
					on: {
						UNMASK: {
							actions: ["publishUnmask"],
							target: "unmasked",
						},
						...(maskTrigger === "ON_BLUR"
							? {
								FOCUS: {
									actions: ["publishUnmask"],
									target: "unmasked",
								},
							}
							: {}),
						...(maskTrigger === "ON_FOCUS"
							? {
								BLUR: {
									actions: ["publishUnmask"],
									target: "unmasked",
								},
							}
							: {}),
					},
				},
			},
		},
		actions: {
			publishMaskEvent: (context, event) => {
				const { enabledEvents = [], topic, ...rest } = context

				if ((enabledEvents as Array<Transitions>).includes(event.type)) {
					publish({ eventName: "MASK", data: { ...rest } }, { topic: topic as string })
				}
			},
			publishUnmask: (context, event) => {
				const { enabledEvents = [], topic, ...rest } = context

				if ((enabledEvents as Array<Transitions>).includes(event.type)) {
					publish({ eventName: "UNMASK", data: { ...rest } }, { topic: topic as string })
				}
			},
		},
	}
}
