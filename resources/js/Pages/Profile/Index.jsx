import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import UpdatePasswordForm from './Partials/UpdatePasswordForm'
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm'
import { usePage } from '@inertiajs/react'

export default function Edit({ title, auth }) {
  return (
    <AuthenticatedLayout title={title} auth={auth}>
      <ProfileShow />
    </AuthenticatedLayout>
  )
}

const ProfileShow = () => {
  const { appName } = usePage().props
  return (
    <div className='py-12'>
      <div className='mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8'>
        <div className='p-4 bg-white shadow sm:p-8 sm:rounded-lg border'>
          <UpdateProfileInformationForm className='max-w-xl w-full sm:min-w-[24rem]' />
        </div>
        <div className='p-4 bg-white shadow sm:p-8 sm:rounded-lg border'>
          <UpdatePasswordForm className='max-w-xl w-full sm:min-w-[24rem]' />
        </div>
      </div>
    </div>
  )
}
