"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function CompletarPedidoButton({
  pedidoId,
  validadorId,
}: {
  pedidoId: string
  validadorId: string
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function completar() {
    if (!confirm("¿Confirmas que este pedido ya se completó?")) return
    setLoading(true)

    const { error } = await supabase.rpc("completar_pedido", {
      p_pedido_id: pedidoId,
      p_validador_id: validadorId,
    })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={completar}
      disabled={loading}
      className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors disabled:opacity-50"
    >
      {loading ? "Validando..." : "Marcar completado"}
    </button>
  )
}