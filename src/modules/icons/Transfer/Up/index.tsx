export default function TransferUpIcon({
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
			<path d="M9 16H15V10H19L12 3L5 10H9V16ZM5 18H19V20H5V18Z" fill={fill} />
		</svg>
	)
}
