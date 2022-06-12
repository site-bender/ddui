import type { ComponentConfig, ContentConfig } from "~getComponent/types"
import { render, screen } from "~setup/testUtils"
import getComponent from "./"

test("[getComponent] returns null when no component found", () => {
	expect(getComponent({} as ComponentConfig)).toBe(null)
})

test("[getComponent] returns a component to match the config", () => {
	render(getComponent({
		datatype: "CONTENT",
		content: "content",
		id: "id",
		title: "title",
	} as ContentConfig) as JSX.Element)

	const div = screen.getByText("content")

	expect(div).toBeDefined()
	expect(div.id).toBe("id")
	expect(div.title).toBe("title")
})
