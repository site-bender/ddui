import concatenateCssClasses from "."

const classNames = {
	red: true,
	green: false,
	blue: true,
	"burnt-sienna": true,
}

test("[concatenateCssClasses] returns a space-separated string of class names for className keys with truthy values", () => {
	expect(concatenateCssClasses(classNames)).toBe("red blue burnt-sienna")
})

test("[concatenateCssClasses] returns an empty string if argument is undefined", () => {
	expect(concatenateCssClasses()).toBe("")
})
