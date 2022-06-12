export default function CheckboxUncheckedIcon({
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
			<path d="M19 5V19H5V5H19ZM21 3H3V21H21V3Z" fill={fill} />
		</svg>
	)
}
