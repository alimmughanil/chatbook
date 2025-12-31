import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { isFunction } from "@/utils/format"

export const DropdownAction = (props) => {
  const { actionMenu, item, align = "start", isTable = true, btnClassName = null, Tag } = props

  return (
    <Tag scope="row" className={`text-start ${isTable ? 'w-10' : ''}`}>
      <DropdownMenu >
        <DropdownMenuTrigger className={btnClassName ?? "m-1 btn btn-ghost btn-sm"}><i className="fas fa-ellipsis-vertical"></i></DropdownMenuTrigger>
        <DropdownMenuContent align={align}>
          {isFunction(actionMenu) && actionMenu(item)}
        </DropdownMenuContent>
      </DropdownMenu>
    </Tag>
  )
}

export default DropdownAction
