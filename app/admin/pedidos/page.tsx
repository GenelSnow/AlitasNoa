import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getPerfil, esStaff } from "@/lib/perfil"
import {
  AdminPedidosTabs,
  type PedidoRow,
} from "@/components/admin/AdminPedidosTabs"

export default async function AdminPedidosPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect("/auth/login")
  if (!esStaff(perfil.rol)) redirect("/")

  const supabase = await createClient()

  const { data: pedidos } = await supabase
    .from("pedidos")
    .select(
      `
      id, total, estado, notas, created_at,
      nombre_entrega, telefono, codigo_referido_usado, es_reserva,
      perfiles:cliente_id ( nombre, apellido, whatsapp )
    `
    )
    .order("created_at", { ascending: false })
    .limit(100)

  const lista = (pedidos || []) as PedidoRow[]

  const reservas = lista.filter(
    (p) => p.estado === "reservado" || p.es_reserva === true
  )

  const activos = lista.filter(
    (p) => p.estado !== "reservado" && p.estado !== "cancelado"
  )

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-black text-white mb-2">Pedidos</h1>
      <p className="text-zinc-400 text-sm mb-8">
        Pedidos en curso y reservas. Confirma reservas cuando abras el local.
        Al completar un pedido se activa el punto de referido si aplica.
      </p>

      {!lista.length ? (
        <p className="text-zinc-500 border border-zinc-800 rounded-xl p-8 text-center">
          No hay pedidos aún. Cuando alguien ordene o reserve, aparecerán aquí.
        </p>
      ) : (
        <AdminPedidosTabs activos={activos} reservas={reservas} />
      )}
    </div>
  )
}