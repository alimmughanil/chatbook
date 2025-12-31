import { FileUploader } from "react-drag-drop-files"
import BaseForm from "./BaseForm"
import { mimeType } from "@/utlis/format"
import { useState } from "react"
import { Fragment } from "react"
import { BaseMultipleInput } from "./MultipleInput"
import { useForm } from "@inertiajs/react"

function FileUploaderInput(props) {
  const { name, data, setData, multiple = true, disabled = false, maxSize = 2, handleOpenPreview = null, isAttachmentLink = false, attachmentLinkProps = null } = props
  const [error, setError] = useState({
    fileType: null,
    fileSize: null
  })

  function handleSetFiles(files) {
    if (multiple) {
      setData((state) => {
        let current = state?.[name] ?? []

        return {
          ...state,
          [name]: [...current, ...files]
        }
      })
    } else {
      setData((state) => ({
        ...state,
        [name]: [files]
      }))
    }


    setError((state) => ({
      ...state,
      fileType: null,
      fileSize: null
    }))
  }

  function handleRemoveFile(file) {
    let current = data?.[name] ?? []
    const files = current?.filter((state) => state != file)
    setData((state) => ({
      ...state,
      [name]: files
    }))
  }

  const handleSetError = (type, message) => {
    setError((state) => ({
      ...state,
      [type]: message
    }))
  }

  let accept = ''

  if (typeof props.accept == 'string') {
    accept = mimeType(props.accept)
  }
  if (typeof props.accept == 'object') {
    accept = props.accept?.map(accept => mimeType(accept))?.join(',')
  }

  accept = accept.split(',').filter((item) => item.startsWith('.')).map((item) => item.replace('.', '').toUpperCase())

  let inputProps = { name, multiple, disabled, maxSize }
  let files = typeof data[name] === 'object' ? data[name] : []
  console.log(data[name]);


  return (
    <div className="grid gap-2 w-full z-50">
      <BaseForm {...props}>
        <FileUploader handleChange={handleSetFiles} types={accept} onTypeError={(e) => handleSetError('fileType', e)} onSizeError={(e) => handleSetError('fileSize', e)} {...inputProps}>
          <div className={`flex items-start gap-2 w-full border min-h-[4rem] p-4 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <i className="fas fa-upload"></i>
            <div className="">
              <p>Click or Drop Files to Upload. Max: {maxSize} MB</p>
              <p className="text-xs mt-4">{accept.join(', ')}</p>

              {error.fileType ? (
                <p className="text-xs mt-4 text-red-600">* {error.fileType}</p>
              ) : null}
              {error.fileSize ? (
                <p className="text-xs mt-4 text-red-600">* {error.fileSize}. Max: {maxSize} MB</p>
              ) : null}
            </div>
          </div>
        </FileUploader>
      </BaseForm>

      <div className="flex flex-wrap gap-2 w-full text-gray-700">
        {files?.length > 0 ? files.map((file, index) => {
          return (
            <Fragment key={index}>
              <FileUploaderPreview file={file} handleRemoveFile={handleRemoveFile} handleOpenPreview={handleOpenPreview} />
            </Fragment>
          )
        }) : null}
      </div>

      {isAttachmentLink ? (<AttachmentLinkForm {...props} {...inputProps} />) : null}
    </div>
  )
}

export const FileUploaderPreview = ({ isRemoveButton = true, file, handleRemoveFile = null, handleOpenPreview = null, wrapperClassName = null }) => {
  let imageUrl = file?.type?.startsWith('image') ? URL.createObjectURL(file) : null

  if (file?.value?.startsWith('/storage')) {
    imageUrl = file?.value
  }
  if (file?.value?.startsWith('/image')) {
    imageUrl = file?.value
  }

  let label = file.name
  if (!label) {
    label = file?.label
  }

  if (imageUrl && !file?.type?.startsWith('image')) {
    let imageTypes = mimeType('image').split(',').filter((item) => item.startsWith('.')).map((item) => item.replace('.', '').toLowerCase())
    let fileType = imageUrl.split('.')
    let ext = fileType[fileType.length - 1].toLowerCase()
    if (!imageTypes.includes(ext)) {
      imageUrl = ""
    }
  }

  if (!label && !!file && typeof file == 'string') {
    label = file
  }

  return (
    <div className={wrapperClassName ?? `border px-2 rounded-lg flex gap-2 w-full py-1`}>
      {isRemoveButton && label ? (
        <button onClick={() => handleRemoveFile(file)} type="button" className="btn btn-xs btn-neutral btn-circle">
          <i className="fas fa-x"></i>
        </button>
      ) : null}
      <div className="">
        {!!label ? (
          <button type="button" onClick={handleOpenPreview ? () => handleOpenPreview(file) : null} className={`${handleOpenPreview ? 'link-hover' : ''} text-start`}>
            <p>{label}</p>
          </button>
        ) : null}
        {imageUrl ? (
          <figure>
            <img src={imageUrl} className="w-full max-w-2xl h-full max-h-[10rem] object-cover mt-2" />
          </figure>
        ) : null}
      </div>
    </div>
  )
}

export const AttachmentLinkForm = (props) => {
  const { data, setData, multiple, attachmentLinkProps } = props
  const { name } = attachmentLinkProps
  let attachmentLinks = typeof data[name] === 'object' ? data[name] : []

  let formData = attachmentLinks == '' ? [] : (typeof attachmentLinks === 'string' ? JSON.parse(attachmentLinks) : attachmentLinks)

  const baseForm = {
    content_type: 'link',
    label: '',
    value: '',
  }

  const { data: form, setData: setForm } = useForm(formData?.length ? formData : [baseForm])

  const handleSetData = (form) => {
    setData((state) => {
      let selected = form

      if (!multiple) {
        selected = form?.[0] ?? []
      }

      return {
        ...state,
        [name]: [...selected]
      }
    })
  }

  const handleRemove = (index) => {
    setForm((state) => {
      const newState = [...state]
      newState.splice(index, 1)
      handleSetData(newState)
      return newState
    })
  }

  const handleChange = (e, index) => {
    let { name, value, type, checked } = e.target
    if (type === 'checkbox') value = checked ? 1 : 0

    setForm((state) => {
      const newState = [...state]
      newState[index] = { ...newState[index], [name]: value }
      handleSetData(newState)
      return newState
    })
  }

  const inputProps = { form, setForm, baseForm }

  return (
    <div className="my-2">
      <BaseMultipleInput {...inputProps} {...props} label={`Lampiran Tautan`}>
        {form?.map((item, index) => (
          <div key={index} className="group relative bg-white border border-gray-200 rounded-lg p-3 mb-2 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              <div className="md:col-span-5">
                <label className="text-xs text-gray-500 font-medium ml-1 mb-1 block">Judul / Label</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <i className="fas fa-tag text-xs"></i>
                  </div>
                  <input
                    onChange={(e) => handleChange(e, index)}
                    name="label"
                    value={item.label}
                    type="text"
                    placeholder="Cth: Portofolio Web"
                    className="input input-bordered input-sm w-full pl-8 transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-6">
                <label className="text-xs text-gray-500 font-medium ml-1 mb-1 block">Alamat URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <i className="fas fa-globe text-xs"></i>
                  </div>
                  <input
                    onChange={(e) => handleChange(e, index)}
                    name="value"
                    value={item.value}
                    type="url"
                    placeholder="https://..."
                    className="input input-bordered input-sm w-full pl-8 transition-all font-mono text-xs md:text-sm"
                  />
                </div>
              </div>

              <div className="md:col-span-1 flex justify-end md:justify-center mt-auto h-full items-end pb-1">
                <button
                  onClick={() => handleRemove(index)}
                  type="button"
                  className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50 w-full md:w-auto tooltip tooltip-left"
                  data-tip="Hapus Tautan"
                >
                  <i className="fas fa-trash-alt"></i>
                  <span className="md:hidden ml-2">Hapus</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </BaseMultipleInput>
    </div>
  )
}

export default FileUploaderInput
