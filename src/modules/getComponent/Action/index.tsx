import { useCallback } from "react"
import type { ActionProps } from "~getComponent/types"
import { publish } from "~services/pubsub"
import concatenateCssClasses from "~utilities/concatenateCssClasses"
import generateShortId from "~utilities/generateShortId"
import snakeCaseToSentenceCase from "~utilities/snakeCaseToSentenceCase"
import makeDataAttributes from "../utilities/makeDataAttributes"
import css from "./index.module.css"

export default function Action({
	actionType = "SUBMIT_ACTION",
	dataset = {},
	id = generateShortId(),
	isReadOnly,
	label,
	machineConfig,
	mutationId,
	buttonVariant = "DEFAULT",
	...props
}: ActionProps): JSX.Element {
	const handleClick = useCallback(() =>
		publish({
			eventName: actionType,
			data: {
				id,
			},
		}, { topic: mutationId }), [])

	return (
		<button
			className={concatenateCssClasses({
				[css.button]: true,
				[css.outline]: buttonVariant === "OUTLINE",
				[css.link]: buttonVariant === "LINK",
				[css.primary]: ["TRIGGER_ACTION", "SUBMIT_ACTION"].includes(actionType),
				[css.secondary]: actionType === "SUBMIT_ACTION" || actionType === "REDIRECT_ACTION",
				[css.danger]: ["DELETE_ACTION"].includes(actionType),
			})}
			{...makeDataAttributes(dataset)}
			disabled={isReadOnly}
			form={mutationId}
			id={id}
			onClick={handleClick}
			type="button"
		>
			{label || snakeCaseToSentenceCase(actionType)}
		</button>
	)
}
