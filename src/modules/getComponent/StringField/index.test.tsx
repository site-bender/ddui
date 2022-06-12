import userEvent from "@testing-library/user-event"
import { subscribe } from "~services/pubsub"
import type { PubSubEvent } from "~services/pubsub/types"
import type {
	CreateMachineParamsConfig,
	MaskStates,
	MaskTrigger,
	OperationStates,
	StateNames,
	Transitions,
	Validation,
} from "~services/useMachines/types"
import { fireEvent, render, screen } from "~setup/testUtils"
import StringField from "./"

const user = userEvent.setup()

type TestProps = {
	labelId?: string
	label?: string
	machineConfig?: CreateMachineParamsConfig
}

const id = "inputId"
const description = "description"
const mutationId = "mutationId"
const initialValue = "Bob"
const name = "givenName"

const fullMachineConfig = {
	NESTED: {
		enabledEvents: ["INPUT_UPDATE", "BLUR", "FOCUS", "TOUCH", "MASK", "UNMASK"] as Array<Transitions>,
		id: "nestedMachineId",
		topic: mutationId,
		injectInto: "enabled" as StateNames,
		child: {
			PARALLEL: {
				children: {
					FOCUS: {
						id: "focusMachineId",
					},
					MASK: {
						id: "maskMachineId",
						initial: "masked" as MaskStates,
						maskTrigger: "ON_BLUR" as MaskTrigger,
					},
					TOUCH: {
						id: "touchMachineId",
					},
					INPUT: {
						errorText: "errorText",
						id: "inputMachineId",
						initialValue,
						name,
					},
				},
			},
		},
		parent: {
			OPERATION: {
				id: "operationMachineId",
				initial: "enabled" as OperationStates,
			},
		},
	},
}

function TestComponent ({ labelId, label, machineConfig }: TestProps): JSX.Element {
	return (
		<StringField
			description={description}
			id={id}
			initialValue={initialValue}
			label={label}
			labelId={labelId}
			machineConfig={machineConfig}
			maskTrigger="ON_BLUR"
			mutationId={mutationId}
			name={name}
			variant="DEFAULT"
		/>
	)
}

test("[StringField] works with the state machine as advertised", async function() {
	const labelId = "labelId"
	const labelText = "label"

	render(<TestComponent labelId={labelId} label={labelText} machineConfig={fullMachineConfig} />)

	const events: Array<PubSubEvent> = []

	subscribe(id, (event) => events.push(event), { topic: mutationId })

	const label = screen.getByText(labelText)

	expect(label).toHaveAttribute("id", labelId)
	expect(label).toHaveAttribute("for", id)
	expect(label).toHaveTextContent(labelText)

	const input = screen.getByRole("textbox")

	expect(input).toHaveAttribute("aria-labelledby", labelId)
	expect(input).toHaveAttribute("form", mutationId)
	expect(input).toHaveAttribute("id", id)
	expect(input).toHaveAttribute("name", name)
	expect(input).toHaveAttribute("type", "text")
	expect(input).toHaveAttribute("value", initialValue)

	const output = screen.getByText(description)

	expect(output).toBeDefined()

	fireEvent.focus(input)

	const focusEvent = events.shift() as PubSubEvent

	expect(focusEvent.id).toBeDefined()
	expect(focusEvent.timestamp).toBeDefined()
	expect(focusEvent.eventName).toBe("FOCUS")
	expect(focusEvent.data).toMatchObject({
		errors: [],
		initialValue: "Bob",
		isInvalid: false,
		name: "givenName",
		value: "Bob",
	})

	const unmaskEvent = events.shift()

	expect(unmaskEvent?.eventName).toBe("UNMASK")

	const touchEvent = events.shift() as PubSubEvent

	expect(touchEvent.eventName).toBe("TOUCH")
	expect(touchEvent.data).toMatchObject({
		errors: [],
		initialValue: "Bob",
		isInvalid: false,
		name: "givenName",
		value: "Bob",
	})

	fireEvent.blur(input)

	const blurEvent = events.shift() as PubSubEvent

	expect(blurEvent.eventName).toBe("BLUR")
	expect(blurEvent.data).toMatchObject({
		errors: [],
		initialValue: "Bob",
		isInvalid: false,
		name: "givenName",
		value: "Bob",
	})

	const maskEvent = events.shift() as PubSubEvent

	expect(maskEvent?.eventName).toBe("MASK")

	await user.click(input)
	await user.keyboard("by")

	const reFocusEvent = events.shift() as PubSubEvent

	expect(reFocusEvent.eventName).toBe("FOCUS")

	const reMaskEvent = events.shift() as PubSubEvent

	expect(reMaskEvent?.eventName).toBe("UNMASK")

	const updateEvent = events.shift() as PubSubEvent

	expect(updateEvent.eventName).toBe("INPUT_UPDATE")
	expect(updateEvent.data).toMatchObject({
		initialValue: "Bob",
		value: "Bobb",
	})

	const reUpdateEvent = events.shift() as PubSubEvent

	expect(reUpdateEvent.eventName).toBe("INPUT_UPDATE")
	expect(reUpdateEvent.data).toMatchObject({
		value: "Bobby",
	})
})

const basicMachineConfig = {
	NESTED: {
		enabledEvents: ["INPUT_UPDATE"] as Array<Transitions>,
		id: "nestedMachineId",
		topic: mutationId,
		injectInto: "enabled" as StateNames,
		child: {
			PARALLEL: {
				children: {
					INPUT: {
						errorText: "errorText",
						id: "inputMachineId",
						initialValue,
						name,
						validate: ({ value }: Validation) =>
							value === "Bobs"
								? ({ errors: ["is wrong"], isInvalid: true, value })
								: ({ errors: [], isInvalid: false, value }),
					},
				},
			},
		},
		parent: {
			OPERATION: {
				id: "operationMachineId",
				initial: "enabled" as OperationStates,
			},
		},
	},
}

test("[StringField] works with the state machine as advertised", async function() {
	render(<TestComponent machineConfig={basicMachineConfig} />)

	const events: Array<PubSubEvent> = []

	subscribe(id, (event) => events.push(event), { topic: mutationId })

	const input = screen.getByRole("textbox")
	const output = screen.getByText(description)

	await user.click(input)
	await user.keyboard("s")

	expect(output).toHaveTextContent("is wrong")

	await user.keyboard("ie")

	expect(output).toHaveTextContent(description)
})
