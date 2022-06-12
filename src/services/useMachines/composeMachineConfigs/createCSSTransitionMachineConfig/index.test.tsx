import { useMemo } from "react"
import { subscribeToAllTopics, unsubscribeFromAllTopics } from "~services/pubsub"
import type { PubSubEvent } from "~services/pubsub/types"
import { fireEvent, render, screen } from "~setup/testUtils"
import useMachines from "../../"
import type { CSSTransitionMachineContext, CSSTransitionMachineParams } from "../../types"

function Tester (props: CSSTransitionMachineParams): JSX.Element {
	const config = useMemo(() => ({ CSS_TRANSITION: props }), [])

	const { actions, context, status } = useMachines(config)

	return (
		<main
			data-ready={status.transitionReady?.()}
			data-running={status.transitionRunning?.()}
			data-started={status.transitioning?.()}
			data-cancelled={status.transitionCancelled?.()}
			data-completed={status.transitionCompleted?.()}
			data-topic={(context as CSSTransitionMachineContext).topic}
			onMouseEnter={actions.cssTransitionRun}
			onClick={actions.cssTransitionStart}
			onMouseLeave={actions.cssTransitionEnd}
			onDoubleClick={actions.cssTransitionCancel}
			onReset={actions.cssTransitionReset}
		>
			{(context as CSSTransitionMachineContext).iterations}
		</main>
	)
}

test("[createCSSTransitionMachineConfig] works with defaults", () => {
	render(<Tester id="default-test" />)

	const main = screen.getByRole("main")

	expect(main).toHaveTextContent("0")
	expect(main).toHaveAttribute("data-ready", "true")
	expect(main).toHaveAttribute("data-running", "false")
	expect(main).toHaveAttribute("data-started", "false")
	expect(main).toHaveAttribute("data-cancelled", "false")
	expect(main).toHaveAttribute("data-completed", "false")

	fireEvent.mouseEnter(main) // Run (but not yet started)

	expect(main).toHaveTextContent("0")
	expect(main).toHaveAttribute("data-ready", "false")
	expect(main).toHaveAttribute("data-running", "true")
	expect(main).toHaveAttribute("data-started", "false")
	expect(main).toHaveAttribute("data-cancelled", "false")
	expect(main).toHaveAttribute("data-completed", "false")

	fireEvent.click(main) // Start (animation now running)

	expect(main).toHaveTextContent("1")
	expect(main).toHaveAttribute("data-ready", "false")
	expect(main).toHaveAttribute("data-running", "false")
	expect(main).toHaveAttribute("data-started", "true")
	expect(main).toHaveAttribute("data-cancelled", "false")
	expect(main).toHaveAttribute("data-completed", "false")

	fireEvent.dblClick(main) // Cancel (iteration still counted)

	expect(main).toHaveTextContent("1")
	expect(main).toHaveAttribute("data-ready", "false")
	expect(main).toHaveAttribute("data-running", "false")
	expect(main).toHaveAttribute("data-started", "false")
	expect(main).toHaveAttribute("data-cancelled", "true")
	expect(main).toHaveAttribute("data-completed", "false")

	fireEvent.reset(main) // Reset (iteration still counted)

	expect(main).toHaveTextContent("1")
	expect(main).toHaveAttribute("data-ready", "true")
	expect(main).toHaveAttribute("data-running", "false")
	expect(main).toHaveAttribute("data-started", "false")
	expect(main).toHaveAttribute("data-cancelled", "false")
	expect(main).toHaveAttribute("data-completed", "false")

	fireEvent.mouseEnter(main) // Run (but not yet started)
	fireEvent.click(main) // Start (animation now running)
	fireEvent.mouseLeave(main) // End

	expect(main).toHaveTextContent("2")
	expect(main).toHaveAttribute("data-ready", "false")
	expect(main).toHaveAttribute("data-running", "false")
	expect(main).toHaveAttribute("data-started", "false")
	expect(main).toHaveAttribute("data-cancelled", "false")
	expect(main).toHaveAttribute("data-completed", "true")

	fireEvent.reset(main) // Reset
	fireEvent.dblClick(main) // Cancel (from transitionReady state)

	expect(main).toHaveAttribute("data-cancelled", "true")

	fireEvent.reset(main) // Reset
	fireEvent.mouseEnter(main) // Run (but not yet started)
	fireEvent.dblClick(main) // Cancel (from transitionRunning state)

	expect(main).toHaveAttribute("data-cancelled", "true")
})

test("[createCSSTransitionMachineConfig] accepts props and sets context", () => {
	render(<Tester iterations={5} initial="transitionRunning" topic="topic" />)

	const main = screen.getByRole("main")

	expect(main).toHaveTextContent("5")
	expect(main).toHaveAttribute("data-topic", "topic")

	expect(main).toHaveAttribute("data-ready", "false")
	expect(main).toHaveAttribute("data-running", "true")
	expect(main).toHaveAttribute("data-started", "false")
	expect(main).toHaveAttribute("data-cancelled", "false")
	expect(main).toHaveAttribute("data-completed", "false")
})

test("[createCSSTransitionMachineConfig] publishes events properly", () => {
	render(
		<Tester
			id="pubsub-test"
			enabledEvents={[
				"CSS_TRANSITION_CANCEL",
				"CSS_TRANSITION_END",
				"CSS_TRANSITION_RESET",
				"CSS_TRANSITION_RUN",
				"CSS_TRANSITION_START",
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

	fireEvent.mouseEnter(main) // Run

	expect(event.eventName).toBe("CSS_TRANSITION_RUN")

	fireEvent.click(main) // Start

	expect(event.eventName).toBe("CSS_TRANSITION_START")
	expect(event.data?.iterations).toBe(1)

	fireEvent.dblClick(main) // Cancel

	expect(event.eventName).toBe("CSS_TRANSITION_CANCEL")

	fireEvent.reset(main) // Reset

	expect(event.eventName).toBe("CSS_TRANSITION_RESET")

	fireEvent.mouseLeave(main) // End

	expect(event.eventName).toBe("CSS_TRANSITION_END")
	expect(event.data?.iterations).toBe(1)

	unsubscribeFromAllTopics(token)
})
