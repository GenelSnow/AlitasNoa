"use client"

import { useEffect } from "react"

const APP_ID = "4675b5e6-c456-4aa4-a468-5153bcaa3cf1"

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: OneSignalStub) => void | Promise<void>>
    __onesignal_initialized?: boolean
  }
}

type OneSignalStub = {
  init: (options: {
    appId: string
    allowLocalhostAsSecureOrigin?: boolean
    notifyButton?: { enable: boolean }
  }) => Promise<void>
}

export function OneSignalInit() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.__onesignal_initialized) return

    window.OneSignalDeferred = window.OneSignalDeferred || []
    window.OneSignalDeferred.push(async function (OneSignal: OneSignalStub) {
      await OneSignal.init({
        appId: APP_ID,
        notifyButton: {
          enable: true,
        },
      })
      window.__onesignal_initialized = true
    })
  }, [])

  return null
}