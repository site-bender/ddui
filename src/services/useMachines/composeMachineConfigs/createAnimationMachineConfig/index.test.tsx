import { useMemo } from "react"
import { subscribeToAllTopics, unsubscribeFromAllTopics } from "~services/pubsub"
import type { PubSubEvent } from "~services/pubsub/types"
import { fireEvent, render, screen } from "~setup/testUtils"
import useMachines from "../../"
import type { AnimationMachineContext, AnimationMachineParams } from "../../types"

function Tester (props: AnimationMachineParams): JSX.Element {
	const config = useMemo(() => ({ ANIMATION: props }), [])

	const { actions, context, status } = useMachines(config)

	return (
		<main
			data-ready={status.animationReady?.()}
			data-animating={status.animating?.()}
			data-completed={status.animationCompleted?.()}
			data-cancelled={status.animationCancelled?.()}
			data-topic={(context as AnimationMachineContext).topic}
			onAnimationStart={actions.animationStart}
			onAnimationIteration={actions.animationIteration}
			onAnimationEnd={actions.animationEnd}
			onClick={actions.animationCancel}
			onReset={actions.animationReset}
		>
			{(context as AnimationMachineContext).iterations}
		</main>
	)
}

test("[createAnimationMachineConfig] works with defaults", () => {
	render(<Tester id="default-test" />)

	const main = screen.getByRole("main")

	expect(main).toHaveTextContent("0")
	expect(main).toHaveAttribute("data-ready", "true")
	expect(main).toHaveAttribute("data-animating", "false")
	expect(main).toHaveAttribute("data-completed", "false")
	expect(main).toHaveAttribute("data-cancelled", "false")

	fireEvent.animationStart(main) // Begin animating

	expect(main).toHaveAttribute("data-ready", "false")
	expect(main).toHaveAttribute("data-animating", "true")
	expect(main).toHaveAttribute("data-completed", "false")
	expect(main).toHaveAttribute("data-cancelled", "false")

	// Iterate the animation
	fireEvent.animationIteration(main)
	fireEvent.animationIteration(main)
	fireEvent.animationIteration(main)

	expect(main).toHaveTextContent("3")

	fireEvent.animationEnd(main) // Complete the animation

	expect(main).toHaveAttribute("data-ready", "false")
	expect(main).toHaveAttribute("data-animating", "false")
	expect(main).toHaveAttribute("data-completed", "true")
	expect(main).toHaveAttribute("data-cancelled", "false")

	fireEvent.reset(main) // Reset the animation (but not iterations)

	expect(main).toHaveTextContent("3")
	expect(main).toHaveAttribute("data-ready", "true")
	expect(main).toHaveAttribute("data-animating", "false")
	expect(main).toHaveAttribute("data-completed", "false")
	expect(main).toHaveAttribute("data-cancelled", "false")

	fireEvent.animationStart(main) // Begin animating
	fireEvent.animationIteration(main) // Iterate once
	fireEvent.click(main) // Cancel the animation

	expect(main).toHaveTextContent("4")
	expect(main).toHaveAttribute("data-ready", "false")
	expect(main).toHaveAttribute("data-animating", "false")
	expect(main).toHaveAttribute("data-completed", "false")
	expect(main).toHaveAttribute("data-cancelled", "true")
})

test("[createAnimationMachineConfig] accepts props and sets context", () => {
	render(<Tester initial="animating" iterations={5} topic="topic" />)

	const main = screen.getByRole("main")

	expect(main).toHaveAttribute("data-ready", "false")
	expect(main).toHaveAttribute("data-animating", "true")
	expect(main).toHaveAttribute("data-completed", "false")
	expect(main).toHaveAttribute("data-cancelled", "false")
	expect(main).toHaveTextContent("5")
	expect(main).toHaveAttribute("data-topic", "topic")
})

test("[createAnimationMachineConfig] publishes events properly", () => {
	render(
		<Tester
			id="pubsub-test"
			enabledEvents={[
				"ANIMATION_CANCEL",
				"ANIMATION_END",
				"ANIMATION_ITERATION",
				"ANIMATION_RESET",
				"ANIMATION_START",
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

	fireEvent.animationStart(main)

	expect(event.eventName).toBe("ANIMATION_START")

	fireEvent.animationIteration(main)

	expect(event.eventName).toBe("ANIMATION_ITERATION")
	expect(event.data?.iterations).toBe(1)

	fireEvent.click(main)

	expect(event.eventName).toBe("ANIMATION_CANCEL")

	fireEvent.reset(main)

	expect(event.eventName).toBe("ANIMATION_RESET")

	fireEvent.animationStart(main)
	fireEvent.animationIteration(main)
	fireEvent.animationEnd(main)

	expect(event.eventName).toBe("ANIMATION_END")
	expect(event.data?.iterations).toBe(2)

	unsubscribeFromAllTopics(token)
})
