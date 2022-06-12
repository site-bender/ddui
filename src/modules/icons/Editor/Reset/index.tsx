export default function EditorResetIcon({
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
			<path d="M6 6H8V18H6V6ZM9.5 12L18 18V6L9.5 12Z" fill={fill} />
		</svg>
	)
}
