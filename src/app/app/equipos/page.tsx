"use client";
import { useState } from "react";
import { formatCLP } from "@/lib/data";
import { useVehicles, useTrips, useExpenses, genId } from "@/lib/store";
import Modal from "@/components/Modal";

export default function EquiposPage() {
  const { data: vehs, update: setV, loaded } = useVehicles();
  const { data: trips } = useTrips();
  const { data: expenses } = useExpenses();
  const [show, setShow] = useState(false);
  if (!loaded) return <div className="text-center py-20 text-gray-400">Cargando...</div>;
  const emoji: Record<string, string> = { camion: "🚛", grua: "🏗️", furgon: "🚐" };
  const badge: Record<string, string> = { activo: "bg-green-100 text-green-700", mantencion: "bg-amber-100 text-amber-700", inactivo: "bg-gray-100 text-gray-500" };
  return (
    <div>
      <div className="flex justify-between items-center mb-6"><h1 className="text-xl font-bold">Equipos ({vehs.length})</h1><button onClick={() => setShow(true)} className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">+ Agregar</button></div>
      <div className="space-y-3">{vehs.map(v => {
        const ing = trips.filter(t => t.vehicleId === v.id && (t.estado === "completado" || t.estado === "facturado")).reduce((s, t) => s + t.valor, 0);
        const gas = expenses.filter(e => e.vehicleId === v.id).reduce((s, e) => s + e.monto, 0);
        const m = ing - gas; const p = ing > 0 ? Math.round((m / ing) * 100) : 0;
        return (<div key={v.id} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3"><span className="text-2xl">{emoji[v.tipo]}</span><div><p className="font-bold">{v.patente}</p><p className="text-sm text-gray-500">{v.marca} {v.modelo} · {v.ano}{v.capacidad ? ` · ${v.capacidad}` : ""}</p></div></div>
            <div className="flex items-center gap-2"><span className={`text-xs font-bold px-2 py-1 rounded-full ${badge[v.estado]}`}>{v.estado}</span>
            <button onClick={() => setV(p => p.filter(x => x.id !== v.id))} className="text-gray-300 hover:text-red-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg></button></div>
          </div>
          <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-lg p-3">
            <div className="text-center"><p className="text-[10px] text-gray-500">Ingresos</p><p className="font-bold text-sm">{formatCLP(ing)}</p></div>
            <div className="text-center"><p className="text-[10px] text-gray-500">Gastos</p><p className="font-bold text-sm text-red-600">{formatCLP(gas)}</p></div>
            <div className="text-center"><p className="text-[10px] text-gray-500">Margen</p><p className={`font-bold text-sm ${m >= 0 ? "text-green-600" : "text-red-600"}`}>{formatCLP(m)} ({p}%)</p></div>
          </div>
        </div>);
      })}</div>
      <Modal open={show} onClose={() => setShow(false)} title="Agregar equipo">
        <form onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); setV(p => [...p, { id: genId(), patente: f.get("patente") as string, tipo: f.get("tipo") as "camion" | "grua" | "furgon", marca: f.get("marca") as string, modelo: f.get("modelo") as string, ano: parseInt(f.get("ano") as string), estado: "activo", capacidad: f.get("capacidad") as string || undefined }]); setShow(false); }}>
          <div className="space-y-3">
            <div><label className="block text-sm font-medium mb-1">Patente</label><input name="patente" required placeholder="RRXX-12" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Tipo</label><select name="tipo" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"><option value="camion">Camion</option><option value="grua">Grua</option><option value="furgon">Furgon</option></select></div>
            <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium mb-1">Marca</label><input name="marca" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div><div><label className="block text-sm font-medium mb-1">Modelo</label><input name="modelo" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div></div>
            <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium mb-1">Ano</label><input name="ano" type="number" required defaultValue={2024} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div><div><label className="block text-sm font-medium mb-1">Capacidad</label><input name="capacidad" placeholder="60 ton" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div></div>
          </div>
          <button type="submit" className="mt-4 w-full bg-blue-700 text-white font-semibold py-3 rounded-lg">Agregar</button>
        </form>
      </Modal>
    </div>
  );
}
