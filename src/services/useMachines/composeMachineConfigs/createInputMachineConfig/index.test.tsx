import { useMemo } from "react"
import { subscribeToAllTopics, unsubscribeFromAllTopics } from "~services/pubsub"
import type { PubSubEvent } from "~services/pubsub/types"
import { fireEvent, render, screen } from "~setup/testUtils"
import useMachines from "../../"
import type { InputMachineContext, InputMachineParams, Validation, ValueTarget } from "../../types"

function validate ({ value }: Validation): Validation {
	return value.length
		? {
			errors: [],
			isInvalid: false,
			value,
		}
		: {
			errors: ["is required"],
			isInvalid: true,
			value,
		}
}

function Tester (props: InputMachineParams): JSX.Element {
	const config = useMemo(() => ({ INPUT: props }), [])

	const { actions, context, status } = useMachines(config)

	return (
		<input
			data-clean={status.inputClean?.()}
			data-dirty={status.inputDirty?.()}
			data-updating={status.inputUpdating?.()}
			data-validating={status.inputValidating?.()}
			data-invalid={status.inputInvalid?.()}
			data-valid={status.inputValid?.()}
			data-topic={(context as InputMachineContext).topic}
			data-name={(context as InputMachineContext).name}
			data-is-invalid={(context as InputMachineContext).isInvalid}
			data-initial-value={(context as InputMachineContext).initialValue}
			data-value={(context as InputMachineContext).value}
			data-errors={(context as InputMachineContext).errors?.toString()}
			onInput={(event) => {
				actions.inputUpdate?.((event.target as ValueTarget).value)
			}}
			onClick={actions.inputClear}
			onReset={actions.inputReset}
			value={(context as InputMachineContext).value}
		/>
	)
}

test("[createInputMachineConfig] works with defaults and no validation", () => {
	render(<Tester initialValue="bob" />)

	const input = screen.getByRole("textbox")

	expect(input).toHaveAttribute("value", "bob")
	expect(input).toHaveAttribute("data-clean", "true")
	expect(input).toHaveAttribute("data-dirty", "false")
	expect(input).toHaveAttribute("data-updating", "false")
	expect(input).toHaveAttribute("data-validating", "false")
	expect(input).toHaveAttribute("data-invalid", "false")
	expect(input).toHaveAttribute("data-valid", "false")

	fireEvent.input(input, { target: { value: "tom" } }) // Input value "tom"

	expect(input).toHaveAttribute("value", "tom")
	expect(input).toHaveAttribute("data-initial-value", "bob")
	expect(input).toHaveAttribute("data-value", "tom")
	expect(input).toHaveAttribute("data-clean", "false")
	expect(input).toHaveAttribute("data-dirty", "true")

	fireEvent.click(input) // Clear

	expect(input).toHaveAttribute("value", "")
	expect(input).toHaveAttribute("data-initial-value", "bob")
	expect(input).toHaveAttribute("data-value", "")
	expect(input).toHaveAttribute("data-clean", "false")
	expect(input).toHaveAttribute("data-dirty", "true")

	fireEvent.reset(input) // Reset

	expect(input).toHaveAttribute("value", "bob")
	expect(input).toHaveAttribute("data-initial-value", "bob")
	expect(input).toHaveAttribute("data-value", "bob")
	expect(input).toHaveAttribute("data-clean", "true")
	expect(input).toHaveAttribute("data-dirty", "false")
})

test("[createInputMachineConfig] accepts props, context, adds validation", () => {
	render(
		<Tester id="validation-test" initial="inputValidating" initialValue="sally" name="name" validate={validate} />,
	)

	const input = screen.getByRole("textbox")

	expect(input).toHaveAttribute("value", "sally")
	expect(input).toHaveAttribute("data-clean", "true")
	expect(input).toHaveAttribute("data-dirty", "false")
	expect(input).toHaveAttribute("data-updating", "false")
	expect(input).toHaveAttribute("data-validating", "false")
	expect(input).toHaveAttribute("data-invalid", "false")
	expect(input).toHaveAttribute("data-valid", "false")

	fireEvent.input(input, { target: { value: "jane" } }) // Input value "jane"

	expect(input).toHaveAttribute("value", "jane")
	expect(input).toHaveAttribute("data-initial-value", "sally")
	expect(input).toHaveAttribute("data-value", "jane")
	expect(input).toHaveAttribute("data-clean", "false")
	expect(input).toHaveAttribute("data-dirty", "true")
	expect(input).toHaveAttribute("data-invalid", "false")
	expect(input).toHaveAttribute("data-valid", "true")
	expect(input).toHaveAttribute("data-is-invalid", "false")
	expect(input).toHaveAttribute("data-errors", "")

	fireEvent.click(input) // Clear

	expect(input).toHaveAttribute("value", "")
	expect(input).toHaveAttribute("data-initial-value", "sally")
	expect(input).toHaveAttribute("data-value", "")
	expect(input).toHaveAttribute("data-clean", "false")
	expect(input).toHaveAttribute("data-dirty", "true")
	expect(input).toHaveAttribute("data-invalid", "true")
	expect(input).toHaveAttribute("data-valid", "false")
	expect(input).toHaveAttribute("data-is-invalid", "true")
	expect(input).toHaveAttribute("data-errors", "is required")

	fireEvent.reset(input) // Reset

	expect(input).toHaveAttribute("value", "sally")
	expect(input).toHaveAttribute("data-initial-value", "sally")
	expect(input).toHaveAttribute("data-value", "sally")
	expect(input).toHaveAttribute("data-clean", "true")
	expect(input).toHaveAttribute("data-dirty", "false")
	expect(input).toHaveAttribute("data-invalid", "false")
	expect(input).toHaveAttribute("data-valid", "false")
	expect(input).toHaveAttribute("data-is-invalid", "false")
	expect(input).toHaveAttribute("data-errors", "")
})

test("[createInputMachineConfig] publishes events properly", () => {
	render(
		<Tester
			enabledEvents={[
				"INPUT_CLEAR",
				"INPUT_RESET",
				"INPUT_UPDATE",
			]}
			id="default-test"
			validate={validate}
		/>,
	)

	const input = screen.getByRole("textbox")

	let event: PubSubEvent = {} as PubSubEvent

	const token = "TOKEN"
	subscribeToAllTopics(token, function(e) {
		event = e
	})

	expect(event.eventName).toBeUndefined()

	fireEvent.input(input, { target: { value: "tom" } }) // Input value "tom"

	expect(event.eventName).toBe("INPUT_UPDATE")
	expect(event.data?.errors).toEqual([])
	expect(event.data?.id).toBe("default-test")
	expect(event.data?.initialValue).toBe("")
	expect(event.data?.isInvalid).toBe(false)
	expect(event.data?.name).toBe("input")
	expect(event.data?.value).toBe("tom")

	fireEvent.click(input) // Clear

	expect(event.eventName).toBe("INPUT_CLEAR")
	expect(event.data?.errors).toEqual(["is required"])
	expect(event.data?.id).toBe("default-test")
	expect(event.data?.initialValue).toBe("")
	expect(event.data?.isInvalid).toBe(true)
	expect(event.data?.name).toBe("input")
	expect(event.data?.value).toBe("")

	fireEvent.reset(input) // Reset

	expect(event.eventName).toBe("INPUT_RESET")
	expect(event.data?.errors).toEqual([])
	expect(event.data?.id).toBe("default-test")
	expect(event.data?.initialValue).toBe("")
	expect(event.data?.isInvalid).toBe(false)
	expect(event.data?.name).toBe("input")
	expect(event.data?.value).toBe("")

	unsubscribeFromAllTopics(token)
})
