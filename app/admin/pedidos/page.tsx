import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getPerfil, esStaff } from "@/lib/perfil"
import { CompletarPedidoButton } from "@/components/admin/CompletarPedidoButton"

export default async function AdminPedidosPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect("/auth/login")
  if (!esStaff(perfil.rol)) redirect("/")

  const supabase = await createClient()

  const { data: pedidos } = await supabase
    .from("pedidos")
    .select(`
      id,
      total,
      estado,
      notas,
      created_at,
      perfiles:cliente_id ( nombre, apellido, whatsapp )
    `)
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-black text-white mb-2">Pedidos</h1>
      <p className="text-zinc-400 text-sm mb-8">
        Marca como completado solo cuando el cliente ya recibió / pagó el pedido.
        Eso activa el punto de referido si aplica.
      </p>

      {!pedidos?.length ? (
        <p className="text-zinc-500 border border-zinc-800 rounded-xl p-8 text-center">
          No hay pedidos aún. Cuando exista el carrito, aparecerán aquí.
        </p>
      ) : (
        <ul className="space-y-4">
          {pedidos.map((p) => {
            const cliente = p.perfiles as {
              nombre: string
              apellido: string | null
              whatsapp: string
            } | null

            return (
              <li
                key={p.id}
                className="border border-zinc-800 rounded-2xl p-5 bg-zinc-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <p className="font-bold text-white">
                    {cliente?.nombre} {cliente?.apellido}
                  </p>
                  <p className="text-sm text-zinc-400">
                    WhatsApp: {cliente?.whatsapp}
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(Number(p.total))}
                    {" · "}
                    {new Date(p.created_at).toLocaleString("es-CO")}
                  </p>
                  {p.notas && (
                    <p className="text-xs text-zinc-500 mt-1">Nota: {p.notas}</p>
                  )}
                  <span
                    className={`inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                      p.estado === "completado"
                        ? "bg-green-500/15 text-green-400"
                        : p.estado === "pendiente"
                          ? "bg-yellow-500/15 text-yellow-400"
                          : "bg-zinc-700 text-zinc-300"
                    }`}
                  >
                    {p.estado}
                  </span>
                </div>

                {p.estado !== "completado" && p.estado !== "cancelado" && (
                  <CompletarPedidoButton
                    pedidoId={p.id}
                    validadorId={perfil.id}
                  />
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}