import getComponent from "~getComponent/index"
import type { GroupProps } from "~getComponent/types"
import css from "./index.module.css"

export default function Group(props: GroupProps): JSX.Element {
	return props.label
		? (
			<section className={css.section}>
				<h3>{props.label}</h3>
				{props.elements.map((component) => getComponent(component))}
			</section>
		)
		: (
			<div>
				{props.elements.map((component) => getComponent(component))}
			</div>
		)
}
