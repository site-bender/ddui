import { useEffect, useMemo, useState } from "react"
import getComponent from "~getComponent/index"
import type { ComponentConfig, MutationProps } from "~getComponent/types"
import { subscribe, subscribeToAllTopics, unsubscribe } from "~services/pubsub"
import type { PubSubEvent } from "~services/pubsub/types"
import useGraphQL from "~services/useGraphQL"
import type { Variables } from "~services/useGraphQL"
import useMachines from "~services/useMachines"
import type { FormMachineContext } from "~services/useMachines/types"
import type { CreateMachineParamsConfig, Fields } from "~services/useMachines/types"
import Action from "../Action"
import makeMutationConfiguration from "../state/makeMutationConfiguration"
import css from "./index.module.css"

export default function Mutation(props: MutationProps): JSX.Element | null {
	const {
		args,
		buttonText = "Update",
		elements,
		enabledEvents,
		id,
		isReadOnly,
		label,
		machineConfig,
		mutableVariableNames = [],
		mutation,
		name,
		url = "http://example.com/",
	} = props
	const { mutate } = useGraphQL(url)
	const [subscribed, setSubscribed] = useState(false)

	const config: CreateMachineParamsConfig = useMemo(
		() => (machineConfig as CreateMachineParamsConfig ?? makeMutationConfiguration({
			enabledEvents,
			isReadOnly,
			label,
			mutationId: props.id,
			name,
		})),
		[],
	)

	const { actions, context, status } = useMachines(config)
	useEffect(() => {
		subscribe(id, (event: PubSubEvent) => {
			if (["INPUT_INITIALIZE", "INPUT_UPDATE"].includes(event.eventName) && event.data?.name) {
				actions?.formUpdate?.({
					[event.data.name as string]: event.data as Fields,
				})
			}

			if (event.eventName === "SUBMIT_ACTION") {
				const variables = mutableVariableNames.reduce((out, name) => {
					return {
						...out,
						[name]: ((context as FormMachineContext).fields?.[name].value as string),
					} as Variables
				}, args)
				mutate(name, mutation as string, variables)
				actions.formSubmit?.()
			}
		}, {
			topic: id,
		})

		setSubscribed(true)

		return () => {
			unsubscribe(id)
		}
	}, [
		args,
		context,
		setSubscribed,
		subscribe,
		unsubscribe,
	])

	const form = (
		<>
			<form id={id}></form>
			{elements?.map((component: ComponentConfig) => getComponent(component))}
			{isReadOnly ? null : (
				<Action
					actionType="SUBMIT_ACTION"
					id={`${id}-submit-button`}
					mutationId={id}
					label={buttonText}
				/>
			)}
		</>
	)

	const output = label
		? (
			<section className={css.mutation}>
				<h3>{label}</h3>
				{form}
			</section>
		)
		: (
			<div className={css.mutation}>
				{form}
			</div>
		)

	return subscribed ? output : null
}
