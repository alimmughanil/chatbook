import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import UpdatePasswordForm from './Partials/UpdatePasswordForm'
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm'
import UpdateProfileDetailForm from './Partials/UpdateProfileDetailForm'
import { usePage } from '@inertiajs/react'
import { useSearchParams } from '@/utils/format'

export default function Edit({ title, auth }) {
  return (
    <AuthenticatedLayout title={title} auth={auth}>
      <ProfileShow />
    </AuthenticatedLayout>
  )
}

const ProfileShow = () => {
  const { auth, location } = usePage().props
  const { params: queryParams } = useSearchParams(location);
  const currentTab = queryParams.get('tab') || 'detail';

  const tabs = [
    { id: 'detail', label: 'Detail Profil' },
    { id: 'password', label: 'Ganti Password' },
  ];

  return (
    <div>
      <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-lg px-4">
          {tabs.map(tab => (
            <a
              key={tab.id}
              href={`?tab=${tab.id}`}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${currentTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.label}
            </a>
          ))}
        </div>

        {/* Tab Content */}
        <div className='bg-white shadow sm:p-8 sm:rounded-b-lg border border-t-0 rounded-t-none'>
          {currentTab === 'detail' && (
            <div className="space-y-8">
              <UpdateProfileInformationForm className='max-w-xl w-full sm:min-w-[24rem]' />
              {auth?.user?.role != 'user' ? (
                <div className="border-t border-gray-200 pt-8">
                  <UpdateProfileDetailForm className='max-w-4xl w-full' />
                </div>
              ) : null}
            </div>
          )}
          {currentTab === 'password' && (
            <UpdatePasswordForm className='max-w-xl w-full sm:min-w-[24rem]' />
          )}
        </div>
      </div>
    </div>
  )
}
