import { ModalButton } from "@/Components/WithModal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { currency } from "@/utils/format";
import { Link, usePage } from "@inertiajs/react";
import WalletModal from "./Modal/WalletModal";

function Index(props) {
  if (props.auth?.user?.role != 'partner') return <DefaultCard />

  return (
    <AuthenticatedLayout title={props.title}>
      <div className="flex flex-wrap items-stretch justify-start gap-4 pt-8">
        <ReportCard label={`Saldo Terkumpul`} icon="fa-wallet">
          <div className="flex gap-4">
            <div className="">
              <p className="text-sm">Saldo Tersedia</p>
              <p className="font-semibold text-2xl">{currency(props.balance?.credit_total ?? 0)}</p>
            </div>
            <div className="">
              <p className="text-sm">Saldo Ditarik</p>
              <p className="font-semibold text-2xl">{currency(props.balance?.debit_total ?? 0)}</p>
            </div>
          </div>
          <div className="text-end mt-2">
            <ModalButton id="modal_wallet" className='btn btn-sm btn-outline mr-2'>
              <i className="fas fa-wallet"></i>
              Riwayat
            </ModalButton>
            <Link href='/admin/withdraw/create' className='btn btn-sm btn-outline'>
              <i className="fas fa-arrow-right"></i>
              Tarik Saldo
            </Link>
          </div>
        </ReportCard>
      </div>
      <WalletModal/>
    </AuthenticatedLayout>
  );
}

const ReportCard = ({ children, label, icon }) => {
  return (
    <div className="border bg-blue-100 shadow-lg border-blue-200 bg-opacity-80 px-4 py-2 rounded-lg flex gap-2 w-full sm:w-max">
      <i className={`fas fa-3x opacity-80 ${icon}`}></i>
      <div className="">
        <p className="opacity-90">{label}</p>
        {children}
      </div>
    </div>
  )
}

const DefaultCard = () => {
  const { props } = usePage()

  return (
    <AuthenticatedLayout title={props.title}>
      <div className="flex flex-col items-center justify-center gap-4 pt-8">
        <p>
          Selamat Datang,{" "}
          <span className="font-semibold">
            {props.auth.user.name}
          </span>
        </p>
      </div>
    </AuthenticatedLayout>
  )
}

export default Index;
