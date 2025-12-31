import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Link, usePage } from "@inertiajs/react"
import CourseIndex from "./Index"
import DetailModalItem from "@/Components/Default/DetailModalItem"
import ShowNavigation from "@/Components/Default/ShowNavigation"
import ModuleIndex from "../Module/Module/Index"

function Show(props) {
  const links = useShowNavigation()

  return (
    <AuthenticatedLayout title={props?.title} Breadcrumb={Breadcrumb}>
      <ShowNavigation links={links} pageUrl={props?.page?.url} />
    </AuthenticatedLayout>
  )
}

const Breadcrumb = ({ currentLabel }) => {
  const { props } = usePage()
  return (
    <div className='text-sm text-gray-500 breadcrumbs overflow-auto scrollbar-none'>
      <ul>
        <li><Link href='/admin/courses' className="text-primary hover:underline">Kursus</Link></li>
        <li><Link href={props.location} className="hover:underline">{currentLabel}</Link></li>
      </ul>
    </div>
  )
}

const DetailShow = () => {
  const { props } = usePage()
  let tableHeader = CourseIndex.tableHeader()
  let hiddenHeader = ["numbering", "action"]
  tableHeader = tableHeader.filter((header) => !hiddenHeader.includes(header.type))

  const rowPropsBase = {
    wrapperClassName: "flex flex-col sm:flex-row lg:gap-4 flex-wrap",
    labelClassName: "min-w-[15rem] font-medium sm:font-normal",
    valueClassName: "flex-1 text-sm md:text-base",
    emptyCheck: false,
  }

  return (
    <div>
      <DetailModalItem data={props?.[props?.page?.name]} tableHeader={tableHeader} rowPropsBase={rowPropsBase} className={"flex flex-col w-full"} />
    </div>
  )
}

const useShowNavigation = (pageUrl = null) => {
  const { props } = usePage()

  if (!pageUrl) {
    pageUrl = props?.page?.url
  }

  let links = [
    {
      name: "detail",
      label: "Detail",
      url: `${pageUrl}?show=detail`,
      isDefault: true,
      Component: DetailShow,
      wrapperClassName: "w-full border p-4 mt-2"
    },
    {
      name: "modules",
      label: "Modul",
      url: `${pageUrl}/modules`,
      Component: ModuleIndex.Table,
    },
  ]

  return links
}

Show.navigation = useShowNavigation
const CourseShow = Show
export default CourseShow
