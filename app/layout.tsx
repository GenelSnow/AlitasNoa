import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/esec/header"
import { Footer } from "@/components/esec/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AlitasNOA | Alas que te hacen volar",
  description: "Las mejores alitas de la ciudad. Clásicas y Miel Mostaza.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}