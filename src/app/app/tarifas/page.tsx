"use client";
import { useState } from "react";
import { formatCLP } from "@/lib/data";
import { useRates, genId } from "@/lib/store";
import Modal from "@/components/Modal";

export default function TarifasPage() {
  const { data: rates, update: setR, loaded } = useRates();
  const [show, setShow] = useState(false);
  if (!loaded) return <div className="text-center py-20 text-gray-400">Cargando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6"><h1 className="text-xl font-bold">Tarifas ({rates.length})</h1><button onClick={() => setShow(true)} className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">+ Nueva tarifa</button></div>

      <div className="space-y-3">{rates.map(r => (
        <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-bold">{r.nombre}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.activa ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{r.activa ? "Activa" : "Inactiva"}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setR(p => p.map(x => x.id === r.id ? { ...x, activa: !x.activa } : x))} className="text-xs text-blue-600 font-medium">{r.activa ? "Desactivar" : "Activar"}</button>
              <button onClick={() => setR(p => p.filter(x => x.id !== r.id))} className="text-gray-300 hover:text-red-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-lg p-3 text-center">
            <div><p className="text-[10px] text-gray-500">Valor/hora</p><p className="font-bold text-sm">{r.valorHora > 0 ? formatCLP(r.valorHora) : "—"}</p></div>
            <div><p className="text-[10px] text-gray-500">Valor/km</p><p className="font-bold text-sm">{r.valorKm > 0 ? formatCLP(r.valorKm) : "—"}</p></div>
            <div><p className="text-[10px] text-gray-500">Min. horas</p><p className="font-bold text-sm">{r.minimoHoras > 0 ? r.minimoHoras : "—"}</p></div>
          </div>
        </div>
      ))}</div>

      <Modal open={show} onClose={() => setShow(false)} title="Nueva tarifa">
        <form onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); setR(p => [...p, { id: genId(), nombre: f.get("nombre") as string, valorHora: parseInt(f.get("valorHora") as string) || 0, valorKm: parseInt(f.get("valorKm") as string) || 0, minimoHoras: parseFloat(f.get("minimoHoras") as string) || 0, activa: true }]); setShow(false); }}>
          <div className="space-y-3">
            <div><label className="block text-sm font-medium mb-1">Nombre de la tarifa</label><input name="nombre" required placeholder="Ej: Grua pluma standard" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Valor por hora ($)</label><input name="valorHora" type="number" defaultValue="0" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /><p className="text-[10px] text-gray-400 mt-0.5">Dejar en 0 si no aplica</p></div>
            <div><label className="block text-sm font-medium mb-1">Valor por km ($)</label><input name="valorKm" type="number" defaultValue="0" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /><p className="text-[10px] text-gray-400 mt-0.5">Dejar en 0 si no aplica</p></div>
            <div><label className="block text-sm font-medium mb-1">Minimo de horas</label><input name="minimoHoras" type="number" step="0.5" defaultValue="0" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div>
          </div>
          <button type="submit" className="mt-4 w-full bg-blue-700 text-white font-semibold py-3 rounded-lg">Crear tarifa</button>
        </form>
      </Modal>
    </div>
  );
}
