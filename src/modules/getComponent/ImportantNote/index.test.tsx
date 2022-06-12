import { render, screen } from "~setup/testUtils"
import ImportantNote from "./"

const id = "group-id"

test("[ImportantNote] renders a text node as children", () => {
	render(
		<ImportantNote id={id}>children</ImportantNote>,
	)

	const p = screen.getByText("children")

	expect(screen.queryByText("Important note:")).toBeDefined()
	expect(p.tagName).toBe("P")
})

test("[ImportantNote] renders react elements as children", () => {
	render(
		<ImportantNote id={id}>
			<small>small children</small>
		</ImportantNote>,
	)

	const small = screen.getByText("small children")

	expect(screen.queryByText("Important note:")).toBeDefined()
	expect(small.tagName).toBe("SMALL")
})
