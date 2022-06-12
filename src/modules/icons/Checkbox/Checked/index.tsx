export default function CheckboxCheckedIcon({
	fill = "#323232",
	height = 24,
	unfill = "none",
	width = 24,
}: IconProps): JSX.Element {
	return (
		<svg
			fill={unfill}
			height={height}
			viewBox="0 0 24 24"
			width={width}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M21 3H3V21H21V3ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
				fill={fill}
			/>
		</svg>
	)
}
