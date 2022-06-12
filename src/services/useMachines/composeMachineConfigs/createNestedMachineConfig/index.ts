import type { AssignAction } from "xstate"
import composeMachineConfigs from "~services/useMachines/composeMachineConfigs"
import type {
	Machine,
	MachineContext,
	MachineEvent,
	NestedMachineParams,
	StateNames,
} from "~services/useMachines/types"

export default function createNestedMachineConfig(
	{ child, parent, injectInto, ...config }: NestedMachineParams,
): Config {
	const [{ context: childCtx, ...childMachine }, { actions: childActions, guards: childGuards }] =
		composeMachineConfigs(child)
	const [{ context: parentCtx, states, ...parentMachine }, { actions: parentActions, guards: parentGuards }] =
		composeMachineConfigs(parent)

	const actions = { ...childActions, ...parentActions }
	const guards = { ...childGuards, ...parentGuards }

	const { [injectInto]: toReplace, ...remainingStates } = states as Record<StateNames, { [key: string]: unknown }>

	return {
		machine: {
			// @ts-ignore: !@#$%^ TypeScript! FIXME!
			context: {
				...childCtx,
				...parentCtx,
				...config,
			},
			...parentMachine,
			states: {
				...remainingStates,
				[injectInto]: {
					...toReplace,
					...childMachine,
				},
			},
		},
		actions,
		guards,
	}
}

export type Config = {
	actions: Record<string, AssignAction<MachineContext, MachineEvent>>
	guards: Record<string, (context: MachineContext, event: MachineEvent) => boolean>
	machine: Machine
}
