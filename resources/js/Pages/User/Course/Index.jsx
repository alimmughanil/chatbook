import CategoryCard from '@/Components/Card/CategoryCard'
import CourseCard from '@/Components/Card/CourseCard'
import ExploreLayout from '@/Layouts/ExploreLayout'
import { usePage } from '@inertiajs/react'
import { Fragment } from 'react'

function Index(props) {
  const { course } = props

  return (
    <ExploreLayout links={course.links} HeadCard={props?.category || props?.company ? HeadCard : null} searchPlaceholder='Cari acara pilihan anda'>
      <CourseIndex />
    </ExploreLayout>
  )
}

const HeadCard = () => {
  const { category } = usePage().props
  if (category) return <CategoryCard category={category} isShowButton={false} type='index' />
}

export const CourseIndex = () => {
  const { course } = usePage().props

  return (
    <div className='w-full py-4 mb-8'>
      <p className='w-full px-4 pb-2 text-center'>
        Menampilkan <span className='font-semibold'>{course.total}</span> Kursus
      </p>

      {course.data.length == 0 ? (
        <p className="pt-4 pb-8">Belum ada data yang dapat ditampilkan</p>
      ) : (
        <div className="grid justify-center gap-6 w-full grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
          {course?.data?.map((course) => (
            <Fragment key={course.id}>
              <CourseCard course={course} />
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

export default Index
