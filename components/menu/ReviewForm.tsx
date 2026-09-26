"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Star } from "lucide-react"
import { toast } from "sonner"

type Props = {
  menuItemId: string
}

export function ReviewForm({ menuItemId }: Props) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [nombreCuenta, setNombreCuenta] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [puedeResenar, setPuedeResenar] = useState(false)
  const [motivoBloqueo, setMotivoBloqueo] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function verificar() {
      setChecking(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setMotivoBloqueo("login")
        setChecking(false)
        return
      }

      setUserId(user.id)

      const { data: perfil } = await supabase
        .from("perfiles")
        .select("nombre, apellido")
        .eq("id", user.id)
        .maybeSingle()

      const nombre = [perfil?.nombre, perfil?.apellido].filter(Boolean).join(" ")
      setNombreCuenta(nombre || "Cliente")

      // Pedidos completados del usuario
      const { data: pedidos } = await supabase
        .from("pedidos")
        .select("id, items, estado")
        .eq("cliente_id", user.id)
        .eq("estado", "completado")

      if (!pedidos?.length) {
        setMotivoBloqueo("sin_pedido")
        setChecking(false)
        return
      }

      // ¿Algún pedido incluye este producto?
      const probo = pedidos.some((p) => {
        const items = p.items
        if (!Array.isArray(items)) return false
        return items.some(
          (it: { id?: string }) => String(it.id) === String(menuItemId)
        )
      })

      if (!probo) {
        setMotivoBloqueo("no_probo")
        setChecking(false)
        return
      }

      // ¿Ya dejó reseña de este producto?
      const { data: ya } = await supabase
        .from("reviews")
        .select("id")
        .eq("menu_item_id", menuItemId)
        .eq("user_id", user.id)
        .maybeSingle()

      if (ya) {
        setMotivoBloqueo("ya_reseño")
        setChecking(false)
        return
      }

      setPuedeResenar(true)
      setMotivoBloqueo(null)
      setChecking(false)
    }

    verificar()
  }, [menuItemId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId || !nombreCuenta) return

    setLoading(true)

    const { error } = await supabase.from("reviews").insert({
      menu_item_id: menuItemId,
      author_name: nombreCuenta,
      rating,
      comment: comment.trim() || null,
      user_id: userId,
    })

    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Reseña publicada")
    setComment("")
    setPuedeResenar(false)
    setMotivoBloqueo("ya_reseño")
    router.refresh()
  }

  if (checking) {
    return (
      <p className="text-sm text-zinc-500">Comprobando si puedes reseñar...</p>
    )
  }

  if (motivoBloqueo === "login") {
    return (
      <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-950/80 text-sm text-zinc-400">
        <p>
          Inicia sesión para dejar una reseña.{" "}
          <Link href="/auth/login" className="text-orange-400 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    )
  }

  if (motivoBloqueo === "sin_pedido" || motivoBloqueo === "no_probo") {
    return (
      <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-950/80 text-sm text-zinc-400">
        <p>
          Solo puedes reseñar este producto si ya lo pediste y el local marcó tu
          pedido como <span className="text-white font-medium">completado</span>.
        </p>
      </div>
    )
  }

  if (motivoBloqueo === "ya_reseño") {
    return (
      <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-950/80 text-sm text-zinc-400">
        Ya publicaste una reseña de este producto. ¡Gracias!
      </div>
    )
  }

  if (!puedeResenar) return null

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-zinc-800 rounded-2xl p-5 bg-zinc-950/80 space-y-4"
    >
      <h3 className="font-bold text-white">Escribe tu reseña</h3>

      <p className="text-sm text-zinc-400">
        Publicarás como{" "}
        <span className="text-white font-medium">{nombreCuenta}</span>
      </p>

      <div>
        <label className="text-xs text-zinc-400 mb-1 block">Calificación</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)}>
              <Star
                className={`h-6 w-6 ${
                  n <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-zinc-600"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-zinc-400">Comentario</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="mt-1 w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-orange-500 resize-none"
          placeholder="¿Qué te pareció?"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 rounded-full bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm disabled:opacity-50"
      >
        {loading ? "Publicando..." : "Publicar reseña"}
      </button>
    </form>
  )
}