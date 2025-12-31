import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BaseForm from './BaseForm'
import { isMobile } from "react-device-detect";
import moment from "moment";

function DatePicker(props) {
  const { name, handleChange, data, placeholder = null, ref, disabled = false, formProps = {}, required = false } = props
  let { type = 'text', label = null, className = null } = props
  let { accept = '*', multiple = false} = props
  let { defaultClassName = "border input w-full border-gray-300"} = props

  if (!label) {
    label = name.split("_").join(" ");
  }

  let ReactDatePickerProps = {
    name: name,
    selected: data[name],
    showIcon: true,
    icon: 'fa fa-calendar',
    toggleCalendarOnIconClick: true,
    onChange: (e)=>handleChange(moment(e).format("YYYY-MM-DDTHH:mm")),
    onSelect: (e)=>handleChange(moment(e).format("YYYY-MM-DDTHH:mm")),
    tabIndex: 1,
    required,
  }

  let additionalProps = {}

  let typeList = [
    "date",
    "month",
    "year",
    "day",
    "day-month",
    "month-year",
    "year",
  ];
  type = typeList.includes(type) ? type : "date";

  switch (type) {
    case 'month':
      additionalProps = {
        yearDropdownItemNumber: 15,
        showYearDropdown: true,
        scrollableYearDropdown: true,

        showMonthYearPicker: true,
        dateFormat: "MMMM yyyy"
      }
      break;
    case 'month-year':
      additionalProps = {
        yearDropdownItemNumber: 15,
        showYearDropdown: true,

        showMonthYearPicker: true,
        dateFormat: "MMMM yyyy"
      }
      break;
    case 'year':
      additionalProps = {
        showYearPicker: true,
        dateFormat: "yyyy"
      }
      break;

    default:
      additionalProps = {
        yearDropdownItemNumber: 15,
        showYearDropdown: true,
        scrollableYearDropdown: true,
        peekNextMonth: true,
        showMonthDropdown: true,
        dropdownMode: "select",
      }
      break
  }

  return (
    <BaseForm {...props}>
      <ReactDatePicker
        {...ReactDatePickerProps}
        {...additionalProps}
        calendarIconClassName="top-1/2 -translate-y-1/2"
        placeholderText={placeholder ?? `Pilih ${label}`}
        className={`${defaultClassName} ${className}`}
        wrapperClassName="w-full relative"
        autoComplete="off"
        withPortal={isMobile}
      />
    </BaseForm>
  )
}

export default DatePicker