import { currency, dateFormat, isFunction, isNumber, paginationNumber, sortArray, sortBy, useSearchParams } from "@/utils/format"
import { Link, router, usePage } from "@inertiajs/react"
import { Fragment, useState } from "react"
import Pagination from "./Pagination"
import useLang from "@/utils/useLang"
import useStatus, { useStatusLabel } from "@/utils/useStatus"
import SearchInput from "./SearchInput"
import { ButtonLabel, FilterModal, filterResetAction } from "./FilterCard"
import { useAtom, useAtomValue } from "jotai"
import { filterAtom, showModalAtom } from "@/atoms"
import { ModalButton } from "./WithModal"
import { useEffect } from "react"
import DetailModalItem from "./Default/DetailModalItem"
import { isMobile } from "react-device-detect"
import { useSidebar } from "./ui/sidebar"
import { ArrowUp, ArrowDown, InboxIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import DropdownAction from "./Default/DropdownAction"

function Table(props) {
  const { location, page } = usePage().props
  const { tableHeader, tableBody = [], tableAction = null, tableFooter = null, tableRender = null, headerSection = null } = props
  const { bottomLeftSection = null, bottomCenterSection = null, bottomRightSection = null } = props
  const { tablePage = null, children = null, headerCenterButton = null, headerLeftButton = null, headerRightButton = null } = props
  const { search = false, filter = false, filterOptions = null, maxWidth = null } = props
  const { addButton = true, addLink = `${page?.url}/create`, cardChecbox = true } = props
  let { tdBodyClassName = "text-start whitespace-pre md:whitespace-normal" } = props
  let { trBodyClassName = "text-start" } = props

  const [isDomLoaded, setIsDomLoaded] = useState(false)

  let isTableView = !isMobile
  if (window?.localStorage?.getItem("isTableView")) {
    isTableView = window?.localStorage?.getItem("isTableView") == "true"
  }

  const [isTable, setIsTable] = useState(isTableView)

  useEffect(() => {
    setIsDomLoaded(true)
    if (window?.localStorage?.getItem("isTableView")) {
      setIsTable(window?.localStorage?.getItem("isTableView") == "true")
    }

    return () => { }
  }, [])

  useEffect(() => {
    if (window?.localStorage && window?.localStorage?.getItem("isTableView") != isTable) {
      window?.localStorage.setItem("isTableView", isTable)
    }

    return () => { }
  }, [isTable])

  const { params } = useSearchParams(location)

  const searchable = !!tableHeader ? tableHeader?.filter((header) => !!header?.isSearchable && !header?.isHidden) : null
  const filters = Object.keys(useAtomValue(filterAtom) ?? [])

  let isActiveFilter = false
  for (const filter of filters) {
    if (params.get(filter) && params.get(filter) != "") {
      isActiveFilter = true
      continue
    }
  }

  const [sort, setSort] = useState({
    by: null,
    asc: false,
  })

  const handleSortBy = (header) => {
    setSort((state) => ({
      ...state,
      by: header.value,
      asc: !state.asc,
    }))
    params.delete("sort")
    params.delete("sortDirection")
    router.visit(`?${params.toString()}`, {
      method: "get",
      preserveState: true,
      preserveScroll: true,
      async: false,
    })
  }

  const currentServerSort = params.get("sort")
  const currentServerDirection = params.get("sortDirection")

  const TableRender = tableRender
  const sidebar = useSidebar()

  return (
    <div
      className={`relative w-full min-h-[68dvh] flex flex-col items-center pt-2 ${maxWidth ?? "max-w-[calc(100vw-0.5rem)] sm:max-w-[calc(100vw-5rem)]"}`}
    >
      <div className="flex flex-col items-center lg:items-center justify-between w-full gap-4 md:flex-row">
        <div className={`order-2 md:order-1 ${!headerCenterButton ? "flex-1" : ""}`}>
          <div className="flex flex-wrap items-center gap-2 place-content-center md:place-content-start">
            {filter && filterOptions ? (
              <>
                <div className="m-1">
                  <ModalButton id={`modal_filter`} btnLabel={<ButtonLabel />} />
                </div>
                {isActiveFilter ? (
                  <button onClick={(e) => filterResetAction(e, location, filters)} className="btn btn-error btn-xs">
                    Hapus Filter
                  </button>
                ) : null}
              </>
            ) : null}
            {cardChecbox ? (
              <div className="form-control mr-auto">
                <label className="label cursor-pointer">
                  <input type="checkbox" checked={isTable} onChange={(e) => setIsTable(e.target.checked)} className="checkbox checkbox-sm" />
                  <span className="label-text pl-2">Tampilan Tabel</span>
                </label>
              </div>
            ) : null}
            {headerLeftButton && typeof headerLeftButton === "function" && headerLeftButton()}
          </div>
        </div>

        <div className="order-1 md:order-2 flex flex-col md:flex-row gap-2">
          {headerCenterButton && typeof headerCenterButton === "function" && headerCenterButton()}
        </div>

        <div className="order-3 flex flex-col sm:flex-row gap-2 items-center">
          {search ? <SearchInput searchable={searchable} /> : null}
          {addButton ? (
            <Link href={addLink} className="btn btn-primary w-max btn-sm text-white">
              <i className="fas fa-plus"></i>
              Tambah
            </Link>
          ) : null}
          {headerRightButton && typeof headerRightButton === "function" && headerRightButton()}
        </div>
      </div>

      {headerSection && typeof headerSection === "function" && headerSection()}

      {!!TableRender ? (
        <TableRender {...props} />
      ) : (
        <>
          {isTable ? (
            <div
              className={cn(
                "overflow-auto flex-1 max-h-[62dvh] sm:max-h-[calc(100vh-11.5rem)] mt-1",
                !sidebar?.open
                  ? "w-full max-w-[calc(100vw-0.25rem)] md:max-w-[calc(100vw-6rem)]"
                  : "w-full max-w-[calc(100vw-0.25rem)] md:max-w-[calc(100vw-19rem)]",
              )}
            >
              <table className={`table table-zebra table-pin-rows table-pin-cols relative border-[1.5px] ${tableHeightStyle}`}>
                <thead className="border-b-[1.5px]">
                  <tr className="">
                    {tableHeader.map((header, i) => {
                      if ("isDetail" in (header || {}) && header.isDetail === true) return null
                      if ("isHidden" in (header || {}) && header.isHidden === true) return null
                      const Tag = i === 0 ? "th" : "td"

                      let isSortable = true
                      if ("isSortable" in (header || {}) && header.isSortable === false) {
                        isSortable = false
                      }
                      const isClientSort = header?.isClientSort ?? false

                      const isClientSorted = sort.by === header.value
                      const isServerSorted = currentServerSort === header.value
                      const isSorted = isClientSorted || isServerSorted

                      let direction = null
                      if (isClientSorted) {
                        direction = sort.asc ? "asc" : "desc"
                      } else if (isServerSorted) {
                        direction = currentServerDirection || "asc"
                      }

                      return (
                        <Tag key={i} scope="col" className="text-start">
                          <button
                            onClick={() => (isSortable ? (!!isClientSort ? handleSortBy(header) : sortBy(header.value, router, params)) : null)}
                            className={cn(
                              "flex items-center gap-1 text-sm",
                              header?.headerClassName,
                              isSorted && isSortable ? "bg-primary text-gray-100 px-2 rounded-lg font-normal" : "",
                              !isSortable && "cursor-not-allowed",
                            )}
                            disabled={!isSortable}
                          >
                            {header.label}

                            {isSorted && isSortable && direction === "asc" && <ArrowUp className="h-4 w-4" />}
                            {isSorted && isSortable && direction === "desc" && <ArrowDown className="h-4 w-4" />}
                          </button>
                        </Tag>
                      )
                    })}
                  </tr>
                </thead>
                <tbody className="relative">
                  {!!children ? (
                    children
                  ) : tableBody.length == 0 ? (
                    <tr>
                      <td colSpan={tableHeader.length} className="!py-8">
                        <NoData />
                      </td>
                    </tr>
                  ) : (
                    <>
                      {tableBody.sort(sortArray(sort.by, sort.asc)).map((body, index) => {
                        let tdProps = { index, props, body, tableHeader, tdBodyClassName, trBodyClassName, tableAction }

                        return (
                          <tr key={index} className={trBodyClassName}>
                            <TableContent {...tdProps} />
                          </tr>
                        )
                      })}

                      {tableFooter &&
                        typeof tableFooter === "function" &&
                        tableFooter({ tableBody, tableHeader, defaultClassName: { tdBodyClassName, trBodyClassName } })}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <TableCard props={props} tableBody={tableBody} tableHeader={tableHeader} />
          )}
        </>
      )}
      <div className="flex items-center justify-between w-full pt-2 pb-4">
        <div className="">
          {bottomLeftSection &&
            typeof bottomLeftSection === "function" &&
            bottomLeftSection({ tableBody, tableHeader, defaultClassName: { tdBodyClassName, trBodyClassName } })}
        </div>

        <div className="">
          {bottomCenterSection &&
            typeof bottomCenterSection === "function" &&
            bottomCenterSection({ tableBody, tableHeader, defaultClassName: { tdBodyClassName, trBodyClassName } })}
        </div>

        <div className="">
          {bottomRightSection &&
            typeof bottomRightSection === "function" &&
            bottomRightSection({ tableBody, tableHeader, defaultClassName: { tdBodyClassName, trBodyClassName } })}
        </div>

        {!tablePage ? null : (
          <ul className="flex list-style-none">
            <Pagination links={tablePage} />
          </ul>
        )}
      </div>

      {filter && isDomLoaded ? <FilterModal options={filterOptions} /> : null}
    </div>
  )
}

export const TableContent = ({ props, body, tableHeader, tdBodyClassName, trBodyClassName, index, tableAction }) => {
  const [show, setShow] = useAtom(showModalAtom)

  let pageProps = usePage().props
  let pageData = pageProps?.[pageProps?.page?.name]

  return (
    <Fragment>
      {tableHeader.map((header, i) => {
        if (header?.customHeader && typeof header?.customHeader === "function") {
          header = header?.customHeader({ data: body, header })
        }

        if ("isDetail" in (header || {}) && header.isDetail === true) return null
        if ("isHidden" in (header || {}) && header.isHidden === true) return null

        let isModalDetail = false
        if ("isModalDetail" in (header || {}) && header.isModalDetail === true) {
          isModalDetail = true
        }

        let headerValue = header?.value?.split(".")
        let value = headerValue?.reduce((acc, key) => acc?.[key], body)

        if (!value) {
          value = ""
        }

        let prefix = header?.prefix
        if (!prefix?.endsWith(".")) {
          prefix += "."
        }

        if (!!header?.prefix && header?.type != "status") {
          value = `${prefix ?? ""}${value}`
        }

        if (!value && !!header?.defaultValue) {
          value = header?.defaultValue
        }

        if (!!header?.valueLabel && !!value) {
          if (isFunction(header?.valueLabel)) {
            value = header?.valueLabel({data: body, value})
          } else{
            value = header?.valueLabel.toString().replaceAll("[value]", value)
          }
        }

        let typeCase = 'normal'
        if ("typeCase" in (header || {}) && header.typeCase) {
          typeCase = header.typeCase
        }

        if (typeCase == 'lowerCase') {
          value = value?.toLowerCase()
        }

        if (header?.custom && typeof header?.custom === "function") {
          return header?.custom({ data: body, key: i, header, defaultClassName: { tdBodyClassName, trBodyClassName } })
        }

        let actionUrl = null
        if (header?.actionUrl && typeof header?.actionUrl === "function") {
          actionUrl = header?.actionUrl({ data: body })
        }

        if (header.type == 'boolean') {
          value = !!value ? "Ya" : "Tidak"
        }

        if (header.type == "numbering") {
          return (
            <th key={i} scope="row" className="text-start w-10">
              {pageData ? paginationNumber(pageData, index) : index + 1}
            </th>
          )
        }

        if (header.type == "action" && tableAction) {
          return <WithAction key={i} {...props} item={body} actionMenu={tableAction} />
        }

        if (header.type == "status") {
          let prefix = header.prefix ?? ""
          if (prefix && !prefix?.endsWith(".")) {
            prefix += "."
          }

          return (
            <td key={i} className={`${tdBodyClassName} ${header?.className ?? ""}`}>
              <div className={`capitalize badge badge-xs p-2 ${useStatus(`${prefix ?? ""}${value}`)}`}>
                {useStatusLabel(`${prefix ?? ""}${value}`)}
              </div>
            </td>
          )
        }

        if (header.type == "date") {
          tdBodyClassName = "text-[13px] w-[10%] md:w-[100px] !whitespace-pre "
          const tdClassName = Array.from(
            new Set([...(tdBodyClassName?.split(" ") ?? []), ...(header?.className?.split(" ") ?? [])].filter(Boolean)),
          ).join(" ")

          return (
            <td key={i} className={tdClassName}>
              {!!value && value != '-' ? dateFormat(value, header.dateFormat ?? null) : header?.defaultValue}
            </td>
          )
        }

        if (header.type == "currency") {
          let headerCurrencyCode = header.currency_code?.split(".")
          let currencyCode = "IDR"
          if (headerCurrencyCode) {
            currencyCode = headerCurrencyCode.reduce((acc, key) => acc?.[key], body)
          }

          if (value == 0) {
            value = "-"
          }

          return (
            <td key={i} className={`${tdBodyClassName} ${header?.className ?? ""}`}>
              {isNumber(parseInt(Math.abs(value))) ? currency(value, "id-ID", currencyCode) : value}
            </td>
          )
        }

        if (header.type == "list") {
          const values = value.split("\n")
          let isEmpty = false
          if (values?.length == 0) {
            isEmpty = true
          }
          if (values?.length == 1 && values[0] == "") {
            isEmpty = true
          }
          if (isEmpty) return "-"

          let listClassName = header?.listClassName ?? "list-disc list-inside"

          return (
            <td key={i} className={`${tdBodyClassName} ${header?.className ?? ""}`}>
              <ul className={listClassName}>
                {values.map((value, index) => (
                  <li key={index}>{value}</li>
                ))}
              </ul>
            </td>
          )
        }

        if (!!actionUrl) {
          return (
            <td key={i} className={`${tdBodyClassName} ${header?.className ?? ""}`}>
              <Link href={actionUrl} className="underline">
                {useLang(value)}
              </Link>
            </td>
          )
        }

        return (
          <td key={i} className={`${tdBodyClassName} ${header?.className ?? ""}`}>
            {isModalDetail ? (
              <ModalButton id={`detail_${body?.id}`} onClick={() => setShow(body)}>
                <span>{value}</span>
              </ModalButton>
            ) : (
              useLang(value)
            )}
          </td>
        )
      })}
    </Fragment>
  )
}

export const WithAction = (props) => {
  const { actionMenu, item, align = "left", isTable = true, btnClassName = null, variant="daisyui" } = props
  const Tag = isTable ? "th" : "div"

  if (variant == "shadcn") return <DropdownAction Tag={Tag} {...props} />

  return (
    <Tag scope="row" className={`text-start ${isTable ? 'w-10' : ''}`}>
      <div className={`dropdown dropdown-${align}`}>
        <div tabIndex={0} role="button" className={btnClassName ?? "m-1 btn btn-ghost btn-sm"}>
          <i className="fas fa-ellipsis-vertical"></i>
        </div>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-max">
          {actionMenu && typeof actionMenu === "function" && actionMenu(item)}
        </ul>
      </div>
    </Tag>
  )
}

export const NoData = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <InboxIcon className="w-10 h-10 opacity-40" />
      <p>Tidak ada data untuk ditampilkan</p>
    </div>
  )
}

export const TableCard = ({ props, tableBody, tableHeader, isLimitIndex = true }) => {
  if (tableBody?.length == 0) return <NoData />

  const { location, page } = usePage().props
  const { url } = useSearchParams(location)
  let isIndexView = page.url == url.pathname
  let pageData = page?.[page?.name]

  const [loadIndex, setLoadIndex] = useState(null)
  let previewHeader = tableHeader?.filter((header) => header.isSearchable)

  const rowPropsBase = {
    wrapperClassName: "grid grid-cols-1 border-y",
    labelClassName: "w-full text-sm opacity-90",
    valueClassName: "w-full text-sm",
    emptyCheck: false,
  }

  let detailProps = {
    className: "flex flex-col w-full sm:max-h-[60vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white",
    tableHeader,
    rowPropsBase,
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 my-4 justify-start w-full px-2 ${isIndexView ? "md:grid-cols-3 2xl:grid-cols-4" : ""}`}>
      {tableBody.map((body, index) => {
        if (isLimitIndex) {
          detailProps.tableHeader = loadIndex == index ? tableHeader : previewHeader
        }

        return (
          <div key={index} className={`border p-2 flex gap-2`}>
            <div className="flex flex-col items-center">
              <p> {pageData ? paginationNumber(pageData, index) : index + 1}. </p>
              {isIndexView ? <WithAction key={index} {...props} item={body} align="right" /> : null}
            </div>

            <div className="flex-1 w-full flex flex-col gap-2 items-center justify-between">
              <DetailModalItem {...detailProps} data={body} />
              {isLimitIndex ? (
                <button type="button" onClick={() => setLoadIndex(loadIndex == index ? null : index)} className="btn btn-xs btn-circle mx-auto text-sm font-bold">
                  {loadIndex == index ? (
                    <i className="fas fa-chevron-up"></i>
                  ) : (
                    <i className="fas fa-chevron-down"></i>
                  )}
                </button>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const tableHeightStyle = `
    [&_th]:px-2
    [&_td]:px-2 [&_td]:p-0 [&_td]:leading-tight [&_td]:min-h-0
    [&tr]:px-2 [&tr]:p-0 [&tr]:leading-tight [&tr]:min-h-0
  `

export default Table
