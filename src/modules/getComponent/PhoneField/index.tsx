import generateShortId from "~utilities/generateShortId"
import ElementField from "../ElementField"
import StringField from "../StringField"
import type { PhoneDatatypeProps } from "../types"
import { countries } from "../utilities/constants"
import css from "./index.module.css"

export default function PhoneField(props: PhoneDatatypeProps): JSX.Element {
	const mutationId = generateShortId()
	const {
		isReadOnly,
		label,
		telecomCountryIsoCode,
		telecomVerified,
		value,
		variant,
	} = props

	return (
		<div className={css.phoneField}>
			<ElementField
				hideLabel
				isReadOnly={isReadOnly}
				id={generateShortId()}
				initialValue={telecomCountryIsoCode || "NZ"}
				label="Country"
				labelId={generateShortId()}
				mutationId={mutationId}
				preferSelect
				name="telecomCountryIsoCode"
				set={{ values: countries }}
				variant={variant}
			/>
			<StringField
				isReadOnly={isReadOnly}
				id={generateShortId()}
				initialValue={value.replace(/^\+64/, "")}
				label={label}
				labelId={generateShortId()}
				mutationId={mutationId}
				name="lineNumber"
				variant={variant}
			/>
		</div>
	)
}
