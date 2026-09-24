"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Flame } from "lucide-react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setMessage("Te enviamos un correo de confirmación. Revisa tu bandeja de entrada.")
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
          <h1 className="text-3xl font-bold text-white">Crear cuenta</h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Obtén descuentos y promociones exclusivas
          </p>
        </div>

        <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950/80">
          <form onSubmit={handleSignUp} className="space-y-4">
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {message && <p className="text-green-400 text-sm">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-bold transition-colors disabled:opacity-50"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="text-orange-400 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}