"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

type Perm = NotificationPermission | "unsupported"

export function ActivarAvisosButton() {
  const [perm, setPerm] = useState<Perm>("default")

  useEffect(() => {
    if (!("Notification" in window)) {
      setPerm("unsupported")
      return
    }
    setPerm(Notification.permission)
  }, [])

  async function onClick() {
    if (!("Notification" in window)) {
      toast.error("Este navegador no soporta notificaciones")
      return
    }

    if (Notification.permission === "denied") {
      toast.error(
        "Notificaciones bloqueadas. Actívalas en el candado de la URL → Notificaciones → Permitir, y recarga."
      )
      setPerm("denied")
      return
    }

    const result = await Notification.requestPermission()
    setPerm(result)

    if (result === "granted") {
      toast.success("Avisos activados")
      try {
        new Notification("AlitasNOA", {
          body: "Te avisaremos cuando abramos o si hay cierre del día.",
          icon: "/icon.png",
        })
      } catch {
        // algunos navegadores fallan si no hay service worker; el permiso igual quedó ok
      }
    } else if (result === "denied") {
      toast.error("Permiso denegado. Revisa ajustes del sitio en el navegador.")
    } else {
      toast.message("No se activaron los avisos")
    }
  }

  if (perm === "unsupported") {
    return (
      <span className="text-xs text-zinc-500">
        Notificaciones no disponibles en este navegador
      </span>
    )
  }

  if (perm === "granted") {
    return (
      <span className="text-xs text-green-400">Avisos activados ✓</span>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs text-zinc-400 hover:text-orange-400 underline"
    >
      {perm === "denied"
        ? "Notificaciones bloqueadas (abrir ajustes del sitio)"
        : "Activar avisos de apertura"}
    </button>
  )
}