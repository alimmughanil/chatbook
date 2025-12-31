import { Link, usePage } from '@inertiajs/react'
import Form from './Form/Form'
import { useAtomValue } from 'jotai'
import { disableButtonAtom } from '@/atoms'
import { useEffect, useState } from 'react'
import { getBasePageUrl } from '@/utlis/format'

function FormBuilder(props) {
  const { BackButton = null, SubmitButton = null, wrapperClassName = null } = props
  const { page, location } = usePage().props
  const disableButton = useAtomValue(disableButtonAtom)

  let { label } = props
  const { properties, inputProps, handleSubmit, form, submitLabel = null, isLabel = true } = props
  const { processing } = form

  const params = new URLSearchParams(new URL(location).search)
  let backUrl = props?.ref ?? params.get('ref')
  if (!backUrl) {
    backUrl = getBasePageUrl(page?.url)
  }

  if (!label) {
    label = !!page?.data ? `Edit ${page?.label}` : `Tambah ${page?.label}`
  }

  return (
    <form className={wrapperClassName ?? "flex flex-col items-center justify-center w-full gap-4 p-4 border rounded-lg shadow-lg"}>
      {isLabel ? (
        <p className="text-lg font-semibold">{label}</p>
      ) : null}

      <FormProperty props={props} properties={properties} inputProps={inputProps} />

      <div className="flex justify-center gap-2 mt-4">
        {!!BackButton ? (
          <BackButton />
        ) : (
          <Link type="button" href={backUrl} className="btn btn-primary btn-outline btn-sm">
            Batal
          </Link>
        )}
        {!!SubmitButton ? (
          <SubmitButton {...props} />
        ) : (
          <button onClick={handleSubmit} disabled={processing || disableButton} className={`btn btn-primary btn-sm`}>
            <span className={`${processing && "loading"}`}></span>
            <span>{submitLabel ?? 'Simpan'}</span>
          </button>
        )}
      </div>
    </form>
  )
}

export const CreateButton = ({ path = null, fullpath = null }) => {
  const { props } = usePage()
  const location = new URL(props.location)

  if (!fullpath) {
    fullpath = `/admin/${path}/create`
  }

  return (
    <Link href={`${fullpath}?ref=${location.pathname}`} className='bg-gray-700 py-1 px-2 rounded-[25%] hover:bg-gray-900'>
      <i className='text-white fas fa-plus'></i>
    </Link>
  )
}

export const FormProperty = ({ props, properties, inputProps }) => {
  return (
    <>
      {properties.map((properties, index) => (
        <div key={index} className="flex flex-col sm:flex-row w-full gap-4">
          {properties.map((property, i) => {
            if (!!property.custom && typeof property.custom === 'function') return property.custom(props)
            if (property?.customProperty && typeof property?.customProperty === "function") {
              property = property?.customProperty({ data, property })
            }
            if (!!property.isHidden) return null

            if (!!property?.imagePreview) {
              return <ImagePreviewForm key={i} index={i} property={property} inputProps={inputProps} />
            }

            return (
              <div key={i} className='w-full'>
                <Form key={i} index={i} property={property} inputProps={inputProps} />
                {property?.infoCard && typeof property?.infoCard === "function" && property?.infoCard(property, inputProps)}
              </div>
            )
          })}
        </div>
      ))}
    </>
  )
}

export const ImagePreviewForm = ({ index, property, inputProps }) => {
  const [picture, setPicture] = useState(null)

  let isSidePreview = true
  if ("isSidePreview" in (property || {}) && property.isSidePreview === false) {
    isSidePreview = false
  }

  let previewClassName = "w-16 h-16 object-cover rounded-md"
  if ("previewClassName" in (property || {})) {
    previewClassName = property?.previewClassName
  }

  const handleSetPicture = (imageUrl) => {
    if (!imageUrl || [undefined, null].includes(imageUrl)) {
      imageUrl = null
    }

    if (imageUrl instanceof File) {
      imageUrl = URL.createObjectURL(imageUrl)
    }

    setPicture(imageUrl)
  }

  const handleRemovePicture = (e) => {
    setPicture(null)
    e.target.name = property?.props?.name
    e.target.value = ''
    inputProps.handleChange(e)
  }

  useEffect(() => {
    handleSetPicture(inputProps.data[property?.props?.name])
    return () => { }
  }, [inputProps.data[property?.props?.name]])

  return (
    <div key={index} className={`flex gap-2 w-full ${isSidePreview ? 'flex-row items-end' : 'flex-col items-start'}`}>
      <Form property={property} inputProps={inputProps} />
      {picture ? (
        <div className="border px-2 rounded-lg flex gap-2 w-full py-1">
          <button onClick={handleRemovePicture} type="button" className="btn btn-xs btn-neutral btn-circle">
            <i className="fas fa-x"></i>
          </button>
          <div className="">
            <p className='text-sm opacity-80'>{property?.previewLabel}</p>
            <figure>
              <img src={picture} alt={property?.props?.name} className={previewClassName} />
            </figure>
          </div>
        </div>

      ) : null}
    </div>
  )
}

export default FormBuilder
