import ApplicationLogo from '@/Components/ApplicationLogo'
import FlashMessage from '@/Components/FlashMessage'
import Footer from '@/Components/Footer'
import LogoutModal from '@/Components/LogoutModal'
import { Head, Link, usePage } from '@inertiajs/react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/Components/ui/dropdown-menu";

function HomeLayout({ Breadcrumb = null, footer = true, children, className = null }) {
  const { props } = usePage()
  const { title } = props

  return (
    <>
      <Head title={title} />
      <div className={`${className ?? "relative flex flex-col justify-between w-full min-h-screen max-w-[100vw] overflow-hidden"}`}>
        <div className="">
          <NavBar />
          <div className="mx-auto pt-16 flex flex-col px-[20px] sm:px-[70px] justify-center items-center w-full mt-[2rem]">
            {Breadcrumb ? <Breadcrumb /> : null}
            {children}
          </div>
        </div>
        {footer ? <Footer /> : null}
      </div>
      <FlashMessage />
      <LogoutModal />
    </>
  )
}


const NavBar = () => {
  const { props } = usePage()
  const user = props?.auth?.user

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 flex flex-col"
      style={{
        backgroundImage: 'linear-gradient(90deg, rgba(96, 23, 190, 1), rgba(131, 51, 234, 1))',
        height: 'auto',
      }}
    >

      <div
        className="flex px-[20px] md:px-[70px] justify-between items-center w-full py-4"
      >
        <a href='/'>
          <ApplicationLogo />
        </a>

        {user ? (
          <Auth />
        ) : (
          <Link href='/login' type="button" className="flex btn btn-sm btn-primary bg-bg-button text-white px-4">
            <span>Sign In</span>
            <img
              src="/assets/icons/Profile.svg"
              alt=""
              className="w-[20px]"
            />
          </Link>
        )}
      </div>
    </nav>
  )
}

const Auth = () => {
  const user = usePage().props.auth.user
  const picture = user?.picture ? user.picture : `/image/user.png`

  return user?.role == 'user' ? <ProfileDropdown user={user} picture={picture} /> : (
    <Link href={'/app/dashboard'} className="whitespace-pre btn-primary btn btn-sm">
      Dashboard
    </Link>
  )
}

function ProfileDropdown({ user, picture }) {
  const navbarMenu = [
    {
      title: 'Pesanan Saya',
      src: 'fas fa-2x fa-shopping-cart',
      link: '/me/orders',
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full border-2 w-10 h-10 overflow-hidden">
          <img
            src={picture}
            alt="Account"
            className="w-full h-full object-cover"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 p-5 z-50 rounded-xl shadow-lg space-y-5 relative"
      >
        <a href="#logout-confirm" className="btn btn-sm btn-ghost absolute top-4 right-4 text-gray-600 hover:text-red-600 transition">
          <i className="fas fa-sign-out-alt"></i>
          <p className="text-base font-medium">Keluar</p>
        </a>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 mb-3">
            <img
              src={picture}
              alt="Account"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="font-bold text-base">{user?.name}</div>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {navbarMenu.map((menu, i) => (
            <Link
              key={i}
              href={menu.link}
              className="flex flex-col items-center gap-2 text-gray-700 hover:text-primary transition"
            >
              <i className={menu.src}></i>
              <p className="text-xs mx-auto text-center">{menu.title}</p>
            </Link>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export default HomeLayout
