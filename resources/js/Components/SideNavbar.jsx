import { Link, router, usePage } from "@inertiajs/react"
import { SidebarTrigger } from "./ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { formatDistance } from "date-fns"
import { id } from "date-fns/locale"

function SideNavbar({ Breadcrumb = null, isNotification = false }) {
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

        {isNotification ? (
          <NotificationDropdown />
        ) : null}

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

                <Link href="/app/profile" className="text-gray-700 hover:text-primary">
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

function NotificationDropdown() {
  const { notification, notification_count } = usePage().props

  const handleClickLink = async (data) => {
    if (!data.read_at) router.put(`/admin/notifications/${data.id}`)

    if (data.type?.includes("REQUEST_PRODUCT")) {
      return router.visit(`/admin/product/${data.type.split("=").pop()}`)
    }    

    switch (data.type) {
      case "PAYMENT_SUCCESS":
        return router.visit(`/admin/order?q=${data.order?.order_number}&searchBy=order_number`)
      case "FIRSTLOGIN":
        return null
      default:
        return router.visit(`/admin/order?q=${data.order?.order_number}&searchBy=order_number`)
    }
  }

  const handleClickUpdateAll = () => {
    router.put(`/admin/notifications/readAll`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100">
          <i className="fas fa-bell text-xl text-gray-600"></i>
          {parseInt(notification_count) !== 0 && (
            <div className="absolute bg-red-600 text-white w-[18px] h-[18px] -top-1 -right-1 rounded-full text-[10px] flex items-center justify-center">
              {notification_count}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[320px] p-0 rounded-lg shadow"
      >
        {notification.length > 0 ? (
          <>
            <div className="flex items-center justify-between p-3 border-b">
              <p className="font-bold">Notifikasi</p>
              <button
                onClick={handleClickUpdateAll}
                className="text-xs text-blue-600 hover:underline"
              >
                Tandai baca semua
              </button>
            </div>

            <ScrollArea className="max-h-[70vh]">
              <div className="flex flex-col">
                {notification.map((el) => (
                  <div
                    key={el.id}
                    onClick={() => handleClickLink(el)}
                    className={`p-3 pr-10 hover:bg-slate-200 border-b last:border-none relative ${el.read_at ? "text-gray-500" : "cursor-pointer"
                      }`}
                  >
                    {!el.read_at && (
                      <div className="absolute bg-blue-600 rounded-full w-[14px] h-[14px] right-3 top-1/2 -translate-y-1/2" />
                    )}

                    <p className="mb-1">{el.body}</p>
                    <small className={el.read_at ? "" : "text-blue-700"}>
                      {formatDistance(el.created_at, new Date(), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </small>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="text-center p-8">Tidak ada notifikasi</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default SideNavbar
