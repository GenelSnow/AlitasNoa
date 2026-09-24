"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, User } from "lucide-react"

interface Props {
  email?: string | null
}

export function AuthButtons({ email }: Props) {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  // Usuario logueado
  if (email) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-400">
          <User className="h-4 w-4" />
          <span className="max-w-[140px] truncate">{email}</span>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-300 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    )
  }

  // Usuario NO logueado
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/auth/login"
        className="text-sm font-medium text-zinc-300 hover:text-white transition-colors px-3 py-2"
      >
        Entrar
      </Link>
      <Link
        href="/auth/sign-up"
        className="text-sm font-bold bg-orange-500 hover:bg-orange-400 text-black px-4 py-2 rounded-full transition-colors"
      >
        Crear cuenta
      </Link>
    </div>
  )
}