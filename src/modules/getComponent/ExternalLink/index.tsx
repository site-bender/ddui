import type { ExternalLinkProps } from "~getComponent/types"
import css from "./index.module.css"

export default function ExternalLink({ href, id, label, rel, target }: ExternalLinkProps): JSX.Element {
	return <a className={css.externalLink} href={href} id={id} rel={rel} target={target}>{label}</a>
}
