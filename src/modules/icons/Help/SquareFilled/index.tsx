export default function HelpSquareFilledIcon({
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
				d="M21 3H3V21H21V3ZM12.01 18C11.31 18 10.75 17.44 10.75 16.74C10.75 16.03 11.31 15.49 12.01 15.49C12.72 15.49 13.26 16.03 13.26 16.74C13.25 17.43 12.72 18 12.01 18ZM15.02 10.6C14.26 11.71 13.54 12.06 13.15 12.77C12.99 13.06 12.93 13.25 12.93 14.18H11.11C11.11 13.69 11.03 12.89 11.42 12.2C11.91 11.33 12.84 10.81 13.38 10.04C13.95 9.23 13.63 7.71 12.01 7.71C10.95 7.71 10.43 8.51 10.21 9.19L8.56 8.49C9.01 7.15 10.22 6 11.99 6C13.47 6 14.48 6.67 15 7.52C15.44 8.24 15.7 9.59 15.02 10.6Z"
				fill={fill}
			/>
		</svg>
	)
}
