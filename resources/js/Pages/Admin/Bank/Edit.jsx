import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import MainForm from './Form/MainForm'

function Edit(props) {
  return (
    <AuthenticatedLayout title={props.title} auth={props.auth}>
      <div className='flex flex-wrap items-center justify-center w-full gap-4 pt-8'>
        <MainForm data={props.bank} />
      </div>
    </AuthenticatedLayout>
  )
}

export default Edit
