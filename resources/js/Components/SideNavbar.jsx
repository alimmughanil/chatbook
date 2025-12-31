import { Link, usePage } from "@inertiajs/react"
import { SidebarTrigger } from "./ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"

function SideNavbar({ Breadcrumb = null }) {
  const { props, url } = usePage()
  const { auth, title } = props
  const { user } = auth
  const picture = user?.picture ? user.picture : `/image/user.png`

  return (
    <div className="sticky top-0 left-0 bg-base-100 z-10 border-b">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2 flex-1">
          <SidebarTrigger />
          {Breadcrumb ? (
            <div className="[&_*]:text-sm max-w-[70vw] lg:max-w-[78vw] overflow-auto scrollbar-none">
              <Breadcrumb currentLabel={title} />
            </div>
          ) : (
            <Link href={url} className="normal-case text-sm">
              {title}
            </Link>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-10 h-10 border-2 rounded-full overflow-hidden cursor-pointer">
              <img src={picture} alt="Account" width={40} height={40} />
            </div>
          </DropdownMenuTrigger>

          {/* Bagian Content (yang muncul) */}
          <DropdownMenuContent className="p-4 w-64 mt-2" align="end">
            <div className="flex flex-col gap-4">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 rounded-full overflow-hidden">
                  <img src={picture} alt="Account" width={40} height={40} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">{user?.name}</span>
                  <span className="text-sm text-gray-500">{user?.email}</span>
                </div>
              </div>

              {/* Action Links */}
              <div className="flex justify-between">
                {/* Tidak perlu <NavigationMenuLink> lagi */}
                <a href="/" className="text-gray-700 hover:text-primary">
                  <i className="fas fa-home fa-lg"></i>
                </a>

                <Link href="/profile" className="text-gray-700 hover:text-primary">
                  <i className="fas fa-gear fa-lg"></i>
                </Link>

                <a href="#logout-confirm" className="text-gray-700 hover:text-primary">
                  <i className="fas fa-sign-out-alt fa-lg"></i>
                </a>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default SideNavbar
