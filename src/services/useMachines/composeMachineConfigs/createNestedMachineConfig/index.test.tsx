import { useMemo } from "react"
import { subscribe, unsubscribe } from "~services/pubsub"
import type { PubSubEvent } from "~services/pubsub/types"
import { fireEvent, render, screen } from "~setup/testUtils"
import useMachines from "../../"
import type { NestedMachineContext, NestedMachineParams } from "../../types"

function Tester (props: NestedMachineParams): JSX.Element {
	const config = useMemo(() => ({ NESTED: props }), [])

	const { actions, context, status } = useMachines(config)

	return (
		<main
			data-blurred={status.blurred?.()}
			data-disabled={status.disabled?.()}
			data-enabled={status.enabled?.()}
			data-focused={status.focused?.()}
			data-topic={(context as NestedMachineContext).topic}
			onBlur={actions.blur}
			onFocus={actions.focus}
			onClick={actions.disable}
			onReset={actions.enable}
		/>
	)
}

test("[createNestedMachineConfig] works with defaults", () => {
	const topic = "TOPIC"

	render(
		<Tester
			child={{
				FOCUS: {
					id: "focus-machine",
					bob: "Dobbs",
				},
			}}
			enabledEvents={[
				"BLUR",
				"DISABLE",
				"ENABLE",
				"FOCUS",
			]}
			injectInto="enabled"
			parent={{
				OPERATION: {
					id: "operation-machine",
					sam: "Spade",
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

	expect(main).toHaveAttribute("data-topic", topic)
	expect(main).toHaveAttribute("data-blurred", "true")
	expect(main).toHaveAttribute("data-disabled", "false")
	expect(main).toHaveAttribute("data-enabled", "true")
	expect(main).toHaveAttribute("data-focused", "false")

	fireEvent.focus(main) // Focus

	expect(event.eventName).toBe("FOCUS")

	expect(main).toHaveAttribute("data-blurred", "false")
	expect(main).toHaveAttribute("data-disabled", "false")
	expect(main).toHaveAttribute("data-enabled", "true")
	expect(main).toHaveAttribute("data-focused", "true")

	fireEvent.blur(main) // Blur

	expect(event.eventName).toBe("BLUR")

	expect(main).toHaveAttribute("data-blurred", "true")
	expect(main).toHaveAttribute("data-disabled", "false")
	expect(main).toHaveAttribute("data-enabled", "true")
	expect(main).toHaveAttribute("data-focused", "false")

	fireEvent.focus(main) // Focus
	fireEvent.click(main) // Disable

	expect(event.eventName).toBe("DISABLE")

	expect(main).toHaveAttribute("data-disabled", "true")
	expect(main).toHaveAttribute("data-enabled", "false")

	// Not available when disabled
	expect(main).toHaveAttribute("data-blurred", "false")
	expect(main).toHaveAttribute("data-focused", "false")

	fireEvent.reset(main) // Enable

	expect(event.eventName).toBe("ENABLE")

	expect(main).toHaveAttribute("data-blurred", "true")
	expect(main).toHaveAttribute("data-disabled", "false")
	expect(main).toHaveAttribute("data-enabled", "true")
	expect(main).toHaveAttribute("data-focused", "false")

	unsubscribe(token, topic)
})
