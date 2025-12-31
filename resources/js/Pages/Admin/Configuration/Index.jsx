import { Link, router, useForm, usePage } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import DeleteModal from './Modal/DeleteModal'
import { useState } from 'react'
import ConfigurationForm from './Form/ConfigurationForm'
import useLinkTabs from '@/utlis/useLinkTabs'

function Index(props) {
  const { url } = usePage()  
  const { data, setData, post, processing } = useForm(props.configurations)

  const handleSubmit = (e) => {
    e.preventDefault()
    return post(`/admin/configuration`, {
      onSuccess: () => {
        router.reload({ only: ['configurations'] })
      },
    })
  }

  const [show, setShow] = useState(null)
  const handleShow = (data) => {
    setShow(data)
  }

  const formProps = { data, setData }
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
                    <ConfigurationForm {...formProps} inputType={props.inputType[option]} type={option} configuration={config} typeIndex={index} index={i} />
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

export default Index
