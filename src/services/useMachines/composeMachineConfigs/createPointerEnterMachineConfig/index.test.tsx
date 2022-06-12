import { useMemo } from "react"
import { subscribe, unsubscribe } from "~services/pubsub"
import type { PubSubEvent } from "~services/pubsub/types"
import { fireEvent, render, screen } from "~setup/testUtils"
import useMachines from "../.."
import type { PointerEnterMachineContext, PointerEnterMachineParams, PointerEvent } from "../../types"

function Tester (props: PointerEnterMachineParams): JSX.Element {
	const config = useMemo(() => ({ POINTER_ENTER: props }), [])

	const { actions, context, status } = useMachines(config)

	return (
		<main
			data-pointer-entered={status.pointerEntered?.()}
			data-pointer-left={status.pointerLeft?.()}
			data-client-x={(context as PointerEnterMachineContext).pointer.clientX}
			data-client-y={(context as PointerEnterMachineContext).pointer.clientY}
			data-alt-key={(context as PointerEnterMachineContext).pointer.altKey}
			data-meta-key={(context as PointerEnterMachineContext).pointer.metaKey}
			data-topic={(context as PointerEnterMachineContext).topic}
			// JSDOM is broken for pointer events
			onClick={actions.pointerEnter}
			onDoubleClick={actions.pointerLeave}
		/>
	)
}

test("[createPointerEnterMachineConfig] works with defaults", () => {
	// By default, tracks up/down, enter/leave, over/out, but not move
	render(<Tester />)

	const main = screen.getByRole("main")

	// Starts pointerLeft (default)
	expect(main).toHaveAttribute("data-pointer-entered", "false")
	expect(main).toHaveAttribute("data-pointer-left", "true")

	// Pointer enter
	fireEvent.click(main, {
		clientX: 50,
		clientY: 75,
		altKey: true,
		metaKey: true,
	})

	expect(main).toHaveAttribute("data-pointer-entered", "true")
	expect(main).toHaveAttribute("data-pointer-left", "false")
	expect(main).toHaveAttribute("data-client-x", "50")
	expect(main).toHaveAttribute("data-client-y", "75")
	expect(main).toHaveAttribute("data-alt-key", "true")
	expect(main).toHaveAttribute("data-meta-key", "true")

	// Pointer leave
	fireEvent.dblClick(main, {
		altKey: false,
	})

	expect(main).toHaveAttribute("data-pointer-entered", "false")
	expect(main).toHaveAttribute("data-pointer-left", "true")
	expect(main).toHaveAttribute("data-client-x", "0")
	expect(main).toHaveAttribute("data-client-y", "0")
	expect(main).toHaveAttribute("data-alt-key", "false")
	expect(main).toHaveAttribute("data-meta-key", "false")
})

test("[createPointerMachineConfig] publishes events properly", () => {
	const topic = "TOPIC"

	render(
		<Tester
			id="pubsub-test"
			enabledEvents={[
				"POINTER_ENTER",
				"POINTER_LEAVE",
			]}
			pointerTracking={["keys", "screen"]}
			topic={topic}
		/>,
	)

	const main = screen.getByRole("main")

	let event: PubSubEvent = {} as PubSubEvent

	const token = "TOKEN"

	subscribe(token, function(e) {
		event = e
	}, {
		topic,
	})

	expect(event.eventName).toBeUndefined()

	fireEvent.click(main, {
		screenX: 100,
		screenY: 200,
		ctrlKey: true,
		shiftKey: true,
	}) // Pointer down

	expect(event.eventName).toBe("POINTER_ENTER")
	expect((event.data?.pointer as PointerEvent).screenX).toBe(100)
	expect((event.data?.pointer as PointerEvent).screenY).toBe(200)
	expect((event.data?.pointer as PointerEvent).ctrlKey).toBe(true)
	expect((event.data?.pointer as PointerEvent).shiftKey).toBe(true)

	fireEvent.dblClick(main) // Pointer leave

	expect(event.eventName).toBe("POINTER_LEAVE")

	unsubscribe(token, topic)
})
