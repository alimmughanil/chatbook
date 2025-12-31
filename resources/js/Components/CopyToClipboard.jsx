import { toast } from 'react-toastify'

const CopyToClipboard = ({ label = '', data, btnClassName=null, btnLabel=null}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(data)
    toast(`${label} berhasil disalin`, { type: "success" })
  }

  return (
    <div className="">
      <button onClick={handleCopy} type='button' className={`${btnClassName ?? "bg-gray-600 hover:bg-gray-700 px-4 py-1 rounded text-white"}`}>
        {btnLabel ?? "Salin"}
      </button>
    </div>
  )
}

export default CopyToClipboard