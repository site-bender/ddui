import type { HelpOrErrorProps } from "~getComponent/types"
import makeDataAttributes from "../utilities/makeDataAttributes"
import css from "./index.module.css"

export default function HelpOrError({
	dataset,
	errors = [],
	description,
}: HelpOrErrorProps): JSX.Element | null {
	if (errors.length) {
		return (
			<output className={css.errorText} {...makeDataAttributes(dataset)} role="alert">
				{formatter.format(errors)}
			</output>
		)
	}

	if (description) {
		return <output className={css.description} {...makeDataAttributes(dataset)} role="note">{description}</output>
	}

	return null
}

declare namespace Intl {
	type ListFormatOptions = { style: string; type: string }
	class ListFormat {
		constructor(locales?: string | string[], options?: Intl.ListFormatOptions)
		public format: (items: string[]) => string
	}
}

const formatter = new Intl.ListFormat("en", { style: "long", type: "conjunction" })
