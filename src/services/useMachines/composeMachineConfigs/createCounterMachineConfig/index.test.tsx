import { useMemo } from "react"
import { subscribeToAllTopics, unsubscribeFromAllTopics } from "~services/pubsub"
import type { PubSubEvent } from "~services/pubsub/types"
import { fireEvent, render, screen } from "~setup/testUtils"
import useMachines from "../../"
import type { CounterMachineContext, CounterMachineParams } from "../../types"

function Tester (props: CounterMachineParams): JSX.Element {
	const config = useMemo(() => ({ COUNTER: props }), [])

	const { actions, context, status } = useMachines(config)

	return (
		<main
			data-counting={status.counting?.()}
			data-done={status.counterDone?.()}
			data-paused={status.counterPaused?.()}
			data-topic={(context as CounterMachineContext).topic}
			onMouseEnter={actions.counterIncrement}
			onMouseOut={actions.counterDecrement}
			onMouseDown={actions.counterPause}
			onMouseUp={actions.counterResume}
			onClick={actions.counterStop}
			onDoubleClick={actions.counterClear}
			onReset={actions.counterReset}
		>
			{(context as CounterMachineContext).count}
		</main>
	)
}

test("[createCounterMachineConfig] works with defaults", () => {
	render(<Tester id="default-test" />)

	const main = screen.getByRole("main")

	expect(main).toHaveTextContent("0")
	expect(main).toHaveAttribute("data-counting", "true")
	expect(main).toHaveAttribute("data-paused", "false")
	expect(main).toHaveAttribute("data-done", "false")

	fireEvent.mouseEnter(main) // Increment
	fireEvent.mouseEnter(main) // Increment
	fireEvent.mouseEnter(main) // Increment

	expect(main).toHaveTextContent("3") // 0 + 3
	expect(main).toHaveAttribute("data-counting", "true")
	expect(main).toHaveAttribute("data-paused", "false")
	expect(main).toHaveAttribute("data-done", "false")

	// Pause counting
	fireEvent.mouseDown(main) // Pause
	fireEvent.mouseEnter(main) // Increment (should fail)

	expect(main).toHaveTextContent("3")
	expect(main).toHaveAttribute("data-counting", "false")
	expect(main).toHaveAttribute("data-paused", "true")
	expect(main).toHaveAttribute("data-done", "false")

	// Resume counting
	fireEvent.mouseUp(main) // Resume
	fireEvent.mouseOut(main) // Decrement
	fireEvent.mouseOut(main) // Decrement

	expect(main).toHaveTextContent("1") // 3 - 2
	expect(main).toHaveAttribute("data-counting", "true")
	expect(main).toHaveAttribute("data-paused", "false")
	expect(main).toHaveAttribute("data-done", "false")

	fireEvent.click(main) // Stop

	expect(main).toHaveTextContent("1") // Does not clear or reset
	expect(main).toHaveAttribute("data-counting", "false")
	expect(main).toHaveAttribute("data-paused", "false")
	expect(main).toHaveAttribute("data-done", "true")
})

test("[createCounterMachineConfig] accepts props and sets context", () => {
	render(<Tester count={5} initial="counterPaused" increment={10} topic="topic" />)

	const main = screen.getByRole("main")

	expect(main).toHaveTextContent("5")
	expect(main).toHaveAttribute("data-topic", "topic")

	expect(main).toHaveAttribute("data-counting", "false")
	expect(main).toHaveAttribute("data-paused", "true")
	expect(main).toHaveAttribute("data-done", "false")

	fireEvent.dblClick(main) // Clear

	expect(main).toHaveTextContent("0") // Cleared (set to 0)

	fireEvent.mouseUp(main) // Resume
	fireEvent.mouseEnter(main) // Increment
	fireEvent.mouseEnter(main) // Increment

	expect(main).toHaveTextContent("20") // 0 + (10 * 2)
	expect(main).toHaveAttribute("data-counting", "true")
	expect(main).toHaveAttribute("data-paused", "false")
	expect(main).toHaveAttribute("data-done", "false")

	fireEvent.reset(main) // Reset to defaults (count: 5)

	expect(main).toHaveTextContent("5") // Reset
})

test("[createCounterMachineConfig] publishes events properly", () => {
	render(
		<Tester
			id="pubsub-test"
			enabledEvents={[
				"COUNTER_CLEAR",
				"COUNTER_DECREMENT",
				"COUNTER_INCREMENT",
				"COUNTER_PAUSE",
				"COUNTER_RESET",
				"COUNTER_RESUME",
				"COUNTER_STOP",
			]}
		/>,
	)

	const main = screen.getByRole("main")

	let event: PubSubEvent = {} as PubSubEvent

	const token = "TOKEN"
	subscribeToAllTopics(token, function(e) {
		event = e
	})

	expect(event.eventName).toBeUndefined()

	fireEvent.mouseEnter(main) // Increment

	expect(event.eventName).toBe("COUNTER_INCREMENT")
	expect(event.data?.count).toBe(1)

	fireEvent.mouseDown(main) // Pause

	expect(event.eventName).toBe("COUNTER_PAUSE")
	expect(event.data?.count).toBe(1)

	fireEvent.mouseUp(main) // Resume

	expect(event.eventName).toBe("COUNTER_RESUME")
	expect(event.data?.count).toBe(1)

	fireEvent.reset(main) // Reset

	expect(event.eventName).toBe("COUNTER_RESET")
	expect(event.data?.count).toBe(0)

	fireEvent.mouseOut(main) // Decrement

	expect(event.eventName).toBe("COUNTER_DECREMENT")
	expect(event.data?.count).toBe(-1)

	fireEvent.dblClick(main) // Clear

	expect(event.eventName).toBe("COUNTER_CLEAR")
	expect(event.data?.count).toBe(0)

	fireEvent.mouseEnter(main) // Increment
	fireEvent.click(main) // Stop

	expect(event.eventName).toBe("COUNTER_STOP")
	expect(event.data?.count).toBe(1)

	unsubscribeFromAllTopics(token)
})
