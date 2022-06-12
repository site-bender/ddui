import { useMemo } from "react"
import { subscribeToAllTopics, unsubscribeFromAllTopics } from "~services/pubsub"
import type { PubSubEvent } from "~services/pubsub/types"
import { fireEvent, render, screen } from "~setup/testUtils"
import useMachines from "../../"
import type { FocusMachineContext, FocusMachineParams } from "../../types"

function Tester (props: FocusMachineParams): JSX.Element {
	const config = useMemo(() => ({ FOCUS: props }), [])

	const { actions, context, status } = useMachines(config)

	return (
		<main
			data-blurred={status.blurred?.()}
			data-focused={status.focused?.()}
			data-topic={(context as FocusMachineContext).topic}
			onBlur={actions.blur}
			onFocus={actions.focus}
		/>
	)
}

test("[createFocusMachineConfig] works with defaults", () => {
	render(<Tester id="default-test" />)

	const main = screen.getByRole("main")

	// Starts blurred
	expect(main).toHaveAttribute("data-blurred", "true")
	expect(main).toHaveAttribute("data-focused", "false")

	fireEvent.focus(main) // Focus

	expect(main).toHaveAttribute("data-blurred", "false")
	expect(main).toHaveAttribute("data-focused", "true")

	fireEvent.blur(main) // Blur

	expect(main).toHaveAttribute("data-blurred", "true")
	expect(main).toHaveAttribute("data-focused", "false")
})

test("[createFocusMachineConfig] accepts props and sets context", () => {
	render(<Tester initial="focused" topic="topic" />)

	const main = screen.getByRole("main")

	// Starts focused
	expect(main).toHaveAttribute("data-blurred", "false")
	expect(main).toHaveAttribute("data-focused", "true")

	fireEvent.blur(main) // Blur

	expect(main).toHaveAttribute("data-blurred", "true")
	expect(main).toHaveAttribute("data-focused", "false")

	fireEvent.focus(main) // Focus

	expect(main).toHaveAttribute("data-blurred", "false")
	expect(main).toHaveAttribute("data-focused", "true")
})

test("[createFocusMachineConfig] publishes events properly", () => {
	render(
		<Tester
			id="pubsub-test"
			enabledEvents={[
				"BLUR",
				"FOCUS",
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

	fireEvent.focus(main) // Focus

	expect(event.eventName).toBe("FOCUS")

	fireEvent.blur(main) // Blur

	expect(event.eventName).toBe("BLUR")

	unsubscribeFromAllTopics(token)
})
