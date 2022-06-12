export default function TransferDownIcon({
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
			<path d="M19 9H15V3H9V9H5L12 16L19 9ZM5 18V20H19V18H5Z" fill={fill} />
		</svg>
	)
}
