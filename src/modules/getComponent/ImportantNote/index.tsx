import type { ImportantNoteProps } from "~getComponent/types"
import css from "./index.module.css"

export default function ImportantNote({
	children,
}: ImportantNoteProps): JSX.Element {
	return (
		<div className={css.importantNote} role="note" aria-label="Important note">
			<header>Important note:</header>
			{typeof children === "string" ? <p>{children}</p> : children}
		</div>
	)
}
