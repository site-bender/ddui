import unique from "./"

const nums = [1, 2, 3, 4, 5]
const strings = ["bob", "ted", "carol", "alice"]

test("[unique] returns the unique members of an array", () => {
	expect(unique([
		...nums,
		...nums,
		...nums,
	])).toEqual(nums)
})

test("[unique] returns the unique members of a mixed array", () => {
	expect(unique([
		...nums,
		...strings,
		...nums,
		...strings,
		...nums,
	])).toEqual([...nums, ...strings])
})
