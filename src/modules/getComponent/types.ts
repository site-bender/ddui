import type {
	CreateMachineParamsConfig,
	FormTransitions,
	MaskStates,
	StateNames,
	Transitions,
	Validation,
} from "~services/useMachines/types"

export type ActionButtonVariants =
	| "DEFAULT"
	| "OUTLINE"
	| "LINK"

export type ActivationState =
	| "ACTIVATED"
	| "DEACTIVATED"

export type AddressComponent = {
	longValue: string
	shortValue: string
	type: AddressComponentType
}

export type AddressComponentType =
	| "BUILDING_NAME"
	| "UNIT_TYPE"
	| "UNIT_IDENTIFIER"
	| "FLOOR"
	| "NUMBER"
	| "STREET"
	| "STREET_TYPE"
	| "STREET_NAME"
	| "SUBURB"
	| "CITY"
	| "STATE"
	| "BOX_TYPE"
	| "BOX_NUMBER"
	| "LOBBY_NAME"
	| "RD_NUMBER"
	| "POST_SUBURB"
	| "MAIL_TOWN"
	| "POSTCODE"
	| "COUNTRY"

export type Autocomplete = {
	autoComplete?: "string"
}

export type ConditionalProps = {
	showWhen?: ActivationState
	topic?: string
}

export type Dataset = {
	[key: string]: string | number | boolean | bigint | undefined
}

export type Datatypes =
	| "ADDRESS_DATATYPE"
	| "ARRAY_DATATYPE"
	| "BOOLEAN_DATATYPE"
	| "CALENDAR_DATATYPE"
	| "DECLARED_RECORD_DATATYPE"
	| "DURATION_DATATYPE"
	| "ELEMENT_DATATYPE"
	| "EMAIL_DATATYPE"
	| "EMPTY_DATATYPE"
	| "FRACTION_DATATYPE"
	| "NAME_DATATYPE"
	| "ID_DATATYPE"
	| "INSTANT_DATATYPE"
	| "INTEGER_DATATYPE"
	| "LIST_DATATYPE"
	| "MAP_DATATYPE"
	| "MAP_DATATYPE"
	| "MONTH_DAY_DATATYPE"
	| "PHONE_DATATYPE"
	| "PLAIN_DATE_DATATYPE"
	| "PLAIN_DATE_TIME_DATATYPE"
	| "PRECISION_DATATYPE"
	| "RADIAN_DATATYPE"
	| "REAL_DATATYPE"
	| "RECORD_DATATYPE"
	| "SET_DATATYPE"
	| "STRING_DATATYPE"
	| "TIMEZONE_DATATYPE"
	| "YEAR_MONTH_DATATYPE"
	| "ZONED_DATE_TIME_DATATYPE"

export type FieldProps = ConditionalProps & MachineProps & ModificationProps & {
	allowDelete?: boolean
	dataset?: Dataset
	description?: string
	enabledEvents?: Array<Transitions>
	errorText?: string
	format?: Record<string, string> | string
	id: string
	initial?: StateNames
	initialMaskState?: MaskStates
	initialValue?: string
	injectInto?: StateNames
	isReadOnly?: boolean
	isRequired?: boolean
	label?: string
	labelId?: string
	mutationId?: string
	name: string
	placeholder?: string
	validate?: (validation: Validation) => Validation
	variant?: FieldVariants
}

export type FieldVariants =
	| "DEFAULT"
	| "DENSE"

export type TypesOfInput =
	| "date"
	| "datetime-local"
	| "email"
	| "hidden"
	| "number"
	| "password"
	| "tel"
	| "text"
	| "time"
	| "url"
	| "week"

export type MachineProps = {
	machine?: Record<string, unknown>
	machineConfig?: CreateMachineParamsConfig
	maskTrigger?: "ON_BLUR" | "ON_FOCUS"
}

export type ModificationProps = {
	mutation?: string
	mutationId?: string
	variables?: Variables
}

export type TypesOfAction =
	| "CREATE_ACTION"
	| "DELETE_ACTION"
	| "FETCH_ACTION"
	| "REDIRECT_ACTION"
	| "TOGGLE_ACTION"
	| "SUBMIT_ACTION"

export type Variables = {
	[key: string]: undefined | boolean | number | string | Variables | Array<Variables>
}

export type TypesOfComponent =
	| Datatypes
	| "ACTION"
	| "COMPOSITE"
	| "CONTENT"
	| "EXTERNAL_LINK"
	| "GROUP"
	| "HELP_OR_ERROR"
	| "IMPORTANT_NOTE"
	| "MUTATION"
	| "SECTION"

export type TypesOfMask = "PERCENT" | "BANK_ACCOUNT" | "PASSWORD"

export type ActionProps = MachineProps & ModificationProps & {
	actionType: TypesOfAction
	buttonVariant?: ActionButtonVariants
	dataset?: Dataset
	id: string
	isReadOnly?: boolean
	label?: string
	mutationId: string
}

export type ActionConfig = ActionProps & {
	readonly datatype: Extract<TypesOfComponent, "ACTION">
}

export type AddressDatatypeProps = FieldProps & Autocomplete & {
	addressComponents: Array<AddressComponent>
	formattedAddress?: string
	isVerified?: boolean
}

