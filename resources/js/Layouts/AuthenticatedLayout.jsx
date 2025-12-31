import SideNavbar from "@/Components/SideNavbar"
import Sidebar from "@/Components/Sidebar"
import { Head, usePage } from "@inertiajs/react"
import FlashMessage from "@/Components/FlashMessage"
import { SidebarInset, SidebarProvider } from "@/Components/ui/sidebar"
import { Home, Users, Settings } from "lucide-react"
import { getCookie } from "@/utlis/format"

function AuthenticatedLayout({ title, children, Breadcrumb = null, auth }) {
  const sidebarMenu = useSidebarMenu()
  const defaultOpen = getCookie("sidebar_state") === "true"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Head title={title} />
      <Sidebar menu={sidebarMenu} />
      <SidebarInset>
        <main className="w-full">
          <SideNavbar Breadcrumb={Breadcrumb} />
          <div className="sm:px-4 py-1 w-full">
            <FlashMessage />
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

const useSidebarMenu = () => {
  const { user } = usePage().props.auth

  let sidebarMenu = [
    {
      title: "Dashboard",
      fa_icon: "fas fa-tachometer-alt fa-fw",
      icon: Home,
      link: "/admin/dashboard",
    },
    {
      title: "Pengguna",
      fa_icon: "fas fa-users",
      icon: Users,
      link: "/admin/users",
    },
    {
      title: "Data Dokter",
      fa_icon: "fas fa-stethoscope",
      icon: Stethoscope,
      link: "/admin/doctors",
    },
    {
      title: "Data Pasien",
      fa_icon: "fas fa-hospital-user",
      icon: Hospital,
      link: "/admin/patients",
    },
    {
      title: "Konfigurasi",
      fa_icon: "fas fa-gear",
      icon: Settings,
      dropdown: [
        {
          title: "Pengaturan Umum",
          link: "/admin/configuration",
        },
      ],
    },
  ]

  let routes = []

  if (["editor"].includes(user?.role)) {
    routes = ["/admin/dashboard"]
  }

  if (routes.length > 0) {
    sidebarMenu = sidebarMenu.filter((menu) => {
      if (!menu.link && !!menu.dropdown) {
        menu.dropdown = menu.dropdown.filter((subMenu) => {
          return routes.includes(subMenu.link)
        })

        return menu.dropdown.length > 0
      }

      return routes.includes(menu.link)
    })
  }

  return sidebarMenu
}
export default AuthenticatedLayout
