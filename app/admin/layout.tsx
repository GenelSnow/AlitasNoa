import { redirect } from "next/navigation"
import { getPerfil, esStaff } from "@/lib/perfil"
import { StaffPedidoNotifs } from "@/components/admin/StaffPedidoNotifs"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const perfil = await getPerfil()
  if (!perfil) redirect("/auth/login")
  if (!esStaff(perfil.rol)) redirect("/")

  return (
    <>
      {children}
      <StaffPedidoNotifs />
    </>
  )
}