
import { getEstadoRestaurante } from "@/lib/restaurante-abierto"
import CarritoClient from "@/components/cart/CarritoClient"

export default async function CarritoPage() {
  const { abierto } = await getEstadoRestaurante()
  return <CarritoClient modoReserva={!abierto} />
}