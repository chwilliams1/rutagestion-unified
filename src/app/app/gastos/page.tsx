"use client";
import { useState } from "react";
import { formatCLP } from "@/lib/data";
import { useExpenses, useVehicles, genId } from "@/lib/store";
import Modal from "@/components/Modal";

const tipos = ["combustible", "peaje", "mantencion", "neumaticos", "seguro", "otro"];
const emoji: Record<string, string> = { combustible: "⛽", peaje: "🛣️", mantencion: "🔧", neumaticos: "🔘", seguro: "🛡️", otro: "📦" };

export default function GastosPage() {
  const { data: gastos, update: setG, loaded } = useExpenses();
  const { data: vehs } = useVehicles();
  const [fTipo, setFTipo] = useState("todos");
  const [fVeh, setFVeh] = useState("todos");
  const [show, setShow] = useState(false);
  if (!loaded) return <div className="text-center py-20 text-gray-400">Cargando...</div>;
  const filtered = gastos.filter(g => (fTipo === "todos" || g.tipo === fTipo) && (fVeh === "todos" || g.vehicleId === fVeh));
  const total = filtered.reduce((s, g) => s + g.monto, 0);
  return (
    <div>
      <div className="flex justify-between items-center mb-4"><h1 className="text-xl font-bold">Gastos ({gastos.length})</h1><button onClick={() => setShow(true)} className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">+ Registrar</button></div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
        {tipos.map(t => { const tot = gastos.filter(g => g.tipo === t).reduce((s, g) => s + g.monto, 0); return (
          <button key={t} onClick={() => setFTipo(fTipo === t ? "todos" : t)} className={`rounded-xl p-2.5 text-center border transition ${fTipo === t ? "border-blue-700 bg-blue-50" : "border-gray-100 bg-white"}`}>
            <span className="text-lg">{emoji[t]}</span><p className="text-[9px] text-gray-500 capitalize mt-0.5">{t}</p><p className="text-[10px] font-bold">{formatCLP(tot)}</p>
          </button>);
        })}
      </div>
      <select value={fVeh} onChange={e => setFVeh(e.target.value)} className="w-full md:w-auto bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4">
        <option value="todos">Todos los equipos</option>{vehs.map(v => <option key={v.id} value={v.id}>{v.patente} — {v.marca}</option>)}
      </select>
      <div className="bg-red-50 rounded-xl p-4 mb-4 flex justify-between"><span className="text-sm font-medium text-red-700">Total</span><span className="text-xl font-extrabold text-red-700">{formatCLP(total)}</span></div>
      <div className="space-y-2">{filtered.map(g => { const v = vehs.find(x => x.id === g.vehicleId); return (
        <div key={g.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0"><span className="text-xl shrink-0">{emoji[g.tipo]}</span><div className="min-w-0"><p className="text-sm font-medium truncate">{g.descripcion}</p><p className="text-[10px] text-gray-400">{g.fecha} · {v?.patente || "—"}</p></div></div>
          <div className="flex items-center gap-2 shrink-0 ml-3"><p className="font-bold text-sm text-red-600">{formatCLP(g.monto)}</p><button onClick={() => setG(p => p.filter(x => x.id !== g.id))} className="text-gray-300 hover:text-red-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg></button></div>
        </div>);
      })}</div>
      <Modal open={show} onClose={() => setShow(false)} title="Registrar gasto">
        <form onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); setG(p => [{ id: genId(), fecha: f.get("fecha") as string, vehicleId: f.get("vehicleId") as string, tipo: f.get("tipo") as Expense["tipo"], monto: parseInt(f.get("monto") as string), descripcion: f.get("descripcion") as string }, ...p]); setShow(false); }}>
          <div className="space-y-3">
            <div><label className="block text-sm font-medium mb-1">Tipo</label><select name="tipo" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm">{tipos.map(t => <option key={t} value={t}>{emoji[t]} {t}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Equipo</label><select name="vehicleId" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm">{vehs.map(v => <option key={v.id} value={v.id}>{v.patente} — {v.marca}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Monto ($)</label><input name="monto" type="number" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Descripcion</label><input name="descripcion" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Fecha</label><input name="fecha" type="date" required defaultValue="2026-03-27" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div>
          </div>
          <button type="submit" className="mt-4 w-full bg-blue-700 text-white font-semibold py-3 rounded-lg">Registrar</button>
        </form>
      </Modal>
    </div>
  );
}
type Expense = import("@/lib/data").Expense;
