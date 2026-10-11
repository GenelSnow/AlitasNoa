"use client"

import { useEffect } from "react"
import type { OneSignalSDK } from "@/types/onesignal"

const APP_ID = "4675b5e6-c456-4aa4-a468-5153bcaa3cf1"

export function OneSignalInit() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.__onesignal_initialized) return

    window.OneSignalDeferred = window.OneSignalDeferred || []
    window.OneSignalDeferred.push(async function (OneSignal: OneSignalSDK) {
      await OneSignal.init({
        appId: APP_ID,
        notifyButton: { enable: false },
      })
      window.__onesignal_initialized = true
    })
  }, [])

  return null
}