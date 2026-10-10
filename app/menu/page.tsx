import { createClient } from "@/lib/supabase/server"
import { MenuCategory } from "@/components/menu/MenuCategory"
import { getEstadoRestaurante } from "@/lib/restaurante-abierto"

export const revalidate = 60

export default async function MenuPage() {
  const supabase = await createClient()
  const estado = await getEstadoRestaurante()

  const { data: categories, error } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      description,
      sort_order,
      menu_items (
        id,
        name,
        description,
        price,
        spicy_level,
        is_popular,
        image_url,
        sort_order
      )
    `)
    .eq("is_active", true)
    .order("sort_order")

  if (error) {
    console.error(error)
    return (
      <div className="container mx-auto py-20 text-center">
        <p className="text-red-500">Error al cargar el menú</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {estado.forzado && (
        <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <p className="font-bold">Hoy no abrimos</p>
          {estado.motivo ? (
            <p className="text-xs text-red-300/80 mt-0.5">{estado.motivo}</p>
          ) : null}
          <p className="mt-1 text-zinc-300">{estado.mensaje}</p>
        </div>
      )}
      {categories?.map((category, i) => (
        <MenuCategory
          key={category.id}
          category={category}
          defaultOpen={i === 0}
        />
      ))}
    </div>
  )
}