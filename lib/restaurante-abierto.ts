import { createClient } from "@/lib/supabase/server"
import {
  HORARIO_DEFAULT,
  estaAbierto,
  type HorarioSemana,
} from "@/lib/horario"

export async function getEstadoRestaurante() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("config_app")
    .select("valor")
    .eq("clave", "horario_semana")
    .maybeSingle()

  let horario: HorarioSemana = HORARIO_DEFAULT
  if (data?.valor) {
    try {
      horario = { ...HORARIO_DEFAULT, ...JSON.parse(data.valor) }
    } catch {}
  }

  return estaAbierto(horario, "America/Bogota")
}