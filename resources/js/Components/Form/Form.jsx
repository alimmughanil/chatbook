import Input from './Input'
import Select from './Select'
import Checkbox from './Checkbox'
import TextArea from './TextArea'
import FileUploaderInput from './FileUploaderInput'
import DatePicker from './DatePicker'
import Rating from './Rating'

const Form = ({ index = null, property, inputProps }) => {
  const formProps = { ...inputProps, ...property.props, }

  const availableComponent = {
    input: Input,
    rating: Rating,
    select: Select,
    checkbox: Checkbox,
    textarea: TextArea,
    FileUploader: FileUploaderInput,
    DatePicker: DatePicker,
  }

  if (formProps?.isReactSelect && !formProps.defaultValue) {
    let selectedIndex = null;
    if (formProps.options?.length > 0) {
      selectedIndex = formProps?.data[formProps.name] ? formProps.options?.findIndex((option) => option.value == formProps?.data[formProps.name]) : null
    }
    if (selectedIndex >= 0) {
      formProps.defaultValue = formProps.options[selectedIndex]
    }
  }

  if (property.form == "select" && !formProps?.isReactSelect && !formProps.defaultValue) {
    formProps.defaultValue = formProps?.data[formProps.name]
  }

  const SelectedComponent = availableComponent[property.form]

  if (SelectedComponent) {
    return <SelectedComponent key={index} index={index} {...formProps} />
  }
}

export default Form
