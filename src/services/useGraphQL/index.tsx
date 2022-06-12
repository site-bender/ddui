import fetch from "cross-fetch"
import not from "~utilities/not"

export default function useGraphQL<T,>(url: string): GraphQLService<T> {
	if (not(url)) {
		return {} as GraphQLService<T>
	}

	return {
		mutate: makeMutate(url),
		query: makeQuery(url),
	}
}

function makeQuery<T> (url: string) {
	return async function query(
		operationName: string,
		query: string,
		variables: Variables,
	): Promise<T> {
		const response = await fetch(url, {
			method: "POST",
			body: JSON.stringify({
				operationName,
				query,
				variables,
			}),
			headers: {
				Accept: "*/*",
				"Content-Type": "application/json",
			},
		})

		return await response.json()
	}
}

function makeMutate<T> (url: string) {
	return makeQuery<T>(url)
}

export type GraphQLService<T> = {
	query: (
		operationName: string,
		query: string,
		variables: Variables,
	) => Promise<T>
	mutate: (
		operationName: string,
		query: string,
		variables: Variables,
	) => Promise<T>
}

export type Variables = {
	[key: string]: undefined | boolean | number | string | Variables | Array<Variables>
}
