"use client"

import { useCart } from "@/components/cart/CartProvider"
import { ShoppingBag } from "lucide-react"

type Props = {
  id: string
  name: string
  price: number
  image_url?: string | null
  className?: string
}

export function AddToCartButton({ id, name, price, image_url, className }: Props) {
  const { addItem } = useCart()

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        addItem({ id, name, price, image_url })
      }}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-400 text-black text-sm font-bold px-4 py-2 transition-colors"
      }
    >
      <ShoppingBag className="h-4 w-4" />
      Agregar
    </button>
  )
}