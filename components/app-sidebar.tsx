"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  UserPlusIcon,
  UsersIcon,
  ClipboardListIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  BarChart2Icon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileTextIcon,
  ShieldCheckIcon,
} from "lucide-react"

const data = {
  user: {
    name: "Esperança Miguel",
    email: "esperancamiguel02@gmail.com",
    avatar: "EM",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    
    {
      title: "Clientes",
      url: "/clientes",
      icon: <UsersIcon />,
    },
    {
      title: "Processos",
      url: "#",
      icon: <ClipboardListIcon />,
    },
    {
      title: "Aprovações",
      url: "#",
      icon: <CheckCircleIcon />,
    },
    {
      title: "Compliance / KYC",
      url: "#",
      icon: <ShieldCheckIcon />,
      items: [
      ],
    },
    {
      title: "Análise Comercial",
      url: "#",
      icon: <BarChart2Icon />,
    },
    {
      title: "Alertas",
      url: "#",
      icon: <AlertCircleIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Configurações",
      url: "#",
      icon: <Settings2Icon />,
    },
    {
      title: "Suporte",
      url: "#",
      icon: <CircleHelpIcon />,
    },
    {
      title: "Pesquisar",
      url: "#",
      icon: <SearchIcon />,
    },
  ],
  documents: [
    {
      name: "Base de Clientes",
      url: "#",
      icon: <DatabaseIcon />,
    },
    {
      name: "Relatórios",
      url: "#",
      icon: <FileChartColumnIcon />,
    },
    {
      name: "Documentos",
      url: "#",
      icon: <FileTextIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <div className="flex items-center justify-center w-5 h-5 bg-[#FF7607] rounded text-white text-[10px] font-bold">
                
                </div>
                <span className="text-base font-semibold">Sistema Comercial</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}