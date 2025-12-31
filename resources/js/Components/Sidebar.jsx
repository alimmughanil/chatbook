import { Link, usePage } from "@inertiajs/react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/Components/ui/sidebar"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/Components/ui/collapsible"
import { ChevronDown } from "lucide-react"

import { ChevronUp, User2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import LogoutModal from "./LogoutModal"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

const SIDEBAR_COOKIE_NAME = "sidebar_state"

export default function AppSidebar({ menu }) {
  const { url, props, auth } = usePage()
  const { setOpen, setOpenMobile, isMobile } = useSidebar()
  const activePage = useRef(null)

  useEffect(() => {
    if (activePage.current) {
      activePage.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [url])

  return (
    <>
      <Sidebar collapsible="icon" variant="sidebar">
        <SidebarHeader className="bg-white">
          <SidebarGroupLabel className="text-lg font-semibold tracking-tight">
            <a href="/">{props?.appName}</a>
          </SidebarGroupLabel>
        </SidebarHeader>

        <SidebarContent className="bg-white">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menu.map((item, i) => {
                  const isSubActive = item?.dropdown?.some((sub) => url.startsWith(sub.link))
                  if (item?.type === "group_label") {
                    return <SidebarGroupLabel key={i}>{item.title}</SidebarGroupLabel>
                  }

                  return (
                    <SidebarMenuItem key={i}>
                      {item.dropdown ? (
                        <Collapsible defaultOpen={isSubActive}>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip={{
                                children: item.title,
                                className: "bg-white border-2 shadow-xl"
                              }}
                              className="group w-full justify-between"
                              onClick={() => (isMobile ? setOpenMobile(true) : setOpen(true))}
                            >
                              <div className="flex items-center gap-2">
                                {renderIcon(item)}
                                <span>{item.title}</span>
                              </div>
                              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.dropdown.map((sub, j) => (
                                <SidebarMenuSubItem key={j}>
                                  <Link href={sub.link} ref={url.startsWith(sub.link) ? activePage : null}>
                                    <SidebarMenuSubButton
                                      asChild
                                      className={cn("w-full justify-start text-left", url.startsWith(sub.link) ? "bg-blue-50 text-blue-800" : "")}
                                    >
                                      <span>{sub.title}</span>
                                    </SidebarMenuSubButton>
                                  </Link>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <Link href={item.link} ref={url.startsWith(item.link) ? activePage : null}>
                          <SidebarMenuButton
                            tooltip={{
                              children: item.title,
                              className: "bg-white border-2 shadow-xl"
                            }}
                            asChild
                            className={cn("w-full justify-start text-left", url.startsWith(item.link) ? "bg-blue-50 text-blue-800" : "")}
                          >
                            <div className="flex items-center gap-2">
                              {renderIcon(item)}
                              <span>{item.title}</span>
                            </div>
                          </SidebarMenuButton>
                        </Link>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-white border-t-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <UserProfile />
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuItem>
                    <Link href="/app/profile" className="w-full cursor-pointer">
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a href="#logout-confirm" className="w-full cursor-pointer">
                      Sign out
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <LogoutModal />
    </>
  )
}

const UserProfile = () => {
  const { user } = usePage().props.auth
  const picture = user?.picture ? user.picture : `/image/user.png`

  return (
    <div className="flex items-center gap-2">
      <User2 />
      <div className="">
        <p>{user?.name}</p>
        <p className="text-xs">{user?.email}</p>
      </div>
    </div>
  )
}

const renderIcon = (item) => {
  const provider = item.icon_provider ?? "lucide"

  if (provider === "fontawesome" && item.fa_icon) {
    return <i className={`${item.fa_icon} w-4 text-center`} />
  }

  if (provider === "lucide" && item.icon) {
    const LucideIcon = item.icon
    return <LucideIcon className="w-4 h-4" />
  }

  return <span className="w-4 inline-block" />
}
