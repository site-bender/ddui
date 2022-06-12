import { useMemo } from "react"
import { subscribe, unsubscribe } from "~services/pubsub"
import type { PubSubEvent } from "~services/pubsub/types"
import { fireEvent, render, screen } from "~setup/testUtils"
import useMachines from "../.."
import type { PointerDownMachineContext, PointerDownMachineParams, PointerEvent } from "../../types"

function Tester (props: PointerDownMachineParams): JSX.Element {
	const config = useMemo(() => ({ POINTER_DOWN: props }), [])

	const { actions, context, status } = useMachines(config)

	return (
		<main
			data-pointer-down={status.pointerDown?.()}
			data-pointer-up={status.pointerUp?.()}
			data-client-x={(context as PointerDownMachineContext).pointer.clientX}
			data-client-y={(context as PointerDownMachineContext).pointer.clientY}
			data-alt-key={(context as PointerDownMachineContext).pointer.altKey}
			data-meta-key={(context as PointerDownMachineContext).pointer.metaKey}
			data-topic={(context as PointerDownMachineContext).topic}
			// JSDOM is broken for pointer events
			onClick={actions.pointerDown}
			onDoubleClick={actions.pointerUp}
		/>
	)
}

test("[createPointerDownMachineConfig] works with defaults", () => {
	render(<Tester />)

	const main = screen.getByRole("main")

	// Starts pointerUp (default)
	expect(main).toHaveAttribute("data-pointer-down", "false")
	expect(main).toHaveAttribute("data-pointer-up", "true")

	// Pointer down
	fireEvent.click(main, {
		clientX: 100,
		clientY: 200,
		altKey: true,
		metaKey: true,
	})

	expect(main).toHaveAttribute("data-pointer-down", "true")
	expect(main).toHaveAttribute("data-pointer-up", "false")
	expect(main).toHaveAttribute("data-client-x", "100")
	expect(main).toHaveAttribute("data-client-y", "200")
	expect(main).toHaveAttribute("data-alt-key", "true")
	expect(main).toHaveAttribute("data-meta-key", "true")

	// Pointer up
	fireEvent.dblClick(main, {
		altKey: false,
	})

	expect(main).toHaveAttribute("data-pointer-down", "false")
	expect(main).toHaveAttribute("data-pointer-up", "true")
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
				"POINTER_DOWN",
				"POINTER_UP",
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

	expect(event.eventName).toBe("POINTER_DOWN")
	expect((event.data?.pointer as PointerEvent).screenX).toBe(100)
	expect((event.data?.pointer as PointerEvent).screenY).toBe(200)
	expect((event.data?.pointer as PointerEvent).ctrlKey).toBe(true)
	expect((event.data?.pointer as PointerEvent).shiftKey).toBe(true)

	fireEvent.dblClick(main) // Pointer up

	expect(event.eventName).toBe("POINTER_UP")

	unsubscribe(token, topic)
})
