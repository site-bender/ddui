import { useMemo } from "react"
import { subscribe, unsubscribe } from "~services/pubsub"
import type { PubSubEvent } from "~services/pubsub/types"
import { fireEvent, render, screen } from "~setup/testUtils"
import useMachines from "../../"
import type { ParallelMachineContext, ParallelMachineParams } from "../../types"
import createParallelMachineConfig from "./"

function Tester (props: ParallelMachineParams): JSX.Element {
	const config = useMemo(() => ({ PARALLEL: props }), [])

	const { actions, context, status } = useMachines(config)

	return (
		<main
			data-client-x={(context as ParallelMachineContext).pointer?.clientX}
			data-client-y={(context as ParallelMachineContext).pointer?.clientY}
			data-blurred={status.blurred?.()}
			data-focused={status.focused?.()}
			data-pointer-down={status.pointerDown?.()}
			data-pointer-enter={status.pointerEntered?.()}
			data-pointer-leave={status.pointerLeft?.()}
			data-pointer-out={status.pointerOut?.()}
			data-pointer-over={status.pointerOver?.()}
			data-pointer-up={status.pointerUp?.()}
			data-screen-x={(context as ParallelMachineContext).pointer?.screenX}
			data-screen-y={(context as ParallelMachineContext).pointer?.screenY}
			data-topic={(context as ParallelMachineContext).topic}
			onMouseDown={actions.pointerDown}
			// Using enter and leave triggers over and out
			onClick={actions.pointerEnter}
			onDoubleClick={actions.pointerLeave}
			onMouseMove={actions.pointerMove}
			onMouseOut={actions.pointerOut}
			onMouseOver={actions.pointerOver}
			onMouseUp={actions.pointerUp}
			onBlur={actions.blur}
			onFocus={actions.focus}
		>
			{JSON.stringify(context as ParallelMachineContext)}
		</main>
	)
}

test.only("[createParallelMachineConfig] works with defaults", () => {
	const topic = "TOPIC"

	render(
		<Tester
			id="default-test"
			enabledEvents={[
				"POINTER_DOWN",
				"POINTER_ENTER",
				"POINTER_LEAVE",
				"POINTER_MOVE",
				"POINTER_OUT",
				"POINTER_OVER",
				"POINTER_UP",
			]}
			children={{
				POINTER_DOWN: {
					id: "down-machine",
					pointerTracking: [
						"screen",
						"client",
						"keys",
					],
				},
				POINTER_ENTER: {
					id: "enter-machine",
					pointerTracking: [],
				},
				POINTER_MOVE: {
					id: "move-machine",
					pointerTracking: [],
				},
				POINTER_OVER: {
					id: "over-machine",
					pointerTracking: [],
				},
			}}
			topic={topic}
		/>,
	)

	const main = screen.getByRole("main")

	let event: PubSubEvent = {} as PubSubEvent

	const token = "TOKEN"

	subscribe(token, function(e) {
		event = e
	}, { topic })

	expect(event.eventName).toBeUndefined()

	// Default states
	expect(main).toHaveAttribute("data-pointer-down", "false")
	expect(main).toHaveAttribute("data-pointer-enter", "false")
	expect(main).toHaveAttribute("data-pointer-leave", "true")
	expect(main).toHaveAttribute("data-pointer-out", "true")
	expect(main).toHaveAttribute("data-pointer-over", "false")
	expect(main).toHaveAttribute("data-pointer-up", "true")

	// Pointer down
	fireEvent.mouseDown(main, {
		clientX: 33,
		clientY: 66,
		screenX: 42,
		screenY: 84,
	})

	expect(event.eventName).toBe("POINTER_DOWN")

	// New states
	expect(main).toHaveAttribute("data-pointer-down", "true")
	expect(main).toHaveAttribute("data-pointer-up", "false")

	expect(main).toHaveAttribute("data-client-x", "33")
	expect(main).toHaveAttribute("data-client-y", "66")
	expect(main).toHaveAttribute("data-screen-x", "42")
	expect(main).toHaveAttribute("data-screen-y", "84")

	// Pointer up
	fireEvent.mouseUp(main)

	expect(event.eventName).toBe("POINTER_UP")

	// New states
	expect(main).toHaveAttribute("data-pointer-down", "false")
	expect(main).toHaveAttribute("data-pointer-up", "true")

	// Pointer enter
	fireEvent.click(main)

	expect(event.eventName).toBe("POINTER_ENTER")

	// New states
	expect(main).toHaveAttribute("data-pointer-enter", "true")
	expect(main).toHaveAttribute("data-pointer-leave", "false")

	// Pointer leave
	fireEvent.dblClick(main)

	expect(event.eventName).toBe("POINTER_LEAVE")

	// New states
	expect(main).toHaveAttribute("data-pointer-enter", "false")
	expect(main).toHaveAttribute("data-pointer-leave", "true")

	// Pointer over
	fireEvent.mouseOver(main)

	expect(event.eventName).toBe("POINTER_OVER")

	// New states
	expect(main).toHaveAttribute("data-pointer-out", "false")
	expect(main).toHaveAttribute("data-pointer-over", "true")

	// Pointer out
	fireEvent.mouseOut(main)

	expect(event.eventName).toBe("POINTER_OUT")

	// New states
	expect(main).toHaveAttribute("data-pointer-out", "true")
	expect(main).toHaveAttribute("data-pointer-over", "false")

	unsubscribe(token, topic)
})

test("[createParallelMachineConfig] works no actions", () => {
	render(
		<Tester
			children={{
				FOCUS: {
					id: "focus-machine",
				},
				KEYBOARD: {
					id: "keyboard-machine",
				},
			}}
		/>,
	)

	const main = screen.getByRole("main")

	expect(main).toHaveAttribute("data-blurred", "true")
	expect(main).toHaveAttribute("data-focused", "false")

	fireEvent.focus(main)

	expect(main).toHaveAttribute("data-blurred", "false")
	expect(main).toHaveAttribute("data-focused", "true")

	fireEvent.blur(main)

	expect(main).toHaveAttribute("data-blurred", "true")
	expect(main).toHaveAttribute("data-focused", "false")
})
