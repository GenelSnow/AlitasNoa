"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

type Rew = {
    id: string
    nombre: string
    descripcion: string | null
    puntos_requeridos: number
    activa: boolean
}

export function AdminRecompensas() {
    const supabase = createClient()
    const [list, setList] = useState<Rew[]>([])
    const [editId, setEditId] = useState<string | null>(null)
    const [nombre, setNombre] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [puntos, setPuntos] = useState("")
    const [activa, setActiva] = useState(true)
    const [loading, setLoading] = useState(false)

    async function load() {
        const { data } = await supabase
            .from("recompensas")
            .select("*")
            .order("puntos_requeridos")
        setList(data || [])
    }

    useEffect(() => {
        load()
    }, [])

    function startEdit(r: Rew) {
        setEditId(r.id)
        setNombre(r.nombre ?? "")
        setDescripcion(r.descripcion ?? "")
        setPuntos(String(r.puntos_requeridos ?? ""))
        setActiva(r.activa ?? true)
    }

    function reset() {
        setEditId(null)
        setNombre("")
        setDescripcion("")
        setPuntos("")
        setActiva(true)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        const payload = {
            nombre: nombre.trim(),
            descripcion: descripcion.trim() || null,
            puntos_requeridos: Number(puntos),
            activa,
        }
        const { error } = editId
            ? await supabase.from("recompensas").update(payload).eq("id", editId)
            : await supabase.from("recompensas").insert(payload)
        setLoading(false)
        if (error) {
            toast.error(error.message)
            return
        }
        toast.success(editId ? "Recompensa actualizada" : "Recompensa creada")
        reset()
        load()
    }

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            <form
                onSubmit={handleSubmit}
                className="border border-zinc-800 rounded-2xl p-5 bg-zinc-950/80 space-y-3"
            >
                <h2 className="font-bold text-white text-lg">
                    {editId ? "Editar recompensa" : "Crear recompensa"}
                </h2>
                <input
                    required
                    placeholder="Nombre"
                    value={nombre ?? ""}
                    onChange={(e) => setNombre(e.target.value)}
                    className="..."
                />

                <textarea
                    placeholder="Descripción"
                    value={descripcion ?? ""}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={2}
                    className="..."
                />

                <input
                    required
                    type="number"
                    placeholder="Puntos requeridos"
                    value={puntos ?? ""}
                    onChange={(e) => setPuntos(e.target.value)}
                    className="..."
                />
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                    <input
                        type="checkbox"
                        checked={activa}
                        onChange={(e) => setActiva(e.target.checked)}
                    />
                    Activa
                </label>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 h-10 rounded-full bg-orange-500 text-black font-bold text-sm"
                    >
                        {editId ? "Actualizar" : "Crear"}
                    </button>
                    {editId && (
                        <button
                            type="button"
                            onClick={reset}
                            className="h-10 px-4 rounded-full border border-zinc-700 text-sm text-zinc-300"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <div className="space-y-2">
                {list.map((r) => (
                    <button
                        key={r.id}
                        type="button"
                        onClick={() => startEdit(r)}
                        className="w-full text-left border border-zinc-800 rounded-xl p-3 hover:border-orange-500/50"
                    >
                        <span className="font-medium text-white">{r.nombre}</span>
                        <span className="text-orange-400 text-sm ml-2">
                            {r.puntos_requeridos} pts
                        </span>
                        {!r.activa && (
                            <span className="text-xs text-zinc-500 ml-2">Inactiva</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}