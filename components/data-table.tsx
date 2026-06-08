"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
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
import { 
  GripVerticalIcon, 
  CircleCheckIcon, 
  LoaderIcon, 
  EllipsisVerticalIcon, 
  Columns3Icon, 
  ChevronDownIcon, 
  PlusIcon, 
  ChevronsLeftIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChevronsRightIcon, 
  CalculatorIcon, 
  UserIcon, 
  Building2Icon,
  UserCheckIcon,
  ArrowLeftRightIcon
} from "lucide-react"

// Schema flexível para suportar ambos os segmentos
export const schema = z.object({
  id: z.number(),
  segment: z.enum(["particular", "empresa"]),
  header: z.string(),       // Nome do Cliente ou Empresa
  type: z.string(),         // Tipo de Produto/Conta
  status: z.string(),       // Estado (Ativa, Em Análise, Suspensa)
  target: z.string(),       // Província
  limit: z.string(),        // Saldo Atual ou Linha de Crédito
  reviewer: z.string(),     // Gestor ou Balcão responsável
})

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id })
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent cursor-grab active:cursor-grabbing"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Arrastar</span>
    </Button>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todos"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "header",
    header: "Cliente Titular",
    cell: ({ row }) => <TableCellViewer item={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Produto / Segmento",
    cell: ({ row }) => (
      <div className="w-44">
        <Badge variant="outline" className="px-1.5 font-medium border-orange-200 text-orange-700 bg-orange-50/50">
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const isDone = row.original.status === "Ativa" || row.original.status === "Ativo"
      return (
        <Badge 
          variant="outline" 
          className={`px-1.5 gap-1 ${
            isDone 
              ? "border-green-200 text-green-700 bg-green-50" 
              : "border-amber-200 text-amber-700 bg-amber-50"
          }`}
        >
          {isDone ? (
            <CircleCheckIcon className="size-3.5 fill-green-500 text-white" />
          ) : (
            <LoaderIcon className="size-3.5 animate-spin text-amber-500" />
          )}
          {row.original.status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "target",
    header: () => <div className="w-full text-left">Província</div>,
    cell: ({ row }) => <div className="text-left font-medium">{row.original.target}</div>,
  },
  {
    accessorKey: "limit",
    header: () => <div className="w-full text-right">Fundos / Património</div>,
    cell: ({ row }) => (
      <div className="text-right font-semibold text-slate-900">
        {row.original.limit}
      </div>
    ),
  },
  {
    accessorKey: "reviewer",
    header: "Gestão / Alocação",
    cell: ({ row }) => {
      const isAssigned = row.original.reviewer !== "Atribuir Gestor" && row.original.reviewer !== "Atribuir Balcão"
      if (isAssigned) return <span className="text-sm font-medium">{row.original.reviewer}</span>

      return (
        <Select>
          <SelectTrigger className="w-44 h-8" size="sm" id={`${row.original.id}-reviewer`}>
            <SelectValue placeholder="Definir Alocação" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectGroup>
              <SelectItem value="Balcão Talatona">Balcão Talatona</SelectItem>
              <SelectItem value="Hub Corporate Luanda">Hub Corporate Luanda</SelectItem>
              <SelectItem value="Balcão Lobito">Balcão Lobito</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex size-8 text-muted-foreground" size="icon">
            <EllipsisVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>Consultar Ficha Integral</DropdownMenuItem>
          <DropdownMenuItem>Simular Operação de Crédito</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Bloquear Credenciais</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// BASE DE DADOS COMPLETA INTERCALADA (SINGULARES E EMPRESAS)
const bfaUnifiedDatabase: z.infer<typeof schema>[] = [
  // Clientes Particulares / Singulares
  { id: 1, segment: "particular", header: "António Manuel Francisco", type: "Conta BFA Salário", status: "Ativa", target: "Luanda", limit: "450.000 AOA", reviewer: "Balcão Talatona" },
  { id: 2, segment: "particular", header: "Analtina da Conceição Neto", type: "Poupança BFA Crescer", status: "Ativa", target: "Benguela", limit: "1.200.000 AOA", reviewer: "Balcão Lobito" },
  { id: 3, segment: "particular", header: "Edivaldo dos Santos Pires", type: "Conta BFA Zero (Digital)", status: "Pendente", target: "Huíla", limit: "12.500 AOA", reviewer: "Atribuir Balcão" },
  { id: 4, segment: "particular", header: "Maria Isabel Miguel", type: "Conta BFA Salário", status: "Ativa", target: "Cabinda", limit: "310.000 AOA", reviewer: "Balcão Cabinda Sede" },
  
  // Clientes Empresas / PMEs
  { id: 5, segment: "empresa", header: "Sonangol E.P.", type: "BFA Corporate", status: "Ativo", target: "Luanda", limit: "45.200.000 AOA", reviewer: "Hub Corporate" },
  { id: 6, segment: "empresa", header: "Aliança Comercial Lda", type: "PME Empreendedor", status: "Em Análise", target: "Benguela", limit: "12.800.000 AOA", reviewer: "Analtina Dias" },
  { id: 7, segment: "empresa", header: "Kero Supermercados", type: "BFA Corporate", status: "Ativo", target: "Luanda", limit: "89.430.000 AOA", reviewer: "Manuel Neto" },
  { id: 8, segment: "empresa", header: "Ngola Bebidas S.A.", type: "PME Empreendedor", status: "Em Análise", target: "Huambo", limit: "18.900.000 AOA", reviewer: "Atribuir Gestor" },
]

export function DataTable() {
  // Estado para intercalar o segmento ativo global da Dashboard
  const [currentSegment, setCurrentSegment] = React.useState<"particular" | "empresa">("particular")
  
  // Filtra os dados da tabela baseado no segmento intercalado
  const [data, setData] = React.useState(bfaUnifiedDatabase)
  const filteredData = React.useMemo(() => {
    return data.filter(item => item.segment === currentSegment)
  }, [data, currentSegment])

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
  
  // PARÂMETROS DO SIMULADOR ADAPTÁVEL
  const [amount, setAmount] = React.useState<number>(500000)
  const [months, setMonths] = React.useState<string>("12")
  const [calculatedInstallment, setCalculatedInstallment] = React.useState<number>(0)

  // Taxas BFA dinâmicas baseadas no segmento intercalado
  const currentTax = currentSegment === "particular" ? 0.22 : 0.18 // 22% Particular vs 18% Empresa

  React.useEffect(() => {
    const p = amount
    const r = currentTax / 12
    const n = parseInt(months)
    if (p > 0 && n > 0) {
      const payment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      setCalculatedInstallment(isNaN(payment) ? 0 : payment)
    }
  }, [amount, months, currentSegment, currentTax])

  // Ajusta valores padrão ao intercalar segmentos para manter o realismo
  const toggleSegment = (segment: "particular" | "empresa") => {
    setCurrentSegment(segment)
    setAmount(segment === "particular" ? 500000 : 5000000)
    setMonths(segment === "particular" ? "12" : "24")
  }

  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => filteredData.map(({ id }) => id),
    [filteredData]
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((prevData) => {
        const oldIndex = prevData.findIndex(item => item.id === active.id)
        const newIndex = prevData.findIndex(item => item.id === over.id)
        return arrayMove(prevData, oldIndex, newIndex)
      })
    }
  }

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="w-full flex flex-col gap-6 p-4 lg:p-6 bg-slate-50/50 min-h-screen">
      
      {/* CONTROLADOR PRINCIPAL PARA INTERCALAR ENTRE SINGULAR E EMPRESA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-900 text-white rounded-xl shadow-md gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-600 rounded-lg text-white">
            <ArrowLeftRightIcon className="size-5" />
          </div>
          <div>
            <h1 className="text-md font-bold tracking-tight">Consola de Gestão de Carteira BFA</h1>
            <p className="text-xs text-slate-400">Intercale os segmentos de mercado para auditoria de contas</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg w-full sm:w-auto border border-slate-700">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => toggleSegment("particular")}
            className={`flex-1 sm:flex-none gap-2 px-4 h-8 font-semibold rounded-md transition-all ${
              currentSegment === "particular" 
                ? "bg-orange-600 text-white hover:bg-orange-600" 
                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <UserIcon className="size-4" />
            Clientes Singulares
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => toggleSegment("empresa")}
            className={`flex-1 sm:flex-none gap-2 px-4 h-8 font-semibold rounded-md transition-all ${
              currentSegment === "empresa" 
                ? "bg-orange-600 text-white hover:bg-orange-600" 
                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <Building2Icon className="size-4" />
            Empresas / PMEs
          </Button>
        </div>
      </div>

      {/* SIMULADOR INTELIGENTE AUTO-ADAPTÁVEL */}
      <div className="grid gap-6 md:grid-cols-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="md:col-span-2 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-lg">
            <CalculatorIcon className="size-5" />
            <h2>
              Simulador BFA: {currentSegment === "particular" ? "Crédito Retalho Singular" : "Linhas de Financiamento Comercial"}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            As taxas e prazos estão configurados automaticamente para o perfil de clientes **{currentSegment === "particular" ? "Particulares (TAE 22%)" : "Empresariais (TAE 18%)"}**.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="dynamic-amount">Capital Solicitado (AOA)</Label>
              <Input 
                id="dynamic-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="focus-visible:ring-orange-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dynamic-months">Período de Amortização</Label>
              <Select value={months} onValueChange={setMonths}>
                <SelectTrigger id="dynamic-months">
                  <SelectValue placeholder="Selecione o prazo" />
                </SelectTrigger>
                <SelectContent>
                  {currentSegment === "particular" ? (
                    <>
                      <SelectItem value="6">6 Meses</SelectItem>
                      <SelectItem value="12">12 Meses (1 Ano)</SelectItem>
                      <SelectItem value="24">24 Meses (2 Anos)</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="12">12 Meses</SelectItem>
                      <SelectItem value="24">24 Meses (2 Anos)</SelectItem>
                      <SelectItem value="36">36 Meses (3 Anos)</SelectItem>
                      <SelectItem value="48">48 Meses (4 Anos)</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-slate-900 to-orange-950 text-white p-5 rounded-xl flex flex-col justify-between shadow-md">
          <div>
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Encargo Mensal Previsto</span>
            <h3 className="text-2xl lg:text-3xl font-black mt-1">
              {calculatedInstallment.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-normal text-slate-300">AOA/mês</span>
            </h3>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-xs space-y-1 text-slate-300">
            <div className="flex justify-between"><span>Taxa de Juro Aplicada:</span> <span className="font-bold text-orange-400">{(currentTax * 100).toFixed(2)}%</span></div>
            <div className="flex justify-between"><span>Tipologia do Segmento:</span> <span className="font-bold uppercase text-slate-200">{currentSegment}</span></div>
            <div className="flex justify-between"><span>Total Bruto Devido:</span> 
              <span className="font-bold">
                {(calculatedInstallment * parseInt(months)).toLocaleString('pt-PT', { maximumFractionDigits: 0 })} AOA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* VISUALIZADOR DA TABELA COM ABAS DE DADOS/ESTATÍSTICAS */}
      <Tabs defaultValue="list-view" className="w-full bg-white rounded-xl border border-slate-200 shadow-sm py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 lg:px-6 gap-4 pb-4 border-b border-slate-100">
          <TabsList className="bg-slate-100/80 p-1 border">
            <TabsTrigger value="list-view" className="data-[state=active]:bg-white data-[state=active]:text-orange-600 font-medium">
              Listagem Ativa ({currentSegment === "particular" ? "Singulares" : "Empresas"})
            </TabsTrigger>
            <TabsTrigger value="charts-view" className="data-[state=active]:bg-white data-[state=active]:text-orange-600 font-medium">
              Métricas de Adesão
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 border-slate-200">
                  <Columns3Icon className="size-4 mr-2" />
                  Visualização
                  <ChevronDownIcon className="size-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {table
                  .getAllColumns()
                  .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id === "header" ? "Nome/Titular" : column.id === "type" ? "Produto" : column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="h-9 bg-orange-600 hover:bg-orange-700 text-white">
              <PlusIcon className="size-4 mr-1.5" />
              Novo Registo ({currentSegment === "particular" ? "Singular" : "Empresa"})
            </Button>
          </div>
        </div>

        {/* CONTEÚDO DA LISTA DE ACORDO COM O FILTRO INTERCALADO */}
        <TabsContent value="list-view" className="relative flex flex-col gap-4 overflow-auto pt-4 px-4 lg:px-6 outline-none">
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
              sensors={sensors}
              id={sortableId}
            >
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="hover:bg-transparent">
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} colSpan={header.colSpan} className="text-slate-700 font-semibold h-11">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="**:data-[slot=table-cell]:first:w-8">
                  {table.getRowModel().rows?.length ? (
                    <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                        Nenhum cliente deste segmento registado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>

          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex-1 text-sm text-muted-foreground hidden sm:block">
              {table.getFilteredSelectedRowModel().rows.length} de{" "}
              {table.getFilteredRowModel().rows.length} registo(s) selecionados.
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="size-8" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <ChevronLeftIcon className="size-4" />
              </Button>
              <div className="text-sm font-medium px-2">
                Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
              </div>
              <Button variant="outline" className="size-8" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* GRÁFICO DINÂMICO QUE DETECTA O PROCESSO INTERCALADO */}
        <TabsContent value="charts-view" className="flex flex-col pt-4 px-4 lg:px-6 outline-none">
          <div className="p-6 border border-slate-200 rounded-xl bg-white space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Performance de Abertura: {currentSegment === "particular" ? "Contas de Retalho Singular" : "Contas Corporativas / PMEs"}
              </h3>
              <p className="text-sm text-muted-foreground">Mapeamento estatístico do volume de novos contratos assinados no BFA.</p>
            </div>
            <div className="w-full h-[320px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <AreaChart accessibilityLayer data={currentSegment === "particular" ? chartDataSingulares : chartDataEmpresas} margin={{ left: 12, right: 12, top: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                  <Area dataKey="volume" type="monotone" fill="rgba(250, 112, 0, 0.2)" stroke="#fa7000" name={currentSegment === "particular" ? "Contas Particulares" : "Contas PME/Corporate"} />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 bg-white"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

// DADOS DE GRÁFICOS SEPARADOS PARA CADA UM DOS SEGMENTOS INTERCALADOS
const chartDataSingulares = [
  { month: "Jan", volume: 1400 },
  { month: "Fev", volume: 1650 },
  { month: "Mar", volume: 2100 },
  { month: "Abr", volume: 2300 },
  { month: "Mai", volume: 2800 },
  { month: "Jun", volume: 3400 },
]

const chartDataEmpresas = [
  { month: "Jan", volume: 120 },
  { month: "Fev", volume: 190 },
  { month: "Mar", volume: 150 },
  { month: "Abr", volume: 310 },
  { month: "Mai", volume: 280 },
  { month: "Jun", volume: 420 },
]

const chartConfig = {
  volume: { label: "Volume de Registos", color: "#fa7000" },
} satisfies ChartConfig

/* FICHA ANALÍTICA LATERAL ADAPTÁVEL (DRAWER) */
function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-orange-600 font-semibold hover:text-orange-700 hover:underline">
          {item.header}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-md">
        <DrawerHeader className="gap-1 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-slate-900">
            {item.segment === "particular" ? <UserIcon className="size-5 text-orange-600" /> : <Building2Icon className="size-5 text-orange-600" />}
            <DrawerTitle>{item.header}</DrawerTitle>
          </div>
          <DrawerDescription>
            Ficha Detalhada — Segmento {item.segment === "particular" ? "Titular Singular" : "Entidade Coletiva"}
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="flex flex-col gap-5 overflow-y-auto p-4 text-sm">
          <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Produto Ativo:</span>
              <span className="font-bold text-slate-900">{item.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Província:</span>
              <span className="font-semibold text-slate-900">{item.target}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Disponibilidade Financeira:</span>
              <span className="font-bold text-orange-600">{item.limit}</span>
            </div>
          </div>

          <Separator />
          
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="header" className="font-semibold text-slate-700">Denominação / Nome do Titular</Label>
              <Input id="header" defaultValue={item.header} className="focus-visible:ring-orange-500" />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="reviewer" className="font-semibold text-slate-700">Responsabilidade Logística / Alocação</Label>
              <Input id="reviewer" defaultValue={item.reviewer} className="focus-visible:ring-orange-500" />
            </div>
          </form>
        </div>
        
        <DrawerFooter className="border-t border-slate-100 mt-auto bg-slate-50/50">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">Confirmar Atualização</Button>
          <DrawerClose asChild>
            <Button variant="outline">Voltar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}