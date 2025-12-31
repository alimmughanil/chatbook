import { useEffect } from "react"
import BaseForm from "./BaseForm"

const MultipleInput = (props) => {
  const { children, form, setForm, setData, name, baseForm } = props

  const handleClick = (type) => {
    if (type == 'decrease') {
      form.length == 1 ? null : setForm(form.slice(0, -1))
      return
    }

    setForm((state) => ([
      ...state, baseForm
    ]))
  }

  useEffect(() => {
    if (form) {
      const filteredData = form.filter((form) => form.value != '')
      if (filteredData.length > 0) {
        setData((state) => ({
          ...state,
          [name]: JSON.stringify(filteredData)
        }))
      }
    }

    return () => { }
  }, [form])

  return (
    <BaseForm {...props}>
      {children}
      <div className="mx-auto mt-2">
        <OtherInputButton onClickIncrease={() => handleClick('increase')} onClickDecrease={() => handleClick('decrease')} />
      </div>
    </BaseForm>
  )
}

export const BaseMultipleInput = (props) => {
  const { children, form, setForm, baseForm } = props

  const handleClick = (type) => {
    if (type == 'decrease') {
      form.length == 1 ? null : setForm(form.slice(0, -1))
      return
    }

    setForm((state) => ([
      ...state, baseForm
    ]))
  }

  return (
    <BaseForm {...props}>
      {children}
      <div className="mx-auto mt-2">
        <OtherInputButton onClickIncrease={() => handleClick('increase')} onClickDecrease={() => handleClick('decrease')} />
      </div>
    </BaseForm>
  )
}

const OtherInputButton = ({ onClickIncrease, onClickDecrease }) => {
  return (
    <div className="flex gap-2 items-center">
      <button type="button" onClick={onClickDecrease} className="btn btn-circle btn-xs btn-outline">
        <i className="fas fa-minus"></i>
      </button>
      <button type="button" onClick={onClickIncrease} className="btn btn-circle btn-xs btn-outline">
        <i className="fas fa-plus"></i>
      </button>
    </div>
  )
}

export default MultipleInput