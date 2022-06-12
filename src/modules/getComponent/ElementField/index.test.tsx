import { fireEvent, render, screen } from "~setup/testUtils"
import ElementField from "./"

test("[ElementField] displays as radio buttons", () => {
	render(
		<ElementField
			description="description"
			id="id"
			initialValue="red"
			label="color"
			name="color"
			set={{
				values: ["red", "green", "blue"],
			}}
		/>,
	)

	const red = screen.getByLabelText("red")
	const green = screen.getByLabelText("green")
	const blue = screen.getByLabelText("blue")

	expect(red.getAttribute("name")).toBe("color")
	expect(red.getAttribute("type")).toBe("radio")
	expect(red.getAttribute("value")).toBe("red")
	expect(red).toHaveAttribute("checked")

	expect(green.getAttribute("name")).toBe("color")
	expect(green.getAttribute("type")).toBe("radio")
	expect(green.getAttribute("value")).toBe("green")
	expect(green).not.toHaveAttribute("checked")

	expect(blue.getAttribute("name")).toBe("color")
	expect(blue.getAttribute("type")).toBe("radio")
	expect(blue.getAttribute("value")).toBe("blue")
	expect(blue).not.toHaveAttribute("checked")

	expect(screen.getByText("description")).toBeDefined()

	fireEvent.click(blue)

	expect((red as HTMLInputElement).checked).toBe(false)
	expect((green as HTMLInputElement).checked).toBe(false)
	expect((blue as HTMLInputElement).checked).toBe(true)
})

test("[ElementField] displays as a select", () => {
	render(
		<ElementField
			description="description"
			id="id"
			initialValue="3"
			label="Color"
			name="color"
			preferSelect
			set={{
				values: ["0", "1", "2", "3", "4", "5"],
			}}
		/>,
	)

	const select = screen.getByLabelText("Color")
	const zero = screen.getByText("0")
	const one = screen.getByText("1")
	const two = screen.getByText("2")
	const three = screen.getByText("3")
	const four = screen.getByText("4")
	const five = screen.getByText("5")

	expect(select.getAttribute("aria-label")).toBe("Color")
	expect(select.getAttribute("class")).include("_select_")
	expect(select.getAttribute("id")).toBe("id")
	expect(select.getAttribute("name")).toBe("color")

	expect(zero.getAttribute("value")).toBe("0")

	expect(one.getAttribute("value")).toBe("1")

	expect(two.getAttribute("value")).toBe("2")

	expect(three.getAttribute("value")).toBe("3")
	expect(three).toHaveAttribute("selected")

	expect(four.getAttribute("value")).toBe("4")

	expect(five.getAttribute("value")).toBe("5")

	fireEvent.change(select, { target: { value: "1" } })

	expect((screen.getByRole("option", { name: "1" }) as HTMLOptionElement).selected).toBe(true)
})

test("[ElementField] as select can hide label", () => {
	render(
		<ElementField
			hideLabel
			description="description"
			id="id"
			initialValue="3"
			label="Bob"
			name="bob"
			preferSelect
			set={{
				values: ["0", "1", "2", "3", "4", "5"],
			}}
		/>,
	)

	const select = screen.getByLabelText("Bob")

	expect(select.getAttribute("aria-label")).toBe("Bob")
	expect(select.getAttribute("class")).include("_select_")
	expect(select.getAttribute("id")).toBe("id")
	expect(select.getAttribute("name")).toBe("bob")
})
