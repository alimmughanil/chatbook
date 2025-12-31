import UserLayout from '@/Layouts/UserLayout';
import { FilterTabMenu, FilterTabSelect, CertificateCardList, EmptyData } from '@/Components/Card/UserDashboard';
import { router, usePage } from '@inertiajs/react';
import { useStatusLabel } from '@/utlis/useStatus';
import { useSearchParams } from '@/utlis/format';

const Index = () => {
  const { props } = usePage();
  const { params } = useSearchParams(props.location);
  const activeFilter = params.get('status') ?? '';

  let filters = props.status.map((status) => ({
    value: status,
    label: useStatusLabel(`certificate.${status}`),
  }));

  filters = [{ value: '', label: 'Semua' }, ...filters];

  const handleFilterChange = (value) => {
    params.set('status', value);
    router.get(`?${params.toString()}`);
  };

  const handleRedirect = (item) => {
    window.open(`/me/certificates/${item.id}`,'_parent');
  };

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto py-6 w-full">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 md:hidden">
          Sertifikat Saya
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <FilterTabMenu options={filters} onChange={handleFilterChange} active={activeFilter} />

          <div className="flex-1 w-full">
            <FilterTabSelect options={filters} onChange={handleFilterChange} active={activeFilter} />

            {props.certificates?.data?.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {props.certificates.data.map((item) => (
                  <CertificateCardList key={item.id} item={item} onClick={handleRedirect} />
                ))}
              </div>
            ) : (
              <EmptyData message="Tidak ada sertifikat ditemukan"/>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  )
}

export default Index;
