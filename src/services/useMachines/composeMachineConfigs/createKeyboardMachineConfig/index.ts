import type { AssignAction, MachineConfig } from "xstate"
import { assign } from "xstate"
import { publish } from "~services/pubsub"
import type {
	KeyboardEvent,
	KeyboardMachineContext,
	KeyboardMachineEvent,
	KeyboardMachineParams,
	KeyboardMachineState,
	KeyEvent,
	Transitions,
} from "~services/useMachines/types"

export default function createKeyboardMachineConfig({
	enableRedo,
	enableUndo,
	id = "focus-machine",
	initial = "keyboardReady",
	redo = [] as Array<KeyboardEvent>,
	undo = [] as Array<KeyboardEvent>,
	...context
}: KeyboardMachineParams): {
	actions: Record<
		string,
		| AssignAction<KeyboardMachineContext, KeyboardMachineEvent>
		| ((context: KeyboardMachineContext, event: KeyboardMachineEvent) => void)
	>
	guards: Record<string, (context: KeyboardMachineContext, event: KeyboardMachineEvent) => boolean>
	machine: MachineConfig<KeyboardMachineContext, KeyboardMachineState, KeyboardMachineEvent>
} {
	return {
		machine: {
			context: {
				key: {
					key: "",
				},
				redo,
				undo,
				...context,
			},
			id,
			initial,
			states: {
				keyboardReady: {
					on: {
						KEY_DOWN: {
							actions: ["keydown", "publishKeyboardEvent"],
							target: "keyDown",
						},
						...(enableRedo || enableUndo
							? {
								KEY_REDO: {
									actions: ["redo", "publishKeyboardEvent"],
									cond: "isRedoable",
								},
							}
							: {}),
						KEY_RESET: {
							actions: ["reset", "publishKeyboardEvent"],
						},
						...(enableUndo
							? {
								KEY_UNDO: {
									actions: ["undo", "publishKeyboardEvent"],
									cond: "isUndoable",
								},
							}
							: {}),
					},
				},
				keyDown: {
					on: {
						KEY_UP: {
							actions: ["publishKeyboardEvent"],
							target: "keyboardReady",
						},
					},
				},
			},
		},
		actions: {
			keydown: assign({
				key: (_, event) => (event as KeyEvent).key,
				...(enableUndo
					? {
						undo: (context) => [context.key, ...context.undo],
					}
					: {}),
				...(enableRedo || enableUndo
					? {
						redo: (_) => [],
					}
					: {}),
			}),
			publishKeyboardEvent: (context, event) => {
				const { enabledEvents = [], topic, ...rest } = context

				if ((enabledEvents as Array<Transitions>).includes(event.type)) {
					publish({ eventName: event.type, data: { ...rest } }, { topic: topic as string })
				}
			},
			...(enableRedo
				? {
					redo: assign({
						key: ({ redo: [first] }) => first,
						redo: ({ redo: [, ...rest] }) => rest,
						undo: ({ key, undo }) => [key, ...undo],
					}),
				}
				: {}),
			reset: assign({
				key: (_) => ({ key: undefined }),
				...(enableRedo || enableUndo
					? {
						redo: (_) => [],
					}
					: {}),
				...(enableUndo
					? {
						undo: (_) => [],
					}
					: {}),
			}),
			...(enableUndo
				? {
					undo: assign({
						key: (context) => context.undo?.[0],
						redo: ({ key, redo }) => [key, ...redo],
						undo: ({ undo: [, ...rest] }) => rest,
					}),
				}
				: {}),
		},
		guards: {
			...(enableRedo || enableUndo
				? {
					isRedoable: ({ redo }) => Boolean(redo.length),
				}
				: {}),
			...(enableUndo
				? {
					isUndoable: ({ undo }) => Boolean(undo.length),
				}
				: {}),
		},
	}
}
