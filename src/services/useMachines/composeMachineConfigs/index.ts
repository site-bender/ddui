import type { AssignAction } from "xstate"
import type {
	CreateMachineParamsConfig,
	Machine,
	MachineContext,
	MachineEvent,
	Options,
	TypeOfMachine,
} from "~services/useMachines/types"
import createAnimationMachineConfig from "./createAnimationMachineConfig"
import createCounterMachineConfig from "./createCounterMachineConfig"
import createCSSTransitionMachineConfig from "./createCSSTransitionMachineConfig"
import createFocusMachineConfig from "./createFocusMachineConfig"
import createFormMachineConfig from "./createFormMachineConfig"
import createInputMachineConfig from "./createInputMachineConfig"
import createKeyboardMachineConfig from "./createKeyboardMachineConfig"
import createMaskMachineConfig from "./createMaskMachineConfig"
import createNestedMachineConfig from "./createNestedMachineConfig"
import createOperationMachineConfig from "./createOperationMachineConfig"
import createParallelMachineConfig from "./createParallelMachineConfig"
import createPointerDownMachineConfig from "./createPointerDownMachineConfig"
import createPointerEnterMachineConfig from "./createPointerEnterMachineConfig"
import createPointerMoveMachineConfig from "./createPointerMoveMachineConfig"
import createPointerOverMachineConfig from "./createPointerOverMachineConfig"
import createToggleMachineConfig from "./createToggleMachineConfig"
import createTouchMachineConfig from "./createTouchMachineConfig"

export default function composeMachineConfigs(
	config: CreateMachineParamsConfig,
): [Machine, Options] {
	const [[name, configuration]] = Object.entries(config)

	const { actions, guards, machine } = (machines[name as TypeOfMachine]?.(configuration)) as ComposeMachineConfig

	return [
		machine,
		{
			actions,
			guards,
		},
	]
}

export const machines = {
	ANIMATION: createAnimationMachineConfig,
	COUNTER: createCounterMachineConfig,
	CSS_TRANSITION: createCSSTransitionMachineConfig,
	FOCUS: createFocusMachineConfig,
	FORM: createFormMachineConfig,
	INPUT: createInputMachineConfig,
	KEYBOARD: createKeyboardMachineConfig,
	MASK: createMaskMachineConfig,
	NESTED: createNestedMachineConfig,
	OPERATION: createOperationMachineConfig,
	PARALLEL: createParallelMachineConfig,
	POINTER_DOWN: createPointerDownMachineConfig,
	POINTER_ENTER: createPointerEnterMachineConfig,
	POINTER_MOVE: createPointerMoveMachineConfig,
	POINTER_OVER: createPointerOverMachineConfig,
	TOGGLE: createToggleMachineConfig,
	TOUCH: createTouchMachineConfig,
}

export type ComposeMachineConfig = {
	actions?: Record<string, AssignAction<MachineContext, MachineEvent>>
	guards?: Record<string, (context: MachineContext, event: MachineEvent) => boolean>
	machine: Machine
}
