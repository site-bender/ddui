import { useMemo } from "react"
import { subscribe, unsubscribe } from "~services/pubsub"
import type { PubSubEvent } from "~services/pubsub/types"
import { fireEvent, render, screen } from "~setup/testUtils"
import useMachines from "../../"
import type { OperationMachineContext, OperationMachineParams } from "../../types"

function Tester (props: OperationMachineParams): JSX.Element {
	const config = useMemo(() => ({ OPERATION: props }), [])

	const { actions, context, status } = useMachines(config)

	return (
		<main
			data-disabled={status.disabled?.()}
			data-enabled={status.enabled?.()}
			data-topic={(context as OperationMachineContext).topic}
			onClick={actions.disable}
			onDoubleClick={actions.enable}
			onFocus={actions.reset}
			onBlur={actions.resume}
		/>
	)
}

test("[createOperationMachineConfig] works with defaults", () => {
	render(<Tester />)

	const main = screen.getByRole("main")

	// Starts enabled
	expect(main).toHaveAttribute("data-disabled", "false")
	expect(main).toHaveAttribute("data-enabled", "true")

	fireEvent.click(main) // Disable

	expect(main).toHaveAttribute("data-disabled", "true")
	expect(main).toHaveAttribute("data-enabled", "false")

	fireEvent.dblClick(main) // Enable

	expect(main).toHaveAttribute("data-disabled", "false")
	expect(main).toHaveAttribute("data-enabled", "true")
})

test("[createOperationMachineConfig] publishes events", () => {
	const topic = "TOPIC"

	render(
		<Tester
			enabledEvents={[
				"DISABLE",
				"ENABLE",
			]}
			id="default-test"
			initial="disabled"
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

	// Starts disabled
	expect(main).toHaveAttribute("data-disabled", "true")
	expect(main).toHaveAttribute("data-enabled", "false")

	fireEvent.dblClick(main) // Enable

	expect(event.eventName).toBe("ENABLE")
	expect(main).toHaveAttribute("data-disabled", "false")
	expect(main).toHaveAttribute("data-enabled", "true")

	fireEvent.click(main) // Disable

	expect(event.eventName).toBe("DISABLE")
	expect(main).toHaveAttribute("data-disabled", "true")
	expect(main).toHaveAttribute("data-enabled", "false")

	unsubscribe(token)
})
