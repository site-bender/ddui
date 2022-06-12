export default function TransferDoneIcon({
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
				d="M5 18H19V20H5V18ZM9.6 15.3L5 10.7L7 8.8L9.6 11.4L17 4L19 6L9.6 15.3Z"
				fill={fill}
			/>
		</svg>
	)
}
