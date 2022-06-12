export default function EditorRedoIcon({
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
				d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8C6.85004 8 2.92004 11.03 1.54004 15.22L3.90004 16C4.95004 12.81 7.95004 10.5 11.5 10.5C13.45 10.5 15.23 11.22 16.62 12.38L13 16H22V7L18.4 10.6Z"
				fill={fill}
			/>
		</svg>
	)
}
