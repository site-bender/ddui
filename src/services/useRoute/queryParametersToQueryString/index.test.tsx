import queryParametersToQueryString from "."

test("[queryParametersToQueryString] converts query params to a string", () => {
	expect(
		queryParametersToQueryString({
			color: "blue",
			object: "sky",
			distance: "12",
			clear: "true",
		}),
	).toBe("color=blue&object=sky&distance=12&clear=true")
})
