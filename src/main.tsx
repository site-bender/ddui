import "@formatjs/intl-listformat/locale-data/en"
import "@formatjs/intl-listformat/polyfill"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import "./reset.css"

const container = document.getElementById("root")

if (!container) {
	throw new Error("Failed to find the root element.")
}

const root = ReactDOM.createRoot(container)

root.render(
	<StrictMode>
		<div>Hi, there!</div>
	</StrictMode>,
)
