import { filterAtom } from "@/atoms"
import { Link, usePage } from "@inertiajs/react"
import { useAtomValue } from "jotai"

function Pagination({ links }) {
  const { props } = usePage();
  const location = new URL(props.location);
  const params = new URLSearchParams(location.search);
  const filters = Object.keys(useAtomValue(filterAtom) ?? [])

  return (
    <nav aria-label="Pagination of Index Report">
      <ul className="flex list-style-none">
        {links.map((link, i) => {
          let pageParams
          if (link.url) {
            const pageUrl = new URL(link.url)
            pageParams = new URLSearchParams(pageUrl.search)
          }

          if (pageParams && params.get('searchBy')) {
            pageParams?.set("searchBy", params?.get('searchBy'));
          }
          if (pageParams && params.get('q')) {
            pageParams?.set("q", params?.get('q'));
          }
          if (pageParams && params.get('filter')) {
            pageParams?.set("filter", params?.get('filter'));
        }
          if (pageParams && params.get('status')) {
            pageParams?.set("status", params?.get('status'));
          }

          if (pageParams && params.get('sort')) {
            pageParams.set('sort', params.get('sort'))
          }
          
          if (pageParams && params.get('course_id')) {
            pageParams.set('course_id', params.get('course_id'))
          }

          if (filters?.length > 0) {
            for (const filter of filters) {
              if (pageParams && params.get(filter)) {
                pageParams.set(filter, params.get(filter))
              }
            }
          }

          return (
            <li key={i} aria-current="page">
              <Link
                className={`${link.active
                  ? "bg-blue-200 rounded-lg"
                  : "bg-transparent"
                  } relative block rounded py-1.5 px-3 text-sm text-neutral-500 transition-all duration-300 dark:text-neutral-400`}
                href={!link.url
                  ? "#"
                  : `${location.pathname}?${pageParams.toString()}`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  )
}

export default Pagination