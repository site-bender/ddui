import { useCallback, useEffect, useState } from "react"

export default function useRoute(): {
	hash: string
	path: Array<string>
	route: URL
} {
	const [route, setRoute] = useState<URL>(new URL(self.location.href))

	const updateRoute = useCallback(
		() => setRoute(new URL(self.location.href)),
		[],
	)

	useEffect(() => {
		self.addEventListener("hashchange", updateRoute, false)

		updateRoute()
	}, [updateRoute])

	return {
		hash: route.hash,
		path: route.hash.replace(/^#\//, "").split("/"),
		route,
	}
}
