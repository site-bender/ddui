export default function ArrowNorthIcon({
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
				d="M5 9L6.41 10.41L11 5.83V22H13V5.83L17.59 10.42L19 9L12 2L5 9Z"
				fill={fill}
			/>
		</svg>
	)
}
