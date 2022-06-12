import { useMemo } from "react"
import { subscribe, unsubscribe } from "~services/pubsub"
import type { PubSubEvent } from "~services/pubsub/types"
import { fireEvent, render, screen } from "~setup/testUtils"
import useMachines from "../../"
import type { TouchMachineContext, TouchMachineParams, ValueTarget } from "../../types"

function Tester (props: TouchMachineParams): JSX.Element {
	const config = useMemo(() => ({ TOUCH: props }), [])

	const { actions, context, status } = useMachines(config)

	return (
		<input
			data-topic={(context as TouchMachineContext).topic}
			data-touched={status.touched?.()}
			data-untouched={status.untouched?.()}
			onBlur={actions.blur}
			onClick={actions.inputClear}
			onFocus={actions.focus}
			onMouseOut={actions.untouch}
			onMouseOver={actions.touch}
			onReset={actions.inputReset}
			onInput={(event) => {
				actions.inputUpdate?.((event.target as ValueTarget).value)
			}}
			role="textbox"
		/>
	)
}

test("[createTouchMachineConfig] works with defaults", () => {
	render(<Tester id="default-test" />)

	const input = screen.getByRole("textbox")

	// Starts untouched (default)
	expect(input).toHaveAttribute("data-touched", "false")
	expect(input).toHaveAttribute("data-untouched", "true")

	fireEvent.mouseOver(input) // Touch

	expect(input).toHaveAttribute("data-touched", "true")
	expect(input).toHaveAttribute("data-untouched", "false")

	fireEvent.mouseOut(input) // Untouch

	expect(input).toHaveAttribute("data-touched", "false")
	expect(input).toHaveAttribute("data-untouched", "true")

	fireEvent.blur(input) // Blur

	expect(input).toHaveAttribute("data-touched", "true")
	expect(input).toHaveAttribute("data-untouched", "false")

	fireEvent.mouseOut(input) // Untouch

	expect(input).toHaveAttribute("data-touched", "false")
	expect(input).toHaveAttribute("data-untouched", "true")

	fireEvent.focus(input) // Focus

	expect(input).toHaveAttribute("data-touched", "true")
	expect(input).toHaveAttribute("data-untouched", "false")

	fireEvent.reset(input) // Input reset

	expect(input).toHaveAttribute("data-touched", "false")
	expect(input).toHaveAttribute("data-untouched", "true")
})

test("[createTouchMachineConfig] accepts props and sets context", () => {
	render(<Tester initial="touched" topic="topic" />)

	const input = screen.getByRole("textbox")

	// Starts touched
	expect(input).toHaveAttribute("data-touched", "true")
	expect(input).toHaveAttribute("data-untouched", "false")
	expect(input).toHaveAttribute("data-topic", "topic")

	fireEvent.mouseOut(input) // Untouch

	expect(input).toHaveAttribute("data-touched", "false")
	expect(input).toHaveAttribute("data-untouched", "true")

	fireEvent.click(input) // Input clear

	expect(input).toHaveAttribute("data-touched", "true")
	expect(input).toHaveAttribute("data-untouched", "false")

	fireEvent.reset(input) // Input reset

	expect(input).toHaveAttribute("data-touched", "false")
	expect(input).toHaveAttribute("data-untouched", "true")

	fireEvent.input(input, { target: { value: "tom" } }) // Input update

	expect(input).toHaveAttribute("data-touched", "true")
	expect(input).toHaveAttribute("data-untouched", "false")
})

test("[createTouchMachineConfig] publishes events properly", () => {
	const topic = "TOPIC"
	render(
		<Tester
			id="pubsub-test"
			enabledEvents={[
				"BLUR",
				"FOCUS",
				"INPUT_CLEAR",
				"INPUT_RESET",
				"INPUT_UPDATE",
				"TOUCH",
				"UNTOUCH",
			]}
			topic={topic}
		/>,
	)

	const input = screen.getByRole("textbox")

	let event: PubSubEvent = {} as PubSubEvent

	const token = "TOKEN"
	subscribe(token, function(e) {
		event = e
	}, {
		topic,
	})

	expect(event.eventName).toBeUndefined()

	fireEvent.mouseOver(input) // Touch

	expect(event.eventName).toBe("TOUCH")

	fireEvent.mouseOut(input) // Untouch

	expect(event.eventName).toBe("UNTOUCH")

	fireEvent.blur(input) // Blur

	expect(event.eventName).toBe("TOUCH")

	fireEvent.mouseOut(input) // Untouch
	fireEvent.focus(input) // Focus

	expect(event.eventName).toBe("TOUCH")

	fireEvent.click(input) // Input clear

	expect(event.eventName).toBe("TOUCH")

	fireEvent.reset(input) // Input reset

	expect(event.eventName).toBe("UNTOUCH")

	fireEvent.input(input, { target: { value: "tom" } }) // Input update

	expect(event.eventName).toBe("TOUCH")

	unsubscribe(token, topic)
})
