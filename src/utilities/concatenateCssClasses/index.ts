// Either wrap non-boolean input values in Boolean() or consider setting the value below to `unknown`
export default function concatenateCssClasses(classNames: {
	[className: string]: boolean | undefined
} = {}): string {
	return Object.entries(classNames)
		.reduce(
			(classList: Array<string>, [className, include]) => [...classList, ...(include ? [className] : [])],
			[],
		)
		.join(" ")
}
