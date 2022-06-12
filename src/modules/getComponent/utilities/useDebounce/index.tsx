import { useEffect, useState } from "react"

export default function useDebounce<T,>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value as T)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])

	return debouncedValue
}
