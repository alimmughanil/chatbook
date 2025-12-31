import UserLayout from '@/Layouts/UserLayout';
import { EmptyData, FilterTabMenu, FilterTabSelect, OrderCardList } from '@/Components/Card/UserDashboard';
import { router, usePage } from '@inertiajs/react';
import { useSearchParams } from '@/utils/format';
import { useStatusLabel } from '@/utils/useStatus';

const Index = () => {
  const { props } = usePage();
  const { params } = useSearchParams(props.location);
  const activeFilter = params.get('status') ?? '';

  let filters = props.status.map((status) => ({
    value: status,
    label: useStatusLabel(`order.${status}`),
  }));

  filters = [{ value: '', label: 'Semua' }, ...filters];

  const handleFilterChange = (value) => {
    params.set('status', value);
    router.get(`?${params.toString()}`);
  };

  const handleRedirect = (item) => {
    router.visit(`/app/order/${item.order_number}`);
  };

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto py-6 w-full">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 md:hidden">
          Pesanan Saya
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <FilterTabMenu options={filters} onChange={handleFilterChange} active={activeFilter} />

          <div className="flex-1 w-full">
            <FilterTabSelect options={filters} onChange={handleFilterChange} active={activeFilter} />

            {props.orders?.data?.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {props.orders.data.map((item) => (
                  <OrderCardList key={item.id} item={item} onClick={handleRedirect} />
                ))}
              </div>
            ) : (
              <EmptyData message="Tidak ada pesanan ditemukan" />
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Index;
