import { useForm } from '@inertiajs/react';
import HomeLayout from '@/Layouts/HomeLayout';
import { ArrowRight, Package, AlertCircle, Lock } from 'lucide-react';
import { currency } from '@/utils/format';

export default function Create({ auth, product, errors }) {
  const { data, setData, post, processing } = useForm({
    product_id: product.id,
    note: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/app/order');
  };

  return (
    <HomeLayout auth={auth}>
      <div className="min-h-screen bg-white sm:border w-full max-w-7xl py-8 md:py-12">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-lg lg:text-2xl font-bold text-gray-900">Buat Pesanan</h1>
            <p className="text-gray-500 text-sm mt-1">Selesaikan pembayaran untuk memulai proyek anda.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT COLUMN - Order Details & Form */}
            <div className="lg:col-span-8 space-y-6">

              {/* Card: Informasi Produk */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex gap-4 items-start">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.thumbnail || '/images/default.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <Package size={14} />
                      <span>Produk: <span className="font-semibold text-[#6017BE]">{product.name}</span></span>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gray-50/50">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Deskripsi Produk:</p>
                  <div
                    className="text-sm text-gray-600 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              </div>

              {/* Card: Catatan Tambahan */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan untuk Freelancer (Opsional)</label>
                <textarea
                  className="w-full rounded-lg border-gray-300 focus:border-[#6017BE] focus:ring focus:ring-[#6017BE]/20 transition-all"
                  rows="4"
                  placeholder="Jelaskan detail kebutuhan spesifik anda disini..."
                  value={data.note}
                  onChange={e => setData('note', e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* RIGHT COLUMN - Summary & Action */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4">Ringkasan Pembayaran</h3>

                <div className="space-y-3 mb-6 border-b border-gray-100 pb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Harga Produk</span>
                    <span>{currency(product.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Biaya Layanan</span>
                    <span>{currency(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-green-600">
                    <span>Diskon</span>
                    <span>-</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-gray-900">Total Bayar</span>
                  <span className="font-bold text-xl text-[#6017BE]">{currency(product.price)}</span>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-[#6017BE] text-white py-3 rounded-xl font-bold hover:bg-[#4c1296] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {processing ? 'Memproses...' : 'Bayar Sekarang'}
                  {!processing && <ArrowRight size={18} />}
                </button>

                <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <Lock size={14} className="mt-0.5 flex-shrink-0" />
                  <p>Pembayaran anda dijamin aman. Dana akan diteruskan ke freelancer setelah pekerjaan selesai.</p>
                </div>

                {errors && Object.keys(errors).length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold">Terjadi Kesalahan</p>
                      <ul className="list-disc pl-4 mt-1">
                        {Object.values(errors).map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </form>
        </div>
      </div>
    </HomeLayout>
  );
}