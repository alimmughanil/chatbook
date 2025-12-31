import { useRef } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import Input from '@/Components/Form/Input'

export default function UpdatePasswordForm({ className = '' }) {
	const { has_password } = usePage().props.auth
	const passwordInput = useRef()
	const currentPasswordInput = useRef()

	const { data, setData, errors, post, reset, processing, recentlySuccessful } = useForm({
		current_password: '',
		password: '',
		password_confirmation: '',
	})

	const updatePassword = (e) => {
		e.preventDefault()

		post('/profile?update-password=true', {
			preserveScroll: true,
			onSuccess: () => reset(),
			onError: (errors) => {
				if (errors.password) {
					reset('password', 'password_confirmation')
					passwordInput.current?.focus()
				}

				if (errors.current_password) {
					reset('current_password')
					currentPasswordInput.current?.focus()
				}
			},
		})
	}

	function handleChange(e) {
		const { name, value } = e.target
		let filteredValue = value

		setData((state) => ({
			...state,
			[name]: filteredValue,
		}))
	}

	const inputProps = { handleChange, data, errors }

	return (
		<section className={className}>
			<header>
				<h2 className='text-lg font-medium text-gray-900 '>{has_password ? 'Ganti' : 'Tambahkan'} Password</h2>
			</header>

			<form onSubmit={updatePassword} className='space-y-6'>
				<div className='grid gap-2'>
					{has_password ? <Input type='password' name='current_password' label='Password Sekarang' {...inputProps} /> : null}
					<Input type='password' name='password' label='Password Baru' {...inputProps} />
					<Input type='password' name='password_confirmation' label='Konfirmasi Password Baru' {...inputProps} />
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
