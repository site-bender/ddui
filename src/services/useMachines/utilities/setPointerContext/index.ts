import type { PointerEvent } from "~services/useMachines/types"

export default function setPointerContext(pointer: PointerEvent, event: PointerEvent): PointerEvent {
	return Object.keys(pointer).reduce((acc, key) => {
		return {
			...acc,
			...(Object.keys(event).includes(key)
				? {
					[key]: event[key as keyof PointerEvent],
				}
				: {}),
		}
	}, {})
}
