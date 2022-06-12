import type { CreateMachineParamsConfig, OperationStates, StateNames, Transitions } from "~services/useMachines/types"
import generateShortId from "~utilities/generateShortId"

export default function makeMutationMachineConfiguration({
	enabledEvents = ["FORM_FAILURE", "FORM_INITIALIZE", "FORM_RESET", "FORM_SUBMIT", "FORM_SUCCESS", "FORM_UPDATE"],
	initial = "enabled",
	injectInto = "enabled",
	isReadOnly,
	label,
	mutationId,
	name,
}: Props, type: MachineType = "DEFAULT"): CreateMachineParamsConfig {
	const initialState = isReadOnly ? "disabled" : initial

	switch (type) {
		default:
			return {
				NESTED: {
					enabledEvents,
					id: generateShortId(),
					topic: mutationId,
					injectInto,
					child: {
						FORM: {
							id: mutationId,
							isReadOnly,
							label,
							name,
						},
					},
					parent: {
						OPERATION: {
							id: generateShortId(),
							initial: initialState as OperationStates,
						},
					},
				},
			}
	}
}

export type Props = {
	enabledEvents?: Array<Transitions>
	mutationId: string
	label?: string
	initial?: StateNames
	injectInto?: StateNames
	isReadOnly?: boolean
	name?: string
}

export type MachineType = "DEFAULT"
