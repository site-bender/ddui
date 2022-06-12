import { useMachine } from "@xstate/react"
import { useMemo } from "react"
import type { MachineConfig } from "xstate"
import { createMachine } from "xstate"
import composeActions from "./composeActions"
import composeMachineConfigs from "./composeMachineConfigs"
import composeStatuses from "./composeStatuses"
import type {
	CreateMachineParamsConfig,
	MachineContext,
	MachineEvent,
	MachineState,
	MachineStatuses,
	RecursiveRecord,
	UseMachinesReturn,
} from "./types"

export default function useMachines(
	config: CreateMachineParamsConfig,
	// options: UseMachineOptions = {},
): UseMachinesReturn {
	const machine = useMemo(
		() => {
			const [machine, options] = composeMachineConfigs(config)

			return createMachine<MachineContext, MachineEvent>(
				// @ts-ignore: !@#$%^ TypeScript!
				machine as MachineConfig<MachineContext, MachineState, MachineEvent>,
				options as Record<string, RecursiveRecord>,
			)
		},
		[config],
	)

	const debug = sessionStorage && sessionStorage.getItem("DEBUG") ? { devTools: true } : undefined

	const [state, send] = useMachine(machine, debug)

	const actions = composeActions(config, send)

	const status = composeStatuses(config).reduce((acc, name: MachineStatuses) => ({
		...acc,
		[name]: () => JSON.stringify(state.value).includes(`"${name}"`),
	}), {})

	return {
		actions,
		context: state.context,
		state: state.value,
		status,
	}
}
