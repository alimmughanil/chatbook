import RegisterForm from '@/Components/RegisterForm'
import FormPage from "@/Components/Default/FormPage";
function Create(props) {
  return (
    <FormPage>
      <RegisterForm roles={props.roles} />
    </FormPage>
  );
}

export default Create;