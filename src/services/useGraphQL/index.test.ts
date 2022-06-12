import { rest } from "msw"
import { setupServer } from "msw/node"
import useGraphQL from "./"

const MOCKED_URL = "http://mock.example.net:8080/foo"

const server = setupServer(
	rest.post(MOCKED_URL, (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json(req.body),
		)
	}),
)

type ReturnValue = {
	operationName: string
	query?: string
	mutation?: string
	variables: {
		[key: string]: string
	}
}

test("[useGraphQL] query makes the correct request", async function() {
	const { query } = useGraphQL(MOCKED_URL)
	const operationName = "TestQuery"
	const testQuery = `query TestQuery($id: String!) {
		testQuery(id: $id) {
			id
			name
		}
	}`
	const variables = { id: "ID" }

	server.listen()

	const json = await query(
		operationName,
		testQuery,
		variables,
	) as ReturnValue

	expect(json.operationName).toBe(operationName)
	expect(json.query).toBe(testQuery)
	expect(json.variables).toEqual(variables)

	server.resetHandlers()
	server.close()
})

test("[useGraphQL] mutation makes the correct request", async function() {
	const { mutate } = useGraphQL(MOCKED_URL)
	const operationName = "TestMutation"
	const testMutation = `mutation TestMutation($id: String!) {
		testMutation(id: $id) {
			id
			name
		}
	}`
	const variables = { id: "ID" }

	server.listen()

	const json = await mutate(
		operationName,
		testMutation,
		variables,
	) as ReturnValue

	expect(json.operationName).toBe(operationName)
	expect(json.query).toEqual(testMutation)
	expect(json.variables).toEqual(variables)

	server.resetHandlers()
	server.close()
})
