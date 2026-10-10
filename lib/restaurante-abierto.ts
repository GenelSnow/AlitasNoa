import { createClient } from "@/lib/supabase/server"
import {
  HORARIO_DEFAULT,
  estaAbierto,
  type HorarioSemana,
} from "@/lib/horario"

export async function getEstadoRestaurante() {
  const supabase = await createClient()

  // Leer horario + cierre del día
  const { data } = await supabase
    .from("config_app")
    .select("clave, valor")
    .in("clave", [
      "horario_semana",
      "cierre_hoy",
      "cierre_motivo",
      "cierre_mensaje",
    ])

  const map = Object.fromEntries((data || []).map((r) => [r.clave, r.valor]))

  // ↓↓↓ AQUÍ va el if de cierre forzado
  if (map.cierre_hoy === "true") {
    return {
      abierto: false as const,
      forzado: true as const,
      motivo: map.cierre_motivo || "",
      mensaje:
        map.cierre_mensaje ||
        "Hoy no estamos atendiendo. Gracias por tu comprensión.",
      hoy: undefined,
      desde: undefined,
      hasta: undefined,
    }
  }

  let horario: HorarioSemana = HORARIO_DEFAULT
  if (map.horario_semana) {
    try {
      horario = { ...HORARIO_DEFAULT, ...JSON.parse(map.horario_semana) }
    } catch {
      /* default */
    }
  }

  const estado = estaAbierto(horario, "America/Bogota")
  return {
    ...estado,
    forzado: false as const,
    motivo: "",
    mensaje: "",
  }
}