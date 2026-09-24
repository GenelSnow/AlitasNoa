import { Flame } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { AuthButtons } from "./AuthButtons"

export async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="relative border-b border-orange-900/40 bg-black/90 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Flame className="h-7 w-7 text-orange-500 fill-orange-500 group-hover:scale-110 transition-transform" />
            <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase">
              Alitas<span className="text-orange-500">NOA</span>
            </span>
          </Link>

          {/* Navegación */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/menu"
              className="text-zinc-300 hover:text-orange-400 transition-colors"
            >
              Menú
            </Link>
            <a
              href="https://wa.me/573105332480"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-green-400 transition-colors"
            >
              Pedir
            </a>
          </nav>

          {/* Auth + WhatsApp */}
          <div className="flex items-center gap-3">
            <AuthButtons email={user?.email} />

            <a
              href="https://wa.me/573105332480"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}