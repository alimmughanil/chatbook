import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
// import MainForm from "./Form/MainForm"
import MainForm from "./Form/ProductForm"

function Create(props) {
  return (
    <AuthenticatedLayout title={props.title}>
      <div className="flex flex-wrap items-center justify-center w-full gap-4 pt-8">
        <MainForm />
      </div>
    </AuthenticatedLayout>
  )
}

export default Create
