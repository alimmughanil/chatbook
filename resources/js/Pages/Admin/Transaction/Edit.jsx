import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import TransactionForm from "./Form/TransactionForm"

function Edit(props) {
  return (
    <AuthenticatedLayout title={props.title}>
      <div className="flex flex-wrap items-center justify-center w-full gap-4 pt-8">
        <TransactionForm isEdit={true} />
      </div>
    </AuthenticatedLayout>
  )
}

export default Edit
