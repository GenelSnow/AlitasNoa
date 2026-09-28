"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

type Row = { clave: string; valor: string }

const LABELS: Record<string, string> = {
  precio_domicilio: "Precio domicilio (COP)",
  nequi_numero: "Número Nequi",
  llave_numero: "Número Llave",
}

export function AdminConfig() {
  const supabase = createClient()
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)

  async function load() {
    const { data } = await supabase.from("config_app").select("clave, valor")
    setRows(data || [])
  }

  useEffect(() => {
    load()
  }, [])

  function setValor(clave: string, valor: string) {
    setRows((prev) =>
      prev.map((r) => (r.clave === clave ? { ...r, valor } : r))
    )
  }

  async function save() {
    setLoading(true)
    for (const r of rows) {
      const { error } = await supabase
        .from("config_app")
        .update({ valor: r.valor, updated_at: new Date().toISOString() })
        .eq("clave", r.clave)
      if (error) {
        toast.error(`${r.clave}: ${error.message}`)
        setLoading(false)
        return
      }
    }
    setLoading(false)
    toast.success("Configuración guardada")
  }

  return (
    <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-950/80 space-y-4 max-w-lg">
      <h2 className="font-bold text-white text-lg">Parámetros</h2>
      {rows.map((r) => (
        <div key={r.clave}>
          <label className="text-xs text-zinc-400 mb-1 block">
            {LABELS[r.clave] || r.clave}
          </label>
          <input
            value={r.valor}
            onChange={(e) => setValor(r.clave, e.target.value)}
            className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={save}
        disabled={loading}
        className="w-full h-10 rounded-full bg-orange-500 text-black font-bold text-sm"
      >
        {loading ? "Guardando..." : "Guardar configuración"}
      </button>
    </div>
  )
}