"use client";
import { useState } from "react";
import { getClient } from "@/lib/data";
import { useServices, useVehicles, useDrivers, useClients, genId } from "@/lib/store";
import Modal from "@/components/Modal";

export default function ServiciosPage() {
  const { data: svcs, update: setS, loaded } = useServices();
  const { data: vehs } = useVehicles();
  const { data: drvs } = useDrivers();
  const { data: clients } = useClients();
  const [filtro, setFiltro] = useState("todos");
  const [show, setShow] = useState(false);
  if (!loaded) return <div className="text-center py-20 text-gray-400">Cargando...</div>;
  const filtered = filtro === "todos" ? svcs : svcs.filter(s => s.estado === filtro);
  const ec: Record<string, string> = { nueva: "bg-blue-100 text-blue-700", asignada: "bg-amber-100 text-amber-700", en_curso: "bg-green-100 text-green-700", completada: "bg-purple-100 text-purple-700" };
  const nextS: Record<string, string> = { nueva: "asignada", asignada: "en_curso", en_curso: "completada" };
  const nextL: Record<string, string> = { nueva: "Asignar", asignada: "Iniciar", en_curso: "Completar" };
  const tipoColor: Record<string, string> = { izaje: "bg-blue-50 text-blue-700", montaje: "bg-green-50 text-green-700", descarga: "bg-amber-50 text-amber-700", traslado: "bg-purple-50 text-purple-700" };
  return (
    <div>
      <div className="flex justify-between items-center mb-4"><h1 className="text-xl font-bold">Servicios ({svcs.length})</h1><button onClick={() => setShow(true)} className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">+ Nueva solicitud</button></div>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {["todos", "nueva", "asignada", "en_curso", "completada"].map(f => (
          <button key={f} onClick={() => setFiltro(f)} className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${filtro === f ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-600"}`}>{f === "todos" ? "Todos" : f.replace("_", " ")} ({f === "todos" ? svcs.length : svcs.filter(s => s.estado === f).length})</button>
        ))}
      </div>
      <div className="space-y-3">{filtered.map(s => {
        const cl = getClient(s.clienteId) || clients.find(c => c.id === s.clienteId);
        const v = vehs.find(x => x.id === s.vehicleId);
        const d = drvs.find(x => x.id === s.driverId);
        return (<div key={s.id} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex justify-between items-start mb-2">
            <div><div className="flex items-center gap-2"><p className="font-bold">{s.codigo}</p><span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${ec[s.estado]}`}>{s.estado.replace("_", " ")}</span></div><p className="text-sm text-gray-700 mt-0.5">{cl?.nombre || "—"}</p></div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tipoColor[s.tipo] || "bg-gray-100 text-gray-700"}`}>{s.tipo}</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
            <p>{s.descripcion}</p>
            <p className="text-xs text-gray-400">📍 {s.direccion} · 📅 {s.fecha}</p>
            {(v || d) && <p className="text-xs text-gray-400">🏗️ {v?.patente || "Sin asignar"} · 👤 {d?.nombre || "Sin asignar"}</p>}
          </div>
          {nextS[s.estado] && <button onClick={() => setS(p => p.map(x => x.id === s.id ? { ...x, estado: nextS[s.estado] as ServiceRequest["estado"] } : x))} className="mt-3 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold py-2 rounded-lg">{nextL[s.estado]}</button>}
        </div>);
      })}</div>
      <Modal open={show} onClose={() => setShow(false)} title="Nueva solicitud de servicio">
        <form onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); setS(p => [{ id: genId(), codigo: `SRV-${String(p.length + 1).padStart(3, "0")}`, clienteId: f.get("clienteId") as string, driverId: f.get("driverId") as string, vehicleId: f.get("vehicleId") as string, tipo: f.get("tipo") as string, descripcion: f.get("descripcion") as string, fecha: f.get("fecha") as string, direccion: f.get("direccion") as string, estado: "nueva" }, ...p]); setShow(false); }}>
          <div className="space-y-3">
            <div><label className="block text-sm font-medium mb-1">Cliente</label><select name="clienteId" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm">{clients.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Tipo</label><select name="tipo" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"><option value="izaje">Izaje</option><option value="montaje">Montaje</option><option value="descarga">Descarga</option><option value="traslado">Traslado</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Descripcion</label><input name="descripcion" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Direccion</label><input name="direccion" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Fecha</label><input name="fecha" type="date" required defaultValue="2026-03-28" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div>
            <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium mb-1">Equipo</label><select name="vehicleId" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"><option value="">Sin asignar</option>{vehs.filter(v => v.tipo === "grua").map(v => <option key={v.id} value={v.id}>{v.patente}</option>)}</select></div><div><label className="block text-sm font-medium mb-1">Operador</label><select name="driverId" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"><option value="">Sin asignar</option>{drvs.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}</select></div></div>
          </div>
          <button type="submit" className="mt-4 w-full bg-blue-700 text-white font-semibold py-3 rounded-lg">Crear solicitud</button>
        </form>
      </Modal>
    </div>
  );
}
type ServiceRequest = import("@/lib/data").ServiceRequest;
