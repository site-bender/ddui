import type { ContentProps } from "~getComponent/types"
import css from "./index.module.css"

export default function Content({ content, id, showWhen, title }: ContentProps): JSX.Element | null {
	return showWhen === "DEACTIVATED" ? null : (
		<div
			className={css.content}
			dangerouslySetInnerHTML={{ __html: content }}
			id={id}
			title={title}
		/>
	)
}
