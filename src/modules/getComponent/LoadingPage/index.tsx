import Loading from "~icons/Loading"
import Logo from "~icons/Logo"
import css from "./index.module.css"

export default function LoadingPage({ message }: LoadingProps): JSX.Element {
	return (
		<div className={css.loading}>
			<Loading />
			<Logo />
			{message ? <p>{message}</p> : undefined}
		</div>
	)
}

export type LoadingProps = {
	message?: string
}
