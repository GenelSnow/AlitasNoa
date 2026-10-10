"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { div } from "framer-motion/client"

export function StaffPedidoNotifs() {
    const [count, setCount] = useState(0)
    const [perm, setPerm] = useState<NotificationPermission>("default")

    useEffect(() => {
        if ("Notification" in window) setPerm(Notification.permission)
        if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "default") {

            }
        }

        const supabase = createClient()

        const channel = supabase
            .channel("staff-pedidos-insert")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "pedidos",
                },
                () => {
                    setCount((prev) => {
                        const next = prev + 1

                        // Toast en la web
                        toast.message(
                            next > 1
                                ? `Hay un pedido nuevo, ¡atiéndelo! (+${next})`
                                : "Hay un pedido nuevo, ¡atiéndelo!",
                            { duration: 6000 }
                        )

                        // Notificación del sistema (si hay permiso)
                        if (
                            typeof window !== "undefined" &&
                            "Notification" in window &&
                            Notification.permission === "granted"
                        ) {
                            new Notification("AlitasNOA — Pedido nuevo", {
                                body:
                                    next > 1
                                        ? `Hay un pedido nuevo, ¡atiéndelo! (+${next})`
                                        : "Hay un pedido nuevo, ¡atiéndelo!",
                                tag: "alitas-pedidos-staff",
                                icon: "/icon.png",
                            })
                        }

                        return next
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    if (count === 0) return null

    return (
        <div>
            {perm !== "granted" && perm !== "denied" && (
                <button
                    type="button"
                    onClick={async () => {
                        const r = await Notification.requestPermission()
                        setPerm(r)
                        if (r === "granted") toast.success("Notificaciones de pedidos activadas")
                        if (r === "denied")
                            toast.error("Bloqueadas: actívalas en el candado de la URL")
                    }}
                    className="fixed bottom-4 right-4 z-50 h-10 px-4 rounded-full border border-orange-500/50 text-orange-400 text-xs bg-zinc-950"
                >
                    Activar avisos de pedidos
                </button>
            )}
            <Link
                href="/admin/pedidos"
                onClick={() => setCount(0)}
                className="fixed bottom-4 right-4 z-50 h-12 px-5 rounded-full bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm shadow-lg shadow-orange-900/40 inline-flex items-center gap-2"
            >
                {count === 1
                    ? "Pedido nuevo · Ver"
                    : `Pedidos nuevos (+${count}) · Ver`}
            </Link>
        </div>
    )
} 