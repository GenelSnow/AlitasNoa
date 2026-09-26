import { createClient } from "@/lib/supabase/server"

export type Perfil = {
  id: string
  nombre: string
  apellido: string | null
  whatsapp: string
  rol: "usuario" | "empleado" | "dueño" | "developer"
  codigo_referido: string | null
  puntos: number
}

export async function getPerfil(): Promise<Perfil | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from("perfiles")
    .select("id, nombre, apellido, whatsapp, rol, codigo_referido, puntos")
    .eq("id", user.id)
    .single()

  return data
}

export function esStaff(rol: string) {
  return ["empleado", "dueño", "developer"].includes(rol)
}