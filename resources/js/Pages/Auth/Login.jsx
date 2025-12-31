import { useEffect, useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import Input from "@/Components/Form/Input";
import ShowPasswordButton from "@/Components/ShowPasswordButton";
import Checkbox from "@/Components/Form/Checkbox";
import useFormChange from "@/utlis/useFormChange";
import GoogleAuthButton from "@/Components/GoogleAuthButton";

export default function Login(props) {
  const { status } = props;
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: "",
  });

  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);

  function handleChange(e) {
    let { name, value } = useFormChange(e)

    setData((state) => ({
      ...state,
      [name]: value,
    }))
  }
  const submit = (e) => {
    e.preventDefault();

    post('/login', {
      onSuccess: ({ props }) => {
        if (props.auth.user.role == "user") {
          return history.go(-2);
        }
      },
    });
  };

  const inputProps = { handleChange, data, errors }
  const [showPassword, setShowPassword] = useState(false)

  return (
    <GuestLayout>
      <Head title={`Log in - ${props.appName}`} />
      <div className=""></div>
      <p className="text-lg font-bold text-center">
        Masuk ke akunmu
      </p>

      {status && (
        <div className="mb-4 text-sm font-medium text-green-600">
          {status}
        </div>
      )}
      {props.flash?.message ? (
        <div className="h-full mx-auto mb-4 text-center text-white badge badge-error">
          {props.flash?.message}
        </div>
      ) : null}

      <GoogleAuthButton />
      <form onSubmit={submit}>
        <Input type="text" name="email" label="email" {...inputProps} />
        <div className="relative">
          <Input type={showPassword ? 'text' : 'password'} name='password' label='password' {...inputProps} />
          <ShowPasswordButton show={showPassword} setShow={setShowPassword} className='absolute right-4 top-11 btn btn-sm btn-circle' />
        </div>

        <div className="form-control w-max mt-2">
          <Checkbox name='remember' label='Ingat Saya' {...inputProps} />
        </div>

        <div className="flex flex-col gap-4 my-4">
          <div className="flex flex-col">
            <button
              className="btn btn-sm btn-primary"
              disabled={processing}
            >
              Masuk
            </button>
          </div>
        </div>
      </form>
    </GuestLayout>
  );
}
