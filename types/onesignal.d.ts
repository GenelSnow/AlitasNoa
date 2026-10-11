export type OneSignalSDK = {
  init: (options: {
    appId: string
    allowLocalhostAsSecureOrigin?: boolean
    notifyButton?: { enable: boolean }
  }) => Promise<void>
  Notifications: {
    permissionNative: string
    requestPermission: () => Promise<void>
  }
  User: {
    PushSubscription: {
      optedIn: boolean
      optIn: () => Promise<void>
    }
    addTag: (key: string, value: string) => void
  }
  login?: (externalId: string) => Promise<void>
}

declare global {
  interface Window {
    OneSignalDeferred?: Array<
      (OneSignal: OneSignalSDK) => void | Promise<void>
    >
    __onesignal_initialized?: boolean
  }
}

export {}