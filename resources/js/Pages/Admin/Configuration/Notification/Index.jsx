import { Link, router, useForm, usePage } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import DeleteModal from '../Modal/DeleteModal'
import { useState } from 'react'
import ConfigurationForm from '../Form/ConfigurationForm'
import useLinkTabs from '@/utils/useLinkTabs'
import MultipleInput from '@/Components/Form/MultipleInput'

function Index(props) {
  const { url } = usePage()
  const { setData, post, processing } = useForm(props.configurations)

  const handleSubmit = (e) => {
    e.preventDefault()
    return post(`/admin/configuration?redirect=notification`, {
      onSuccess: () => {
        router.reload({ only: ['configurations'] })
      },
    })
  }

  const [show, setShow] = useState(null)
  const handleShow = (data) => {
    setShow(data)
  }

  const formProps = { setData, MultipleFormInput:EmailInputForm}
  const menus = useLinkTabs('config')

  return (
    <AuthenticatedLayout title={props.title} auth={props.auth}>
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-col w-full sm:w-max border">
          {menus.map((menu, index) => (
            <Link href={menu.value} key={index} className={`p-2 border-y border-neutral-300 ${url == menu.value ? 'bg-neutral-200 font-semibold' : ''}`}>
              {menu.label}
            </Link>
          ))}
        </div>
        <div className="relative w-full max-w-xl border bg-white sm:p-4 rounded-lg">
          {props.options.map((option, index) => {
            const config = props.configurations.filter((config) => config[option])
            return (
              <div key={index} className="">
                {config[0][option].map((config, i) => (
                  <div key={i}>
                    <ConfigurationForm {...formProps} configType="notification" inputType={props.inputType[option]} type={option} configuration={config} typeIndex={index} index={i} />
                  </div>
                ))}
              </div>
            )
          })}
          <div className="sticky bottom-5 flex w-full z-50 mt-2">
            <button onClick={handleSubmit} className={`btn btn-primary btn-sm w-full`} disabled={processing}>
              <span className={`${processing && 'loading'}`}>Simpan</span>
            </button>
          </div>
        </div>
      </div>

      {show ? (
        <>
          <DeleteModal data={show} handleClick={() => handleShow(null)} />
        </>
      ) : null}
    </AuthenticatedLayout>
  )
}

const EmailInputForm = (props) => {
  const { data, name } = props
  const formData = data[name] == '' ? [] : JSON.parse(data[name])
  const baseForm = {
    email: '',
    status: 1,
  }
  const { data: form, setData: setForm } = useForm([...formData, baseForm])

  const handleRemove = (index) => {
    if (form.length == 1) return

    setForm((state) => {
      state.splice(index, 1)
      return [...state]
    })
  }

  const handleChange = (e, index) => {
    let { name, value, type, checked } = e.target

    if (type == 'checkbox') {
      value = checked ? 1 : 0
    }

    setForm((state) => {
      state[index] = {
        ...state[index],
        [name]: value
      }
      return [...state]
    })
  }

  let valueLabel = `Tambah Email`
  const inputProps = { form, setForm, baseForm, mainInputName: 'email' }

  return (
    <MultipleInput {...inputProps} {...props}>
      {form?.map((form, index) => (
        <div key={index} className="join w-full my-1 items-center">
          <input type="checkbox" className="toggle mr-2" name="status" checked={form.status == 1} disabled={form.value == ''} onChange={(e) => handleChange(e, index)} />
          <input onChange={(e) => handleChange(e, index)} name="email" value={form.email} type="email" placeholder={valueLabel} className="input input-bordered input-sm w-full join-item focus:outline-none" />
          <button disabled={index == 0} type="button" onClick={() => handleRemove(index)} className="btn btn-error join-item btn-sm bg-red-700 text-white">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ))}
    </MultipleInput>
  )
}

export default Index
