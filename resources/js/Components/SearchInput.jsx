import { router, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import { ModalButton } from "./WithModal";
import { date } from "@/utils/format";
import DateRangeModal from "./DateRangeModal";

function SearchInput(state) {
  const { placeholder = "Cari email atau nama pengguna", searchable = [] } = state
  const { location } = usePage().props
  const params = new URLSearchParams(new URL(location).search)

  const startDate = params.get('startDate')
  const endDate = params.get('endDate')

  const [selectionRange, setselectionRange] = useState({
    startDate: startDate ? new Date(startDate) : new Date(),
    endDate: endDate ? new Date(endDate) : new Date(),
    key: 'range1',
  })

  const handleDateRange = (data) => {
    setselectionRange(data.range1)
  }

  let selectedSearchable = searchable[0]
  if (searchable?.length > 0 && !!params.get('searchBy')) {
    selectedSearchable = searchable.find((search) => {
      return search.value == params.get('searchBy')
    })
  }  

  const { data, setData } = useForm({
    searchBy: !selectedSearchable ? null : (!!selectedSearchable?.searchValue ? selectedSearchable?.searchValue : selectedSearchable.value),
    placeholder: !selectedSearchable ? placeholder : `Cari ${selectedSearchable?.label}`,
    query: params.get('q') ? decodeURIComponent(params.get('q')) : '',
    type: !!selectedSearchable ? selectedSearchable?.type : 'input'
  })

  function handleChange(e) {
    const { name, value } = e.target

    setData((state) => ({
      ...state,
      [name]: value,
    }))

    if (name == 'searchBy' && searchable.length > 0) {
      const selectedSearchable = searchable.filter((search) => {
        if (!!search?.searchValue) {
          return search?.searchValue == value
        }

        return search.value == value
      })

      setData((state) => ({
        ...state,
        ['placeholder']: name == 'searchBy' ? `Cari ${selectedSearchable[0].label}` : state.placeholder,
        ['type']: !!selectedSearchable[0].type && selectedSearchable[0].type == 'date' ? selectedSearchable[0]?.type : 'input',
      }))
    }
  }
  
  const handleSearch = () => {
    const filteredQuery = data.query ? encodeURIComponent(data.query) : ''
    const filteredSearchBy = data.searchBy ? encodeURIComponent(data.searchBy) : ''
    filteredQuery ? params?.set("q", filteredQuery) : params?.delete('q');
    filteredSearchBy ? params?.set("searchBy", filteredSearchBy) : params?.delete('searchBy');

    params.delete('startDate')
    params.delete('endDate')

    params?.has("page") ? params?.delete("page") : null;
    return router.visit(`?${params.toString()}`, {
      method: 'get',
      preserveState: true
    })
  }

  const handleReset = () => {
    params.delete('q')
    params.delete('searchBy')
    params.delete('startDate')
    params.delete('endDate')
    setData((state) => ({ ...state, query: '' }))
    return router.visit(`?${params.toString()}`, {
      method: 'get',
      preserveState: true,
    })
  }

  return (
    <div className="join w-full">
      <button onClick={handleReset} className="btn btn-sm border join-item border-gray-500 hover:border-gray-500">
        <i className={`fas fa-${params.get('q') || params.get('startDate') ? 'x' : 'search'}`}></i>
      </button>
      {searchable.length > 0 ? (
        <select className="w-max select-sm text-xs border-gray-400 rounded-lg join-item" onChange={handleChange} defaultValue={data.searchBy} name="searchBy">
          {searchable.map((option, index) => (
            <option key={index} value={!!option?.searchValue ? option?.searchValue : option.value} className="capitalize">{option.label}</option>
          ))}
        </select>
      ) : null}

      {data.type == 'date' ? (
        <>
          <DateRangeModal selectionRange={selectionRange} handleChange={handleDateRange} searchData={data} id="_search" />
          <ModalButton id={'modal_date_range_search'} className="btn btn-neutral btn-outline join-item border-gray-400 btn-sm">{date(selectionRange.startDate)} - {date(selectionRange.endDate)}</ModalButton>
        </>
      ) : (
        <>
          <input
            onChange={handleChange}
            onKeyDown={(e) => e.code == "Enter" ? handleSearch() : null}
            type="text"
            name="query"
            className="input input-sm w-full join-item border border-gray-500"
            placeholder={data.placeholder}
            value={data.query}
          />
          <div className="dropdown dropdown-end rounded-r-lg bg-neutral join-item">
            <button onClick={handleSearch} className="btn btn-neutral btn-sm rounded-r-lg">Cari</button>
          </div>
        </>
      )}

    </div>
  )
}

export default SearchInput
