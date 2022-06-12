export default function ArrowWestIcon({
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
				d="M9 19L10.41 17.59L5.83 13H22V11H5.83L10.42 6.41L9 5L2 12L9 19Z"
				fill={fill}
			/>
		</svg>
	)
}
