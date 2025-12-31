import UserLayout from '@/Layouts/UserLayout';
import { CourseCardList, EmptyCourseFilter, FilterTabMenu, FilterTabSelect } from '@/Components/Card/UserDashboard';
import { router, usePage } from '@inertiajs/react';
import { useStatusLabel } from '@/utlis/useStatus';
import { useSearchParams } from '@/utlis/format';
import RatingFormModal from '@/Components/Modal/RatingFormModal';
import { showModalAtom } from '@/atoms';
import { useAtom } from 'jotai';

const Index = () => {
  const { props } = usePage()
  const {params} = useSearchParams(props.location)
  const activeFilter = params.get('progress') ?? '';

  let filters = props.status.map((status) => ({
    value: status,
    label: useStatusLabel(`lesson.progress.${status}`),
  }))

  filters = [
    { value: '', label: 'Semua' },
    ...filters,
  ];  

  const handleFilterChange = (value) => {    
    params.set('progress', value);
    router.get(`?${params.toString()}`)
  };
  
  const [show, setShow] = useAtom(showModalAtom)

  const handleRedirect = (course) => {
    router.visit(`/course/${course.slug}/module`, {
      method: 'get',
    })
  }

  return (
    <UserLayout links={props.course?.links}>
      <div className="max-w-7xl mx-auto py-6 w-full">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 md:hidden">Kelas Saya</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <FilterTabMenu options={filters} onChange={handleFilterChange} active={activeFilter} />
          <div className="flex-1 w-full">
            <FilterTabSelect options={filters} onChange={handleFilterChange} active={activeFilter} />

            {props.course?.data?.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {props.course?.data?.map((course) => (
                  <CourseCardList key={course.id} course={course} onClick={handleRedirect} />
                ))}
              </div>
            ) : (
              <EmptyCourseFilter />
            )}

          </div>
        </div>
      </div>

      {show ? (
        <RatingFormModal data={show} handleClick={()=>setShow(null)}/>
      ): null}
    </UserLayout>
  );
}


export default Index;