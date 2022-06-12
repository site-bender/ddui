export default function EditorSendIcon({
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
			<path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill={fill} />
		</svg>
	)
}
