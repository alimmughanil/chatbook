import Input from '@/Components/Form/Input'
import { useForm, usePage } from '@inertiajs/react'
import TextArea from '@/Components/Form/TextArea'
import useLang from '@/utils/useLang'
import { useEffect } from 'react'
import MultipleInput from '@/Components/Form/MultipleInput'
import Select from '@/Components/Form/Select'
import { useAtomValue, useSetAtom } from 'jotai'
import { configSelectOptionAtom } from '@/atoms'
import { FormProperty } from '@/Components/FormBuilder'

function ConfigurationForm(state) {
  const { configuration = null, type = null, setData: setParentData, index, typeIndex, inputType = null } = state
  const { props } = usePage()

  const selected = useAtomValue(configSelectOptionAtom)

  const { data, setData, errors, setError } = useForm({
    id: configuration?.id ?? null,
    type: configuration?.type ?? '',
    value: configuration?.value ?? '',
    status: configuration?.status ?? props.status[0],
    description: configuration?.description ?? '',
    is_active: configuration?.status == 'active',
  })  

  function handleChange(e, additionalState = {}) {
    const { name, value, type, checked } = e.target
    let filteredValue = type == 'checkbox' ? checked : value

    setData((state) => ({
      ...state,
      ...additionalState,
      [name]: filteredValue,
    }))
  }

  useEffect(() => {
    const contentField = data?.type.includes('CONTENT') ? 'description' : 'value'
    setParentData((state) => {
      const dataClone = structuredClone(data)
      if (inputType != 'toggle') {
        dataClone.is_active = !data[contentField] ? false : dataClone.is_active
      }
      state[typeIndex][type][index] = dataClone
      return state
    })

    if (data.is_active && !data[contentField] && inputType != 'toggle') {
      setError(contentField, 'Kolom ini harus diisi, jika kosong maka akan otomatis nonaktif')
    } else if (data[contentField] && inputType == 'currency') {
      const numberRegex = /^\d+$/
      if (numberRegex.test(data[contentField])) {
        setError(contentField, null)
      } else {
        setError(contentField, 'Ketik nominal uang yang valid')
      }
    } else if (data[contentField] && inputType == 'tel') {
      const phoneRegex = /^(?:\+62|62|0)[2-9]\d{7,11}$/
      if (phoneRegex.test(data[contentField])) {
        setError(contentField, null)
      } else {
        setError(contentField, 'Ketik nomor handphone yang valid')
      }
    } else if (data[contentField] && inputType == 'email') {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      if (emailRegex.test(data[contentField])) {
        setError(contentField, null)
      } else {
        setError(contentField, 'Ketik email yang valid')
      }
    } else {
      setError(contentField, null)
    }
    return () => { }
  }, [data])

  if (props.hiddenOptions?.includes(type)) return <></>
  let inputProps = { handleChange, data, errors, setData }

  return (
    <div className="form-control">
      <div className="flex items-center justify-between mt-4">
        <p className="mb-1 font-semibold flex-1">{useLang(type)}</p>
        <ValueInput inputProps={inputProps} {...state} />
      </div>
      {data.is_active && !['toggle', 'select'].includes(inputType) ? (
        <div className="flex flex-col w-full gap-4">
          <FormInput {...state} data={data} inputProps={inputProps} />
        </div>
      ) : null}

      {selected?.[type] ? (
        <>
          {selected?.[type]?.description ? (
            <p className='text-[15px] opacity-90'>{selected?.[type].description}</p>
          ) : null}
          {selected?.[type]?.form_properties ? (
            <FormProperty props={props} properties={selected?.[type]?.form_properties} inputProps={inputProps} />
          ) : null}
        </>
      ) : null}
    </div>
  )
}

const ValueInput = ({ inputProps, inputType, type }) => {
  const { handleChange, data } = inputProps
  const { props } = usePage()

  if (inputType == 'select') {
    const setSelected = useSetAtom(configSelectOptionAtom)
    const options = props.selectOptions[type]

    const formProps = {
      className: "rounded-md select w-auto border ml-auto",
      isLabel: false,
      name: 'value',
      defaultValue: data.value,
    }

    useEffect(() => {
      let selected = null
      if (data?.value) {
        selected = options.find(option => option.value == data.value)
      }

      if (selected && !!selected?.form_properties) {
        selected?.form_properties?.forEach((properties) => {
          properties = properties.forEach((property) => {
            const formName = property?.props?.name
            const [prefix, type, column] = formName?.split('.')
            const disabled = props.disabledConfigs.find(disabledType => Object.keys(disabledType)[0] == type)
            if (disabled) {
              let id = disabled[type]?.[0]?.id
              let value = disabled[type]?.[0]?.[column]

              inputProps.setData((state) => ({
                ...state,
                [`${type}.id`]: id,
                [formName]: value,
              }))
            }
            return property
          })

          return properties
        })
      }

      setSelected((state) => ({
        ...state,
        [type]: selected
      }))

      return () => { }
    }, [data.value])

    const handleChange = (e) => {
      inputProps.handleChange(e, {
        is_active: true,
      })
    }

    return (
      <div className="">
        <Select {...formProps} {...inputProps} handleChange={handleChange}>
          {options?.map((option, i) => (
            <option key={i} value={option.value}>{option.label}</option>
          ))}
        </Select>
      </div>
    )
  }

  return (
    <input type="checkbox" className="toggle" name="is_active" checked={data.is_active} onChange={handleChange} />
  )
}

const FormInput = (state) => {
  const { data, inputProps, inputType } = state
  const { props } = usePage()

  if (data?.type?.includes('CONTENT')) {
    return (<TextArea isLabel={false} isTextEditor={true} name="description" label={data?.type?.includes('CONTENT') ? 'Konten' : 'deskripsi'} {...inputProps} />)
  }

  if (props.multipleInput.includes(data.type)) {
    return (<MultipleConfigForm isLabel={false} name='value' label={useLang(data.type)} {...inputProps} />)
  }

  return (<Input isLabel={false} type={inputType ?? 'text'} name="value" label="Nilai" required={true} {...inputProps} />)
}

const MultipleConfigForm = (props) => {
  const { data, name } = props
  
  const formData = data[name] == '' ? [] : JSON.parse(data[name])
  
  const baseForm = {
    value: '',
    status: 1,
  }
  const { data: form, setData: setForm } = useForm([...formData, baseForm])

  const handleRemove = (index) => {
    if (form.length == 1) return

    setForm((state) => {
      state.splice(index, 1)
      return [...state]
    })
  }

  const handleChange = (e, index) => {
    let { name, value, type, checked } = e.target

    if (type == 'checkbox') {
      value = checked ? 1 : 0
    }

    setForm((state) => {
      state[index] = {
        ...state[index],
        [name]: value
      }
      return [...state]
    })
  }

  let valueLabel = `Tambah ${props.label}`
  const inputProps = { form, setForm, baseForm }  

  return (
    <MultipleInput {...inputProps} {...props}>
      {form?.map((form, index) => (
        <div key={index} className="join w-full my-1 items-center">
          <input type="checkbox" className="toggle mr-2" name="status" checked={[1, 'active'].includes(form.status)} disabled={form.value == ''} onChange={(e) => handleChange(e, index)} />
          <input onChange={(e) => handleChange(e, index)} name="value" value={form.value} type="text" placeholder={valueLabel} className="input input-bordered input-sm w-full join-item focus:outline-none" />
          <button disabled={index == 0} type="button" onClick={() => handleRemove(index)} className="btn btn-error join-item btn-sm bg-red-700 text-white">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ))}
    </MultipleInput>
  )
}

export default ConfigurationForm
