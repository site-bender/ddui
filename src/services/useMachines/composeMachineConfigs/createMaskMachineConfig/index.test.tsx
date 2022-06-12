import { useMemo } from "react"
import { subscribeToAllTopics, unsubscribeFromAllTopics } from "~services/pubsub"
import type { PubSubEvent } from "~services/pubsub/types"
import { fireEvent, render, screen } from "~setup/testUtils"
import useMachines from "../../"
import type { MaskMachineContext, MaskMachineParams } from "../../types"

function Tester (props: MaskMachineParams): JSX.Element {
	const config = useMemo(() => ({ MASK: props }), [])

	const { actions, context, status } = useMachines(config)

	return (
		<main
			data-masked={status.masked?.()}
			data-unmasked={status.unmasked?.()}
			data-topic={(context as MaskMachineContext).topic}
			onBlur={actions.blur}
			onFocus={actions.focus}
			onMouseOver={actions.unmask}
			onMouseOut={actions.mask}
		/>
	)
}

test("[createMaskMachineConfig] works with defaults", () => {
	render(<Tester id="default-test" />)

	const main = screen.getByRole("main")

	// Starts unmasked
	expect(main).toHaveAttribute("data-unmasked", "true")
	expect(main).toHaveAttribute("data-masked", "false")

	fireEvent.mouseOut(main) // Mask

	expect(main).toHaveAttribute("data-unmasked", "false")
	expect(main).toHaveAttribute("data-masked", "true")

	fireEvent.mouseOver(main) // Unmask

	expect(main).toHaveAttribute("data-unmasked", "true")
	expect(main).toHaveAttribute("data-masked", "false")

	fireEvent.focus(main) // Focus

	// No change
	expect(main).toHaveAttribute("data-unmasked", "true")
	expect(main).toHaveAttribute("data-masked", "false")

	fireEvent.blur(main) // Blur

	// No change
	expect(main).toHaveAttribute("data-unmasked", "true")
	expect(main).toHaveAttribute("data-masked", "false")
})

test("[createMaskMachineConfig] accepts props and sets context", () => {
	render(<Tester initial="masked" topic="topic" />)

	const main = screen.getByRole("main")

	// Starts masked
	expect(main).toHaveAttribute("data-unmasked", "false")
	expect(main).toHaveAttribute("data-masked", "true")

	fireEvent.mouseOver(main) // Unmask

	expect(main).toHaveAttribute("data-unmasked", "true")
	expect(main).toHaveAttribute("data-masked", "false")

	fireEvent.mouseOut(main) // Mask

	expect(main).toHaveAttribute("data-unmasked", "false")
	expect(main).toHaveAttribute("data-masked", "true")
})

test("[createMaskMachineConfig] works on focus/blur when maskTrigger set to 'ON_BLUR'", () => {
	render(
		<Tester
			enabledEvents={[
				"FOCUS",
				"BLUR",
				"UNMASK",
				"MASK",
			]}
			initial="masked"
			maskTrigger="ON_BLUR"
			topic="topic"
		/>,
	)

	const main = screen.getByRole("main")

	let event: PubSubEvent = {} as PubSubEvent

	const token = "TOKEN"
	subscribeToAllTopics(token, function(e) {
		event = e
	})

	expect(event.eventName).toBeUndefined()

	expect(main).toHaveAttribute("data-unmasked", "false")
	expect(main).toHaveAttribute("data-masked", "true")

	fireEvent.focus(main) // Focus unmasks in "ON_BLUR"

	expect(event.eventName).toBe("UNMASK")

	expect(main).toHaveAttribute("data-unmasked", "true")
	expect(main).toHaveAttribute("data-masked", "false")

	fireEvent.blur(main) // Blur masks in "ON_BLUR"

	expect(event.eventName).toBe("MASK")
	expect(event.data?.maskTrigger).toBe("ON_BLUR")

	expect(main).toHaveAttribute("data-unmasked", "false")
	expect(main).toHaveAttribute("data-masked", "true")

	fireEvent.mouseOver(main) // Unmask

	expect(event.eventName).toBe("UNMASK")

	expect(main).toHaveAttribute("data-unmasked", "true")
	expect(main).toHaveAttribute("data-masked", "false")

	fireEvent.mouseOut(main) // Mask

	expect(event.eventName).toBe("MASK")

	expect(main).toHaveAttribute("data-unmasked", "false")
	expect(main).toHaveAttribute("data-masked", "true")

	unsubscribeFromAllTopics(token)
})

test("[createMaskMachineConfig] works on focus/blur when maskTrigger set to 'ON_FOCUS'", () => {
	render(
		<Tester
			enabledEvents={[
				"FOCUS",
				"BLUR",
				"UNMASK",
				"MASK",
			]}
			maskTrigger="ON_FOCUS"
			topic="topic"
		/>,
	)

	const main = screen.getByRole("main")

	let event: PubSubEvent = {} as PubSubEvent

	const token = "TOKEN"

	subscribeToAllTopics(token, function(e) {
		event = e
	})

	expect(event.eventName).toBeUndefined()

	expect(main).toHaveAttribute("data-unmasked", "true")
	expect(main).toHaveAttribute("data-masked", "false")

	fireEvent.focus(main) // Focus masks in "ON_FOCUS" (masked on blur)

	expect(event.eventName).toBe("MASK")
	expect(event.data?.maskTrigger).toBe("ON_FOCUS")

	expect(main).toHaveAttribute("data-unmasked", "false")
	expect(main).toHaveAttribute("data-masked", "true")

	fireEvent.blur(main) // Blur unmasks in "ON_FOCUS"

	expect(event.eventName).toBe("UNMASK")

	expect(main).toHaveAttribute("data-unmasked", "true")
	expect(main).toHaveAttribute("data-masked", "false")

	fireEvent.mouseOut(main) // Mask

	expect(event.eventName).toBe("MASK")

	expect(main).toHaveAttribute("data-unmasked", "false")
	expect(main).toHaveAttribute("data-masked", "true")

	fireEvent.mouseOver(main) // Unmask

	expect(event.eventName).toBe("UNMASK")

	expect(main).toHaveAttribute("data-unmasked", "true")
	expect(main).toHaveAttribute("data-masked", "false")

	unsubscribeFromAllTopics(token)
})
