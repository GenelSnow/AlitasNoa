import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Flame, Crown } from "lucide-react"
import Image from "next/image"

interface Props {
  item: {
    name: string
    description: string
    price: number
    spicyLevel?: number
    popular?: boolean
    image?: string
  }
  accent?: "orange" | "yellow"
}

export function MenuItem({ item, accent = "orange" }: Props) {
  const isYellow = accent === "yellow"

  const priceColor = isYellow ? "text-yellow-400" : "text-orange-500"
  const badgeColor = isYellow
    ? "bg-yellow-500 hover:bg-yellow-600 text-black"
    : "bg-orange-500 hover:bg-orange-600 text-white"
  const flameColor = isYellow ? "fill-yellow-400 text-yellow-400" : "fill-orange-500 text-orange-500"

  // Formato de precio colombiano
  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(item.price)

  return (
    <Card className="overflow-hidden border-zinc-800 bg-zinc-950/80 hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-orange-900/10 group">
      {/* Imagen (si existe) */}
      {item.image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {item.popular && (
            <Badge className={`absolute top-3 left-3 ${badgeColor} font-bold`}>
              <Crown className="h-3.5 w-3.5 mr-1" />
              Popular
            </Badge>
          )}
        </div>
      )}

      <CardContent className="p-5">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg tracking-tight text-white group-hover:text-white/90">
              {item.name}
            </h3>
            <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Precio */}
          <span className={`font-black text-xl whitespace-nowrap ${priceColor}`}>
            {formattedPrice}
          </span>
        </div>

        {/* Nivel de picante */}
        {item.spicyLevel !== undefined && item.spicyLevel > 0 && (
          <div className="flex items-center gap-1 mt-4">
            {Array.from({ length: item.spicyLevel }).map((_, i) => (
              <Flame key={i} className={`h-4 w-4 ${flameColor}`} />
            ))}
            <span className="text-xs text-zinc-500 ml-1">
              {item.spicyLevel === 1 && "Suave"}
              {item.spicyLevel === 2 && "Medio"}
              {item.spicyLevel === 3 && "Extremo"}
            </span>
          </div>
        )}

        {/* Badge Popular cuando no hay imagen */}
        {!item.image && item.popular && (
          <Badge className={`mt-4 ${badgeColor} font-bold`}>
            <Crown className="h-3.5 w-3.5 mr-1" />
            Popular
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}