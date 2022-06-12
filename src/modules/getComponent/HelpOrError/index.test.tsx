import { render } from "~setup/testUtils"
import HelpOrError from "./"

test("[HelpOrError] returns null if no help or error provided", () => {
	render(<HelpOrError id="id" />)
})
