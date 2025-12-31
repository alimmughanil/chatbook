import React from "react"
import useFormBuilder from "@/utils/useFormBuilder"
import FormBuilder from "@/Components/FormBuilder"

function MainForm({ isEdit = false }) {
  const formConfig = { isEdit, getProperties }
  const builderProps = useFormBuilder(formConfig)

  return <FormBuilder {...builderProps} />
}

const getProperties = (state) => {
  const { props, data, setData } = state

  const properties = [
    [
      {
        form: 'input',
        props: {
          name: 'name',
          label: 'Nama Komponen',
          type: 'text',
        }
      },
    ],
    [
      {
        form: "select",
        props: {
          name: "type",
          label: "Tipe",
          options: props.typeOptions,
        },
      },
      {
        form: "select",
        props: {
          name: "unit",
          label: "Satuan Unit",
          options: props.unitOptions,
        },
      },
    ],
    [
      {
        form: 'input',
        props: {
          name: 'value',
          label: 'Nilai',
          type: 'number',
        }
      },
      {
        form: "select",
        props: {
          name: "applied_to",
          label: "Diterapkan Ke",
          options: props.appliedToOptions,
        },
      },
    ],
    [
      {
        form: "select",
        props: {
          name: "status",
          label: "Status",
          options: props.statusOptions,
        },
      },
      {
        form: 'select',
        props: {
          isReactSelect: true,
          name: 'tags',
          label: 'Tags',
          options: props.tags,
          isMulti: true,
          defaultValue: data.tags,
          handleChange: (e) => setData('tags', e)
        }
      }
    ],
  ]

  return properties
}

export default MainForm
