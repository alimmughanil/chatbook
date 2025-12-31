import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import WithdrawForm from './Form/WithdrawForm'

function Create(props) {
  return (
    <AuthenticatedLayout title={props.title} auth={props.auth}>
      <div className='flex flex-wrap items-center justify-center w-full gap-4 pt-8'>
        <WithdrawForm />
      </div>
    </AuthenticatedLayout>
  )
}

export default Create
