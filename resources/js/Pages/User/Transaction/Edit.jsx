import UserLayout from "@/Layouts/UserLayout"
import TransactionForm from "./Form/TransactionForm"

function Edit(props) {
  return (
    <UserLayout headLabel={props.title}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <TransactionForm isEdit={true} />
        </div>
      </div>
    </UserLayout>
  )
}

export default Edit
