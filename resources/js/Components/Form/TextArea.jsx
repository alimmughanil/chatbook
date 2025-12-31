import TextEditor from "../TextEditor"
import BaseForm from "./BaseForm"

function TextArea(props) {
  const { required = false, noLabel = false, isTextEditor = false, name, data, handleChange = null, placeHolder = '', editorRef = null, setData = null} = props
  const { column = null, disabled = false, heightClassName = "h-24"} = props
  let { label = null, isLabel = true } = props

  if (!label && !noLabel) {
    label = name.split('_').join(' ')
  }

  if (noLabel) {
    isLabel = false
  }

  return (
    <BaseForm {...props}>
      {isTextEditor ? (
        <TextEditor setData={setData} data={data} editorRef={editorRef} column={column ?? name} disabled={disabled} {...props} />
      ) : (
        <textarea
          className={`w-full border border-gray-300 textarea disabled:border-gray-300 focus:outline-none focus:border-black  ${heightClassName}`}
          onChange={handleChange}
          name={name}
          id={name}
          value={data[name]}
          placeholder={placeHolder}
          required={required}
          disabled={disabled}
        ></textarea>
      )}
    </BaseForm>
  )
}

export default TextArea
