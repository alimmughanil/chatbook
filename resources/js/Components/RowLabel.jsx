import React from 'react'

function RowLabel(props) {
  const { label, value = null, children, data = null } = props
  let { valueClassName = '' } = props
  let { labelClassName = 'font-semibold sm:text-lg md:text-base md:font-normal w-full md:w-48 capitalize' } = props
  let { wrapperClassName = 'grid sm:grid-cols-12 w-full sm:gap-4' } = props

  let { emptyCheck = false, emptyLabel = "Belum ada data", emptyClassName = "w-[200px] h-[120px] flex items-center justify-center bg-gray-50 border rounded-md text-xs text-gray-400" } = props

  if (!!value) {
    return (
      <div className={wrapperClassName}>
        <p className={"col-span-6 " + labelClassName}>{label}</p>
        <p className={"col-span-6 " + valueClassName}>{value}</p>
      </div >
    )
  }

  return (
    <div className={wrapperClassName}>
      <p className={"col-span-6 " + labelClassName}>{label}</p>

      {emptyCheck && (!data || data?.length == 0) ? (
        <div className={emptyClassName}>
          {emptyLabel}
        </div>
      ) : (
        <div className={valueClassName}>
          {children}
        </div>
      )}

    </div >
  )
}

export default RowLabel