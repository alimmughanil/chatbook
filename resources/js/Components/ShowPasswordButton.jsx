function ShowPasswordButton(state) {
  const { className = 'absolute right-4 top-2 btn btn-sm btn-circle', show, setShow } = state
  return (
    <button type="button" className={className} onClick={() => setShow((state) => !state)}>
      <i className={`fas ${show ? 'fa-eye-slash' : 'fa-eye'} text-lg`}></i>
    </button>
  )
}

export default ShowPasswordButton