export default function EditorEditIcon({
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
				d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM21.41 6.34L17.66 2.59L15.13 5.13L18.88 8.88L21.41 6.34Z"
				fill={fill}
			/>
		</svg>
	)
}
