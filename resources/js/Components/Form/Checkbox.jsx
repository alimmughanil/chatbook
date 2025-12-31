import BaseForm from "./BaseForm"

function Checkbox(props) {
  const { name, handleChange, data, errors, alt = null, isLabel = true, ref, disabled = false, readOnly = false, defaultChecked = false } = props
  let { checked = false, label = null, className = 'checkbox', labelClassName = 'label-text capitalize ' } = props

  if (!label) {
    label = name.split('_').join(' ')
  }

  if (data[name] || data[name] == 1) {
    checked = true
  }

  return (
    <BaseForm {...props} isLabel={false}>
      <label className="label cursor-pointer w-max gap-2">
        <input
          ref={ref}
          type={'checkbox'}
          className={`${className}`}
          onChange={handleChange}
          name={name}
          id={name}
          disabled={disabled}
          // defaultChecked={defaultChecked}
          readOnly={readOnly}
          checked={checked}
        />
        {isLabel && (
          <span className={labelClassName}>{label}</span>
        )}
      </label>
    </BaseForm>
  )
}

export default Checkbox