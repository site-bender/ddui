import { render, screen } from "~setup/testUtils"
import PhoneField from "./"

const id = "id"
const label = "Phone number"
const name = "phoneNumber"
const telecomCountryIsoCode = "AF"
const value = "123456789"

test("[PhoneField] renders a disabled phone field", () => {
	render(
		<PhoneField
			isReadOnly
			id={id}
			label={label}
			name={name}
			telecomCountryIsoCode={telecomCountryIsoCode}
			telecomVerified={false}
			value={value}
			variant="DENSE"
		/>,
	)

	const select = screen.getByText("BI").closest("select")

	expect(select?.getAttribute("aria-label")).include("Country")
	expect(select?.getAttribute("class")).include("_select_")
	expect(select?.getAttribute("disabled")).toBeDefined()
	expect(select?.getAttribute("id")).toBeDefined()
	expect(select?.getAttribute("name")).toBe("telecomCountryIsoCode")

	expect(screen.getByText(telecomCountryIsoCode)).toHaveAttribute("selected")

	const input = screen.getByLabelText(label)

	expect(input).toHaveAttribute("disabled")
	expect(input).toHaveAttribute("form")
	expect(input).toHaveAttribute("id")
	expect(input.getAttribute("class")).include("_inputDense_")
	expect(input.getAttribute("name")).toBe("lineNumber")
	expect(input.getAttribute("type")).toBe("text")
	expect(input.getAttribute("value")).toBe(value)
})

test("[PhoneField] defaults to NZ", () => {
	render(
		<PhoneField
			id={id}
			label={label}
			name={name}
			telecomCountryIsoCode=""
			telecomVerified={false}
			value={value}
			variant="DEFAULT"
		/>,
	)

	const select = screen.getByText("BI").closest("select")

	expect(select).not.toHaveAttribute("disabled")

	expect(screen.getByText("NZ")).toHaveAttribute("selected")

	const input = screen.getByLabelText(label)

	expect(input).not.toHaveAttribute("disabled")
})
