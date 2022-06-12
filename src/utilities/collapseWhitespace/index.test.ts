import collapseWhitespace from "./"

const text = `<p>
	Joe
					from		Chicago
		and
	his

	mob.!?;
</p>`

test("[collapseWhitespace] collapses the whitespace in a string", () => {
	expect(collapseWhitespace(text)).toBe("<p> Joe from Chicago and his mob.!?; </p>")
})

test("[collapseWhitespace] returns an empty string for undefined", () => {
	expect(collapseWhitespace()).toBe("")
})
