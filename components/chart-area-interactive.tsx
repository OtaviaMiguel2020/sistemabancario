"use client"

import * as React from "react"
import { Pie, PieChart, Cell, Legend } from "recharts"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

// ─── DADOS ────────────────────────────────────────────────────────────────────

const dadosTipos = [
  { name: "Conta à Ordem",  value: 42, color: "#005AA9" },
  { name: "Conta Poupança", value: 28, color: "#FF7607" },
  { name: "Conta Salário",  value: 22, color: "#1E8449" },
  { name: "Outras",         value: 8,  color: "#94A3B8" },
]

const dadosBarras = [
  { mes: "Jan", solicitacoes: 98,  aprovadas: 82  },
  { mes: "Fev", solicitacoes: 112, aprovadas: 95  },
  { mes: "Mar", solicitacoes: 134, aprovadas: 110 },
  { mes: "Abr", solicitacoes: 119, aprovadas: 98  },
  { mes: "Mai", solicitacoes: 148, aprovadas: 125 },
  { mes: "Jun", solicitacoes: 162, aprovadas: 140 },
  { mes: "Jul", solicitacoes: 155, aprovadas: 130 },
  { mes: "Ago", solicitacoes: 171, aprovadas: 148 },
  { mes: "Set", solicitacoes: 183, aprovadas: 160 },
  { mes: "Out", solicitacoes: 196, aprovadas: 172 },
  { mes: "Nov", solicitacoes: 210, aprovadas: 188 },
  { mes: "Dez", solicitacoes: 228, aprovadas: 205 },
]

// ─── CONFIGS ──────────────────────────────────────────────────────────────────

const configBarras = {
  solicitacoes: { label: "Solicitações", color: "#FF7607" },
  aprovadas:    { label: "Aprovadas",    color: "#005AA9" },
} satisfies ChartConfig

const RADIAN = Math.PI / 180
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

export function ChartAreaInteractive() {
  const [periodo, setPeriodo] = React.useState("ano")

  const filteredData = dadosBarras.slice(
    periodo === "ano" ? 0 : periodo === "6m" ? 6 : 11
  )

  const total = dadosTipos.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @3xl/main:grid-cols-3">

      {/* Gráfico de Barras — 2/3 */}
      <Card className="@container/card @3xl/main:col-span-2">
        <CardHeader>
          <CardTitle className="font-semibold">
            Desempenho Comercial — 2026
          </CardTitle>
          <CardDescription>
            Solicitações recebidas vs Contas aprovadas por mês
          </CardDescription>
          <CardAction>
            <ToggleGroup
              type="single"
              value={periodo}
              onValueChange={setPeriodo}
              variant="outline"
              className="hidden @[500px]/card:flex"
            >
              <ToggleGroupItem value="ano">Ano</ToggleGroupItem>
              <ToggleGroupItem value="6m">6 Meses</ToggleGroupItem>
              <ToggleGroupItem value="1m">1 Mês</ToggleGroupItem>
            </ToggleGroup>
          </CardAction>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer config={configBarras} className="aspect-auto h-[250px] w-full">
            <BarChart data={filteredData} barGap={4}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="solicitacoes" fill="#FF7607" radius={[4, 4, 0, 0]} />
              <Bar dataKey="aprovadas"    fill="#005AA9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Rosca — 1/3 */}
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="font-semibold">Contas por Tipo</CardTitle>
          <CardDescription>Distribuição — Janeiro a Junho 2026</CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer config={{}} className="aspect-auto h-[250px] w-full">
            <PieChart>
              <Pie
                data={dadosTipos}
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {dadosTipos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <text x="50%" y="43%" textAnchor="middle" dominantBaseline="middle" fontSize={26} fontWeight={700} fill="currentColor">
                {total}
              </text>
              <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" fontSize={11} fill="#94A3B8">
                Total
              </text>
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={{ fontSize: 12, color: "#64748B" }}>{value}</span>}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

    </div>
  )
}