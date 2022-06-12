import { render, screen } from "~setup/testUtils"
import ExternalLink from "./"

test("[ExternalLink] renders an anchor element", () => {
	const href = "https://google.com/"
	const id = "link-id"
	const label = "Google"
	const rel = "rel"
	const target = "_blank"

	render(
		<ExternalLink
			href={href}
			id={id}
			label={label}
			rel={rel}
			target={target}
		/>,
	)

	const link = screen.getByText(label)

	expect(link).toBeDefined()
	expect(link.getAttribute("class")).include("_externalLink_")
	expect(link.getAttribute("href")).toBe(href)
	expect(link.getAttribute("id")).toBe(id)
	expect(link.getAttribute("rel")).toBe(rel)
	expect(link.getAttribute("target")).toBe(target)
})
