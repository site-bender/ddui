import type { StringDatatypeProps } from "~getComponent/types"
import type { CreateMachineParamsConfig } from "~services/useMachines/types"
import generateShortId from "~utilities/generateShortId"
import makeFieldMachineConfiguration from "../makeFieldMachineConfiguration"

export default function makeStringFieldConfiguration({
	enabledEvents = ["INPUT_UPDATE"],
	errorText,
	mutationId = generateShortId(),
	initial,
	initialValue,
	injectInto,
	isReadOnly,
	isRequired,
	label,
	machineConfig,
	name,
	validate,
}: StringDatatypeProps): CreateMachineParamsConfig {
	if (machineConfig) {
		return machineConfig
	}

	return makeFieldMachineConfiguration({
		enabledEvents,
		errorText,
		mutationId: mutationId,
		label,
		initial,
		initialValue,
		injectInto,
		isReadOnly,
		isRequired,
		name,
		validate,
	})
}
