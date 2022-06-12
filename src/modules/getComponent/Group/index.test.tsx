import type { ComponentConfig } from "~getComponent/types"
import { render, screen } from "~setup/testUtils"
import Group from "./"

const className = "className"
const id = "group-id"
const label = "Title of group"
const elements: Array<ComponentConfig> = [{
	content: "content",
	datatype: "CONTENT",
	id: "content-id",
	title: "title",
}]

test("[Group] renders a section element if labeled", () => {
	render(
		<Group
			className={className}
			id={id}
			label={label}
			elements={elements}
		/>,
	)

	const h3 = screen.getByText(label)
	const div = screen.getByText("content")
	const section = h3.closest("section")

	expect(section).toBeDefined()
	expect(section?.getAttribute("class")).include("_section_")
	expect(h3).toBeDefined()
	expect(div.getAttribute("class")).include("_content_")
	expect(div.getAttribute("id")).toBe("content-id")
	expect(div.getAttribute("title")).toBe("title")
})

test("[Group] renders a div element if unlabeled", () => {
	render(
		<Group
			className={className}
			id={id}
			elements={elements}
		/>,
	)

	const div = screen.getByText("content")
	const section = div.closest("section")

	expect(section).toBeNull()
	expect(div.getAttribute("class")).include("_content_")
	expect(div.getAttribute("id")).toBe("content-id")
	expect(div.getAttribute("title")).toBe("title")
})
