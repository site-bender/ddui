import type { ChangeEvent } from "react"
import { useCallback, useState } from "react"
import HelpOrError from "~getComponent/HelpOrError"
import type { Autocomplete, FieldProps } from "~getComponent/types"
import concatenateCssClasses from "~utilities/concatenateCssClasses"
import generateShortId from "~utilities/generateShortId"
import css from "./index.module.css"

export default function ElementField({
	description,
	hideLabel,
	id,
	initialValue,
	isReadOnly = false,
	label = "",
	name,
	preferSelect,
	set = {} as ValueSet,
}: ElementFieldProps): JSX.Element {
	const [current, setCurrent] = useState(initialValue)

	const handleChange = useCallback((value: string) => {
		setCurrent(value)
	}, [setCurrent])

	const options = set.values?.map((value) => ({
		label: Number(value) ? `${value}` : value,
		value,
	}))

	const errors: Array<string> = [] // FIXME

	return (
		<div
			key={id}
			className={concatenateCssClasses({
				[css.elementField]: true,
				// [css.elementFieldDisabled]: status.disabled,
				// [css.elementFieldFocused]: status.focused,
			})}
		>
			{preferSelect
				? fieldAsSelect({ current, handleChange, hideLabel, id, isReadOnly, label, name, options })
				: fieldAsRadioButtons({ current, handleChange, isReadOnly, label, name, options })}
			<HelpOrError errors={errors} description={description} id={`${id}-help-or-error`} />
		</div>
	)
}

function fieldAsRadioButtons (props: ElementProps): JSX.Element {
	const { current = "", handleChange, isReadOnly, label: legend = "", name, options } = props

	function onChange (event: ChangeEvent<HTMLInputElement>) {
		handleChange(event.target.value)
	}

	return (
		<fieldset>
			<legend
				className={concatenateCssClasses({
					// [css.labelError]: not(status.valid),
				})}
			>
				{legend}
			</legend>
			{options?.map(({ label, value }) => (
				<label key={value}>
					<input
						type="radio"
						name={name}
						value={value}
						checked={value === current}
						onChange={onChange}
					/>
					<span></span>
					{label}
				</label>
			))}
		</fieldset>
	)
}

function fieldAsSelect (props: ElementProps): JSX.Element {
	const { current = "", handleChange, hideLabel, id = generateShortId(), isReadOnly, label, name, options } = props

	function onChange (event: ChangeEvent<HTMLSelectElement>) {
		handleChange(event.target.value)
	}

	return (
		<>
			{hideLabel ? undefined : <label htmlFor={id}>{label}</label>}
			<select
				aria-label={label}
				className={css.select}
				defaultValue={current}
				disabled={isReadOnly}
				id={id}
				name={name}
				onChange={onChange}
			>
				{options?.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</>
	)
}

export type ValueSet = {
	values: Array<string>
	mask?: string
}

export type ElementFieldProps = FieldProps & Autocomplete & {
	hideLabel?: boolean
	preferSelect?: boolean
	set: ValueSet
}

export type ElementProps = {
	current?: string
	handleChange: (value: string) => void
	hideLabel?: boolean
	id?: string
	isReadOnly?: boolean
	label?: string
	name: string
	options: Array<{ label: string; value: string }>
}
