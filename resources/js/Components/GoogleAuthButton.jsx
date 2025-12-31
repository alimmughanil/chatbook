import { usePage } from "@inertiajs/react"

function GoogleAuthButton() {
  const { props } = usePage()
  const location = new URL(props.location)
  const params = new URLSearchParams(location.search)

  // return <GoogleAuthModal />

  return (
    <a href="/auth/google/redirect" className="cursor-pointer">
      <GoogleAuthIcon />
    </a>
  )
}

const GoogleAuthModal = () => {
  return (
    <>
      <label htmlFor="login_as" className="cursor-pointer">
        <GoogleAuthIcon />
      </label>
      <input type="checkbox" id="login_as" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box scrollbar-none">
          <p>Masuk sebagai:</p>
          <div className="flex w-full mt-4 join">
            {location.pathname == "/login" ? (
              <RedirectButton label="Penyelenggara" role="company" />
            ) : // <RedirectButton label="Penyelenggara Individu" role="seller" />
            null}
            {location.pathname == "/login" ? <RedirectButton label="Peserta" role="user" /> : null}
            {location.pathname != "/login" ? (
              <>
                <RedirectButton label="Penyelenggara" role="company" />
                {/* <RedirectButton label="Penyelenggara Individu" role="seller" /> */}
                <RedirectButton label="Peserta" role="user" />
              </>
            ) : null}
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="login_as">
          X
        </label>
      </div>
    </>
  )
}

const GoogleAuthIcon = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-2 py-1 my-2 border rounded-lg hover:shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 48 48">
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
        <path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        ></path>
        <path
          fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        ></path>
        <path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
      </svg>
      <span className="">Continue with google</span>
    </div>
  )
}

function RedirectButton({ role, label }) {
  return (
    <a
      href={`/auth/google/redirect?role=${role}`}
      className={`flex-1 btn text-lg sm:text-xl join-item btn-outline capitalize whitespace-pre`}
    >
      {label}
    </a>
  )
}

export default GoogleAuthButton
