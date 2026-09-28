import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getPerfil, esStaff } from "@/lib/perfil"
import { PedidoSeguimiento } from "@/components/admin/PedidoSeguimiento"

interface Props {
  params: Promise<{ id: string }>
}

export default async function PedidoDetallePage({ params }: Props) {
  const { id } = await params
  const perfil = await getPerfil()
  if (!perfil) redirect("/auth/login")
  if (!esStaff(perfil.rol)) redirect("/")

  const supabase = await createClient()

  const { data: pedido } = await supabase
    .from("pedidos")
    .select(`
    id,
    total,
    estado,
    notas,
    created_at,
    nombre_entrega,
    telefono,
    codigo_referido_usado,
    cliente_id,
    perfiles:cliente_id ( nombre, apellido, whatsapp )
  `)
    .eq("id", id)
    .single()

  if (!pedido) notFound()

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Link
        href="/admin/pedidos"
        className="text-sm text-zinc-400 hover:text-orange-400 mb-6 inline-block"
      >
        ← Volver a pedidos
      </Link>

      <h1 className="text-3xl font-black text-white mb-2">Seguimiento</h1>
      <p className="text-zinc-500 text-sm mb-8">
        Pedido {pedido.id.slice(0, 8)}…
      </p>

      <PedidoSeguimiento pedido={pedido} validadorId={perfil.id} />
    </div>
  )
}