import noOp from "./"

test("[noOp] returns undefined regardless of input", () => {
	expect(noOp()).toBeUndefined()
	expect(noOp(666)).toBeUndefined()
	expect(noOp("bobs yer uncle")).toBeUndefined()
	expect(noOp({ red: "blue" })).toBeUndefined()
})
