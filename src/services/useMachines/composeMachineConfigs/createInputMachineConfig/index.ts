import type { AssignAction, MachineConfig } from "xstate"
import { assign } from "xstate"
import { publish } from "~services/pubsub"
import type {
	InputMachineContext,
	InputMachineEvent,
	InputMachineParams,
	InputMachineState,
	Transitions,
	ValueEvent,
} from "~services/useMachines/types"
import generateShortId from "~utilities/generateShortId"
import not from "~utilities/not"

export default function createInputMachineConfig({
	id = generateShortId(),
	initial = "inputClean",
	initialValue = "",
	name = "input",
	validate,
	...context
}: InputMachineParams): {
	actions: Record<
		string,
		| AssignAction<InputMachineContext, InputMachineEvent>
		| ((context: InputMachineContext, event: InputMachineEvent) => void)
	>
	guards: Record<string, (context: InputMachineContext, event: InputMachineEvent) => boolean>
	machine: MachineConfig<InputMachineContext, InputMachineState, InputMachineEvent>
} {
	return {
		machine: {
			context: {
				errors: [],
				id,
				initialValue,
				isInvalid: false,
				name,
				value: initialValue,
				...context,
			},
			id,
			initial,
			states: {
				inputClean: {
					entry: ["publishInputEvent"],
					on: {
						INPUT_CLEAR: {
							actions: ["clear"],
							target: validate ? "inputValidating" : "inputUpdating",
						},
						INPUT_RESET: {
							actions: ["reset"],
							target: "inputClean",
							internal: false,
						},
						INPUT_UPDATE: {
							actions: ["update"],
							target: validate ? "inputValidating" : "inputUpdating",
						},
					},
				},
				inputDirty: {
					entry: ["publishInputEvent"],
					on: {
						INPUT_CLEAR: {
							actions: ["clear"],
							target: validate ? "inputValidating" : "inputUpdating",
						},
						INPUT_RESET: {
							actions: ["reset"],
							target: "inputClean",
							internal: false,
						},
						INPUT_UPDATE: {
							actions: ["update"],
							target: validate ? "inputValidating" : "inputUpdating",
						},
					},
					...(validate
						? {
							states: {
								inputValid: {},
								inputInvalid: {},
							},
						}
						: {}),
				},
				...(validate
					? {
						inputValidating: {
							entry: ["validate"],
							always: [
								{ cond: "isClean", target: "inputClean" },
								{ cond: "isValid", target: "inputDirty.inputValid" },
								{ cond: "isInvalid", target: "inputDirty.inputInvalid" },
							],
						},
					}
					: {
						inputUpdating: {
							always: [
								{ cond: "isClean", target: "inputClean" },
								{ target: "inputDirty" },
							],
						},
					}),
			},
		},
		actions: {
			clear: assign({
				value: (_) => "",
			}),
			publishInputEvent: (context, event) => {
				const { enabledEvents = [], topic, ...rest } = context

				if ((enabledEvents as Array<Transitions>).includes(event.type)) {
					publish({ eventName: event.type, data: { ...rest } }, { topic: topic as string })
				}
			},
			reset: assign({
				errors: (_) => [],
				isInvalid: (_) => false,
				value: (context) => (context as InputMachineContext).initialValue,
			}),
			update: assign({
				value: (_, event) => (event as ValueEvent).value,
			}),
			...(validate
				? {
					validate: assign((context: InputMachineContext) => ({
						...context,
						...validate({ value: context.value }),
					})),
				}
				: {}),
		},
		guards: {
			isClean: (context: InputMachineContext) => context.value === context.initialValue,
			...(validate
				? {
					isInvalid: (context: InputMachineContext) => Boolean(context.isInvalid),
					isValid: (context: InputMachineContext) => not(context.isInvalid),
				}
				: {}),
		},
	}
}
