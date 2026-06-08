"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { CirclePlusIcon, MailIcon } from "lucide-react"
import { ClientesBFA } from "./ClientesBFA"


// Importa os componentes simples que criámos para as outras vistas

export function NavMain({
  items,
}: {
  items: { title: string; url: string; icon?: React.ReactNode }[]
}) {
  // Estado para controlar qual modal de simulação está aberto
  const [activeModal, setActiveModal] = React.useState<string | null>(null)

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton tooltip="Nova Abertura" className="min-w-8 bg-primary text-primary-foreground hover:bg-primary/90">
              <CirclePlusIcon />
              <span>Abrir Conta</span>
            </SidebarMenuButton>
            <Button size="icon" className="size-8" variant="outline">
              <MailIcon />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* LINKS DO MENU: Ao clicar, abrem a respetiva vista num ecrã sobreposto super elegante */}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title}
                onClick={() => {
                  // Mapeia o clique para abrir o modal correspondente
                  if (item.title === "Clientes") setActiveModal("clientes")
                  if (item.title === "Processos") setActiveModal("processos")
                  if (item.title === "Aprovações") setActiveModal("aprovacoes")
                }}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>

      {/* =========================================================
          MODAIS DE SIMULAÇÃO INSTANTÂNEA (Não quebram o teu layout!)
         ========================================================= */}
      <Dialog open={activeModal === "clientes"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="">
          <DialogHeader><DialogTitle>Módulo Comercial: Clientes</DialogTitle></DialogHeader>
          <ClientesBFA/>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "processos"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Módulo Comercial: Processos</DialogTitle></DialogHeader>
          <h1>cliente</h1>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "aprovacoes"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Módulo Comercial: Aprovações</DialogTitle></DialogHeader>
          <h1>cliente</h1>
        </DialogContent>
      </Dialog>

    </SidebarGroup>
  )
}