import { router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

const GroupedBtn = ({
    options = [{ value: 'btnA', label: 'Button A' }, { value: 'btnB', label: 'Button B' }],
    paramName
}) => {
    const { location } = usePage().props
    const [params, setParams] = useState(null)
    const [column, setColumn] = useState(null);
    useEffect(() => {
        if (location) {
            const url = new URL(location)
            setParams(new URLSearchParams(url.search))
            setColumn(url.searchParams.get(paramName) || options[0].value)
        }
    }, [location])

    const handleChange = (e) => {
        setColumn(e);
        params.set(paramName, e);
        params.has("page") ? params.delete("page") : null;
        return router.visit(`?${params.toString()}`, {
            method: "get",
            preserveState: true,
        });
    };

    return (
        <div className="flex">
            {options.map((opt, i) => {
                return (
                    <button
                        key={i}
                        onClick={() => handleChange(opt.value)}
                        className={`${column === opt.value && 'bg-primary text-white border-primary'}}  border px-3 py-1`}>
                        {opt.label}
                    </button>
                )
            })}
        </div>
    )
}

export default GroupedBtn