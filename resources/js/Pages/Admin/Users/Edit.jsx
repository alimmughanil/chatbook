import RegisterForm from '@/Components/RegisterForm'
import FormPage from "@/Components/Default/FormPage";
function Edit(props) {
  return (
    <FormPage>
        <RegisterForm userData={props.user} roles={props.roles} />
    </FormPage>
  );
}

export default Edit;
