import { Flame } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="relative border-b border-orange-900/40 bg-black/90 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Flame className="h-7 w-7 text-orange-500 fill-orange-500 group-hover:scale-110 transition-transform" />
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase">
              Alitas<span className="text-orange-500">NOA</span>
            </span>
          </Link>

          {/* Navegación simple */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
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

          {/* Botón WhatsApp (móvil y desktop) */}
          <a
            href="https://wa.me/573105332480"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  )
}