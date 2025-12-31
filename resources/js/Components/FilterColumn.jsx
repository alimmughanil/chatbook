import useLang from "@/utils/useLang";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";

function FilterColumn({ options, prefix = '', label = "Filter", queryName = 'filter', isTab = false, setData = null, defaultValue = '', onChange = null }) {
  const { location } = usePage().props
  const params = new URLSearchParams(new URL(location).search)
  const [column, setColumn] = useState(params?.get(queryName) ?? defaultValue);

  const handleChange = (e) => {
    const value = e.target.value == '' ? null : e.target.value

    if (setData) {
      setData((state) => ({
        ...state,
        [queryName]: value
      }))

      return
    }

    setColumn(e.target.value);
    value ? params?.set(queryName, value) : params?.delete(queryName);
    params?.has("page") ? params?.delete("page") : null;
    return router.visit(`?${params?.toString()}`, {
      method: "get",
      preserveState: true,
    });
  };

  return (
    <select className={`w-full border-gray-400 rounded-lg ${setData ? '' : 'h-8 text-sm py-0'}`} onChange={onChange ?? handleChange} defaultValue={column}>
      {isTab ? (<>
        {options?.length > 0 ? options.map((option, index) => (
          <option key={index} value={option.value} className="capitalize">{option.label}</option>
        )) : null}
      </>
      ) : (
        <>
          <option value="" className="text-gray-400">
            {params?.get(queryName) ? 'Hapus Filter' : label}
          </option>
          {options?.length > 0 ? options.map((option, index) => {
            let label = option?.label ?? option
            let value = option?.value ?? option
            
            return (
              <option key={index} value={value} className="capitalize">{label ? label : useLang(prefix ? `${prefix}.${value}` : value)}</option>
            )
          }) : null}
        </>
      )}
    </select>
  );
}

export default FilterColumn;
