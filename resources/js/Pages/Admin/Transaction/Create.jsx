import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import TransactionForm from "./Form/TransactionForm"

function Create(props) {
  return (
    <AuthenticatedLayout title={props.title}>
      <div className="flex flex-wrap items-center justify-center w-full gap-4 pt-8">
        <TransactionForm />
      </div>
    </AuthenticatedLayout>
  )
}

export default Create
