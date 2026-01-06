import WithModal from '@/Components/WithModal';
import { useForm, usePage } from '@inertiajs/react';
import { useRef } from 'react';

const DeleteModal = (state) => {
  const { data: productDetail, btnLabel = null, btnClassName = null } = state;
  const { product } = usePage().props

  const MODAL_TYPE = `delete_${productDetail?.id}`;
  const backButtonRef = useRef();
  const { delete: destroy, processing } = useForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    destroy(`/admin/product/${product?.id}/detail/${productDetail.id}`, {
      onSuccess: () => {
        backButtonRef.current?.click();
      },
    });
  };

  return (
    <WithModal
      btnLabel={btnLabel ?? <i className="text-lg text-red-600 fas fa-trash"></i>}
      btnClassName={btnClassName ?? "btn btn-xs btn-ghost text-white"}
      type={MODAL_TYPE}
    >
      <form action="">
        <h1 className="text-lg font-bold">Konfirmasi</h1>
        <p>Apakah anda yakin ingin menghapus paket ini?</p>
        <p className="text-center font-semibold text-xl">{productDetail?.name}</p>
        <p>Semua transaksi yang terjadi pada paket ini juga akan terhapus</p>
        <div className="modal-action">
          <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className="btn btn-sm btn-neutral btn-outline" >
            Batal
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-error bg-red-600 text-white `} disabled={processing}>
            <span className={`${processing && 'loading'}`}>Hapus</span>
          </button>
        </div>
      </form>
    </WithModal>
  );
};

export default DeleteModal