export default function ArrowSouthWestIcon({
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
			<path d="M15 19V17H8.41L20 5.41L18.59 4L7 15.59V9H5V19H15Z" fill={fill} />
		</svg>
	)
}
