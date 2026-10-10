import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/esec/header"
import { Footer } from "@/components/esec/footer"
import { CartProvider } from "@/components/cart/CartProvider"
import { Toaster } from "sonner"
import Script from "next/script"
import { OneSignalInit } from "@/components/esec/OneSignalInit"
import { PushSubscribeButton } from "@/components/esec/PushSubscribeButton"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "AlitasNOA | Alas que te hacen volar",
  description: "Las mejores alitas de la ciudad. Clásicas y Miel Mostaza.",
  icons: {
    icon: "https://ljjbgqqxunzqhwofoved.supabase.co/storage/v1/object/public/comida/loogo.jpeg",
    apple: "https://ljjbgqqxunzqhwofoved.supabase.co/storage/v1/object/public/comida/loogo.jpeg",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} bg-black text-white antialiased`}
        suppressHydrationWarning
      >
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="afterInteractive"
        />
        <CartProvider>
          <OneSignalInit />
          <PushSubscribeButton variant="cliente" />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster
            theme="dark"
            position="top-right"
            richColors
            closeButton
            expand={false}
            visibleToasts={4}
            toastOptions={{
              classNames: {
                toast:
                  "bg-zinc-950 border border-zinc-800 text-white shadow-lg shadow-black/40",
                title: "text-white font-semibold",
                description: "text-zinc-400",
                success: "border-green-500/40",
                error: "border-red-500/40",
                closeButton: "bg-zinc-900 border-zinc-700 text-zinc-300",
              },
            }}
          />
        </CartProvider>

      </body>
    </html>
  )
}