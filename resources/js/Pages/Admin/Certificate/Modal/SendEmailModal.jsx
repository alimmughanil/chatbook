import Input from '@/Components/Form/Input'
import WithModal from '@/Components/WithModal'
import useFormChange from '@/utlis/useFormChange'
import { router, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { useRef } from 'react'

const SendEmailModal = (state) => {
  const { data: certificate, handleClick } = state
  const MODAL_TYPE = `send_email_${certificate?.id}`
  const backButtonRef = useRef()

  const { data, setData, post, errors, processing } = useForm({
    email: '',
    isSample: false,
  });

  function handleChange(e) {
    let { name, value } = useFormChange(e, data)

    setData((state) => ({
      ...state,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.isSample) return router.get(`/admin/course/${certificate?.course_id}/mail?type=${certificate?.type}`)

    return post(`/admin/certificates/${certificate?.id}/mail-sample`, {
      onSuccess: () => {
        backButtonRef.current?.click()
      }
    });
  };


  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick}>
      <form action=''>
        <h1 className='text-lg font-bold'>Konfirmasi Kirim Sertifikat</h1>
          <div className='mb-3 p-2 bg-orange-200 rounded-md flex'>
            <i className='fas fa-circle-exclamation mr-2 mt-1' />
            <p>Anda akan mengirim sertifikat ke semua peserta. Harap pastikan desain sertifikat sudah sesuai. <br /> Jika ingin mengirim sampel sertifikat, anda dapat mengaktifkan toggle dibawah</p>
          </div>
        <div className="flex items-center justify-between">
          <p className="mt-4 mb-1 font-semibold">Kirim Sampel Sertifikat</p>
          <input type="checkbox" className="toggle" name="isSample" checked={data.isSample} onChange={handleChange} />
        </div>
        {data?.isSample ? (
          <Input type="email" name="email" label={`Masukkan Email Untuk Menerima Sampel Sertifikat`} handleChange={handleChange} data={data} errors={errors} />
        ): null}

        <div className='modal-action'>
          <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Batal
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-primary`} disabled={processing}>
            <span className={`${processing && 'loading'}`}>Kirim Sertifikat</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default SendEmailModal
