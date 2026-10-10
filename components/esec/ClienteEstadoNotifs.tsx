"use client"

import { useEffect } from "react"

type Props = {
  abierto: boolean
  forzado?: boolean
  mensaje?: string
}

export function ClienteEstadoNotifs({ abierto, forzado, mensaje }: Props) {
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return
    if (Notification.permission !== "granted") return

    const key = "alitas_last_estado"
    const actual = forzado ? "cerrado_forzado" : abierto ? "abierto" : "cerrado"
    const anterior = localStorage.getItem(key)

    if (!anterior) {
      localStorage.setItem(key, actual)
      return
    }

    if (anterior === actual) return

    if (actual === "abierto" && anterior !== "abierto") {
      new Notification("AlitasNOA — ¡Ya abrimos!", {
        body: "Ya puedes hacer tu pedido.",
        tag: "alitas-estado",
        icon: "/icon.png",
      })
    }

    if (actual === "cerrado_forzado") {
      new Notification("AlitasNOA — Hoy no abrimos", {
        body: mensaje || "Hoy no estamos atendiendo.",
        tag: "alitas-estado",
        icon: "/icon.png",
      })
    }

    localStorage.setItem(key, actual)
  }, [abierto, forzado, mensaje])

  return null
}