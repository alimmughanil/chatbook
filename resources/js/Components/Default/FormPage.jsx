import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, usePage } from "@inertiajs/react";

function FormPage({ children }) {
  const { props } = usePage()
  return (
    <AuthenticatedLayout title={props.title} Breadcrumb={Breadcrumb}>
      <div className="flex flex-wrap items-center justify-center w-full gap-4 pt-2 sm:pt-0">
        {children}
      </div>
    </AuthenticatedLayout>
  );
}

const Breadcrumb = ({ currentLabel }) => {
  const { props } = usePage()

  let parentUrl = props.location.split(`${props.page.name}`)
  parentUrl = `${parentUrl[0]}${props.page.name}`

  return (
    <div className='text-sm text-gray-500 breadcrumbs overflow-auto scrollbar-none'>
      <ul>
        <li><Link href={parentUrl} className="text-primary hover:underline">{props.page?.label}</Link></li>
        <li><Link href={props.location} className="hover:underline">{currentLabel}</Link></li>
      </ul>
    </div>
  )
}

export default FormPage;
