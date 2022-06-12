import { render, screen } from "~setup/testUtils"
import Content from "./"

test("[Content] with showWhen set to DEACTIVATED", () => {
	render(
		<Content
			content="content"
			id="id"
			showWhen="DEACTIVATED"
			title="title"
		/>,
	)

	const div = screen.queryByText("content")

	expect(div).toBeNull()
})

test("[Content] with showWhen set to ACTIVATED", () => {
	render(
		<Content
			content="content"
			id="id"
			showWhen="ACTIVATED"
			title="title"
		/>,
	)

	const div = screen.getByText("content")

	expect(div).toBeDefined()
	expect(div.getAttribute("id")).toBe("id")
	expect(div.getAttribute("title")).toBe("title")
})
