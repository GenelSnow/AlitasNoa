"use client"

import { useEffect } from "react"

const APP_ID = "4675b5e6-c456-4aa4-a468-5153bcaa3cf1"

export function OneSignalInit() {
  useEffect(() => {
    // Evitar doble init en React Strict Mode
    if (typeof window === "undefined") return
    if ((window as unknown as { __onesignal_initialized?: boolean }).__onesignal_initialized) {
      return
    }

    window.OneSignalDeferred = window.OneSignalDeferred || []
    window.OneSignalDeferred.push(async function (OneSignal) {
      await OneSignal.init({
        appId: APP_ID,
        // Solo si pruebas en localhost:
        // allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: true, // campanita flotante de OneSignal
        },
      })
      ;(window as unknown as { __onesignal_initialized?: boolean }).__onesignal_initialized =
        true
    })
  }, [])

  return null
}