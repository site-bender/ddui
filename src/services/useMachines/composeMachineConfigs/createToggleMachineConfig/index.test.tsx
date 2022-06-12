import { useMemo } from "react"
import { subscribe, unsubscribe } from "~services/pubsub"
import type { PubSubEvent } from "~services/pubsub/types"
import { fireEvent, render, screen } from "~setup/testUtils"
import useMachines from "../../"
import type { ToggleMachineContext, ToggleMachineParams } from "../../types"

function Tester (props: ToggleMachineParams): JSX.Element {
	const config = useMemo(() => ({ TOGGLE: props }), [])

	const { actions, context, status } = useMachines(config)

	return (
		<main
			data-untoggled={status.untoggled?.()}
			data-toggled={status.toggled?.()}
			data-topic={(context as ToggleMachineContext).topic}
			onClick={actions.toggle}
			onDoubleClick={actions.toggleClear}
			onReset={actions.toggleReset}
		>
			{(context as ToggleMachineContext).toggleCount}
		</main>
	)
}

test("[createToggleMachineConfig] works with defaults", () => {
	render(<Tester id="default-test" />)

	const main = screen.getByRole("main")

	// Starts untoggled (default)
	expect(main).toHaveAttribute("data-toggled", "false")
	expect(main).toHaveAttribute("data-untoggled", "true")
	expect(main).toHaveTextContent("0")

	fireEvent.click(main) // Toggle

	expect(main).toHaveAttribute("data-toggled", "true")
	expect(main).toHaveAttribute("data-untoggled", "false")
	expect(main).toHaveTextContent("1")

	fireEvent.click(main) // Toggle

	expect(main).toHaveAttribute("data-toggled", "false")
	expect(main).toHaveAttribute("data-untoggled", "true")
	expect(main).toHaveTextContent("2")
})

test("[createToggleMachineConfig] accepts props and sets context", () => {
	render(<Tester initial="toggled" toggleCount={5} topic="topic" />)

	const main = screen.getByRole("main")

	// Starts toggled
	expect(main).toHaveAttribute("data-toggled", "true")
	expect(main).toHaveAttribute("data-untoggled", "false")
	expect(main).toHaveTextContent("5")

	fireEvent.click(main) // Toggle

	expect(main).toHaveAttribute("data-toggled", "false")
	expect(main).toHaveAttribute("data-untoggled", "true")
	expect(main).toHaveTextContent("6")

	fireEvent.click(main) // Toggle

	expect(main).toHaveAttribute("data-toggled", "true")
	expect(main).toHaveAttribute("data-untoggled", "false")
	expect(main).toHaveTextContent("7")

	fireEvent.dblClick(main) // Clear

	expect(main).toHaveTextContent("0")

	fireEvent.reset(main) // Reset

	expect(main).toHaveTextContent("5")
})

test("[createToggleMachineConfig] publishes events properly", () => {
	const topic = "TOPIC"
	render(
		<Tester
			id="pubsub-test"
			enabledEvents={[
				"TOGGLE",
				"TOGGLE_CLEAR",
				"TOGGLE_RESET",
			]}
			toggleCount={7}
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

	fireEvent.click(main) // Toggle

	expect(event.eventName).toBe("TOGGLE")
	expect(event.data?.toggleCount).toBe(8)

	fireEvent.dblClick(main) // Clear

	expect(event.eventName).toBe("TOGGLE_CLEAR")
	expect(event.data?.toggleCount).toBe(0)

	fireEvent.reset(main) // Reset

	expect(event.eventName).toBe("TOGGLE_RESET")
	expect(event.data?.toggleCount).toBe(7)

	unsubscribe(token, topic)
})
