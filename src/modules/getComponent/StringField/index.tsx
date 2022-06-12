import { useEffect, useMemo } from "react"
import HelpOrError from "~getComponent/HelpOrError"
import makeStringFieldConfiguration from "~getComponent/state/makeFieldConfiguration/makeStringFieldConfiguration"
import type { StringDatatypeProps } from "~getComponent/types"
import { publish } from "~services/pubsub"
import useMachines from "~services/useMachines"
import type { CreateMachineParamsConfig } from "~services/useMachines/types"
import concatenateCssClasses from "~utilities/concatenateCssClasses"
import generateShortId from "~utilities/generateShortId"
import makeDataAttributes from "../utilities/makeDataAttributes"
import css from "./index.module.css"

export default function StringField(props: StringDatatypeProps): JSX.Element {
	const {
		autoComplete,
		dataset = {},
		mutationId,
		description,
		label,
		id,
		isReadOnly,
		labelId = generateShortId(),
		machineConfig,
		name,
		type = "text",
		variant,
	} = props

	const config: CreateMachineParamsConfig = useMemo(
		() => (machineConfig as CreateMachineParamsConfig ?? makeStringFieldConfiguration(props)),
		[],
	)

	useEffect(() => {
		const { enabledEvents, topic, ...data } = context

		publish({
			eventName: "INPUT_INITIALIZE",
			data: data as { [key: string]: unknown },
		}, { topic: mutationId })
	}, [publish])

	const { actions, context, status } = useMachines(config)

	return (
		<div
			key={id}
			{...makeDataAttributes(dataset)}
			className={concatenateCssClasses({
				[css.stringField]: true,
				[css.stringFieldDisabled]: status.disabled?.(),
				[css.stringFieldFocused]: status.focused?.(),
			})}
		>
			<label
				htmlFor={id}
				id={labelId}
				className={concatenateCssClasses({
					[css.labelError]: status.inputInvalid?.(),
				})}
				onClick={actions?.disable}
			>
				{label}
			</label>
			<input
				aria-labelledby={labelId}
				autoComplete={autoComplete}
				className={concatenateCssClasses({
					[css.inputError]: status.inputInvalid?.(),
					[css.inputDense]: variant === "DENSE",
				})}
				disabled={isReadOnly || status.disabled?.()}
				form={mutationId}
				id={id}
				name={name}
				onBlur={actions?.blur}
				onInput={function(event: React.ChangeEvent<HTMLInputElement>) {
					actions?.inputUpdate?.((event.currentTarget as HTMLInputElement).value)
				}}
				onFocus={actions?.focus}
				type={type}
				value={(context as Record<string, unknown>).value as string || ""}
			/>
			<HelpOrError
				errors={context.errors as Array<string>}
				description={description}
				id={`${id}-help-or-error`}
			/>
		</div>
	)
}
