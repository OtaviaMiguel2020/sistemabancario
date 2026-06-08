"use client"

import * as React from "react"
import { z } from "zod"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  MoreHorizontal,
  User,
  Building2,
  Phone,
  Mail,
  ShieldAlert,
  MapPin,
  Wallet,
  FileText,
  History,
  ArrowUpDown,
  Search,
  Plus
} from "lucide-react"

// Schema unificado para o Gestor Comercial
export const clientSchema = z.object({
  id: z.string(),
  segment: z.enum(["particular", "empresa"]),
  name: z.string(),
  nif: z.string(),
  phone: z.string(),
  email: z.string().email(),
  accountType: z.string(), 
  status: z.enum(["Ativo", "Pendente", "Bloqueado"]),
  province: z.string(),
  balance: z.string(),
  assignedBranch: z.string(),
  riskProfile: z.enum(["Baixo", "Médio", "Alto"]),
  lastContact: z.string(),
})

type Client = z.infer<typeof clientSchema>

// Definição das colunas da tabela comercial expandida
const columns: ColumnDef<Client>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-semibold text-slate-700"
      >
        Cliente / Titular
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3 py-1">
        <div className="p-2 bg-slate-100 rounded-full text-slate-600 shrink-0">
          {row.original.segment === "particular" ? <User className="size-4" /> : <Building2 className="size-4" />}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{row.original.name}</span>
          <span className="text-xs text-muted-foreground font-mono">NIF: {row.original.nif}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "accountType",
    header: "Produto / Segmento",
    cell: ({ row }) => (
      <Badge variant="secondary" className="bg-orange-50 text-orange-700 border border-orange-100 px-2.5 py-0.5">
        {row.original.accountType}
      </Badge>
    ),
  },
  {
    accessorKey: "contact",
    header: "Contactos directos",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5 text-xs text-slate-600">
        <span className="flex items-center gap-1.5 font-medium">
          <Phone className="size-3 text-muted-foreground" /> {row.original.phone}
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Mail className="size-3" /> {row.original.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "province",
    header: "Localização",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-slate-600 text-sm">
        <MapPin className="size-3.5 text-slate-400" />
        {row.original.province}
      </div>
    ),
  },
  {
    accessorKey: "balance",
    header: () => <div className="text-right">Património / Saldo</div>,
    cell: ({ row }) => (
      <div className="text-right font-bold text-slate-900 font-mono">
        {row.original.balance}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge
          className={`px-2 py-0.5 font-medium border rounded-full ${
            status === "Ativo"
              ? "bg-green-50 text-green-700 border-green-200"
              : status === "Pendente"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ClientActionRow client={row.original} />,
  },
]

// Base de Dados Simulada
const mockClients: Client[] = [
  { id: "1", segment: "particular", name: "António Manuel Francisco", nif: "500124569LA041", phone: "+244 923 456 789", email: "antonio.francisco@gmail.com", accountType: "Conta Salário", status: "Ativo", province: "Luanda (Talatona)", balance: "450.000,00 AOA", assignedBranch: "Balcão Talatona", riskProfile: "Baixo", lastContact: "02/06/2026" },
  { id: "2", segment: "particular", name: "Analtina da Conceição Neto", nif: "500789123BE022", phone: "+244 912 888 777", email: "analtina.neto@outlook.com", accountType: "Poupança Crescer", status: "Ativo", province: "Benguela", balance: "1.200.000,00 AOA", assignedBranch: "Balcão Lobito", riskProfile: "Baixo", lastContact: "28/05/2026" },
  { id: "3", segment: "particular", name: "Edivaldo dos Santos Pires", nif: "500344812HU093", phone: "+244 934 111 222", email: "edivaldo.pires@hotmail.com", accountType: "Conta Zero (Digital)", status: "Pendente", province: "Huíla", balance: "12.500,00 AOA", assignedBranch: "Balcão Lubango Sede", riskProfile: "Médio", lastContact: "15/05/2026" },
  { id: "4", segment: "empresa", name: "Sonangol E.P.", nif: "5401002345", phone: "+244 222 666 000", email: "comercial@sonangol.co.ao", accountType: "BFA Corporate", status: "Ativo", province: "Luanda (Eixo Viário)", balance: "45.200.000,00 AOA", assignedBranch: "Centro Corporate Luanda", riskProfile: "Baixo", lastContact: "04/06/2026" },
  { id: "5", segment: "empresa", name: "Aliança Comercial Lda", nif: "5412009871", phone: "+244 923 777 111", email: "gerencia@alianca.ao", accountType: "PME Empreendedor", status: "Bloqueado", province: "Cabinda", balance: "12.800.000,00 AOA", assignedBranch: "Balcão Cabinda Sede", riskProfile: "Alto", lastContact: "10/04/2026" },
]

// Componente Principal Exportado como ClienteBFA
export function ClientesBFA() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data: mockClients,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="w-full space-y-4 p-6 bg-slate-50/50 min-h-screen">
      
      {/* Cabeçalho de Gestão Comercial */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Gestão de Carteira de Clientes BFA</h1>
          <p className="text-xs text-muted-foreground">Consola de monitorização de conformidade, saldos e relacionamento comercial.</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2 text-sm font-semibold h-10 shadow-sm">
          <Plus className="size-4" /> Novo Cliente BFA
        </Button>
      </div>

      {/* Barra de Pesquisa Integrada */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por Nome, NIF ou Contacto..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 h-10 border-slate-200 focus-visible:ring-orange-500"
          />
        </div>
      </div>

      {/* Tabela com Layout Expandido (Full-Width) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="h-12 text-slate-700 font-bold text-sm">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-slate-50/80 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 px-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    Nenhum registo de cliente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Rodapé e Paginação da Tabela */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-xs text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} cliente(s) selecionados.
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="h-8 text-xs">
              Anterior
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="h-8 text-xs">
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* COMPONENTE INTERNO DE AÇÕES DA LINHA (Menu e Modal Corrigidos) */
function ClientActionRow({ client }: { client: Client }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-slate-900">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 shadow-md">
          <DropdownMenuLabel>Ações de Carteira</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
              <FileText className="size-4 mr-2 text-slate-500" />
              Ver Ficha / Detalhes
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem>
            <History className="size-4 mr-2 text-slate-500" />
            Extrato de Posição
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50">
            Restringir Conta (Compliance)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* SHADCN DIALOG CENTRALIZADO */}
      <DialogContent className="sm:max-w-[640px] p-0 bg-white rounded-xl overflow-hidden gap-0">
        <DialogHeader className="p-6 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-600 rounded-lg text-white">
              {client.segment === "particular" ? <User className="size-5" /> : <Building2 className="size-5" />}
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">{client.name}</DialogTitle>
              <DialogDescription className="text-xs text-slate-400 mt-0.5">
                NIF: {client.nif} • Perfil Comercial Bancário
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Abas Organizacionais do Cliente */}
        <Tabs defaultValue="geral" className="w-full">
          <div className="px-6 border-b border-slate-100 bg-slate-50">
            <TabsList className="bg-transparent gap-4 p-0 h-12">
              <TabsTrigger value="geral" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-600 data-[state=active]:text-orange-600 rounded-none h-full font-medium text-xs">
                <FileText className="size-3.5 mr-1.5" /> Dados Gerais
              </TabsTrigger>
              <TabsTrigger value="financeiro" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-600 data-[state=active]:text-orange-600 rounded-none h-full font-medium text-xs">
                <Wallet className="size-3.5 mr-1.5" /> Posição Financeira
              </TabsTrigger>
              <TabsTrigger value="comercial" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-600 data-[state=active]:text-orange-600 rounded-none h-full font-medium text-xs">
                <ShieldAlert className="size-3.5 mr-1.5" /> Notas & CRM
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Conteúdo Aba: Dados Gerais */}
          <TabsContent value="geral" className="p-6 space-y-4 outline-hidden">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Contacto de Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                  <Input defaultValue={client.phone} className="pl-9 h-9 border-slate-200 text-sm focus-visible:ring-orange-500" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Correio Eletrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                  <Input defaultValue={client.email} className="pl-9 h-9 border-slate-200 text-sm focus-visible:ring-orange-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Província / Região</Label>
                <Input defaultValue={client.province} className="h-9 border-slate-200 text-sm focus-visible:ring-orange-500" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Balcão / Centro de Alocação</Label>
                <Input defaultValue={client.assignedBranch} className="h-9 border-slate-200 text-sm focus-visible:ring-orange-500" />
              </div>
            </div>
          </TabsContent>

          {/* Conteúdo Aba: Financeiro e Compliance */}
          <TabsContent value="financeiro" className="p-6 space-y-4 outline-hidden">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs text-slate-500 font-medium">Património Estimado Total</span>
                <p className="text-xl font-bold text-slate-900 font-mono">{client.balance}</p>
              </div>
              <Badge variant="outline" className="bg-white text-slate-700 px-3 py-1 font-semibold border-slate-200">
                {client.accountType}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Perfil de Risco (Compliance)</Label>
                <Select defaultValue={client.riskProfile}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baixo">Risco Baixo</SelectItem>
                    <SelectItem value="Médio">Risco Médio</SelectItem>
                    <SelectItem value="Alto">Risco Alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Última Interação Comercial</Label>
                <Input defaultValue={client.lastContact} disabled className="h-9 bg-slate-50 border-slate-200 text-sm text-slate-600" />
              </div>
            </div>
          </TabsContent>

          {/* Conteúdo Aba: Notas de Atendimento */}
          <TabsContent value="comercial" className="p-6 space-y-4 outline-hidden">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500">Notas de Reunião e Oportunidades de Venda (Cross-Selling)</Label>
              <Textarea 
                placeholder="Ex: Cliente manifestou interesse em Linhas de Crédito de Campanha ou Terminais de Pagamento Automático (TPA)..." 
                className="min-h-[100px] border-slate-200 text-sm focus-visible:ring-orange-500"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Rodapé do Modal */}
        <DialogFooter className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => setIsModalOpen(false)} className="h-9 text-xs font-medium border-slate-200">
            Cancelar
          </Button>
          <Button onClick={() => setIsModalOpen(false)} className="bg-orange-600 hover:bg-orange-700 text-white h-9 text-xs font-semibold shadow-xs">
            Gravar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}