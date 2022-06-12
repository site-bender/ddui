export default function AddSquareFilledIcon({
	fill = "#323232",
	height = 24,
	unfill = "none",
	width = 24,
}: IconProps): JSX.Element {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 24 24"
			fill={unfill}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M21 3H3V21H21V3ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z"
				fill={fill}
			/>
		</svg>
	)
}
