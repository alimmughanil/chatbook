import { useForm, usePage } from '@inertiajs/react'
import Input from '@/Components/Form/Input'
import { useState } from 'react'

export default function UpdateProfileInformation({ className = '' }) {
	const { auth, flash, user } = usePage().props

	const [picture, setPicture] = useState(user?.picture ?? null)

	const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    picture: user.picture,
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

		post(`/profile?${params.toString()}`, {
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

			<form onSubmit={submit} className='space-y-6'>
				<div className='grid gap-2'>
          <Input type='text' name='name' label='Nama' {...inputProps} />
          <Input type='text' name='username' label='Username' {...inputProps} />
          <Input type='text' name='email' label='Email' {...inputProps} />
          <Input type='text' name='phone' label='Nomor Whatsapp' {...inputProps} />

					<div className='flex gap-2 items-end'>
						<Input type='file' name='picture' label='Upload Foto' alt='Opsional' {...inputProps} />
						{picture ? <img src={picture} alt='Foto Profil' className='w-16 h-16 object-cover rounded-full' /> : null}
					</div>
				</div>
				<div className='flex items-center gap-4'>
					<button disabled={processing} className={`btn btn-primary btn-sm`}>
						{processing && <span className='loading'></span>}
						<span>Simpan</span>
					</button>

					{recentlySuccessful ? (
						<div className='badge badge-success gap-2 badge-lg'>
							<i className='fas fa-check'></i>
							<span>Berhasil Disimpan</span>
						</div>
					) : null}
				</div>
			</form>
		</section>
	)
}
