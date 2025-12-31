import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ConfigurationForm from "./Form/ConfigurationForm";

function Edit(props) {
  return (
    <AuthenticatedLayout auth={props.auth} title={props.title}>
      <div className="flex flex-wrap items-center justify-center w-full gap-4 pt-8">
        <ConfigurationForm configuration={props.configuration} />
      </div>
    </AuthenticatedLayout>
  );
}

export default Edit;
