import type { CreateMachineParamsConfig, StateNames, Validation } from "~services/useMachines/types"
import makeStringFieldConfiguration from "./"

test("[makeStringFieldConfiguration] returns a passed machineConfig", () => {
	const id = "machine-id"
	const machineConfig: CreateMachineParamsConfig = {
		TOGGLE: {},
	}
	const name = "machine"

	expect(makeStringFieldConfiguration({ id, machineConfig, name })).toMatchObject(machineConfig)
})

test("[makeStringFieldConfiguration] creates a field machine config", () => {
	const initial: StateNames = "enabled"
	const input = {
		enabledEvents: [],
		id: "id",
		initial,
		initialValue: "sam",
		isReadOnly: false,
		isRequired: false,
		label: "my field",
		mutationId: "mutation-id",
		name: "myField",
		validate: (validation: Validation) => validation,
	}

	expect(makeStringFieldConfiguration(input)).toMatchObject({
		"NESTED": {
			"enabledEvents": [],
			"topic": "mutation-id",
			"injectInto": "enabled",
			"child": {
				"PARALLEL": {
					"children": {
						"FOCUS": {
							"id": "focusMachineId",
						},
						"MASK": {
							"id": "maskMachineId",
							"initial": "masked",
							"maskTrigger": "ON_BLUR",
						},
						"TOUCH": {
							"id": "touchMachineId",
						},
						"INPUT": {
							"label": "my field",
							"initialValue": "sam",
							"name": "myField",
						},
					},
				},
			},
			"parent": {
				"OPERATION": {
					"initial": "enabled",
				},
			},
		},
	})
})

test("[makeStringFieldConfiguration] creates a disabled field machine config", () => {
	const initial: StateNames = "disabled"
	const input = {
		enabledEvents: [],
		errorText: "my bad",
		mutationId: "mutation-id",
		id: "id",
		initial,
		initialValue: "sam",
		isReadOnly: true,
		isRequired: true,
		label: "my field",
		name: "myField",
		validate: (validation: Validation) => validation,
	}

	expect(makeStringFieldConfiguration(input)).toMatchObject({
		"NESTED": {
			"enabledEvents": [],
			"topic": "mutation-id",
			"injectInto": "enabled",
			"child": {
				"PARALLEL": {
					"children": {
						"FOCUS": {
							"id": "focusMachineId",
						},
						"MASK": {
							"id": "maskMachineId",
							"initial": "masked",
							"maskTrigger": "ON_BLUR",
						},
						"TOUCH": {
							"id": "touchMachineId",
						},
						"INPUT": {
							"errorText": "my bad",
							"label": "my field",
							"initialValue": "sam",
							"name": "myField",
						},
					},
				},
			},
			"parent": {
				"OPERATION": {
					"initial": "disabled",
				},
			},
		},
	})
})
