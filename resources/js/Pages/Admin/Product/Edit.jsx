import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
// import MainForm from "./Form/MainForm"
import MainForm from "./Form/ProductForm"

function Edit(props) {
  return (
    <AuthenticatedLayout title={props.title}>
      <div className="flex flex-wrap items-center justify-center w-full gap-4 pt-8">
        <MainForm isEdit />
      </div>
    </AuthenticatedLayout>
  )
}

export default Edit
