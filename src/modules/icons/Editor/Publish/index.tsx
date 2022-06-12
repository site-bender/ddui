export default function EditorPublishIcon({
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
			<path d="M5 4V6H19V4H5ZM5 14H9V20H15V14H19L12 7L5 14Z" fill={fill} />
		</svg>
	)
}
