export default function EditorSaveIcon({
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
				d="M17 3H3V21H21V7L17 3ZM12 19C10.34 19 9 17.66 9 16C9 14.34 10.34 13 12 13C13.66 13 15 14.34 15 16C15 17.66 13.66 19 12 19ZM15 9H5V5H15V9Z"
				fill={fill}
			/>
		</svg>
	)
}
