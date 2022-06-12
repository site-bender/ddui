import type { StringDatatypeConfig } from "~getComponent/types"
import { render, screen } from "~setup/testUtils"
import FullNameField from "./"

const givenName: StringDatatypeConfig = {
	datatype: "STRING_DATATYPE",
	id: "given-name",
	initialValue: "J.R.",
	label: "Given name",
	name: "givenName",
}
const middleNames: StringDatatypeConfig = {
	datatype: "STRING_DATATYPE",
	id: "middle-names",
	initialValue: `"Bob"`,
	label: "Middle names",
	name: "middleNames",
}
const familyName: StringDatatypeConfig = {
	datatype: "STRING_DATATYPE",
	id: "family-name",
	initialValue: "Dobbs",
	label: "Family name",
	name: "familyName",
}
const id = "id"

test("[FullNameField] renders a full name field", () => {
	render(
		<FullNameField
			id={id}
			givenName={givenName}
			middleNames={middleNames}
			familyName={familyName}
		/>,
	)

	const givenLabel = screen.getByText("Given name")
	const givenField = screen.getByLabelText("Given name")
	const middleLabel = screen.getByText("Middle names")
	const middleField = screen.getByLabelText("Middle names")
	const familyLabel = screen.getByText("Family name")
	const familyField = screen.getByLabelText("Family name")

	expect(givenLabel.getAttribute("for")).toBe("given-name")
	expect(givenLabel).toHaveAttribute("id")

	expect(givenField).toHaveAttribute("aria-labelledby")
	expect(givenField.getAttribute("id")).toBe("given-name")
	expect(givenField.getAttribute("name")).toBe("givenName")
	expect(givenField.getAttribute("type")).toBe("text")
	expect(givenField.getAttribute("value")).toBe("J.R.")

	expect(middleLabel.getAttribute("for")).toBe("middle-names")
	expect(middleLabel).toHaveAttribute("id")

	expect(middleField).toHaveAttribute("aria-labelledby")
	expect(middleField.getAttribute("id")).toBe("middle-names")
	expect(middleField.getAttribute("name")).toBe("middleNames")
	expect(middleField.getAttribute("type")).toBe("text")
	expect(middleField.getAttribute("value")).toBe(`"Bob"`)

	expect(familyLabel.getAttribute("for")).toBe("family-name")
	expect(familyLabel).toHaveAttribute("id")

	expect(familyField).toHaveAttribute("aria-labelledby")
	expect(familyField.getAttribute("id")).toBe("family-name")
	expect(familyField.getAttribute("name")).toBe("familyName")
	expect(familyField.getAttribute("type")).toBe("text")
	expect(familyField.getAttribute("value")).toBe("Dobbs")
})

test("[FullNameField] renders a full name field without middle names", () => {
	render(
		<FullNameField
			id={id}
			givenName={givenName}
			familyName={familyName}
		/>,
	)

	const givenLabel = screen.getByText("Given name")
	const givenField = screen.getByLabelText("Given name")
	const familyLabel = screen.getByText("Family name")
	const familyField = screen.getByLabelText("Family name")

	expect(givenLabel.getAttribute("for")).toBe("given-name")
	expect(givenField.getAttribute("value")).toBe("J.R.")

	expect(familyLabel.getAttribute("for")).toBe("family-name")
	expect(familyField.getAttribute("value")).toBe("Dobbs")
})
