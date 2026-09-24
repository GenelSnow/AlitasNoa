"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Flame } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Flame className="h-7 w-7 text-orange-500 fill-orange-500" />
            <span className="text-2xl font-black tracking-tighter text-white uppercase">
              Alitas<span className="text-orange-500">NOA</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">Iniciar sesión</h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Accede a tus descuentos y promociones
          </p>
        </div>

        <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950/80">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Correo</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
                placeholder="Tu contraseña"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-bold transition-colors disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/auth/sign-up" className="text-orange-400 hover:underline">
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  )
}