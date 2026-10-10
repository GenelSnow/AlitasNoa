"use client"

import { toast } from "sonner"

export function ActivarAvisosButton() {
  async function onClick() {
    if (!("Notification" in window)) {
      toast.error("Este navegador no soporta notificaciones")
      return
    }
    const perm = await Notification.requestPermission()
    if (perm === "granted") {
      toast.success("Avisos activados")
      new Notification("AlitasNOA", {
        body: "Te avisaremos cuando abramos o si hay cierre del día.",
        icon: "/icon.png",
      })
    } else {
      toast.error("Permiso denegado")
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs text-zinc-400 hover:text-orange-400 underline"
    >
      Activar avisos de apertura
    </button>
  )
}