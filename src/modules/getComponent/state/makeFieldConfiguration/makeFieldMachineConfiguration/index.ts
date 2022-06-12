import type {
	CreateMachineParamsConfig,
	MaskStates,
	MaskTrigger,
	OperationStates,
	StateNames,
	Transitions,
	Validation,
} from "~services/useMachines/types"
import generateShortId from "~utilities/generateShortId"

export default function makeFieldMachineConfiguration({
	enabledEvents = ["INPUT_UPDATE"],
	errorText,
	mutationId,
	label,
	injectInto = "enabled",
	initial = "enabled",
	initialValue = "",
	// isRequired,
	maskTrigger = "ON_BLUR",
	name,
	isReadOnly,
	validate,
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
						PARALLEL: {
							children: {
								FOCUS: {
									id: "focusMachineId",
								},
								MASK: {
									id: "maskMachineId",
									initial: "masked" as MaskStates,
									maskTrigger,
								},
								TOUCH: {
									id: "touchMachineId",
								},
								INPUT: {
									errorText,
									label,
									id: generateShortId(),
									initialValue,
									name,
									validate,
								},
							},
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
	enabledEvents: Array<Transitions>
	errorText?: string
	mutationId: string
	label?: string
	initial?: StateNames
	initialValue?: string
	injectInto?: StateNames
	isReadOnly?: boolean
	isRequired?: boolean
	maskTrigger?: MaskTrigger
	name: string
	validate?: (validation: Validation) => Validation
}

export type MachineType = "DEFAULT"
