import { router, useForm, usePage } from '@inertiajs/react';

const SearchCard = ({ searchPath = '/product', placeholder = '' }) => {
  const { location } = usePage().props
  const params = new URLSearchParams(new URL(location).search)

  const { data, setData } = useForm({
    placeholder: placeholder,
    query: params.get('q') ? decodeURIComponent(params.get('q')) : '',
  })

  function handleChange(e) {
    const { name, value } = e.target

    setData((state) => ({
      ...state,
      [name]: value,
    }))
  }

  const handleSearch = () => {
    const filteredQuery = data.query ? encodeURIComponent(data.query) : ''
    filteredQuery ? params?.set("q", filteredQuery) : params?.delete('q');

    params?.has("page") ? params?.delete("page") : null;
    return router.visit(`${searchPath}?${params.toString()}`, {
      method: 'get',
      preserveState: true,
      preserveScroll: true,
    })
  }

  const handleReset = () => {
    params.delete('q')
    return router.visit(`?${params.toString()}`, {
      method: 'get',
      preserveState: true,
    })
  }

  return (
    <div className="flex mt-[18px] sm:mt-[24px] gap-[12px] sm:gap-[24px] w-full">
      <div className="flex items-center rounded-[10px] px-[12px] sm:px-[24px] py-[12px] sm:py-[14px] w-full border border-[rgba(216,216,216,1)]">
        <button onClick={handleReset}>
          {params.get('q') ? (
            <i className={`fas fa-x`}></i>
          ) : (
            <i className='fas fa-search text-gray-500'></i>
          )}
        </button>
        <input
          onChange={handleChange}
          onKeyDown={(e) => e.code == "Enter" ? handleSearch() : null}
          type="text"
          name="query"
          className="ml-[12px] sm:ml-[16px] text-xs sm:text-sm text-main-black w-full outline-none bg-transparent border-none focus:outline-none focus:ring-0 focus:border-none"
          placeholder={data.placeholder}
          value={data.query}
        />
      </div>
      <button
        type="button"
        onClick={handleSearch}
        className="flex items-center my-auto linear-gradient-purple text-white text-xs sm:text-sm px-[14px] sm:px-[32px] py-[12px] sm:py-[14px] rounded-[10px] cursor-pointer"
      >
        Cari
      </button>
    </div>
  )
}

export default SearchCard