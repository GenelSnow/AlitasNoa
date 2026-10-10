"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import {
  DIAS,
  HORARIO_DEFAULT,
  type HorarioSemana,
  type DiaClave,
  estaAbierto,
} from "@/lib/horario"

const LABELS: Record<string, string> = {
  precio_domicilio: "Precio domicilio (COP)",
  nequi_numero: "Número Nequi",
  llave_numero: "Número Llave",
}

const PARAM_KEYS = ["precio_domicilio", "nequi_numero", "llave_numero"] as const

export function AdminConfig() {
  const supabase = createClient()
  const [params, setParams] = useState<Record<string, string>>({
    precio_domicilio: "2500",
    nequi_numero: "",
    llave_numero: "",
  })

  const [horario, setHorario] = useState<HorarioSemana>(HORARIO_DEFAULT)
  const [loading, setLoading] = useState(false)
  const [cierreHoy, setCierreHoy] = useState(false)
  const [motivo, setMotivo] = useState("")
  const [motivoOtro, setMotivoOtro] = useState("")
  const [mensajeCierre, setMensajeCierre] = useState(
    "Hoy no estamos atendiendo. Gracias por tu comprensión."
  )
  const [hubOpen, setHubOpen] = useState(false)

  const MOTIVOS = [
    "Día festivo",
    "Mantenimiento",
    "Evento privado",
    "Falta de insumos",
    "Otro",
  ] as const


  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("config_app").select("clave, valor")
      if (!data) return

      const next = { ...params }
      data.forEach((row) => {
        if (PARAM_KEYS.includes(row.clave as (typeof PARAM_KEYS)[number])) {
          next[row.clave] = row.valor
        }
        if (row.clave === "horario_semana" && row.valor) {
          try {
            setHorario({ ...HORARIO_DEFAULT, ...JSON.parse(row.valor) })
          } catch { }

          if (row.clave === "cierre_hoy") {
            setCierreHoy(row.valor === "true")
          }
          if (row.clave === "cierre_motivo") {
            const predef = MOTIVOS.includes(row.valor as (typeof MOTIVOS)[number])
            if (predef) setMotivo(row.valor)
            else if (row.valor) {
              setMotivo("Otro")
              setMotivoOtro(row.valor)
            }
          }
          if (row.clave === "cierre_mensaje" && row.valor) {
            setMensajeCierre(row.valor)
          }
        }
      })
      setParams(next)
    }
    load()

  }, [])

  function patchDia(
    dia: DiaClave,
    field: "abierto" | "desde" | "hasta",
    value: boolean | string
  ) {
    setHorario((prev) => ({
      ...prev,
      [dia]: { ...prev[dia], [field]: value },
    }))
  }

  async function save() {
    setLoading(true)

    const motivoFinal =
      motivo === "Otro" ? motivoOtro.trim() : motivo

    const updates = [
      ...PARAM_KEYS.map((clave) => ({
        clave,
        valor: params[clave] ?? "",
      })),
      {
        clave: "horario_semana",
        valor: JSON.stringify(horario),
      },
      {
        clave: "cierre_hoy",
        valor: cierreHoy ? "true" : "false",
      },
      {
        clave: "cierre_motivo",
        valor: motivoFinal,
      },
      {
        clave: "cierre_mensaje",
        valor: mensajeCierre.trim(),
      },
    ]

    for (const row of updates) {
      const { error } = await supabase.from("config_app").upsert({
        clave: row.clave,
        valor: row.valor,
        updated_at: new Date().toISOString(),
      })
      if (error) {
        toast.error(`${row.clave}: ${error.message}`)
        setLoading(false)
        return
      }
    }

    setLoading(false)
    toast.success("Configuración guardada")
  }

  const estado = estaAbierto(horario)
  const inputClass =
    "w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-orange-500"

  return (
    <div className="space-y-6 max-w-lg w-full mx-auto overflow-x-hidden px-1">
      {/* Parámetros */}
      <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-950/80 space-y-4">
        <h2 className="font-bold text-white text-lg">Parámetros</h2>
        {PARAM_KEYS.map((clave) => (
          <div key={clave}>
            <label className="text-xs text-zinc-400 mb-1 block">
              {LABELS[clave]}
            </label>
            <input
              value={params[clave] ?? ""}
              onChange={(e) =>
                setParams((p) => ({ ...p, [clave]: e.target.value }))
              }
              className={inputClass}
            />
          </div>
        ))}
      </div>

      {/* Horario */}
      <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-950/80 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-white text-lg">Horario del local</h2>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${estado.abierto
              ? "bg-green-500/15 text-green-400"
              : "bg-red-500/15 text-red-400"
              }`}
          >
            Ahora: {estado.abierto ? "Abierto" : "Cerrado"}
          </span>
        </div>

        {DIAS.map(({ key, label }) => {
          const d = horario[key]
          return (
            <div
              key={key}
              className="flex flex-col gap-2 border border-zinc-800 rounded-xl px-3 py-3 sm:flex-row sm:items-center sm:gap-3"
            >
              {/* Día */}
              <label className="flex items-center gap-2 text-sm text-white shrink-0 sm:w-28">
                <input
                  type="checkbox"
                  checked={d.abierto}
                  onChange={(e) => patchDia(key, "abierto", e.target.checked)}
                  className="h-4 w-4 rounded"
                />
                {label}
              </label>

              {/* Horas: en móvil ocupan todo el ancho, en desktop en fila */}
              <div className="flex items-center gap-2 w-full min-w-0 sm:flex-1 sm:justify-end">
                <input
                  type="time"
                  value={d.desde}
                  disabled={!d.abierto}
                  onChange={(e) => patchDia(key, "desde", e.target.value)}
                  className="h-9 min-w-0 flex-1 max-w-[9rem] px-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm disabled:opacity-40"
                />
                <span className="text-zinc-500 text-xs shrink-0">a</span>
                <input
                  type="time"
                  value={d.hasta}
                  disabled={!d.abierto}
                  onChange={(e) => patchDia(key, "hasta", e.target.value)}
                  className="h-9 min-w-0 flex-1 max-w-[9rem] px-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm disabled:opacity-40"
                />
              </div>
            </div>
          )
        })}
      </div>
      {/* Hoy no abrimos */}
      <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-950/80 space-y-3">
        <button
          type="button"
          onClick={() => setHubOpen((v) => !v)}
          className={`w-full h-11 rounded-full font-bold text-sm border ${cierreHoy
              ? "bg-red-500/15 text-red-400 border-red-500/40"
              : "bg-zinc-900 text-zinc-300 border-zinc-700"
            }`}
        >
          {cierreHoy ? "Cerrado hoy (activo) — editar" : "Hoy no abrimos"}
        </button>

        {hubOpen && (
          <div className="space-y-3 pt-1">
            <label className="flex items-center gap-2 text-sm text-white">
              <input
                type="checkbox"
                checked={cierreHoy}
                onChange={(e) => setCierreHoy(e.target.checked)}
              />
              Forzar cerrado hoy (ignora el horario)
            </label>

            <div>
              <p className="text-xs text-zinc-400 mb-1">Motivo</p>
              <div className="flex flex-wrap gap-2">
                {MOTIVOS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMotivo(m)}
                    className={`text-xs px-3 h-8 rounded-full border ${motivo === m
                        ? "border-orange-500 text-orange-400"
                        : "border-zinc-700 text-zinc-400"
                      }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              {motivo === "Otro" && (
                <input
                  value={motivoOtro}
                  onChange={(e) => setMotivoOtro(e.target.value)}
                  placeholder="Escribe el motivo"
                  className="mt-2 w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white"
                />
              )}
            </div>

            <div>
              <p className="text-xs text-zinc-400 mb-1">Mensaje al cliente</p>
              <textarea
                value={mensajeCierre}
                onChange={(e) => setMensajeCierre(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Un solo guardar */}
      <button
        type="button"
        onClick={save}
        disabled={loading}
        className="w-full h-11 rounded-full bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Guardar configuración"}
      </button>
    </div>
  )
}