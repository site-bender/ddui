import type { AssignAction, MachineConfig } from "xstate"
import { assign } from "xstate"
import { publish } from "~services/pubsub"
import type {
	FormMachineContext,
	FormMachineEvent,
	FormMachineParams,
	FormMachineState,
	FormTransitions,
} from "~services/useMachines/types"

export default function createFormMachineConfig({
	id = "form-machine",
	initial = "formReady",
	...context
}: FormMachineParams): {
	actions: Record<
		string,
		| AssignAction<FormMachineContext, FormMachineEvent>
		| ((context: FormMachineContext, event: FormMachineEvent) => void)
	>
	machine: MachineConfig<FormMachineContext, FormMachineState, FormMachineEvent>
} {
	return {
		machine: {
			context: {
				fields: {},
				...context,
			},
			id,
			initial,
			states: {
				formReady: {
					on: {
						FORM_SUBMIT: {
							actions: ["publishFormEvent"],
							target: "formSubmitted",
						},
						FORM_INITIALIZE: {
							actions: ["updateFormState", "publishFormEvent"],
						},
						FORM_UPDATE: {
							actions: ["updateFormState", "publishFormEvent"],
						},
					},
				},
				formSubmitted: {
					on: {
						FORM_DATA: {
							actions: ["publishFormEvent"],
							target: "formPending",
						},
					},
				},
				formPending: {
					on: {
						FORM_SUCCESS: {
							actions: ["publishFormEvent"],
							target: "formSucceeded",
						},
						FORM_FAILURE: {
							actions: ["setError", "publishFormEvent"],
							target: "formFailed",
						},
					},
				},
				formFailed: {
					on: {
						FORM_RESET: {
							actions: ["resetForm", "publishFormEvent"],
							target: "formReady",
						},
					},
				},
				formSucceeded: {
					on: {
						FORM_RESET: {
							actions: ["resetForm", "publishFormEvent"],
							target: "formReady",
						},
					},
				},
			},
		},
		actions: {
			publishFormEvent: (context: FormMachineContext, event: FormMachineEvent) => {
				const { enabledEvents = [], topic, ...rest } = context

				if ((enabledEvents as Array<FormTransitions>).includes(event.type)) {
					publish({ eventName: event.type, data: { ...rest } }, { topic: topic as string })
				}
			},
			setError: assign({
				error: (_, event) => (event as ErrorEvent).error,
			}),
			resetForm: assign({
				error: (_) => undefined,
				fields: (_) => context.fields,
			}),
			updateFormState: assign({
				fields: (context: FormMachineContext, event) => {
					return {
						...context.fields,
						...(event as FormMachineEvent).fields,
					}
				},
			}),
		},
	}
}
