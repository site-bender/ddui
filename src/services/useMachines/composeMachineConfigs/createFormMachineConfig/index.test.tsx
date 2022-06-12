import { useMemo } from "react"
import { subscribe, unsubscribe } from "~services/pubsub"
import type { PubSubEvent } from "~services/pubsub/types"
import { fireEvent, render, screen } from "~setup/testUtils"
import useMachines from "../../"
import type { FormMachineContext, FormMachineParams, ValueTarget } from "../../types"

function Tester (props: FormMachineParams): JSX.Element {
	const config = useMemo(() => ({ FORM: props }), [])

	const { actions, context, status } = useMachines(config)

	return (
		<input
			data-error={(context as FormMachineContext).error}
			data-form-failed={status.formFailed?.()}
			data-form-pending={status.formPending?.()}
			data-form-ready={status.formReady?.()}
			data-form-submitted={status.formSubmitted?.()}
			data-form-succeeded={status.formSucceeded?.()}
			data-topic={(context as FormMachineContext).topic}
			data-value={(context as FormMachineContext).fields}
			onInput={(event) => {
				actions.formInitialize?.(JSON.parse((event.target as ValueTarget).value))
			}}
			onKeyDown={(event) => {
				actions.formUpdate?.(JSON.parse((event.target as ValueTarget).value))
			}}
			onSubmit={actions.formSubmit}
			onKeyUp={actions.formData}
			onReset={actions.formReset}
			onMouseOver={actions.formSucceeded}
			onMouseOut={(event) => {
				actions.formFailed?.((event.target as ValueTarget).value)
			}}
			value={JSON.stringify((context as FormMachineContext).fields) || ""}
		/>
	)
}

