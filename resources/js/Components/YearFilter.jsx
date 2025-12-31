import { router, useForm, usePage } from "@inertiajs/react";
import DatePicker from "./Form/DatePicker";
import moment from "moment";
import { setCookie } from "@/utils/format";

function YearFilter({name}) {
  const {props} = usePage()

  const {data, errors} = useForm({
    year: props?.year ? moment(props.year, 'Y').toISOString() : null
  })
  
  const handleChange = (e) => {
    let year = moment(e).year().toString()
    setCookie('year', year, 365)
    router.get(`?`)
  }  

  const inputProps = {name: 'year', data, errors, handleChange, placeholder:"Tahun Anggaran"}

  return (
    <div className="w-40 z-[9]">
      <DatePicker type='year' isLabel={false} className="input-sm" {...inputProps}/>
    </div>
  )
}

export default YearFilter