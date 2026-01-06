import React from "react"
import useFormBuilder from "@/utils/useFormBuilder"
import FormBuilder from "@/Components/FormBuilder"

function TransactionForm({ isEdit = false }) {
  const formConfig = { isEdit, getProperties }
  const builderProps = useFormBuilder(formConfig)

  return <FormBuilder {...builderProps} />
}

const getProperties = (state) => {
  const { props } = state

  const properties = [
    [
      {
        form: 'input',
        props: {
          name: 'date',
          label: 'Tanggal',
          type: 'date',
        }
      },
      {
        form: "select",
        props: {
          name: "type",
          label: "Tipe",
          options: props.typeOptions,
        },
      },
    ],
    [
      {
        form: "select",
        props: {
          name: "category_id",
          label: "Kategori",
          options: props.categoryOptions,
        },
      },
      {
        form: 'input',
        props: {
          name: 'amount',
          label: 'Jumlah',
          type: 'number',
        }
      },
    ],
    [
      {
        form: 'input',
        props: {
          name: 'shop_name',
          label: 'Nama Toko',
          type: 'text',
        }
      },
    ],
    [
      {
        form: 'textarea',
        props: {
          name: 'description',
          label: 'Deskripsi',
        }
      }
    ]
  ]

  return properties
}

export default TransactionForm
