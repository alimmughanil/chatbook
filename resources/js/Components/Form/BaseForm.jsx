import { Link } from '@inertiajs/react'
import React from 'react'

function BaseForm(props) {
  const { children, errors, name, alt, isLabel = true, index = null } = props
  let { label = null, wrapperClassName = 'w-full form-control', labelClassName = 'label-text capitalize ', bottomLabel = null, infoCard = null } = props

  if (!label) {
    label = name.split('_').join(' ')
  }

  return (
    <div key={index} className={wrapperClassName}>
      {isLabel && (
        <label className="label">
          <span className={labelClassName}>{label}</span>
          {!alt ? null : (
            <span className="label-text-alt capitalize">{alt}</span>
          )}
        </label>
      )}
      {children}
      {errors[name] && (
        <label className="label">
          <span className="label-text-alt text-error">
            * {errors[name]}
          </span>
        </label>
      )}
      {!!bottomLabel && (
        <label className="label mt-1">
          <span className="label-text-alt">
            {bottomLabel}
          </span>
        </label>
      )}

      {infoCard && typeof infoCard === "function" && infoCard(props)}
    </div>
  )
}

export const AddButton = ({ path }) => {
  return (
    <Link href={path} className='text-lg btn btn-xs btn-neutral btn-circle'>
      <i className='text-white fas fa-plus'></i>
    </Link>
  )
}

export default BaseForm