test("[createFormMachineConfig] works with defaults and no validation", () => {
	const topic = "TOPIC"

	render(
		<Tester
			enabledEvents={[
				"FORM_DATA",
				"FORM_FAILURE",
				"FORM_INITIALIZE",
				"FORM_RESET",
				"FORM_SUBMIT",
				"FORM_SUCCESS",
				"FORM_UPDATE",
			]}
			topic={topic}
		/>,
	)

	const input = screen.getByRole("textbox")

	let event: PubSubEvent = {} as PubSubEvent

	const token = "TOKEN"
	subscribe(token, function(e) {
		event = e
	}, { topic })

	expect(event.eventName).toBeUndefined()

	expect(input).toHaveAttribute("data-form-failed", "false")
	expect(input).toHaveAttribute("data-form-pending", "false")
	expect(input).toHaveAttribute("data-form-ready", "true")
	expect(input).toHaveAttribute("data-form-submitted", "false")
	expect(input).toHaveAttribute("data-form-succeeded", "false")
	expect(input).toHaveAttribute("data-topic", topic)

	// Form initialize
	fireEvent.input(input, {
		target: {
			value: JSON.stringify({
				nameGiven: {
					initialValue: "Bob",
					value: "Bob",
				},
				nameFamily: {
					initialValue: "Dobbs",
					value: "Dobbs",
				},
			}),
		},
	})

	expect(event.eventName).toBe("FORM_INITIALIZE")
	expect(event.data).toEqual({
		fields: {
			nameGiven: {
				initialValue: "Bob",
				value: "Bob",
			},
			nameFamily: {
				initialValue: "Dobbs",
				value: "Dobbs",
			},
		},
	})
	expect((input as HTMLInputElement).value).toBe(
		`{"nameGiven":{"initialValue":"Bob","value":"Bob"},"nameFamily":{"initialValue":"Dobbs","value":"Dobbs"}}`,
	)
	expect(input).toHaveAttribute("data-form-ready", "true") // No state change

	// Form Update
	fireEvent.keyDown(input, {
		target: {
			value: JSON.stringify({
				nameMiddle: {
					initialValue: "J.R.",
					value: "J.R.",
				},
				nameFamily: {
					errors: ["is required"],
					initialValue: "Dobbs",
					isInvalid: true,
					value: "",
				},
			}),
		},
	})

	expect(event.eventName).toBe("FORM_UPDATE")
	expect(event.data).toEqual({
		fields: {
			nameGiven: {
				initialValue: "Bob",
				value: "Bob",
			},
			nameFamily: {
				errors: ["is required"],
				initialValue: "Dobbs",
				isInvalid: true,
				value: "",
			},
			nameMiddle: {
				initialValue: "J.R.",
				value: "J.R.",
			},
		},
	})
	expect((input as HTMLInputElement).value).toBe(
		`{"nameGiven":{"initialValue":"Bob","value":"Bob"},"nameFamily":` +
			`{"errors":["is required"],"initialValue":"Dobbs","isInvalid":true,"value":""}` +
			`,"nameMiddle":{"initialValue":"J.R.","value":"J.R."}}`,
	)
	expect(input).toHaveAttribute("data-form-ready", "true")

	fireEvent.submit(input) // Form submit

	expect(event.eventName).toBe("FORM_SUBMIT")
	expect(event.data).toEqual({
		fields: {
			nameGiven: {
				initialValue: "Bob",
				value: "Bob",
			},
			nameFamily: {
				errors: ["is required"],
				initialValue: "Dobbs",
				isInvalid: true,
				value: "",
			},
			nameMiddle: {
				initialValue: "J.R.",
				value: "J.R.",
			},
		},
	})
	expect(input).toHaveAttribute("data-form-failed", "false")
	expect(input).toHaveAttribute("data-form-pending", "false")
	expect(input).toHaveAttribute("data-form-ready", "false")
	expect(input).toHaveAttribute("data-form-submitted", "true")
	expect(input).toHaveAttribute("data-form-succeeded", "false")

	fireEvent.keyUp(input) // Form data

	expect(event.eventName).toBe("FORM_DATA")
	expect(input).toHaveAttribute("data-form-failed", "false")
	expect(input).toHaveAttribute("data-form-pending", "true")
	expect(input).toHaveAttribute("data-form-ready", "false")
	expect(input).toHaveAttribute("data-form-submitted", "false")
	expect(input).toHaveAttribute("data-form-succeeded", "false")

	fireEvent.mouseOver(input) // Form success

	expect(event.eventName).toBe("FORM_SUCCESS")
	expect(input).toHaveAttribute("data-form-failed", "false")
	expect(input).toHaveAttribute("data-form-pending", "false")
	expect(input).toHaveAttribute("data-form-ready", "false")
	expect(input).toHaveAttribute("data-form-submitted", "false")
	expect(input).toHaveAttribute("data-form-succeeded", "true")

	fireEvent.reset(input) // Form reset

	expect(event.eventName).toBe("FORM_RESET")
	expect(input).toHaveAttribute("data-form-failed", "false")
	expect(input).toHaveAttribute("data-form-pending", "false")
	expect(input).toHaveAttribute("data-form-ready", "true")
	expect(input).toHaveAttribute("data-form-submitted", "false")
	expect(input).toHaveAttribute("data-form-succeeded", "false")

	expect((input as HTMLInputElement).value).toBe("") // Fields cleared

	fireEvent.submit(input) // Form submit
	fireEvent.keyUp(input) // Form data
	fireEvent.mouseOut(input, { target: { value: "Oh, noes!" } }) // Form failure

	expect(event.eventName).toBe("FORM_FAILURE")
	expect(input).toHaveAttribute("data-error", "Oh, noes!")

	unsubscribe(token, topic)
})

test("[createFormMachineConfig] accepts props, context", () => {
	render(
		<Tester id="form-test" initial="formPending" />,
	)

	const input = screen.getByRole("textbox")

	expect(input).toHaveAttribute("data-form-failed", "false")
	expect(input).toHaveAttribute("data-form-pending", "true")
	expect(input).toHaveAttribute("data-form-ready", "false")
	expect(input).toHaveAttribute("data-form-submitted", "false")
	expect(input).toHaveAttribute("data-form-succeeded", "false")

	fireEvent.mouseOver(input) // Form success

	expect(input).toHaveAttribute("data-form-failed", "false")
	expect(input).toHaveAttribute("data-form-pending", "false")
	expect(input).toHaveAttribute("data-form-ready", "false")
	expect(input).toHaveAttribute("data-form-submitted", "false")
	expect(input).toHaveAttribute("data-form-succeeded", "true")
})
