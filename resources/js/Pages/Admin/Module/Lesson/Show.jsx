import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { usePage } from "@inertiajs/react"
import LessonIndex from "./Index"
import DetailModalItem from "@/Components/Default/DetailModalItem"
import ShowNavigation from "@/Components/Default/ShowNavigation"

function Show(props) {
  const links = useShowNavigation()

  return (
    <AuthenticatedLayout title={props?.title}>
      <ShowNavigation links={links} pageUrl={props?.page?.url} />
    </AuthenticatedLayout>
  )
}

const DetailShow = () => {
  const { props } = usePage()
  let tableHeader = LessonIndex.tableHeader()
  let hiddenHeader = ["numbering", "action"]
  tableHeader = tableHeader.filter((header) => !hiddenHeader.includes(header.type))

  const rowPropsBase = {
    wrapperClassName: "flex flew-row flex-wrap justify-between",
    labelClassName: "flex-1 font-medium text-sm md:text-base",
    valueClassName: "text-sm md:text-base",
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
      url: "?show=detail",
      isDefault: true,
      Component: DetailShow,
      wrapperClassName: "w-full max-w-5xl border p-4 mt-2",
    },
  ]

  return links
}

Show.navigation = useShowNavigation
const LessonShow = Show
export default LessonShow
