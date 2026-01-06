import UserLayout from "@/Layouts/UserLayout";
import { usePage } from "@inertiajs/react";
import { currency, dateTime } from "@/utils/format";
import { useStatus } from "@/utils/useStatus";

function Show(props) {
  const { transaction } = usePage().props;

  return (
    <UserLayout headLabel={`Detail Transaksi`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-lg lg:text-2xl font-bold text-gray-800">
                    {transaction.shop_name || 'Transaksi'} {transaction.description ? `- ${transaction.description}` : ''}
                  </h1>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <i className="far fa-calendar"></i>
                    <span>{dateTime(transaction.date)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-sm text-gray-500">
                Kategori: <span className="font-semibold text-gray-700">{transaction.category?.name ?? '-'}</span>
              </div>
              <div className="text-xl font-bold text-gray-800">
                {currency(transaction.amount)}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Rincian</h3>
            {/* Add more details if available in transaction model, currently just basic info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500 block text-sm">Deskripsi</span>
                <span className="text-gray-800 font-medium">{transaction.description || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-sm">Toko / Merchant</span>
                <span className="text-gray-800 font-medium">{transaction.shop_name || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-sm">Tanggal Input</span>
                <span className="text-gray-800 font-medium">{dateTime(transaction.created_at)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </UserLayout>
  );
}

export default Show;
