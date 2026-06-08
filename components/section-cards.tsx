"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">

      {/* Card 1 — Total de Clientes */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de Clientes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            3.199.554
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              +11,6%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Crescimento face a 2023 <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Fonte: Relatório e Contas Banco 2024
          </div>
        </CardFooter>
      </Card>

      {/* Card 2 — Volume de Depósitos */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Volume de Depósitos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            3.210.711 M Kz
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              +6,4%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Subida face a 2024 <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Fonte: Relatório Banco 1º Semestre 2025
          </div>
        </CardFooter>
      </Card>

      {/* Card 3 — Resultado Líquido */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Resultado Líquido 2024</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            205.821 M Kz
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              +22,9%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Melhor resultado da história <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Fonte: Relatório e Contas Banco 2024
          </div>
        </CardFooter>
      </Card>

      {/* Card 4 — Rede de Balcões */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Rede de Balcões</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            194 Balcões
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              +1 balcão
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Expansão da rede em 2024 <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Agências, Centros de Empresas e Private Banking
          </div>
        </CardFooter>
      </Card>

    </div>
  )
}