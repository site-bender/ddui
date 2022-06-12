import type { StateNames, Transitions } from "~services/useMachines/types"
import makeMutationMachineConfiguration from "./"

test("[makeMutationMachineConfiguration] creates a field machine config", () => {
	const input = {
		enabledEvents: ["ENABLE"] as Array<Transitions>,
		initial: "disabled" as StateNames,
		isReadOnly: true,
		label: "my mutation",
		mutationId: "mutation-id",
		name: "myMutation",
	}

	expect(makeMutationMachineConfiguration(input)).toMatchObject({
		NESTED: {
			enabledEvents: [
				"ENABLE",
			],
			topic: "mutation-id",
			injectInto: "enabled",
			child: {
				FORM: {
					id: "mutation-id",
					isReadOnly: true,
					label: "my mutation",
					name: "myMutation",
				},
			},
			parent: {
				OPERATION: {
					initial: "disabled",
				},
			},
		},
	})
})

test("[makeMutationMachineConfiguration] creates a disabled field machine config", () => {
	const input = {
		enabledEvents: ["DISABLE"] as Array<Transitions>,
		isReadOnly: false,
		label: "my mutation",
		mutationId: "mutation-id",
		name: "myMutation",
	}

	expect(makeMutationMachineConfiguration(input)).toMatchObject({
		NESTED: {
			enabledEvents: [
				"DISABLE",
			],
			topic: "mutation-id",
			injectInto: "enabled",
			child: {
				FORM: {
					id: "mutation-id",
					isReadOnly: false,
					label: "my mutation",
					name: "myMutation",
				},
			},
			parent: {
				OPERATION: {
					initial: "enabled",
				},
			},
		},
	})
})
