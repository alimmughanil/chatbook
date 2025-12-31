import TextArea from '@/Components/Form/TextArea'
import WithModal from '@/Components/WithModal'
import { useForm } from '@inertiajs/react'
import { useRef, useState } from 'react'
import { dateTime } from '@/utils/format'
import { AttachmentItem } from '../Card/OrderDetail'
import { useStatusLabel } from '@/utils/useStatus'

const RevisionOrderModal = (state) => {
  const { data: order, handleClick } = state
  const MODAL_TYPE = `revision_order_${order?.id}`
  const backButtonRef = useRef()
  const [showHistory, setShowHistory] = useState(false)

  const histories = order?.work_history || []
  const displayHistories = histories.length > 0 ? (order.work_status === 'work.finish.request' ? histories.slice(1) : histories) : []

  const { data, setData, put, processing, errors } = useForm({
    message: '',
    type: 'request',
    status: 'revision',
    order_number: order?.order_number
  })

  function handleChange(e) {
    const { name, value } = e.target
    setData((state) => ({
      ...state,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    put(`/app/order/${order?.order_number}`, {
      onSuccess: () => {
        backButtonRef.current?.click()
      }
    })
  }

  const inputProps = { handleChange, data, errors, setData }

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick} modalBoxSize="max-w-2xl">
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-2">Permintaan Revisi</h2>

        <div className="mb-4">
          <TextArea
            name='message'
            placeHolder='Masukkan pesan revisi untuk Freelancer'
            heightClassName="h-32"
            isLabel={false}
            {...inputProps}
            required
          />
        </div>

        <div className="flex justify-between items-center mb-2">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs text-primary underline"
          >
            {showHistory ? 'Sembunyikan Riwayat' : 'Lihat Riwayat Pekerjaan'}
          </button>
        </div>

        {showHistory && (
          <div className="max-h-[200px] overflow-y-auto bg-gray-50 p-3 rounded mb-4 border text-sm">
            {displayHistories.length > 0 ? (
              displayHistories.map((history, index) => (
                <div key={index} className="w-full border-b mb-2 pb-2">
                  <div className="flex gap-2 items-start">
                    <img src={history?.user?.picture ?? '/image/logo_proyekin.png'} alt="Foto" className="w-8 h-8 object-cover rounded-full" />
                    <div className="flex flex-col w-full">
                      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <p className='text-xs italic mb-1'>{dateTime(history.created_at)} - ({history?.user?.name ?? 'Sistem'}) <span className='capitalize text-xs'>{useStatusLabel(`work.${history.type}.${history.status}`)}</span></p>
                        <p className="text-gray-700 mt-1">{history.message}</p>

                        {history.attachment && history.attachment.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                              <i className="fas fa-paperclip"></i> Lampiran ({history.attachment.length})
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {history.attachment.map((att, i) => (
                                <AttachmentItem key={i} attachment={att} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center italic text-gray-400">Belum ada riwayat</p>
            )}
          </div>
        )}

        <div className='modal-action'>
          <label
            ref={backButtonRef}
            htmlFor={`modal_${MODAL_TYPE}`}
            className='btn btn-sm btn-neutral btn-outline'
          >
            Batal
          </label>
          <button type="submit" className={`btn btn-sm btn-error text-white`} disabled={processing || !data.message}>
            <span className={`${processing && 'loading'}`}>Ajukan Revisi</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default RevisionOrderModal