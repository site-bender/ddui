import { subscribe } from "~services/pubsub"
import { fireEvent, render, screen } from "~setup/testUtils"
import Action from "./"

const id = "action-id"
const mutationId = "mutation-id"

test("[Action] with label", () => {
	render(
		<Action
			actionType="CREATE_ACTION"
			buttonVariant="LINK"
			dataset={{ color: "red", age: 42 }}
			id={id}
			isReadOnly
			label="label"
			mutationId={mutationId}
		/>,
	)

	const button = screen.getByText("label")

	expect(button).toBeDefined()
	expect(button).toHaveAttribute("disabled")
	expect(button.getAttribute("data-color")).toBe("red")
	expect(button.getAttribute("data-age")).toBe("42")
	expect(button.getAttribute("form")).toBe(mutationId)
	expect(button.getAttribute("id")).toBe(id)
	expect(button.getAttribute("type")).toBe("button")
	expect(button.getAttribute("class")).includes("_button_")
	expect(button.getAttribute("class")).includes("_link_")
})

test("[Action] with action type", () => {
	render(
		<Action
			actionType="CREATE_ACTION"
			buttonVariant="LINK"
			dataset={{ color: "blue", age: 66 }}
			id={id}
			mutationId={mutationId}
		/>,
	)

	const button = screen.getByText("Create action")

	expect(button).toBeDefined()
	expect(button.getAttribute("data-color")).toBe("blue")
	expect(button.getAttribute("data-age")).toBe("66")
	expect(button.getAttribute("form")).toBe(mutationId)
	expect(button.getAttribute("id")).toBe(id)
	expect(button.getAttribute("type")).toBe("button")
	expect(button.getAttribute("class")).includes("_button_")
	expect(button.getAttribute("class")).includes("_link_")

	fireEvent.click(button)
})
