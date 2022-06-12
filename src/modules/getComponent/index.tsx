import Action from "~getComponent/Action"
import Content from "~getComponent/Content"
import ElementField from "~getComponent/ElementField"
import ExternalLink from "~getComponent/ExternalLink"
import FullNameField from "~getComponent/FullNameField"
import Group from "~getComponent/Group"
import ImportantNote from "~getComponent/ImportantNote"
import Mutation from "~getComponent/Mutation"
import PhoneField from "~getComponent/PhoneField"
import StringField from "~getComponent/StringField"
import type { ComponentConfig, TypesOfComponent } from "~getComponent/types"

export default function getComponent(component: ComponentConfig): JSX.Element | null {
	const { datatype, ...props } = component
	const Component = components[datatype as TypesOfComponent] as () => JSX.Element

	return Component ? <Component key={props.id} {...props} /> : null
}

const components: Partial<Record<TypesOfComponent, unknown>> = {
	ACTION: Action,
	CONTENT: Content,
	ELEMENT_DATATYPE: ElementField,
	EMAIL_DATATYPE: StringField,
	EXTERNAL_LINK: ExternalLink,
	NAME_DATATYPE: FullNameField,
	GROUP: Group,
	IMPORTANT_NOTE: ImportantNote,
	MUTATION: Mutation,
	PHONE_DATATYPE: PhoneField,
	STRING_DATATYPE: StringField,
}
