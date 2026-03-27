"use client";
import { useState } from "react";
import { formatCLP } from "@/lib/data";
import { useMaintenance, useVehicles, genId } from "@/lib/store";
import Modal from "@/components/Modal";

export default function MantencionesPage() {
  const { data: mants, update: setM, loaded } = useMaintenance();
  const { data: vehs } = useVehicles();
  const [fVeh, setFVeh] = useState("todos");
  const [fTipo, setFTipo] = useState("todos");
  const [show, setShow] = useState(false);
  if (!loaded) return <div className="text-center py-20 text-gray-400">Cargando...</div>;

  const filtered = mants.filter(m => (fVeh === "todos" || m.vehicleId === fVeh) && (fTipo === "todos" || m.tipo === fTipo));
  const totalCosto = filtered.reduce((s, m) => s + m.costo, 0);
  const tipoBadge: Record<string, string> = { preventivo: "bg-blue-100 text-blue-700", correctivo: "bg-red-100 text-red-700", revision: "bg-amber-100 text-amber-700" };
  const tipoIcon: Record<string, string> = { preventivo: "🔧", correctivo: "🚨", revision: "📋" };

  // Próximas mantenciones
  const proximas = mants.filter(m => m.proximaFecha).sort((a, b) => (a.proximaFecha || "").localeCompare(b.proximaFecha || ""));

  return (
    <div>
      <div className="flex justify-between items-center mb-4"><h1 className="text-xl font-bold">Mantenciones ({mants.length})</h1><button onClick={() => setShow(true)} className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">+ Registrar</button></div>

      {/* Próximas programadas */}
      {proximas.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4">
          <h2 className="text-sm font-bold text-amber-800 mb-2">Proximas mantenciones programadas</h2>
          {proximas.slice(0, 3).map(m => {
            const v = vehs.find(x => x.id === m.vehicleId);
            return (<div key={m.id + "prox"} className="flex justify-between items-center py-1.5 border-b border-amber-100 last:border-0">
              <div><p className="text-sm font-medium text-amber-900">{v?.patente} — {m.descripcion}</p></div>
              <div className="text-right"><p className="text-xs text-amber-700">{m.proximaFecha}</p>{m.proximoKm && <p className="text-[10px] text-amber-600">{m.proximoKm?.toLocaleString()} km</p>}</div>
            </div>);
          })}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-4">
        {(["preventivo", "correctivo", "revision"] as const).map(t => {
          const n = mants.filter(m => m.tipo === t).length;
          const c = mants.filter(m => m.tipo === t).reduce((s, m) => s + m.costo, 0);
          return (<button key={t} onClick={() => setFTipo(fTipo === t ? "todos" : t)} className={`rounded-xl p-3 text-center border transition ${fTipo === t ? "border-blue-700 bg-blue-50" : "border-gray-100 bg-white"}`}>
            <span className="text-lg">{tipoIcon[t]}</span><p className="text-[10px] text-gray-500 capitalize mt-0.5">{t}</p><p className="text-xs font-bold">{n} · {formatCLP(c)}</p>
          </button>);
        })}
      </div>

      <div className="flex gap-3 mb-4">
        <select value={fVeh} onChange={e => setFVeh(e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="todos">Todos los equipos</option>{vehs.map(v => <option key={v.id} value={v.id}>{v.patente} — {v.marca}</option>)}
        </select>
      </div>

      <div className="bg-gray-100 rounded-xl p-4 mb-4 flex justify-between"><span className="text-sm font-medium">Total mantenciones</span><span className="text-xl font-extrabold">{formatCLP(totalCosto)}</span></div>

      <div className="space-y-3">{filtered.sort((a, b) => b.fecha.localeCompare(a.fecha)).map(m => {
        const v = vehs.find(x => x.id === m.vehicleId);
        return (<div key={m.id} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tipoBadge[m.tipo]}`}>{m.tipo}</span>
              <p className="font-bold text-sm">{v?.patente}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-sm">{formatCLP(m.costo)}</p>
              <button onClick={() => setM(p => p.filter(x => x.id !== m.id))} className="text-gray-300 hover:text-red-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
          </div>
          <p className="text-sm text-gray-700">{m.descripcion}</p>
          <div className="flex gap-4 mt-2 text-xs text-gray-400">
            <span>📅 {m.fecha}</span><span>🛣️ {m.km.toLocaleString()} km</span><span>🏭 {m.taller}</span>
          </div>
          {m.proximaFecha && <div className="mt-2 bg-blue-50 rounded-lg px-3 py-1.5 text-xs text-blue-700">Proxima: {m.proximaFecha}{m.proximoKm ? ` o ${m.proximoKm.toLocaleString()} km` : ""}</div>}
        </div>);
      })}</div>

      <Modal open={show} onClose={() => setShow(false)} title="Registrar mantencion">
        <form onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); setM(p => [{ id: genId(), vehicleId: f.get("vehicleId") as string, tipo: f.get("tipo") as "preventivo" | "correctivo" | "revision", descripcion: f.get("descripcion") as string, fecha: f.get("fecha") as string, km: parseInt(f.get("km") as string), costo: parseInt(f.get("costo") as string), taller: f.get("taller") as string, proximaFecha: (f.get("proximaFecha") as string) || undefined, proximoKm: f.get("proximoKm") ? parseInt(f.get("proximoKm") as string) : undefined }, ...p]); setShow(false); }}>
          <div className="space-y-3">
            <div><label className="block text-sm font-medium mb-1">Equipo</label><select name="vehicleId" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm">{vehs.map(v => <option key={v.id} value={v.id}>{v.patente} — {v.marca}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Tipo</label><select name="tipo" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"><option value="preventivo">Preventivo</option><option value="correctivo">Correctivo</option><option value="revision">Revision</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Descripcion</label><input name="descripcion" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div>
            <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium mb-1">Fecha</label><input name="fecha" type="date" required defaultValue="2026-03-27" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div><div><label className="block text-sm font-medium mb-1">Km actual</label><input name="km" type="number" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div></div>
            <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium mb-1">Costo ($)</label><input name="costo" type="number" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div><div><label className="block text-sm font-medium mb-1">Taller</label><input name="taller" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div></div>
            <p className="text-xs font-bold text-gray-500 uppercase mt-2">Proxima mantencion (opcional)</p>
            <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium mb-1">Proxima fecha</label><input name="proximaFecha" type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div><div><label className="block text-sm font-medium mb-1">Proximo km</label><input name="proximoKm" type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div></div>
          </div>
          <button type="submit" className="mt-4 w-full bg-blue-700 text-white font-semibold py-3 rounded-lg">Registrar</button>
        </form>
      </Modal>
    </div>
  );
}
