import { useMemo } from "react"
import { subscribe, unsubscribe } from "~services/pubsub"
import type { PubSubEvent } from "~services/pubsub/types"
import { fireEvent, render, screen } from "~setup/testUtils"
import useMachines from "../.."
import type { PointerEvent, PointerMoveMachineContext, PointerMoveMachineParams } from "../../types"

function Tester (props: PointerMoveMachineParams): JSX.Element {
	const config = useMemo(() => ({ POINTER_MOVE: props }), [])

	const { actions, context, status } = useMachines(config)

	return (
		<main
			data-client-x={(context as PointerMoveMachineContext).pointer.clientX}
			data-client-y={(context as PointerMoveMachineContext).pointer.clientY}
			data-alt-key={(context as PointerMoveMachineContext).pointer.altKey}
			data-meta-key={(context as PointerMoveMachineContext).pointer.metaKey}
			data-topic={(context as PointerMoveMachineContext).topic}
			// JSDOM is broken for pointer events
			onClick={actions.pointerMove}
		/>
	)
}

test("[createPointerMoveMachineConfig] works with defaults", () => {
	render(<Tester />)

	const main = screen.getByRole("main")

	// Pointer move
	fireEvent.click(main, {
		clientX: 333,
		clientY: 666,
		altKey: true,
		metaKey: true,
	})

	expect(main).toHaveAttribute("data-client-x", "333")
	expect(main).toHaveAttribute("data-client-y", "666")
	expect(main).toHaveAttribute("data-alt-key", "true")
	expect(main).toHaveAttribute("data-meta-key", "true")

	// Pointer move
	fireEvent.click(main, {
		metaKey: false,
	})

	expect(main).toHaveAttribute("data-client-x", "0")
	expect(main).toHaveAttribute("data-client-y", "0")
	expect(main).toHaveAttribute("data-alt-key", "false")
	expect(main).toHaveAttribute("data-meta-key", "false")
})

test("[createPointerMoveMachineConfig] publishes events properly", () => {
	const topic = "TOPIC"

	render(
		<Tester
			id="pubsub-test"
			enabledEvents={["POINTER_MOVE"]}
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

	expect(event.eventName).toBe("POINTER_MOVE")
	expect((event.data?.pointer as PointerEvent).screenX).toBe(100)
	expect((event.data?.pointer as PointerEvent).screenY).toBe(200)
	expect((event.data?.pointer as PointerEvent).ctrlKey).toBe(true)
	expect((event.data?.pointer as PointerEvent).shiftKey).toBe(true)

	unsubscribe(token, topic)
})
