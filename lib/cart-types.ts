export type CartItem = {
  id: string          // menu_item id
  name: string
  price: number
  quantity: number
  image_url?: string | null
}

export type CheckoutData = {
  nombre: string
  telefono: string
  direccion: string
  referencia_vivienda: string
  nota_adicional: string
}