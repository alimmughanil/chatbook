import ReactSelect, { components } from 'react-select'
import ReactSelectVirtualized from 'react-select-virtualized';
import CreatableSelect from 'react-select/creatable';
import { AsyncPaginate } from 'react-select-async-paginate';
import BaseForm from './BaseForm'
import useLang from '@/utlis/useLang';

function Select(props) {
  const { name, handleChange, errors, alt = null, children, defaultValue, isReactSelect = false, options = null, isMulti = false, isDisabled = false, ref = null, prefix='' } = props
  let { label = null, className = null, placeholder = null, optionComponent = null, handleCreateOption = null, isCreateAble = false, isVirtualized = false, isReactSelectSize = false} = props
  let { isPagination = false, loadOptions } = props
  let { createLabel = 'Tambah', noOptionsMessage = "Belum ada pilihan yang ditambahkan" } = props

  if (!label) {
    label = name.split('_').join(' ')
  }

  if (isReactSelectSize) {
    className = "border border-gray-300 rounded-md text-sm"
  }

  const handleFormatLabel = (data) => {
    return `${createLabel} "${data}"`
  }

  const handleNoOptionsMessage = (data) => {
    if (isCreateAble || !data?.inputValue) return noOptionsMessage
    return `Pilihan: "${data?.inputValue}" tidak ditemukan`
  }

  const ReactSelectProps = {
    menuPortalTarget: document.body,
    menuPosition: 'absolute',
    className: "basic-single",
    classNamePrefix: "select",
    placeholder: placeholder ?? 'Pilih salah satu',
    defaultValue: defaultValue,
    isClearable: true,
    isSearchable: true,
    onChange: handleChange,
    options: options,
    isMulti: isMulti,
    components: optionComponent ?? components,
    isDisabled: isDisabled,
    noOptionsMessage: handleNoOptionsMessage,
    styles: {
      menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
      }),
    }
  }

  if (isPagination) {
    return (
      <BaseForm {...props}>
        <AsyncPaginate
            {...ReactSelectProps}
            value={value}
            loadOptions={loadOptions}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.label}
            debounceTimeout={300}
            additional={{
                page: 1,
            }}
        />
      </BaseForm>
    )
  }

  if (isVirtualized) {
    const formatOptionLabel = (option) => (
      <span className="block whitespace-nowrap overflow-hidden text-ellipsis line-clamp-2 text-sm">{option.label}</span>
    )
    return (
      <BaseForm {...props}>
        <ReactSelectVirtualized {...ReactSelectProps} formatOptionLabel={formatOptionLabel} />
      </BaseForm>
    )
  }


  return (
    <BaseForm {...props}>
      {isReactSelect ? (
        isCreateAble ? <CreatableSelect {...ReactSelectProps} onCreateOption={handleCreateOption} formatCreateLabel={handleFormatLabel} /> : <ReactSelect  {...ReactSelectProps} />
      ) : (
        <select ref={ref} name={name} id={name} onChange={handleChange} defaultValue={defaultValue} disabled={isDisabled} className={className ?? "w-full border border-gray-300 select disabled:border-gray-300 disabled:text-gray-500"}>
          {!!placeholder ? (
            <option value="" className="capitalize">{placeholder}</option>
          ): null}

          {!options ? children : options.map((option, index) => (
            <option key={index} value={option} className="capitalize">{useLang(prefix ? `${prefix}.${option}` : option)}</option>
          ))}
        </select>
      )}
    </BaseForm>
  )
}
export default Select