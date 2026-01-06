import UserLayout from "@/Layouts/UserLayout";
import { useForm, usePage } from "@inertiajs/react";
import { currency, dateTime } from "@/utils/format";
import useStatus, { useStatusLabel } from "@/utils/useStatus";
import WithModal, { ModalButton } from "@/Components/WithModal";
import Input from "@/Components/Form/Input";
import { useEffect, useRef, useState } from "react";
import Select from "@/Components/Form/Select";
import { OrderData, PaymentData, RefundData, UserData, ProcessData, LastWork } from "@/Components/Card/OrderDetail";
import ChatModal from "@/Components/Modal/ChatModal";
import RatingFormModal from "@/Components/Modal/RatingFormModal";

function Show(props) {
  const [show, setShow] = useState(null)
  const handleShow = (data) => {
    setShow(data)
  }

  return (
    <UserLayout headLabel={`Detail Pesanan`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrderShow handleShow={handleShow} />
      </div>
      {show ? (
        <ChatModal data={props.order} chats={props?.order?.comments} handleClick={handleShow} />
      ) : null}
      {props?.order?.status == 'success' ? (
        <RatingFormModal data={props.order} handleClick={() => { }} />
      ) : null}
    </UserLayout>
  );
}

const OrderShow = ({ handleShow }) => {
  const { order, location, auth } = usePage().props;
  const currentUrl = (new URL(location)).origin + (new URL(location)).pathname;
  const params = new URLSearchParams(new URL(location).search)
  const failedStatus = ["failed", "cancel"];
  const paymentButton = useRef()

  useEffect(() => {
    if (params.get('redirect') == 'payment') {
      const payUrl = localStorage.getItem('payment_link')
      if (payUrl != order.payment?.payment_link) {
        localStorage.setItem('payment_link', order.payment?.payment_link)
        setTimeout(() => {
          paymentButton?.current?.click()
        }, 500);
      }
    }

    return () => { }
  }, [])

  const copyToClipboard = (type, text) => {
    navigator.clipboard.writeText(text);
    alert(`${type} Telah disalin`);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-lg lg:text-2xl font-bold text-gray-800">
                Pesanan #{order.order_number}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <i className="far fa-calendar"></i>
                <span>Dibuat pada {dateTime(order?.created_at)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${useStatus('order.' + order.status)}`}>
                {useStatusLabel(`order.${order.status}`)}
              </span>

              {order.payment?.status == 'paid' && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${useStatus('payment.' + order.payment?.status)}`}>
                  {useStatusLabel(`payment.${order.payment.status}`)}
                </span>
              )}

              {order.payment?.status == 'refund' && (
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${useStatus('refund.' + order.refund?.status)}`}>
                  {useStatusLabel('refund.' + order.refund?.status)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-end items-center gap-3">
          {!order.refund?.attachment ? null : (
            <a target="_blank" href={`/app/order/${order.order_number}?type=refund-attachment`} className="btn btn-sm btn-ghost text-green-700 w-full sm:w-auto">
              <i className="fas fa-file-invoice mr-2"></i> Bukti Refund
            </a>
          )}

          {/* <ModalButton id={`chat_${order?.id}`} onClick={() => handleShow(order)} className="btn btn-sm btn-white border border-gray-300 hover:border-gray-400 text-gray-700 w-full sm:w-auto">
            <i className="fas fa-comment-dots mr-2"></i> Chat
          </ModalButton> */}

          {order.status == 'success' && (
            <ModalButton id={`rating_form_${order?.id}`} onClick={() => { }} className="btn btn-sm btn-white border border-gray-300 hover:border-gray-400 text-gray-700 w-full sm:w-auto">
              <i className="fas fa-star text-yellow-500 mr-2"></i>
              {order?.ratings?.length > 0 ? `Dinilai (${order?.ratings[0].rating})` : "Beri Nilai"}
            </ModalButton>
          )}

          {failedStatus.includes(order.status) && order.payment.status == "success" && (
            <div className="w-full sm:w-auto">
              <RefundModal data={order} />
            </div>
          )}

          {order.status == "pending" && (
            <a ref={paymentButton} href={order.payment?.payment_link ?? `/app/payment/create?order_id=${order.order_number}`} className="btn btn-sm btn-primary text-white shadow-md shadow-purple-200 w-full sm:w-auto">
              Lanjutkan Pembayaran <i className="fas fa-arrow-right ml-2 animate-pulse"></i>
            </a>
          )}
        </div>
      </div>

      {order.status_message && order.status != 'success' && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-circle text-red-500"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <span className="font-bold block mb-1">Status Pesanan:</span>
                {order.status_message}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            {/* <LastWork order={order} /> */}
            <ProcessData order={order} component="LastWork" isSeller={false} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <ProcessData order={order} component="WorkHistoryData" isCtaButton={false}  />
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <OrderData order={order} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <PaymentData order={order} />
            {order.refund && <RefundData order={order} />}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <UserData order={order} type={order.product_id ? 'user' : 'participant'} />
          </div>

          {!auth.user && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm">
              <p className="font-semibold text-blue-800 mb-2 text-center">Simpan Link Transaksi</p>
              <div className="join w-full">
                <input readOnly type="text" value={currentUrl} className="join-item input input-sm input-bordered w-full bg-white text-gray-600" />
                <button onClick={() => copyToClipboard('Link', currentUrl)} className="btn btn-sm btn-blue-600 join-item text-white"><i className="fas fa-copy"></i></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RefundModal = (state) => {
  const { props } = usePage();
  const banks = props.banks[0]?.value && props.banks[0]?.value != '' ? JSON.parse(props.banks[0].value) : []

  const { data: order } = state;
  const MODAL_TYPE = "refund";
  const backButtonRef = useRef();
  const { data, setData, post, errors, processing } = useForm({
    order_id: order.id,
    bank_name: "",
    bank_account: "",
    bank_alias: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setData((state) => ({
      ...state,
      [name]: value,
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    post(`/app/refund`, {
      onSuccess: () => {
        backButtonRef.current?.click();
      },
    });
  };

  return (
    <WithModal
      btnLabel="Ajukan Pengembalian Dana"
      btnClassName="btn btn-sm btn-error btn-outline w-full"
      type={MODAL_TYPE}
    >
      <div className="text-black flex flex-col justify-between items-center mb-4">
        <p className="text-sm text-gray-500">Jumlah Dana Dikembalikan</p>
        <p className="font-bold text-2xl text-gray-800">{currency(order.payment.gross_amount)}</p>
        <p className="text-xs text-red-500 mt-1">* Tidak termasuk biaya layanan</p>
      </div>

      <form action="" className="text-black flex flex-col gap-3">
        <Select name="bank_name" label="Pilih Bank" handleChange={handleChange} data={data} errors={errors} defaultValue={data.bank_name}>
          <option value="">Pilih Salah Satu</option>
          {banks.map((bank, i) => bank.status == 0 ? null : (
            <option key={i} value={bank.value}>
              {bank.value}
            </option>
          ))}
        </Select>
        <Input type="text" name="bank_account" label="Nomor Rekening" handleChange={handleChange} data={data} errors={errors}
        />
        <Input type="text" name="bank_alias" label="Atas Nama" handleChange={handleChange} data={data} errors={errors} />

        <div className="modal-action mt-6">
          <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className="btn btn-sm btn-ghost"  >
            Batal
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-primary text-white ${processing && "loading"}`}  >
            Ajukan Sekarang
          </button>
        </div>
      </form>
    </WithModal>
  );
};

export default Show;