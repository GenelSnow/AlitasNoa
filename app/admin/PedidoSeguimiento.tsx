"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { armarMensajePedido, type EstadoPedido, type FormaPago } from "@/lib/pedido-mensajes"
import { toast } from "sonner"
import { MessageCircle } from "lucide-react"

const ESTADOS: { value: EstadoPedido; label: string }[] = [
  { value: "ordenado", label: "Ordenado" },
  { value: "procesando", label: "Procesando" },
  { value: "en_envio", label: "En envío" },
  { value: "completado", label: "Completado" },
  { value: "cancelado", label: "Cancelado" },
]

const DEMORAS_COCINA = ["10-15 minutos", "15-20 minutos", "20-30 minutos", "30-40 minutos"]
const DEMORAS_ENVIO = ["5-10 minutos", "10-15 minutos", "15-25 minutos", "25-35 minutos"]

type Pedido = {
  id: string
  total: number
  subtotal?: number
  costo_domicilio?: number
  forma_pago: string | null
  estado: string
  nombre_entrega: string | null
  telefono: string | null
  direccion: string | null
  referencia_vivienda: string | null
  nota_adicional: string | null
  items: { id?: string; name: string; price: number; quantity: number }[] | null
  created_at: string
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(n)
}

export function PedidoSeguimiento({
  pedido,
  validadorId,
}: {
  pedido: Pedido
  validadorId: string
}) {
  const [estado, setEstado] = useState(pedido.estado as EstadoPedido)
  const [demoraCocina, setDemoraCocina] = useState(DEMORAS_COCINA[1])
  const [demoraRepartidor, setDemoraRepartidor] = useState(DEMORAS_ENVIO[1])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const formaPago = (pedido.forma_pago || "efectivo") as FormaPago
  const telefono = (pedido.telefono || "").replace(/\D/g, "")
  const wa = telefono.startsWith("57") ? telefono : `57${telefono}`

  const mensaje = armarMensajePedido({
    nombre: pedido.nombre_entrega || "cliente",
    estado,
    formaPago,
    demoraCocina:
      estado === "ordenado" || estado === "procesando" ? demoraCocina : undefined,
    demoraRepartidor: estado === "en_envio" ? demoraRepartidor : undefined,
  })

  async function guardarEstado() {
    setLoading(true)

    if (estado === "completado") {
      const { error } = await supabase.rpc("completar_pedido", {
        p_pedido_id: pedido.id,
        p_validador_id: validadorId,
      })
      if (error) {
        // fallback update simple si el RPC falla por estado legacy
        await supabase
          .from("pedidos")
          .update({ estado: "completado", completado_at: new Date().toISOString() })
          .eq("id", pedido.id)
        toast.error(error.message)
      } else {
        toast.success("Pedido completado", {
          description: "Se registró y se aplicó punto de referido si correspondía.",
        })
      }
    } else {
      const { error } = await supabase
        .from("pedidos")
        .update({ estado })
        .eq("id", pedido.id)

      if (error) {
        toast.error(error.message)
        setLoading(false)
        return
      }
      toast.success("Estado actualizado", { description: ESTADOS.find((e) => e.value === estado)?.label })
    }

    setLoading(false)
    router.refresh()
  }

  function enviarWhatsApp() {
    if (!wa || wa.length < 10) {
      toast.error("El pedido no tiene WhatsApp válido")
      return
    }
    const url = `https://wa.me/${wa}?text=${encodeURIComponent(mensaje)}`
    window.open(url, "_blank")
    toast.success("WhatsApp abierto", {
      description: "Revisa el mensaje y envíalo al cliente.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Detalle */}
      <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-950/80 space-y-3">
        <h2 className="font-bold text-white">Detalle</h2>
        <p className="text-sm text-zinc-300">
          <span className="text-zinc-500">Cliente:</span> {pedido.nombre_entrega}
        </p>
        <p className="text-sm text-zinc-300">
          <span className="text-zinc-500">WhatsApp:</span> {pedido.telefono}
        </p>
        <p className="text-sm text-zinc-300">
          <span className="text-zinc-500">Dirección:</span> {pedido.direccion}
        </p>
        {pedido.referencia_vivienda && (
          <p className="text-sm text-zinc-300">
            <span className="text-zinc-500">Ref:</span> {pedido.referencia_vivienda}
          </p>
        )}
        <p className="text-sm text-zinc-300">
          <span className="text-zinc-500">Pago:</span>{" "}
          {formaPago === "efectivo" ? "Efectivo" : formaPago === "nequi" ? "Nequi" : "Llave"}
        </p>
        <p className="text-sm text-orange-400 font-bold">
          Total: {formatPrice(Number(pedido.total))}
        </p>

        <ul className="text-sm text-zinc-400 border-t border-zinc-800 pt-3 space-y-1">
          {(pedido.items || []).map((it, i) => (
            <li key={i}>
              • {it.name} x{it.quantity}
            </li>
          ))}
        </ul>
      </div>

      {/* Estado + demoras */}
      <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-950/80 space-y-4">
        <h2 className="font-bold text-white">Estado y tiempos</h2>

        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value as EstadoPedido)}
            className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm"
          >
            {ESTADOS.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        </div>

        {(estado === "ordenado" || estado === "procesando") && (
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">
              Demora preparación
            </label>
            <select
              value={demoraCocina}
              onChange={(e) => setDemoraCocina(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm"
            >
              {DEMORAS_COCINA.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}

        {estado === "en_envio" && (
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">
              Demora del repartidor
            </label>
            <select
              value={demoraRepartidor}
              onChange={(e) => setDemoraRepartidor(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm"
            >
              {DEMORAS_ENVIO.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="button"
          onClick={guardarEstado}
          disabled={loading}
          className="w-full h-10 rounded-full bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar estado"}
        </button>
      </div>

      {/* Preview mensaje */}
      <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-950/80 space-y-4">
        <h2 className="font-bold text-white">Mensaje al cliente</h2>
        <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans bg-zinc-900/80 rounded-xl p-4 border border-zinc-800">
          {mensaje}
        </pre>
        <button
          type="button"
          onClick={enviarWhatsApp}
          className="w-full h-11 rounded-full bg-green-600 hover:bg-green-500 text-white font-bold text-sm inline-flex items-center justify-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          Enviar por WhatsApp
        </button>
      </div>
    </div>
  )
}