export type AddressDatatypeConfig = AddressDatatypeProps & {
	readonly datatype: Extract<TypesOfComponent, "ADDRESS_DATATYPE">
}

export type BooleanDatatypeProps = FieldProps

export type BooleanDatatypeConfig = BooleanDatatypeProps & {
	readonly datatype: Extract<TypesOfComponent, "BOOLEAN_DATATYPE">
}

export type CompositeProps = FieldProps

export type CompositeConfig = CompositeProps & {
	readonly datatype: Extract<TypesOfComponent, "COMPOSITE">
}

export type ContentProps = ConditionalProps & MachineProps & {
	content: string
	id: string
	title?: string
}

export type ContentConfig = ContentProps & {
	readonly datatype: Extract<TypesOfComponent, "CONTENT">
}

export type ElementDatatypeProps = FieldProps & {
	set: {
		values: Array<string | number>
		mask?: TypesOfMask
	}
}

export type ElementDatatypeConfig = ElementDatatypeProps & {
	readonly datatype: Extract<TypesOfComponent, "ELEMENT_DATATYPE">
}

export type EmailDatatypeProps = FieldProps & Autocomplete & {
	isVerified?: boolean
}

export type EmailDatatypeConfig = EmailDatatypeProps & {
	readonly datatype: Extract<TypesOfComponent, "EMAIL_DATATYPE">
	type?: Extract<TypesOfInput, "email">
}

export type ExternalLinkProps = {
	href: string
	id: string
	label: string
	rel?: string
	target?: "_blank" | "_parent" | "_self" | "_top"
}

export type ExternalLinkConfig = ExternalLinkProps & {
	readonly datatype: Extract<TypesOfComponent, "EXTERNAL_LINK">
}

export type FullNameDatatypeProps = {
	givenName: StringDatatypeConfig
	id: string
	middleNames?: StringDatatypeConfig
	familyName: StringDatatypeConfig
}

export type FullNameDatatypeConfig = FullNameDatatypeProps & {
	readonly datatype: Extract<TypesOfComponent, "NAME_DATATYPE">
}

export type GroupProps = ConditionalProps & MachineProps & {
	className?: string
	id: string
	label?: string
	elements: Array<ComponentConfig>
	style?: Record<string, string>
}

export type GroupConfig = GroupProps & {
	readonly datatype: Extract<TypesOfComponent, "GROUP">
	id: string
}

export type HelpOrErrorProps = {
	dataset?: Dataset
	description?: string
	errors?: Array<string>
	id: string
}

export type HelpOrErrorConfig = HelpOrErrorProps & {
	readonly datatype: Extract<TypesOfComponent, "HELP_OR_ERROR">
}

export type ImportantNoteProps = {
	children: JSX.Element | string
	id: string
}

export type ImportantNoteConfig = ImportantNoteProps & {
	readonly datatype: Extract<TypesOfComponent, "IMPORTANT_NOTE">
}

export type MutationProps = ConditionalProps & MachineProps & {
	args: Variables
	buttonText?: string
	elements: Array<ComponentConfig>
	enabledEvents?: Array<FormTransitions>
	id: string
	isReadOnly?: boolean
	label?: string
	mutableVariableNames?: Array<string>
	mutation?: string
	name: string
	url: string
}

export type MutationConfig = MutationProps & {
	readonly datatype: Extract<TypesOfComponent, "MUTATION">
}

export type PhoneDatatypeProps = FieldProps & Autocomplete & {
	telecomCountryIsoCode: string
	telecomVerified?: boolean
	value: string
}

export type PhoneDatatypeConfig = PhoneDatatypeProps & {
	readonly datatype: Extract<TypesOfComponent, "PHONE_DATATYPE">
}

export type SetDatatypeProps = FieldProps

export type SetDatatypeConfig = SetDatatypeProps & {
	readonly datatype: Extract<TypesOfComponent, "SET_DATATYPE">
}

export type StringDatatypeProps = FieldProps & Autocomplete & {
	type?: TypesOfInput
}

export type StringDatatypeConfig = StringDatatypeProps & {
	readonly datatype: Extract<TypesOfComponent, "STRING_DATATYPE">
}

export type ComponentProps =
	| ActionProps
	| AddressDatatypeProps
	| BooleanDatatypeProps
	| CompositeProps
	| ContentProps
	| ElementDatatypeProps
	| EmailDatatypeProps
	| ExternalLinkProps
	| FullNameDatatypeProps
	| GroupProps
	| HelpOrErrorProps
	| ImportantNoteProps
	| MutationProps
	| PhoneDatatypeProps
	| SetDatatypeProps
	| StringDatatypeProps

export type ComponentConfig =
	| ActionConfig
	| AddressDatatypeConfig
	| BooleanDatatypeConfig
	| CompositeConfig
	| ContentConfig
	| ElementDatatypeConfig
	| EmailDatatypeConfig
	| ExternalLinkConfig
	| FullNameDatatypeConfig
	| GroupConfig
	| HelpOrErrorConfig
	| ImportantNoteConfig
	| MutationConfig
	| PhoneDatatypeConfig
	| SetDatatypeConfig
	| StringDatatypeConfig
