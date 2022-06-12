import { subscribe } from "../"

test("[subscribe] returns an error when not given the correct params", () => {
	/* eslint-disable @typescript-eslint/ban-ts-comment */
	// @ts-ignore: for testing purposes
	const err = subscribe() as Error
	/* eslint-enable @typescript-eslint/ban-ts-comment */

	expect(err).toBeInstanceOf(Error)
	expect(err.message).toBe(
		"Must provide a token, callback, and topic to subscribe.",
	)
})
