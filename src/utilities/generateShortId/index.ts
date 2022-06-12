import { v4 } from "uuid"

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
const len = BigInt(BASE58.length)

function convertToBase58 (bigInt: bigint, out = ""): string {
	return bigInt > 0
		? convertToBase58(
			bigInt / len,
			BASE58[parseInt((bigInt % len).toString(), 10)] + out,
		)
		: out
}

function encode (uuid: string): string {
	const bigInt = BigInt("0x" + uuid.replace(/-/g, ""))

	return convertToBase58(bigInt)
}

export default function generateShortId(): string {
	return encode(v4())
}
