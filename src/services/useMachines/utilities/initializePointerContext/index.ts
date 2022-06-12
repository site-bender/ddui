import type { PointerEvent, PointerTracking } from "~services/useMachines/types"

export default function initializePointerContext(pointerTracking: Array<PointerTracking>): PointerEvent {
	return {
		...(pointerTracking.includes("client")
			? {
				clientX: null,
				clientY: null,
			}
			: {}),
		...(pointerTracking.includes("coords")
			? {
				x: null,
				y: null,
			}
			: {}),
		...(pointerTracking.includes("keys")
			? {
				altKey: null,
				ctrlKey: null,
				metaKey: null,
				shiftKey: null,
			}
			: {}),
		...(pointerTracking.includes("layer")
			? {
				layerX: null,
				layerY: null,
			}
			: {}),
		...(pointerTracking.includes("movement")
			? {
				movementX: null,
				movementY: null,
			}
			: {}),
		...(pointerTracking.includes("offset")
			? {
				offsetX: null,
				offsetY: null,
			}
			: {}),
		...(pointerTracking.includes("page")
			? {
				pageX: null,
				pageY: null,
			}
			: {}),
		...(pointerTracking.includes("pen")
			? {
				altitudeAngle: null,
				azimuthAngle: null,
				pressure: null,
				tangentialPressure: null,
				twist: null,
			}
			: {}),
		...(pointerTracking.includes("screen")
			? {
				screenX: null,
				screenY: null,
			}
			: {}),
		...(pointerTracking.includes("tilt")
			? {
				tiltX: null,
				tiltY: null,
			}
			: {}),
		...(pointerTracking.includes("type")
			? {
				composed: null,
				pointerType: null,
			}
			: {}),
	}
}
