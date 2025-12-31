import { router } from "@inertiajs/react"
import { isNumber } from "./format"

function useFormChange(event, data = null) {
  let { name, value, files, type, checked } = event.target

  if (type == 'file') {
    value = files[0]
  }
  if (type == 'checkbox') {
    value = checked ? 1 : 0
  }

  let formInput = { name, value, files, type, checked }
  return filterInputValue(formInput, data)
}

const filterInputValue = (formInput, data) => {
  let { name, value, type } = formInput
  if (value == '') return formInput

  if (['tel'].includes(type) && !isNumber(value)) {
    value = !!data[name] ? data[name] : ''
  }
  if (['tel'].includes(type) && value?.length > 13) {
    value = !!data[name] ? data[name] : value
  }

  return { ...formInput, value }
}

export const handleSelectReload = ({ e, name, setData, params, only = [], onBeforeSetData = null, isHtmlSelect = false }) => {
  let newState = {}
  newState[name] = e?.value ?? ''

  if (!newState[name]) {
    newState[name] = e ?? ''
  }

  if (isHtmlSelect) {
    newState[name] = e?.target?.value ?? ''
  }

  if (!!onBeforeSetData) {
    onBeforeSetData(newState)
  }

  setData((state) => ({ ...state, ...newState }))
  params.set(name, newState[name])

  if (only?.length > 0) {
    router.visit(`?${params.toString()}`, {
      method: 'get',
      only: [...only, 'location'],
      preserveState: true,
      async: false
    })
  }
}

export default useFormChange