"use client";
import { useState } from "react";
import { formatCLP } from "@/lib/data";
import { useDrivers, useTrips, genId } from "@/lib/store";
import Modal from "@/components/Modal";

export default function ConductoresPage() {
  const { data: drvs, update: setD, loaded } = useDrivers();
  const { data: trips } = useTrips();
  const [show, setShow] = useState(false);
  if (!loaded) return <div className="text-center py-20 text-gray-400">Cargando...</div>;
  return (
    <div>
      <div className="flex justify-between items-center mb-6"><h1 className="text-xl font-bold">Conductores ({drvs.length})</h1><button onClick={() => setShow(true)} className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">+ Agregar</button></div>
      <div className="space-y-3">{drvs.map(d => {
        const vjs = trips.filter(t => t.driverId === d.id && (t.estado === "completado" || t.estado === "facturado"));
        const km = vjs.reduce((s, t) => s + t.km, 0);
        return (<div key={d.id} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">{d.nombre.split(" ").map(n => n[0]).join("")}</div>
              <div><p className="font-bold">{d.nombre}</p><p className="text-xs text-gray-500">RUT: {d.rut} · {d.telefono}</p></div>
            </div>
            <button onClick={() => setD(p => p.filter(x => x.id !== d.id))} className="text-gray-300 hover:text-red-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div className="grid grid-cols-4 gap-2 bg-gray-50 rounded-lg p-3 text-center">
            <div><p className="text-[10px] text-gray-500">Viajes</p><p className="font-bold text-sm">{vjs.length}</p></div>
            <div><p className="text-[10px] text-gray-500">Km</p><p className="font-bold text-sm">{km.toLocaleString()}</p></div>
            <div><p className="text-[10px] text-gray-500">Sueldo base</p><p className="font-bold text-sm">{formatCLP(d.sueldoBase)}</p></div>
            <div><p className="text-[10px] text-gray-500">Bono/viaje</p><p className="font-bold text-sm">{formatCLP(d.bonoPorViaje)}</p></div>
          </div>
        </div>);
      })}</div>
      <Modal open={show} onClose={() => setShow(false)} title="Agregar conductor">
        <form onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); setD(p => [...p, { id: genId(), nombre: f.get("nombre") as string, rut: f.get("rut") as string, telefono: f.get("telefono") as string, sueldoBase: parseInt(f.get("sueldoBase") as string), bonoPorViaje: parseInt(f.get("bonoPorViaje") as string), bonoPorKm: parseInt(f.get("bonoPorKm") as string) }]); setShow(false); }}>
          <div className="space-y-3">
            <div><label className="block text-sm font-medium mb-1">Nombre</label><input name="nombre" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div>
            <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium mb-1">RUT</label><input name="rut" required placeholder="12.345.678-9" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div><div><label className="block text-sm font-medium mb-1">Telefono</label><input name="telefono" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div></div>
            <div className="grid grid-cols-3 gap-3"><div><label className="block text-sm font-medium mb-1">Sueldo base</label><input name="sueldoBase" type="number" required defaultValue={550000} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div><div><label className="block text-sm font-medium mb-1">Bono/viaje</label><input name="bonoPorViaje" type="number" required defaultValue={15000} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div><div><label className="block text-sm font-medium mb-1">Bono/km</label><input name="bonoPorKm" type="number" required defaultValue={50} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div></div>
          </div>
          <button type="submit" className="mt-4 w-full bg-blue-700 text-white font-semibold py-3 rounded-lg">Agregar</button>
        </form>
      </Modal>
    </div>
  );
}
