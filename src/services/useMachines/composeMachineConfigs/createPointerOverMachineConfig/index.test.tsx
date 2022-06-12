import { useMemo } from "react"
import { subscribe, unsubscribe } from "~services/pubsub"
import type { PubSubEvent } from "~services/pubsub/types"
import { fireEvent, render, screen } from "~setup/testUtils"
import useMachines from "../.."
import type { PointerEvent, PointerOverMachineContext, PointerOverMachineParams } from "../../types"

function Tester (props: PointerOverMachineParams): JSX.Element {
	const config = useMemo(() => ({ POINTER_OVER: props }), [])

	const { actions, context, status } = useMachines(config)

	return (
		<main
			data-pointer-out={status.pointerOut?.()}
			data-pointer-over={status.pointerOver?.()}
			data-client-x={(context as PointerOverMachineContext).pointer.clientX}
			data-client-y={(context as PointerOverMachineContext).pointer.clientY}
			data-alt-key={(context as PointerOverMachineContext).pointer.altKey}
			data-meta-key={(context as PointerOverMachineContext).pointer.metaKey}
			data-topic={(context as PointerOverMachineContext).topic}
			// JSDOM is broken for pointer events
			onClick={actions.pointerOver}
			onDoubleClick={actions.pointerOut}
		/>
	)
}

test("[createPointerOverMachineConfig] works with defaults", () => {
	render(<Tester />)

	const main = screen.getByRole("main")

	// Starts pointerUp (default)
	expect(main).toHaveAttribute("data-pointer-out", "true")
	expect(main).toHaveAttribute("data-pointer-over", "false")

	// Pointer over
	fireEvent.click(main, {
		clientX: 9,
		clientY: 21,
		altKey: true,
		metaKey: true,
	})

	expect(main).toHaveAttribute("data-pointer-out", "false")
	expect(main).toHaveAttribute("data-pointer-over", "true")
	expect(main).toHaveAttribute("data-client-x", "9")
	expect(main).toHaveAttribute("data-client-y", "21")
	expect(main).toHaveAttribute("data-alt-key", "true")
	expect(main).toHaveAttribute("data-meta-key", "true")

	// Pointer out
	fireEvent.dblClick(main, {
		clientY: 12,
		altKey: false,
	})

	expect(main).toHaveAttribute("data-pointer-out", "true")
	expect(main).toHaveAttribute("data-pointer-over", "false")
	expect(main).toHaveAttribute("data-client-x", "0")
	expect(main).toHaveAttribute("data-client-y", "12")
	expect(main).toHaveAttribute("data-alt-key", "false")
	expect(main).toHaveAttribute("data-meta-key", "false")
})

test("[createPointerOverMachineConfig] publishes events properly", () => {
	const topic = "TOPIC"

	render(
		<Tester
			id="pubsub-test"
			enabledEvents={[
				"POINTER_OUT",
				"POINTER_OVER",
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
	}) // Pointer over

	expect(event.eventName).toBe("POINTER_OVER")
	expect((event.data?.pointer as PointerEvent).screenX).toBe(100)
	expect((event.data?.pointer as PointerEvent).screenY).toBe(200)
	expect((event.data?.pointer as PointerEvent).ctrlKey).toBe(true)
	expect((event.data?.pointer as PointerEvent).shiftKey).toBe(true)

	fireEvent.dblClick(main) // Pointer out

	expect(event.eventName).toBe("POINTER_OUT")

	unsubscribe(token, topic)
})
