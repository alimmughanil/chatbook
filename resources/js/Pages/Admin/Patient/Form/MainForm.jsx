import useFormBuilder from "@/utlis/useFormBuilder"
import FormBuilder from "@/Components/FormBuilder"
import { getDurationDate } from "@/utlis/format"

function MainForm({ isEdit = false }) {
  const formConfig = { isEdit, getProperties }
  const builderProps = useFormBuilder(formConfig)

  return <FormBuilder {...builderProps} />
}

const getProperties = (state) => {
  const { props, data } = state

  const properties = [
    [
      {
        form: "input",
        props: {
          name: "name",
          label: "Nama",
        },
      },
      {
        form: "input",
        props: {
          name: "phone",
          label: "No. Hp",
          type: "tel"
        },
      },
      {
        form: 'select',
        props: {
          name: 'gender',
          label: 'Jenis Kelamin',
          options: props.gender,
          placeholder:"Pilih salah satu"
        }
      },
      {
        form: "input",
        props: {
          type: "date",
          name: 'birth_date',
          label: 'Tanggal Lahir',
          alt: data.birth_date ? getDurationDate(data.birth_date) : ''
        },
      },
    ],
    [
      {
        form: 'textarea',
        props: {
          name: 'address',
          label: 'Alamat',
        }
      },
    ],
    [
      {
        form: 'textarea',
        props: {
          name: 'medical_history',
          label: 'Riwayat Penyakit',
          heightClassName: "h-44",
          placeHolder: "Kosongkan jika tidak ada"
        }
      },
      {
        form: 'textarea',
        props: {
          name: 'medication_allergy',
          label: 'Alergi Obat',
          heightClassName: "h-44",
          placeHolder: "Kosongkan jika tidak ada"
        }
      },
    ]
  ]

  return properties
}

export default MainForm
