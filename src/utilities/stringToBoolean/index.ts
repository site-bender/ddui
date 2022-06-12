export default function stringToBoolean(s: string): boolean {
	return s.toLocaleLowerCase() === "true" || false
}
