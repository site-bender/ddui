export default function ArrowSouthEastIcon({
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
			<path d="M19 9H17V15.59L5.41 4L4 5.41L15.59 17H9V19H19V9Z" fill={fill} />
		</svg>
	)
}
