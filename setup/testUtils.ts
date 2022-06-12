import { render } from "@testing-library/react"

const customRender = (ui: JSX.Element, options = {}) =>
	render(ui, {
		// wrap provider(s) here if needed
		wrapper: ({ children }) => children,
		...options,
	})

export * from "@testing-library/jest-dom"
export * from "@testing-library/react"
// export { default as userEvent } from "@testing-library/user-event" FIXME: doesn't seem to work
export { customRender as render }
