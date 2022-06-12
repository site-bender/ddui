import type { AssignAction } from "xstate"
import type {
	Config,
	Machine,
	MachineContext,
	MachineEvent,
	ParallelMachineParams,
	TypeOfMachine,
} from "~services/useMachines/types"
import initializePointerContext from "../../utilities/initializePointerContext"
import { machines } from "../"

export default function createParallelMachineConfig({
	children,
	...config
}: ParallelMachineParams): {
	actions: Record<string, AssignAction<MachineContext, MachineEvent>>
	guards: Record<string, (context: MachineContext, event: MachineEvent) => boolean>
	machine: Machine
} {
	// @ts-ignore: !@#$%^ TypeScript! FIXME
	return Object.entries(children)
		// @ts-ignore: !@#$%^ TypeScript! FIXME
		.map(([name, config]) => [name, machines[name as TypeOfMachine](config)])
		.reduce((acc, [name, config]) => {
			const { actions, guards, machine: { context, ...machine } } = config as Config

			return {
				actions: {
					...acc.actions,
					...actions,
				},
				guards: {
					...acc.guards,
					...guards,
				},
				machine: {
					...acc.machine,
					context: {
						...context,
						...acc.machine.context,
					},
					states: {
						...(acc.machine as Machine).states,
						[(name as string).toLowerCase()]: machine,
					},
				},
			}
		}, {
			actions: {},
			guards: {},
			machine: {
				context: {
					...config,
					...(config.pointerTracking
						? {
							pointer: initializePointerContext(config.pointerTracking),
							pointerTracking: config.pointerTracking,
						}
						: {}),
				},
				type: "parallel",
			},
		})
}
