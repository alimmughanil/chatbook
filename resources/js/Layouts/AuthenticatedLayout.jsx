import SideNavbar from "@/Components/SideNavbar"
import Sidebar from "@/Components/Sidebar"
import { Head, usePage } from "@inertiajs/react"
import FlashMessage from "@/Components/FlashMessage"
import { SidebarInset, SidebarProvider } from "@/Components/ui/sidebar"
import { Home, Users, Settings, Rss } from "lucide-react"
import { getCookie } from "@/utils/format"

function AuthenticatedLayout({ title, children, Breadcrumb = null, auth }) {
  const sidebarMenu = useSidebarMenu()
  const defaultOpen = getCookie("sidebar_state") === "true"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Head title={title} />
      <Sidebar menu={sidebarMenu} />
      <SidebarInset>
        <main className="w-full">
          <SideNavbar Breadcrumb={Breadcrumb} isNotification={true} />
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
      icon: Home,
      link: "/admin/dashboard",
    },
    {
      title: "Pengguna",
      icon: Users,
      link: "/admin/users",
    },
    {
      title: 'Produk',
      fa_icon: 'fas fa-box-open',
      icon_provider: 'fontawesome',
      link: '/admin/product'
    },
    {
      title: "Pesanan",
      fa_icon: "fas fa-shopping-cart",
      icon_provider: "fontawesome",
      link: "/admin/order",
    },
    {
      title: 'Rekening Bank',
      fa_icon: 'fas fa-money-check-dollar',
      icon_provider: "fontawesome",
      link: '/admin/bank'
    },
    {
      title: 'Penarikan Dana',
      fa_icon: 'fas fa-money-bill-transfer',
      icon_provider: "fontawesome",
      link: '/admin/withdraw'
    },
    {
      title: "Kategori",
      fa_icon: "fas fa-tags",
      icon_provider: "fontawesome",
      link: "/admin/categories",
    },
    {
      title: 'Tag',
      fa_icon: 'fas fa-hashtag',
      icon_provider: 'fontawesome',
      link: '/admin/tag'
    },
    {
      title: 'Pricing',
      fa_icon: 'fas fa-tags',
      icon_provider: 'fontawesome',
      link: '/admin/pricing'
    },
    {
      title: "Kotak Masuk",
      fa_icon: "fas fa-envelope",
      icon_provider: "fontawesome",
      link: "/admin/contact",
    },
    {
      title: "Blog",
      icon: Rss,
      dropdown: [
        {
          title: "Kategori Blog",
          link: "/admin/blog/blog_categories"
        },
        {
          title: "Artikel Blog",
          link: "/admin/blog/blogs"
        }
      ]
    },
    {
      title: "Portofolio",
      fa_icon: "fas fa-business-time",
      icon_provider: "fontawesome",
      dropdown: [
        {
          title: "Kategori",
          link: "/admin/portfolio/category",
        },
        {
          title: "Proyek",
          link: "/admin/portfolio/project",
        },
      ],
    },
    {
      title: "Konfigurasi",
      icon: Settings,
      dropdown: [
        {
          title: "Pengaturan Umum",
          link: "/admin/configuration",
        },
        {
          title: "Daftar Bank",
          link: "/admin/supported-bank",
        },
      ],
    },
  ]

  let routes = []

  if (["editor"].includes(user?.role)) {
    routes = ["/admin/dashboard"]
  }

  if (["partner"].includes(user?.role)) {
    routes = [
      '/admin/dashboard',
      '/admin/product',
      '/admin/order',
      '/admin/withdraw',
      '/admin/bank',
      "/app/profile",
    ]
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
