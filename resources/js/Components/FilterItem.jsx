import { useForm, usePage } from '@inertiajs/react'
import FilterColumn from './FilterColumn'
import BaseForm from './Form/BaseForm'
import Select from './Form/Select'
import { useAtom, useSetAtom } from 'jotai'
import { filterAtom } from '@/atoms'
import { useEffect } from 'react'

const FilterItem = ({ options = [], isButton = true }) => {
  const { props } = usePage()
  const location = new URL(props.location)
  const params = new URLSearchParams(location.search)

  if (!options?.length > 0) return <p className='px-4'>Belum ada filter yang diaktifkan</p>

  const [filter, setFilter] = useAtom(filterAtom)

  let filterSelected = {}
  for (const option of options) {
    filterSelected[option.name] = params.get(option.name) ?? null
  }

  const { get, data, setData, errors } = useForm(filterSelected)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (data) {
      get(`${location.origin}${location.pathname}?${params.toString()}`)
    }
  }

  useEffect(() => {
    if (filterSelected && !filter) {
      setFilter(filterSelected)
    }

    return () => { }
  }, [filterSelected])



  const handleSelect = (e, option) => {
    let value = !!option?.isMulti ? e : e?.value
    if ([null, undefined].includes(value)) {
      value = ''
    }

    setData((prevData) => ({
      ...prevData,
      [option.name]: value
    }))

    setFilter((prevFilter) => ({
      ...prevFilter,
      [option.name]: value
    }))
  }


  const inputProps = { data, errors, isReactSelect: true }

  return (
    <div className="w-full grid grid-cols-1 justify-start">
      <div className="w-full overflow-visible pr-2 z-50">
        {options.map((option) => {
          if (option.name == 'deleted_at') {
            option.data = ['show','hidden']
          }
          if (!option?.data) return null

          if (option.isReactSelect) {
            let selectedIndex = data[option.name] ? option.data.findIndex((optionData) => optionData?.value == data[option.name]) : null

            return (
              <Select
                isVirtualized={true}
                isReactSelect={true}
                name={option.name}
                defaultValue={option.data[selectedIndex] ?? null}
                label={option.label}
                handleChange={(e) => handleSelect(e, option)}
                options={option.data}
                isMulti={!!option.isMulti}
                placeholder={`Pilih salah satu ${option.isMulti ? 'atau lebih' : ''}`}
                {...inputProps}
              />
            )
          }

          return (
            <BaseForm name={option.name} label={option.label} {...inputProps}>
              <FilterColumn options={option.data} label={option.label} queryName={option.name} prefix={option.prefix} setData={setData} />
            </BaseForm>
          )
        })}
      </div>

      {isButton ? (
        <button onClick={handleSubmit} className='mt-4 btn btn-primary w-max ml-auto mr-2 sm:mr-6 btn-sm bg-opacity-90 z-0'>Terapkan</button>
      ) : null}
    </div>
  )
}

export default FilterItem
