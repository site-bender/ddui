export default function ChevronUpIcon({
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
				d="M12 8L6 14L7.41 15.41L12 10.83L16.59 15.41L18 14L12 8Z"
				fill={fill}
			/>
		</svg>
	)
}
