import { useMemo } from "react"
import { subscribe, unsubscribe } from "~services/pubsub"
import type { PubSubEvent } from "~services/pubsub/types"
import { fireEvent, render, screen } from "~setup/testUtils"
import useMachines from "../../"
import type { KeyboardEvent, KeyboardMachineContext, KeyboardMachineParams } from "../../types"

type KeyTarget = EventTarget & {
	key: string
}

function Tester (props: KeyboardMachineParams): JSX.Element {
	const { char, ...rest } = props
	const config = useMemo(() => ({
		KEYBOARD: {
			...rest,
			key: {
				key: char,
			} as KeyboardEvent,
		},
	}), [])

	const { actions, context, status } = useMachines(config)

	return (
		<input
			data-keyboard-ready={status.keyboardReady?.()}
			data-key-down={status.keyDown?.()}
			data-redo={JSON.stringify((context as KeyboardMachineContext).redo)}
			data-undo={JSON.stringify((context as KeyboardMachineContext).undo)}
			data-topic={(context as KeyboardMachineContext).topic}
			onKeyDown={(event) => actions.keyDown?.({ key: (event.target as KeyTarget).key })}
			onKeyUp={actions.keyUp}
			onClick={actions.keyUndo}
			onDoubleClick={actions.keyRedo}
			onReset={actions.keyReset}
			value={(context as KeyboardMachineContext).key?.key || ""}
			onChange={() => null}
		/>
	)
}

test("[createKeyboardMachineConfig] works with defaults", () => {
	render(<Tester char="C" />)

	const input = screen.getByRole("textbox")

	// Starts ready
	expect(input).toHaveAttribute("data-keyboard-ready", "true")
	expect(input).toHaveAttribute("data-key-down", "false")
	expect(input).toHaveAttribute("value", "C")

	fireEvent.keyDown(input, { target: { key: "A" } }) // Key down

	expect(input).toHaveAttribute("data-keyboard-ready", "false")
	expect(input).toHaveAttribute("data-key-down", "true")
	expect(input).toHaveAttribute("value", "A")

	fireEvent.keyUp(input) // Key up

	expect(input).toHaveAttribute("data-keyboard-ready", "true")
	expect(input).toHaveAttribute("data-key-down", "false")
	expect(input).toHaveAttribute("value", "A")
})

test("[createKeyboardMachineConfig] publishes events and works with undo and redo", () => {
	const topic = "TOPIC"

	render(
		<Tester
			enabledEvents={[
				"KEY_DOWN",
				"KEY_REDO",
				"KEY_RESET",
				"KEY_UNDO",
				"KEY_UP",
			]}
			enableRedo
			enableUndo
			id="keyboard-undo-redo"
			initial="keyDown"
			topic={topic}
		/>,
	)

	const input = screen.getByRole("textbox")

	let event: PubSubEvent = {} as PubSubEvent

	const token = "TOKEN"

	subscribe(token, function(e) {
		event = e
	}, { topic })

	expect(event.eventName).toBeUndefined()

	// Starts in keyDown so key up first
	expect(input).toHaveAttribute("data-keyboard-ready", "false")
	expect(input).toHaveAttribute("data-key-down", "true")
	expect(input).toHaveAttribute("value", "")

	fireEvent.keyUp(input) // Key up

	expect(event.eventName).toBe("KEY_UP")
	expect(input).toHaveAttribute("data-keyboard-ready", "true")
	expect(input).toHaveAttribute("data-key-down", "false")

	fireEvent.keyDown(input, { target: { key: "A" } }) // Key down

	expect(event.eventName).toBe("KEY_DOWN")
	expect((event.data?.key as KeyboardEvent)?.key).toBe("A")
	expect(input).toHaveAttribute("data-keyboard-ready", "false")
	expect(input).toHaveAttribute("data-key-down", "true")
	expect(input).toHaveAttribute("value", "A")

	fireEvent.keyUp(input) // Key up

	expect(event.eventName).toBe("KEY_UP")
	expect(input).toHaveAttribute("data-keyboard-ready", "true")
	expect(input).toHaveAttribute("data-key-down", "false")
	expect(input).toHaveAttribute("value", "A")

	fireEvent.keyDown(input, { target: { key: "B" } }) // Key down
	fireEvent.keyUp(input) // Key up
	fireEvent.keyDown(input, { target: { key: "C" } }) // Key down
	fireEvent.keyUp(input) // Key up
	fireEvent.keyDown(input, { target: { key: "D" } }) // Key down
	fireEvent.keyUp(input) // Key up

	expect(input).toHaveAttribute("value", "D")

	fireEvent.click(input) // Undo
	fireEvent.click(input) // Undo

	expect(event.eventName).toBe("KEY_UNDO")

	expect(event.data?.key as KeyboardEvent).toStrictEqual({ key: "B" })
	expect(event.data?.redo as KeyboardEvent).toStrictEqual([{ key: "C" }, { key: "D" }])
	expect(event.data?.undo as KeyboardEvent).toStrictEqual([{ key: "A" }, { key: undefined }])

	expect(input).toHaveAttribute("value", "B")
	expect(input).toHaveAttribute("data-undo", `[{"key":"A"},{}]`)
	expect(input).toHaveAttribute("data-redo", `[{"key":"C"},{"key":"D"}]`)

	fireEvent.click(input) // Undo
	fireEvent.click(input) // Undo
	fireEvent.click(input) // Undo (ignores extra undos)
	fireEvent.click(input) // Undo

	expect(event.eventName).toBe("KEY_UNDO")

	expect(event.data?.key as KeyboardEvent).toStrictEqual({ key: undefined })
	expect(event.data?.redo as KeyboardEvent).toStrictEqual([{ key: "A" }, { key: "B" }, { key: "C" }, { key: "D" }])
	expect(event.data?.undo as KeyboardEvent).toStrictEqual([])

	fireEvent.dblClick(input) // Redo
	fireEvent.dblClick(input) // Redo
	fireEvent.dblClick(input) // Redo

	expect(event.eventName).toBe("KEY_REDO")

	expect(event.data?.key as KeyboardEvent).toStrictEqual({ key: "C" })
	expect(event.data?.redo as KeyboardEvent).toStrictEqual([{ key: "D" }])
	expect(event.data?.undo as KeyboardEvent).toStrictEqual([{ key: "B" }, { key: "A" }, { key: undefined }])

	fireEvent.dblClick(input) // Redo
	fireEvent.dblClick(input) // Redo (ignores extra redos)
	fireEvent.dblClick(input) // Redo

	expect(event.eventName).toBe("KEY_REDO")

	expect(event.data?.key as KeyboardEvent).toStrictEqual({ key: "D" })
	expect(event.data?.redo as KeyboardEvent).toStrictEqual([])
	expect(event.data?.undo as KeyboardEvent).toStrictEqual([{ key: "C" }, { key: "B" }, { key: "A" }, {
		key: undefined,
	}])

	fireEvent.reset(input) // Reset

	expect(event.eventName).toBe("KEY_RESET")

	expect(event.data?.key as KeyboardEvent).toStrictEqual({ key: undefined })
	expect(event.data?.redo as KeyboardEvent).toStrictEqual([])
	expect(event.data?.undo as KeyboardEvent).toStrictEqual([])

	unsubscribe(token, topic)
})
