"use client";
import { useState } from "react";
import { formatCLP, getClient } from "@/lib/data";
import { useTrips, useVehicles, useDrivers, useClients, genId } from "@/lib/store";
import Modal from "@/components/Modal";

export default function ViajesPage() {
  const { data: trips, update: setT, loaded } = useTrips();
  const { data: vehs } = useVehicles();
  const { data: drvs } = useDrivers();
  const { data: clients } = useClients();
  const [filtro, setFiltro] = useState("todos");
  const [show, setShow] = useState(false);
  if (!loaded) return <div className="text-center py-20 text-gray-400">Cargando...</div>;
  const filtered = filtro === "todos" ? trips : trips.filter(t => t.estado === filtro);
  const ec: Record<string, string> = { programado: "bg-blue-100 text-blue-700", en_curso: "bg-amber-100 text-amber-700", completado: "bg-green-100 text-green-700", facturado: "bg-purple-100 text-purple-700" };
  const nextState: Record<string, string> = { programado: "en_curso", en_curso: "completado", completado: "facturado" };
  const nextLabel: Record<string, string> = { programado: "Iniciar", en_curso: "Completar", completado: "Facturar" };
  return (
    <div>
      <div className="flex justify-between items-center mb-4"><h1 className="text-xl font-bold">Viajes ({trips.length})</h1><button onClick={() => setShow(true)} className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">+ Nuevo</button></div>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {["todos", "programado", "en_curso", "completado", "facturado"].map(f => (
          <button key={f} onClick={() => setFiltro(f)} className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${filtro === f ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-600"}`}>{f === "todos" ? "Todos" : f.replace("_", " ")} ({f === "todos" ? trips.length : trips.filter(t => t.estado === f).length})</button>
        ))}
      </div>
      <div className="space-y-3">{filtered.map(t => {
        const cl = getClient(t.clienteId) || clients.find(c => c.id === t.clienteId);
        const v = vehs.find(x => x.id === t.vehicleId);
        const d = drvs.find(x => x.id === t.driverId);
        return (<div key={t.id} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex justify-between items-start mb-2"><div><p className="font-bold">{cl?.nombre || "—"}</p><p className="text-xs text-gray-500">{t.fecha}</p></div><div className="text-right"><p className="font-bold">{formatCLP(t.valor)}</p><span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${ec[t.estado]}`}>{t.estado.replace("_", " ")}</span></div></div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm"><p>{t.origen} → {t.destino} ({t.km} km)</p><p className="text-xs text-gray-400 mt-1">🚛 {v?.patente || "—"} · 👤 {d?.nombre || "—"}</p></div>
          {nextState[t.estado] && <div className="mt-3 flex gap-2">
            <button onClick={() => setT(p => p.map(x => x.id === t.id ? { ...x, estado: nextState[t.estado] as Trip["estado"] } : x))} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold py-2 rounded-lg">{nextLabel[t.estado]}</button>
            <button onClick={() => setT(p => p.filter(x => x.id !== t.id))} className="px-3 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 text-xs py-2 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>}
        </div>);
      })}</div>
      <Modal open={show} onClose={() => setShow(false)} title="Nuevo viaje">
        <form onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); setT(p => [{ id: genId(), fecha: f.get("fecha") as string, clienteId: f.get("clienteId") as string, origen: f.get("origen") as string, destino: f.get("destino") as string, vehicleId: f.get("vehicleId") as string, driverId: f.get("driverId") as string, estado: "programado", valor: parseInt(f.get("valor") as string), km: parseInt(f.get("km") as string) }, ...p]); setShow(false); }}>
          <div className="space-y-3">
            <div><label className="block text-sm font-medium mb-1">Cliente</label><select name="clienteId" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm">{clients.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Fecha</label><input name="fecha" type="date" required defaultValue="2026-03-28" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div>
            <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium mb-1">Origen</label><input name="origen" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div><div><label className="block text-sm font-medium mb-1">Destino</label><input name="destino" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div></div>
            <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium mb-1">Valor ($)</label><input name="valor" type="number" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div><div><label className="block text-sm font-medium mb-1">Km</label><input name="km" type="number" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div></div>
            <div><label className="block text-sm font-medium mb-1">Equipo</label><select name="vehicleId" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm">{vehs.map(v => <option key={v.id} value={v.id}>{v.patente} — {v.marca}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Conductor</label><select name="driverId" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm">{drvs.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}</select></div>
          </div>
          <button type="submit" className="mt-4 w-full bg-blue-700 text-white font-semibold py-3 rounded-lg">Crear viaje</button>
        </form>
      </Modal>
    </div>
  );
}

type Trip = import("@/lib/data").Trip;
