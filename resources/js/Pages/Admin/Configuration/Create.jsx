import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ConfigurationForm from "./Form/ConfigurationForm";

function Create(props) {
  return (
    <AuthenticatedLayout auth={props.auth} title={props.title}>
      <div className="flex flex-wrap items-center justify-center w-full gap-4 pt-8">
        <ConfigurationForm />
      </div>
    </AuthenticatedLayout>
  );
}

export default Create;
