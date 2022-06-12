export default function ArrowNorthEastIcon({
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
			<path d="M9 5V7H15.59L4 18.59L5.41 20L17 8.41V15H19V5H9Z" fill={fill} />
		</svg>
	)
}
