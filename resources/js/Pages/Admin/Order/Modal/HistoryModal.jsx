import { AttachmentItem } from '@/Components/Card/OrderDetail'
import WithModal from '@/Components/WithModal'
import { dateTime } from '@/utils/format'
import { useStatusLabel } from '@/utils/useStatus'
import { useRef } from 'react'

const History = (state) => {
  const { data: order, handleClick } = state
  const { work_history } = order
  const MODAL_TYPE = `history_${order?.id}`
  const backButtonRef = useRef()

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick} modalBoxSize="max-w-2xl">
      <form action=''>
        <p className='font-semibold text-lg w-full mb-3'>Riwayat Pekerjaan</p>
        <div className='max-h-[300px] overflow-x-scroll'>
          {work_history?.length > 0 ? work_history.map((history, index) => (
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
          )) : (
            <p>Belum ada aktivitas pada pekerjaan ini</p>
          )}
        </div>
        <div className='modal-action'>
          <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Kembali
          </label>
        </div>
      </form>
    </WithModal>
  )
}

export default History