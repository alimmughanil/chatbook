import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { dateTime } from "@/utils/format";
import { useForm, usePage } from "@inertiajs/react";

function Contact(props) {
  return (
    <AuthenticatedLayout title={props.title}>
      <ContactForm />
    </AuthenticatedLayout >
  );
}

function ContactForm() {
  const { props } = usePage()
  const { contacts, auth } = props
  const { data, setData, post, errors, reset } = useForm({
    name: contacts.length > 0 ? contacts[0]?.name : "",
    email: contacts.length > 0 ? contacts[0]?.email : "",
    message: "",
    is_reply: auth?.user?.role == 'admin' ? 1 : 0,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setData((state) => ({
      ...state,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    post("/admin/contact", {
      onSuccess: reset(),
    });
  }

  return (
    <div className="grid w-full md:place-content-center">
      <div className="w-full min-h-[70vh] xl:min-h-[50vh] sm:w-[50vw] bg-gray-100 border px-4 rounded-lg shadow py-4 mt-4 mb-16">
        <div className="flex flex-col w-full mb-4">
          <p className="text-lg font-bold leading-4">{data.name}</p>
          <p className="text-sm leading-4">{data.email}</p>
        </div>
        {contacts.map((contact, index) => (
          <div key={index} className={`p-2 my-2 rounded-lg border ${contact?.is_reply ? "text-left bg-white" : "text-right bg-green-100"}`}>
            <p>{contact.message}</p>
            <p className="text-xs text-gray-500">{contact.is_reply ? "Dibalas" : null} {dateTime(contact.created_at)}</p>
          </div>
        ))}
        {props.flash.success ? (
          <div className="w-full mx-auto my-4 text-white whitespace-pre badge bg-green-600">
            {props.flash.success}
          </div>
        ) : null}
        {props.flash.error ? (
          <div className="w-full mx-auto my-4 text-white whitespace-pre badge bg-red-600">
            {props.flash.error}
          </div>
        ) : null}
        <div className="grid">
          <div className="w-full form-control">
            <textarea
              className="h-32 border border-gray-300 textarea"
              onChange={handleChange}
              name="message"
              required={true}
              value={data.message}
            ></textarea>
            {errors.message && (
              <div className="py-1 text-sm text-red-500">
                * {errors.message}
              </div>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className="mt-4 text-white btn btn-primary btn-sm"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
}

export default Contact;
