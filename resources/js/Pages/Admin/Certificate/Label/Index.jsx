import Select from "@/Components/Form/Select"
import Input from "@/Components/Form/Input"
import { Link, router, useForm, usePage } from "@inertiajs/react"
import { useEffect, useState } from "react"
import { useRef } from "react"
import useFormChange from "@/utlis/useFormChange"

const LabelIndex = (state) => {
  const { certificate } = state
  const [show, setShow] = useState("index")
  const [label, setLabel] = useState(null)

  const handleShowEdit = (data) => {
    setLabel(data)
    setShow("edit")
  }

  return (
    <>
      <div className="flex flex-col items-start justify-start w-full gap-2 py-4 border-y">
        <div className="flex gap-2">
          <button onClick={() => setShow("create")} className="text-white btn btn-sm btn-neutral">
            Tambah Label
          </button>
          {certificate.label.length == 0 ? null : (
            <a href={`/admin/certificates/${certificate.id}`} className="text-white btn btn-sm bg-green-700 hover:bg-green-800">
              Generate Sertifikat
            </a>
          )}
        </div>
        {show == "index" && (
          <div className="w-full">
            {certificate.label.length == 0 ? (
              <p className="text-left">Belum ada label yang ditambahkan</p>
            ) : (
              certificate.label.map((label, index) => (
                <div key={index} className="flex flex-col justify-start">
                  <p className="font-medium capitalize">
                    {index + 1}. {label.type}
                  </p>
                  <p className="text-sm">Ukuran Huruf: {label.font_size}px</p>
                  <p className="text-sm">
                    Ukuran Kotak: {label.box_width}x{label.box_height}
                  </p>
                  <p className="text-sm">
                    Koordinat: {label.x_coordinate}x{label.y_coordinate}
                  </p>
                  <div className="flex flex-wrap">
                    <button onClick={() => handleShowEdit(label)} className="text-white bg-green-600 hover:bg-green-700 btn btn-sm">
                      Edit
                    </button>
                    <Link
                      method="delete"
                      href={`/admin/certificates/${certificate.id}/label/${label.id}`}
                      className="text-white bg-red-600 hover:bg-red-700 btn btn-sm"
                    >
                      Hapus
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {show == "edit" && <LabelEdit label={label} {...state}/>}
        {show == "create" && <LabelCreate {...state}/>}
      </div>
    </>
  )
}

const LabelCreate = (state) => {
  return (
    <div className="flex flex-col w-full gap-2">
      <LabelForm {...state} />
    </div>
  )
}

const LabelEdit = (state) => {
  return (
    <div className="flex flex-col w-full gap-2">
      <LabelForm {...state} />
    </div>
  )
}

function LabelForm(state) {
  let { label = null, setLabelPreview, labelPreview, isDragging } = state
  const { course, certificateTypes } = usePage().props
  const { certificate } = state
  const backbuttonRef = useRef(null)

  const { data, setData, post, errors, processing, reset } = useForm({
    certificate_id: label?.certificate_id ?? certificate.id,
    type: label?.type ?? certificateTypes[0],
    font_size: label?.font_size ?? "36",
    x_coordinate: label?.x_coordinate ?? "2",
    y_coordinate: label?.y_coordinate ?? "2",
    box_height: label?.box_height ?? "4",
    box_width: label?.box_width ?? "56",
  })

  function handleChange(e) {
    const { name, value } = useFormChange(e, data)

    setData((state) => ({
      ...state,
      [name]: value,
    }))
  }

  useEffect(() => {
    if (!isDragging) {
      setLabelPreview(!!data?.type ? data : null)
    }

    return () => {}
  }, [data])

  useEffect(() => {    
    if (isDragging) {
      setData((state) => ({
        ...state,
        ...labelPreview
      }))
    }
    return () => {}
  }, [labelPreview])

  const handleSubmit = (e) => {
    e.preventDefault()
    const routerOption = {
      onSuccess: () => {
        setTimeout(() => {
          backbuttonRef.current?.click()
        }, 1000)
      },
    }

    if (label) {
      data._method = "put"
      return post(`/admin/certificates/${certificate.id}/label/${label.id}`, routerOption)
    }
    return post(`/admin/certificates/${certificate.id}/label`, routerOption)
  }

  return (
    <form className="flex flex-col items-center justify-center w-full gap-4 p-4 border rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row w-full gap-2">
        <Select type="text" name="type" label="Jenis Label" handleChange={handleChange} data={data} errors={errors} defaultValue={data.type}>
          <option value="">Pilih salah satu</option>
          {certificateTypes.map((type, index) => (
            <option key={index} value={type} className="capitalize">
              {type}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-2">
        <Input type="number" name="font_size" label="Ukuran Huruf" handleChange={handleChange} data={data} errors={errors} />
      </div>
      <div className="flex flex-col md:flex-row w-full gap-2">
        <Input type="number" name="box_width" label="Lebar Kotak" handleChange={handleChange} data={data} errors={errors} />
        <Input type="number" name="box_height" label="Tinggi Kotak" handleChange={handleChange} data={data} errors={errors} />
      </div>

      <div className="flex flex-col md:flex-row w-full gap-2">
        <Input type="number" name="x_coordinate" label="Geser Horizontal (X)" handleChange={handleChange} data={data} errors={errors} />
        <Input type="number" name="y_coordinate" label="Geser Vertikal (Y)" handleChange={handleChange} data={data} errors={errors} />
      </div>

      <div className="flex justify-center gap-2 mt-4">
        <Link
          ref={backbuttonRef}
          replace
          href={`/admin/certificates?course_id=${course?.id ?? "default"}`}
          className="btn btn-primary btn-outline btn-sm"
        >
          Batal
        </Link>
        <button onClick={handleSubmit} disabled={processing} className={`btn btn-primary btn-sm ${processing && "loading"}`}>
          Submit
        </button>
      </div>
    </form>
  )
}

export default LabelIndex
