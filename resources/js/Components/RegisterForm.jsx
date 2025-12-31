import { useEffect } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import Input from "./Form/Input";
import Select from "./Form/Select";
import { useState } from "react";
import useLang from "@/utlis/useLang";
import { useStatusLabel } from "@/utlis/useStatus";
import { getBasePageUrl, mimeType, useSearchParams } from "@/utlis/format";
import useFormChange from "@/utlis/useFormChange";

function RegisterForm({ userData = null }) {
  const { props } = usePage();
  const { location, status = null, roles = null, page = null } = props;
  const user = props?.auth?.user;
  const role = user ? user.role : "guest";
  const [picture, setPicture] = useState(userData?.picture ?? null)

  const { data, setData, post, processing, errors, reset } = useForm({
    location: location,
    name: userData?.name ?? "",
    username: userData?.username ?? "",
    phone: userData?.phone ?? "",
    email: userData?.email ?? "",
    role: userData?.role ?? "user",
    status: userData?.status ?? "active",
    picture: picture ?? "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    if (location) {
      const params = new URLSearchParams(new URL(location).search);

      if (params.get("role")) {
        setData((state) => ({
          ...state,
          ["role"]: params.get("role"),
        }));
      }
    }
    return () => {
      reset("password", "password_confirmation");
    };
  }, []);

  function handleChange(e) {
    let { name, value, files } = useFormChange(e, data)

    if (['picture'].includes(name)) {
      setPicture(URL.createObjectURL(files[0]))
    }

    setData((state) => ({
      ...state,
      [name]: value
    }))
  }

  const submit = (e) => {
    e.preventDefault();

    if (userData) {
      data._method = "put";
      return post(`/admin/users/${userData.id}`);
    }

    ['admin'].includes(role) ? post("/admin/users") : post('/register');
  };

  const inputProps = { handleChange, data, errors }

  const { params } = useSearchParams(location)
  let backUrl = props?.ref ?? params.get('ref')
  if (!backUrl) {
    backUrl = getBasePageUrl(page?.url)
  }

  return (
    <form onSubmit={submit} className="flex flex-col items-center justify-center w-full gap-4 p-4 border rounded-lg shadow-lg">
      {['admin'].includes(role) ? (
        <p className="text-lg font-semibold">{!!userData ? `Edit Pengguna` : `Tambah Pengguna`}</p>
      ) : null}
      <div className="flex flex-col md:flex-row w-full gap-4">
        <Input type='text' name='name' label='nama' {...inputProps} />
        {userData ? (
          <Input type='text' name='username' label='username' {...inputProps} />
        ) : null}
        <Input type='email' name='email' label='email' {...inputProps} />
      </div>

      <div className="flex flex-col md:flex-row w-full gap-4">
        <Input type='tel' name='phone' label='nomor whatsapp' alt="Opsional" {...inputProps} />
        <Input type='password' name='password' label='password' {...inputProps} />
        <Input type='password' name='password_confirmation' label='Konfirmasi Password' {...inputProps} />
      </div>
      <div className="flex flex-col md:flex-row w-full gap-4">
        <div className="flex gap-2 items-end w-full">
          <Input type='file' name='picture' label='Upload Foto' alt='Opsional' {...inputProps} accept={mimeType('image')} />
          {picture ? (
            <img src={picture} alt="Foto Profil" className="w-16 h-16 object-cover rounded-full" />
          ) : null}
        </div>
        {['admin'].includes(role) && status ? (
          <>
            <Select name='status' label='status' {...inputProps} defaultValue={data.status}>
              <option value=''>Pilih salah satu</option>
              {status.length == 0 ? null : status.map((status, index) => (
                <option key={index} value={status} className='capitalize'>
                  {useStatusLabel(status)}
                </option>
              ))}
            </Select>
            <Select name='role' label='role' {...inputProps} defaultValue={data.role}>
              <option value=''>Pilih salah satu</option>
              {roles.length == 0 ? null : roles.map((role, index) => (
                <option key={index} value={role} className='capitalize'>
                  {useLang(role)}
                </option>
              ))}
            </Select>
          </>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 my-4">
        <div className="flex flex-col">
          {['admin'].includes(role) ? (
            <div className="flex justify-center gap-2 mt-4">
              <Link type="button" href={backUrl} className="btn btn-primary btn-outline btn-sm">
                Batal
              </Link>
              <button className="btn btn-sm btn-primary" disabled={processing}>
                Simpan
              </button>
            </div>
          ) : (
            <>
              <button className="btn btn-sm btn-primary" disabled={processing}>
                Buat Akun
              </button>
              <div className="divider">Atau</div>
              <Link
                href="/login"
                className="mx-auto btn btn-sm btn-primary btn-outline w-max"
                disabled={processing}
              >
                Masuk ke akunmu
              </Link>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

export default RegisterForm;
