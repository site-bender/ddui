import StringField from "~getComponent/StringField"
import type { FullNameDatatypeProps } from "~getComponent/types"
import css from "./index.module.css"

export default function FullNameField({
	givenName,
	middleNames,
	familyName,
}: FullNameDatatypeProps): JSX.Element {
	return (
		<div className={css.fullNameField}>
			<StringField {...givenName} />
			{middleNames ? <StringField {...middleNames} /> : null}
			<StringField {...familyName} />
		</div>
	)
}
