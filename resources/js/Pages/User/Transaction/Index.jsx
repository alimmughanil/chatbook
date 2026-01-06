import UserLayout from '@/Layouts/UserLayout';
import { EmptyData, FilterTabMenu, FilterTabSelect, TransactionCardList } from '@/Components/Card/UserDashboard';
import { router, usePage } from '@inertiajs/react';
import { useSearchParams } from '@/utils/format';
import { useStatusLabel } from '@/utils/useStatus';

import TransactionSummary from './Partials/TransactionSummary';

const Index = () => {
  const { props } = usePage();
  const { params } = useSearchParams(props.location);
  const activeFilter = params.get('type') ?? '';

  let filters = props.typeOptions.map((type) => ({
    value: type,
    label: type === 'income' ? 'Pemasukan' : 'Pengeluaran', // Manual mapping or use util helper if available for enum labels
  }));

  filters = [{ value: '', label: 'Semua' }, ...filters];

  const handleFilterChange = (value) => {
    params.set('type', value);
    router.get(`?${params.toString()}`);
  };

  const handleRedirect = (item) => {
    router.visit(`/app/transactions/${item.id}`);
  };

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto py-6 w-full">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 md:hidden">
          Transaksi Saya
        </h1>

        <TransactionSummary summary={props.summary} />

        <div className="flex flex-col md:flex-row gap-8">
          <FilterTabMenu options={filters} onChange={handleFilterChange} active={activeFilter} />

          <div className="flex-1 w-full">
            <FilterTabSelect options={filters} onChange={handleFilterChange} active={activeFilter} />

            {props.transactions?.data?.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {props.transactions.data.map((item) => (
                  <TransactionCardList key={item.id} item={item} onClick={handleRedirect} />
                ))}
              </div>
            ) : (
              <EmptyData message="Tidak ada transaksi ditemukan" />
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Index;
