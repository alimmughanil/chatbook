import HomeLayout from '@/Layouts/HomeLayout'
import { Link, usePage } from '@inertiajs/react'
import Pagination from '@/Components/Pagination'
import SearchCard from '@/Components/Card/SearchCard'

const NavigationMenu = () => {
  const { url } = usePage()

  return (
    <div className='flex flex-wrap justify-center w-full gap-4'>
      <div className='flex flex-wrap justify-center w-full gap-4'>
        <Link href='/app/service' className={`rounded-full px-[14px] py-[5px] sm:px-[20px] sm:py-[8px] text-white font-normal sm:font-medium text-xs sm:text-sm ${url.startsWith('/app/service') ? 'linear-gradient-purple' : 'linear-gradient-yellow'}`}>
          Jasa
        </Link>
        <Link href='/app/category' className={`rounded-full px-[14px] py-[5px] sm:px-[20px] sm:py-[8px] text-white font-normal sm:font-medium text-xs sm:text-sm ${url.startsWith('/app/category') ? 'linear-gradient-purple' : 'linear-gradient-yellow'}`}>
          Kategori
        </Link>
      </div>
    </div>
  )
}

function ExploreLayout(state) {
  const { children, links, searchPlaceholder = 'Ketik disini', isNavigationMenu = true, HeadCard = null } = state
  const { auth, location } = usePage().props
  const path = new URLSearchParams(new URL(location).pathname)

  return (
    <HomeLayout auth={auth}>
      <div className="w-full">
        {isNavigationMenu && !HeadCard ? <NavigationMenu /> : null}
        {HeadCard ? <HeadCard /> : null}
      </div>
      <SearchCard searchPath={''} placeholder={searchPlaceholder} />

      <div className='w-full'>{children}</div>
      <div className='grid w-full max-w-4xl mx-auto mb-8 place-content-center 2xl:max-w-7xl'>
        <Pagination links={links} />
      </div>
    </HomeLayout>
  )
}

export default ExploreLayout
