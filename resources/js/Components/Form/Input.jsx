import { currency } from "@/utils/format"
import BaseForm from "./BaseForm"

function Input(props) {
  const { name, handleChange, data,  placeHolder = null, ref, disabled = false, formProps={} } = props
  let { type = 'text', label = null, className = 'input', value = null } = props
  let { accept = '*', multiple = false } = props

  if (type == "file") {
    className = "file-input file-input-primary"
  }

  if (!label) {
    label = name.split('_').join(' ')
  }

  let typeList = ['date', 'datetime-local', 'email', 'file', 'number', 'password', 'tel', 'text', 'time', 'url','color']
  let isCurrency = structuredClone(type) == 'currency'
  type = typeList.includes(type) ? type : 'text'

  if (!value) {
    value = isCurrency && disabled ? currency(data[name]) : data[name]
  }

  return (
    <BaseForm {...props}>
      {type == "file" ? (
        <input
          ref={ref}
          type={type}
          className={`w-full border border-gray-300 disabled:border-gray-300 disabled:text-gray-500 ${className}`}
          onChange={handleChange}
          name={name}
          id={name}
          placeholder={placeHolder}
          disabled={disabled}
          accept={accept}
          multiple={multiple}
        />
      ) : (
        <input
          ref={ref}
          type={type}
          className={`w-full border border-gray-300 disabled:border-gray-300 disabled:text-gray-500 ${className}`}
          onChange={handleChange}
          name={name}
          value={value}
          id={name}
          placeholder={placeHolder}
          disabled={disabled}
          {...formProps}
        />

      )}
    </BaseForm>
  )
}

export default Input
