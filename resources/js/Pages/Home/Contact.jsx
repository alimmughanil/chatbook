import HomeLayout from "@/Layouts/HomeLayout";
import WithModal from '@/Components/WithModal';
import { router, useForm } from '@inertiajs/react';
import { useRef } from 'react';
import Input from "@/Components/Form/Input";

function Contact(props) {
  const { user } = props.auth
  const { data, setData, post, errors, reset } = useForm({
    name: user && user?.role != 'admin' ? user?.name : '',
    email: user && user?.role != 'admin' ? user?.email : '',
    message: "",
    is_reply: 0,
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
    post("/contact", {
      onSuccess: reset(),
    });
  }
  const url = `https://api.whatsapp.com/send/?phone=${props.whatsapp_number}&type=phone_number&app_absent=0`;

  return (
    <HomeLayout title={props.title} auth={props.auth}>
      <div className="grid w-full md:place-content-center">
        <div className="w-full min-h-[70vh] xl:min-h-[50vh] sm:w-[50vw] bg-white border px-4 rounded-lg shadow py-4 mt-4 mb-16">
          <h1 className="text-lg font-bold text-center">Kontak Kami</h1>
          <div className="flex flex-col justify-between gap-4">
            <div className="grid gap-2">
              <div className="w-full form-control">
                <label className="font-medium">Nama</label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="name"
                  className="w-full border border-gray-300 input"
                  required={true}
                  value={data.name}
                />
                {errors.name && (
                  <div className="py-1 text-sm text-red-500">
                    * {errors.name}
                  </div>
                )}
              </div>
              <div className="w-full form-control">
                <label className="font-medium">Email</label>
                <input
                  type="email"
                  onChange={handleChange}
                  name="email"
                  className="w-full border border-gray-300 input"
                  required={true}
                  value={data.email}
                />
                {errors.email && (
                  <div className="py-1 text-sm text-red-500">
                    * {errors.email}
                  </div>
                )}
              </div>
              <div className="w-full form-control">
                <label className="font-medium">Pesan</label>
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
              <div className="flex flex-col">
                <button
                  onClick={handleSubmit}
                  className="mt-4 text-white btn btn-primary btn-sm"
                >
                  Submit
                </button>
                <div className="divider">Atau</div>
                <CheckEmailModal />
              </div>
            </div>

            <div className="mt-8">
              {!props.whatsapp_number ? null : (
                <a href={url} target="__blank">
                  <div className="flex gap-2 items-center">
                    <i className="fab fa-whatsapp text-xl text-green-600"></i>
                    <p className="text-gray-600">{props.whatsapp_number}</p>
                  </div>
                </a>
              )}
              {!props.email ? null : (
                <a href={`mailto:${props.email}`} target="__blank">
                  <div className="flex gap-2 items-center">
                    <i className="fas fa-envelope text-xl text-red-500"></i>
                    <p className="text-gray-600">{props.email}</p>
                  </div>
                </a>
              )}
              {!props.address ? null : (
                <div className="flex gap-2 items-center">
                  <i className="fas fa-at text-xl text-gray-500"></i>
                  <p className="text-gray-600">{props.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </HomeLayout >
  );
}

const CheckEmailModal = (state) => {
  const { btnLabel = null, btnClassName = null } = state;
  const MODAL_TYPE = `checkEmail`;
  const backButtonRef = useRef();
  const { data, setData, errors } = useForm({
    email: "",
  });

  function submit(e) {
    e.preventDefault();
    router.get(`/contact/${data.email}`);
  }
  function handleChange(e) {
    setData(e.target.name, e.target.value);
  }
  return (
    <WithModal
      btnLabel={btnLabel ?? "Cek Riwayat Percakapanmu"}
      btnClassName={btnClassName ?? "btn btn-sm btn-primary btn-outline"}
      type={MODAL_TYPE}
    >
      <form>
        <p className="text-lg font-semibold text-center">
          Cek Riwayat Percakapan
        </p>
        <Input type="email" name="email" label="Masukkan Email" handleChange={handleChange} data={data} errors={errors} />

        <div className="modal-action">
          <label
            ref={backButtonRef}
            htmlFor={`modal_${MODAL_TYPE}`}
            className="btn btn-sm btn-primary btn-outline"
          >
            Batal
          </label>
          <button
            onClick={submit}
            className="btn btn-sm btn-primary text-white"
          >
            Cek Percakapan
          </button>
        </div>
      </form>
    </WithModal>
  );
};

export default Contact;
