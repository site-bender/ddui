import type { FormEventHandler } from "react"

export type FieldContext = {
	id?: string
	initialValue: string
	isInvalid?: boolean
	name?: string
	redo?: Array<string>
	undo?: Array<string>
	validate: <T>(v: T) => T
	validation: { isInvalid?: boolean; value: string }
	value: string
	[key: string]: unknown
}

export type FocusState =
	| "BLURRED"
	| "FOCUSED"

export type HoverState =
	| "OUT"
	| "OVER"

export type MaskState =
	| "MASKED"
	| "UNMASKED"

export type MutationState =
	| "CLEAN"
	| "DIRTY"

export type RedoUndoState =
	| "DISABLED"
	| "ENABLED"

export type StatusState =
	| "DISABLED"
	| "ENABLED"
	| "READY"

export type TouchState =
	| "TOUCHED"
	| "UNTOUCHED"

export type FieldState = {
	focus: FocusState
	hover: HoverState
	mask: MaskState
	mutation: MutationState
	redo: RedoUndoState
	status: StatusState
	touch: TouchState
	undo: RedoUndoState
	validity: ErrorState
}

export type FieldStatuses = {
	disabled?: boolean
	focused?: boolean
	hovered?: boolean
	masked?: boolean
	valid?: boolean
}

export type FormContext = {
	errors: { [key: string]: string | Array<string> }
	id?: string
	name?: string
	fields: {
		[key: string]: FormField
	}
	[key: string]: unknown
}

export type FormTransitions = {
	submit: FormEventHandler<HTMLFormElement>
}

export type UseFormReturn = {
	transitions: FormTransitions
	context: FormContext
	state: FormState
}

export type ErrorState =
	| "INVALID"
	| "VALID"

export type EnabledFormEvents =
	| "FORM_AVAILABILITY"
	| "FORM_CHANGE"
	| "FORM_FOCUS"
	| "FORM_FORMAT"
	| "FORM_HOVER"
	| "FORM_MUTATION"
	| "FORM_SUBMISSION"

export type FormEvents =
	| "CHECK_MUTATION"
	| "CHECK_VALIDITY"
	| "DISABLE"
	| "ENABLE"
	| "FAILURE"
	| "SUBMIT"
	| "SUCCESS"
	| "UPDATE"

export type EnabledFormEvent = EnabledFormEvents

export type FailureEvent = {
	type: "FAILURE"
	errors: Array<string>
}

export type FormEvent =
	| { type: Exclude<FormEvents, "FAILURE" | "UPDATE"> }
	| FailureEvent
	| UpdateEvent

export type FormField = {
	context: FieldContext
	state: FieldState
	status: FieldStatuses
}

export type FormState =
	| "DISABLED"
	| { ENABLED: "CLEAN" }
	| { ENABLED: { DIRTY: "VALID" } }
	| { ENABLED: { DIRTY: "INVALID" } }

export type InitialContext = {
	id?: string
	name?: string
	fields?: {
		[key: string]: {
			state: FieldState
			context: FieldContext
			status: FieldStatuses
		}
	}
	[key: string]: unknown
}

export type UpdateEvent = {
	type: "UPDATE"
	field: {
		[fieldId: string]: {
			state: FieldState
			context: FieldContext
			status: FieldStatuses
		}
	}
}

export type UseFormConfig = {
	disabled: boolean
	enabledFormEvents: Array<EnabledFormEvent>
	id: string
	name?: string
	title?: string
}
