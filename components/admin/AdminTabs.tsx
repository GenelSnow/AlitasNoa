"use client"

import { useState } from "react"
import { AdminPlatillos } from "@/components/admin/AdminPlatillos"
import { AdminRecompensas } from "@/components/admin/AdminRecompensas"
import { AdminConfig } from "@/components/admin/AdminConfig"

const TABS = [
  { id: "platillos", label: "Platillos" },
  { id: "recompensas", label: "Recompensas" },
  { id: "config", label: "Configuración" },
] as const

type TabId = (typeof TABS)[number]["id"]

export function AdminTabs() {
  const [tab, setTab] = useState<TabId>("platillos")

  return (
    <div>
      <div className="flex gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800 mb-8 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 min-w-[120px] h-10 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-orange-500 text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "platillos" && <AdminPlatillos />}
      {tab === "recompensas" && <AdminRecompensas />}
      {tab === "config" && <AdminConfig />}
    </div>
  )
}