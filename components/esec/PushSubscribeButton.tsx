"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import type { OneSignalSDK } from "@/types/onesignal"

export function PushSubscribeButton({
  variant = "cliente",
}: {
  variant?: "cliente" | "staff"
}) {
  const [ready, setReady] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    window.OneSignalDeferred = window.OneSignalDeferred || []
    window.OneSignalDeferred.push(async (OneSignal: OneSignalSDK) => {
      setReady(true)
      try {
        setSubscribed(!!OneSignal.User?.PushSubscription?.optedIn)
      } catch {
        /* ignore */
      }
    })
  }, [])

  async function onClick() {
    if (!ready) {
      toast.message("Cargando notificaciones…")
      return
    }
    setLoading(true)
    try {
      await new Promise<void>((resolve, reject) => {
        window.OneSignalDeferred = window.OneSignalDeferred || []
        window.OneSignalDeferred.push(async (OneSignal: OneSignalSDK) => {
          try {
            await OneSignal.Notifications.requestPermission()
            await OneSignal.User.PushSubscription.optIn()

            if (variant === "staff") {
              OneSignal.User.addTag("rol", "staff")
              const supabase = createClient()
              const {
                data: { user },
              } = await supabase.auth.getUser()
              if (user?.id && OneSignal.login) {
                await OneSignal.login(user.id)
              }
            } else {
              OneSignal.User.addTag("rol", "cliente")
            }

            setSubscribed(true)
            toast.success(
              variant === "staff"
                ? "Avisos de pedidos activados"
                : "Avisos activados"
            )
            resolve()
          } catch (e) {
            reject(e)
          }
        })
      })
    } catch {
      toast.error(
        "No se pudo activar. Revisa el permiso en el candado de la URL."
      )
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-green-400">
        <Bell className="h-3.5 w-3.5" />
        Avisos activos
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || !ready}
      className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full bg-orange-500 hover:bg-orange-400 text-black text-sm font-bold transition-colors disabled:opacity-50"
    >
      <Bell className="h-4 w-4" />
      {loading
        ? "Activando…"
        : variant === "staff"
          ? "Activar avisos de pedidos"
          : "Activar avisos"}
    </button>
  )
}