import useFormBuilder from "@/utlis/useFormBuilder"
import FormBuilder, { FormProperty } from "@/Components/FormBuilder"
import { useSearchParams } from "@/utlis/format"
import { handleSelectReload } from "@/utlis/useFormChange"
import DetailModalItem from "@/Components/Default/DetailModalItem"
import { useTableHeader as PatientHeader } from "@/Pages/Admin/Patient/Index"
import { useTableHeader as MedicalRecordHeader } from "@/Pages/Admin/MedicalRecord/Index"
import { Link, usePage } from "@inertiajs/react"
import { AddButton } from "@/Components/Form/BaseForm"
import Table from "@/Components/Table"
import Form from "@/Components/Form/Form"

function MainForm({ isEdit = false }) {
  const formConfig = { isEdit, getProperties }
  const builderProps = useFormBuilder(formConfig)

  return <FormBuilder {...builderProps} isLabel={false} />
}

const getProperties = (state) => {
  const { props, setData } = state
  const { params } = useSearchParams(props.location)

  const properties = [
    [
      {
        custom: (props) => <PatientInfoCard {...props} />
      },
    ],
    [
      {
        custom: (props) => <FormLabel {...props} />
      },
    ],
    [
      {
        custom: (props) => <DefaultForm {...props} />
      },
      {
        form: "textarea",
        props: {
          name: "complaint",
          label: "Keluhan",
          heightClassName: "h-44",
          placeHolder: "Isi keluhan disini",
          bottomLabel: "Tekan Enter untuk menambahkan keluhan lain"
        },
      },
    ],
    [
      {
        form: "textarea",
        props: {
          name: "note",
          label: "Keterangan",
          heightClassName: "h-44",
          placeHolder: "Isi keterangan disini",
          bottomLabel: "Tekan Enter untuk menambahkan keterangan lain"
        },
      },
      {
        form: "textarea",
        props: {
          name: "treatment",
          label: "Tindakan",
          heightClassName: "h-44",
          placeHolder: "Isi tindakan disini",
          bottomLabel: "Tekan Enter untuk menambahkan tindakan lain"
        },
      },
    ],
  ]

  return properties
}

const FormLabel = () => {
  return (
    <div>
      <p className="text-purple-600 font-bold'">Tambah Rekam Medis</p>
    </div>
  )
}

const PatientInfoCard = () => {
  const { selected_patient, selected_medical_records, location } = usePage().props
  if (!selected_patient) return <></>

  let medicalRecordHeader = MedicalRecordHeader()
  medicalRecordHeader = medicalRecordHeader?.filter((header) => ["id", "date", "complaint", "note", "treatment"].includes(header.value))

  return (
    <div className="w-full flex flex-col xl:flex-row gap-2">
      <div className="w-full max-w-lg border p-2">
        <div className="flex flex-wrap justify-between">
          <p className="text-purple-600 font-semibold">Data Pasien</p>
        </div>
        <DetailModalItem data={selected_patient} tableHeader={PatientHeader()} />

        <div className="mt-2 flex justify-end">
          <Link href={`/admin/patients/${selected_patient?.id}/edit?ref=${location}`} className="btn btn-sm btn-outline">
            <i className="fas fa-edit"></i>
            Perbarui Data
          </Link>
        </div>
      </div>

      <div className="flex-1 border p-2 h-full max-h-[25rem] overflow-auto">
        <div className="flex flex-wrap justify-between">
          <p className="text-purple-600 font-semibold">Data Rekam Medis</p>
        </div>
        <Table tableHeader={medicalRecordHeader} tableBody={selected_medical_records ?? []} />
      </div>
    </div>
  )
}

const DefaultForm = (builderProps) => {
  const { props } = usePage()
  const { setData } = builderProps

  const properties = [
    [
      {
        form: 'select',
        props: {
          isReactSelect: true,
          name: 'doctor_id',
          label: 'Dokter Pemeriksa',
          options: props.doctors,
          handleChange: (e) => handleSelectReload({ e, name: 'doctor_id', setData, params }),
          isDisabled: true,
          alt: <AddButton path={`/admin/doctors/create?ref=${props.location}`} />
        }
      },
      {
        form: "input",
        props: {
          type: "date",
          name: "date",
          label: "Tanggal",
        },
      },
    ]
  ]

  return (
    <>
      {properties.map((properties, index) => (
        <div key={index} className="flex flex-col w-full gap-4">
          {properties.map((property, i) => {
            return (
              <div key={i} className='w-full'>
                <Form key={i} index={i} property={property} inputProps={builderProps.inputProps} />
                {property?.infoCard && typeof property?.infoCard === "function" && property?.infoCard(property, inputProps)}
              </div>
            )
          })}
        </div>
      ))}
    </>
  )
}

export default MainForm
