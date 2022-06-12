import type { ComponentConfig } from "~getComponent/types"
import { subscribeToAllTopics } from "~services/pubsub"
import { fireEvent, render, screen } from "~setup/testUtils"
import Mutation from "./"

const buttonText = "buttonText"
const labelText = "Name field"
const id = "mutationId"
const name = "mutation"
const initialValue = "Sam"
const elements: Array<ComponentConfig> = [
	{
		datatype: "CONTENT",
		id: "content-id",
		content: "<p>This is some content.</p>",
	},
	{
		datatype: "STRING_DATATYPE",
		label: labelText,
		id: "name-field-id",
		initialValue,
		isRequired: true,
		mutationId: id,
		name: "nameField",
	},
]
const label = "label"

test("[Mutation] renders a form connected to a GraphQL mutation", () => {
	render(
		<Mutation
			args={{}}
			buttonText={buttonText}
			id={id}
			name={name}
			label={label}
			elements={[]}
			url="http://example.com/"
		/>,
	)

	const button = screen.getByText(buttonText)

	expect(button.getAttribute("class")).include("_button_")
	expect(button.getAttribute("form")).toBe(id)
	expect(button.getAttribute("type")).toBe("button")
	expect(button).toHaveAttribute("id")

	expect(button.previousSibling?.nodeName).toBe("FORM")
})

test("[Mutation] renders a disabled form with a label", () => {
	render(
		<Mutation
			args={{}}
			buttonText={buttonText}
			id={id}
			isReadOnly
			name={name}
			label={label}
			elements={[]}
			url="http://example.com/"
		/>,
	)

	const button = screen.queryByText(buttonText)

	expect(button).toBeNull()
})

test("[Mutation] updates state when field updated", () => {
	const value = "Sam Spade"
	const callback = vi.fn()

	render(
		<Mutation
			args={{
				bobs: "yer uncle",
			}}
			buttonText={buttonText}
			id={id}
			mutation="mutation() {}"
			name={name}
			elements={elements}
			url="http://example.com/"
		/>,
	)

	subscribeToAllTopics("mutationId", (event) => {
		callback(event)
	})

	const button = screen.getByText(buttonText)
	const input = screen.getByLabelText(labelText)

	expect(input.getAttribute("value")).toBe(initialValue)

	fireEvent.input(input, { target: { value } })

	// expect

	const touched = callback.mock.calls[0][0]
	const inputUpdated = callback.mock.calls[1][0]
	const formUpdated = callback.mock.calls[2][0]

	expect(input.getAttribute("value")).toBe(value)

	expect(touched.eventName).toBe("TOUCH")
	expect(touched.data.initialValue).toBe(initialValue)

	expect(inputUpdated.eventName).toBe("INPUT_UPDATE")
	expect(inputUpdated.data.initialValue).toBe(initialValue)
	expect(inputUpdated.data.value).toBe(value)

	expect(formUpdated.eventName).toBe("FORM_UPDATE")
	expect(formUpdated.data.name).toBe(name)
	expect(formUpdated.data.fields.nameField.value).toBe(value)

	fireEvent.click(button)
})
