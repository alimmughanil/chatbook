import { useForm, usePage } from '@inertiajs/react'
import Input from '@/Components/Form/Input'
import { useState } from 'react'
import TextArea from '@/Components/Form/TextArea'

export default function UpdateProfileInformation({ className = '' }) {
  const { auth, flash, user } = usePage().props

  const [picture, setPicture] = useState(user?.picture ?? null)

  const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    institute: user.institute,
    position: user.position,
    picture: user.picture,
    about: user?.profile?.about ?? '',
    short_bio: user?.profile?.short_bio ?? '',
  })

  function handleChange(e) {
    const { name, value, files } = e.target
    const fileNames = ['picture']
    let filteredValue = value

    if (fileNames.includes(name)) {
      filteredValue = files[0]
      setPicture(URL.createObjectURL(files[0]))
    }

    setData((state) => ({
      ...state,
      [name]: filteredValue,
    }))
  }

  const submit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(window.location.search)

    post(`/app/profile?${params.toString()}`, {
      preserveScroll: true,
    })
  }

  const inputProps = { handleChange, data, errors }

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900 ">
          Profil Saya
        </h2>
        {flash?.error ? (
          <p className="mt-1 text-sm text-red-600">{flash?.error}</p>
        ) : null}
      </header>

      <form onSubmit={submit} className='space-y-8 mt-6'>
        <div className='grid gap-4 p-4 bg-gray-50 rounded-lg'>
          <h3 className="font-semibold text-gray-700">Informasi Dasar</h3>
          <div className='grid gap-2'>
            <Input type='text' name='name' label='Nama' {...inputProps} />
            <Input type='text' name='username' label='Username' {...inputProps} />
            <Input type='email' name='email' label='Email' {...inputProps} />
            <Input type='tel' name='phone' label='Nomor Whatsapp' {...inputProps} />

            {user.role !== 'user' && (
              <>
                <Input type='text' name='short_bio' label='Bio Singkat' {...inputProps} />
                <TextArea type='text' name='about' label='Tentang Saya' {...inputProps} />
              </>
            )}

            <div className='flex gap-2 items-end'>
              <Input type='file' name='picture' label='Upload Foto' alt='Opsional' {...inputProps} />
              {picture ? <img src={picture} alt='Foto Profil' className='w-16 h-16 object-cover rounded-full' /> : null}
            </div>
          </div>
        </div>

        <div className='flex items-center gap-4 pt-4 border-t border-gray-200'>
          <button disabled={processing} className={`btn btn-primary`}>
            {processing && <span className='loading'></span>}
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </section>
  )
}
