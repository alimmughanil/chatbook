import { useSearchParams } from "@/utils/format"
import { Link, usePage } from "@inertiajs/react"

const ShowNavigation = ({ links, pageUrl, defaultActive = null }) => {
  const { props, url } = usePage()
  const { params } = useSearchParams(props.location)

  const defaultLink = links.find((link) => link.isDefault === true)
  const defaultShowName = defaultLink ? defaultLink.name : links.length > 0 ? links[0].name : null
  let activeShow = params.get("show")

  if (!activeShow) {
    let urlPaths = url.split(pageUrl)
    if (urlPaths.length > 0) {
      activeShow = urlPaths[0]?.split("/")?.[0] ?? defaultShowName
    }
  }
  if (!activeShow) {
    activeShow = defaultActive
  }

  let activeLink = links.find((link) => link.name === activeShow)
  if (!activeLink) {
    activeShow = defaultShowName
    activeLink = links.find((link) => link.name === activeShow)
  }
  const ActiveComponent = activeLink?.Component ? activeLink?.Component : () => <div className="text-red-500 p-4">Menu tidak ditemukan.</div>
  const wrapperClassName = activeLink?.wrapperClassName ? activeLink?.wrapperClassName : "mt-2 p-4 border rounded"

  return (
    <div className="w-full mt-2 relative max-h-[calc(100vh-5rem)] overflow-auto scrollbar-thin">
      <div className="flex items-center space-x-1 border-b p-2 rounded-t-md sticky top-0 bg-white z-10">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.url}
            preserveState
            preserveScroll
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
              link.name === activeShow ? "bg-blue-600 text-white shadow-sm" : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className={wrapperClassName}>{ActiveComponent && <ActiveComponent {...props} />}</div>
    </div>
  )
}

export default ShowNavigation
