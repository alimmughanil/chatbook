import FormPage from "@/Components/Default/FormPage"
import MainForm from "./Form/MainForm"

function Edit() {
  return (
    <FormPage>
      <MainForm isEdit={true} />
    </FormPage>
  )
}

export default Edit
