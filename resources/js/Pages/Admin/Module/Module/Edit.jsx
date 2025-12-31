import FormPage from "@/Components/Default/FormPage"
import MainForm from "./Form/MainForm"
import { Link } from "@inertiajs/react"

function Edit(props) {
  return (
    <FormPage>
      <MainForm isEdit={true} BackButton={() => (
        <Link type="button" href={`${props.page?.url}?module_id=${props.module?.id}`} className="btn btn-primary btn-outline btn-sm">
          Batal
        </Link>
      )} />
    </FormPage>
  )
}

export default Edit
