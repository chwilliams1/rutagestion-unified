"use client";
import { useState } from "react";
import { formatCLP } from "@/lib/data";
import { useClients, useTrips, useInvoices, genId } from "@/lib/store";
import Modal from "@/components/Modal";

export default function ClientesPage() {
  const { data: clients, update: setC, loaded } = useClients();
  const { data: trips } = useTrips();
  const { data: invoices } = useInvoices();
  const [show, setShow] = useState(false);
  if (!loaded) return <div className="text-center py-20 text-gray-400">Cargando...</div>;
  return (
    <div>
      <div className="flex justify-between items-center mb-6"><h1 className="text-xl font-bold">Clientes ({clients.length})</h1><button onClick={() => setShow(true)} className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">+ Agregar</button></div>
      <div className="space-y-3">{clients.map(c => {
        const vjs = trips.filter(t => t.clienteId === c.id).length;
        const facturado = invoices.filter(f => f.clienteId === c.id && f.estado === "pagada").reduce((s, f) => s + f.monto, 0);
        return (<div key={c.id} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex justify-between items-start mb-2">
            <div><p className="font-bold">{c.nombre}</p><p className="text-xs text-gray-500">RUT: {c.rut}</p><p className="text-xs text-gray-400">{c.telefono} · {c.direccion}</p></div>
            <button onClick={() => setC(p => p.filter(x => x.id !== c.id))} className="text-gray-300 hover:text-red-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-lg p-3">
            <div className="text-center"><p className="text-[10px] text-gray-500">Viajes</p><p className="font-bold text-sm">{vjs}</p></div>
            <div className="text-center"><p className="text-[10px] text-gray-500">Facturado pagado</p><p className="font-bold text-sm text-green-600">{formatCLP(facturado)}</p></div>
          </div>
        </div>);
      })}</div>
      <Modal open={show} onClose={() => setShow(false)} title="Agregar cliente">
        <form onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); setC(p => [...p, { id: genId(), nombre: f.get("nombre") as string, rut: f.get("rut") as string, telefono: f.get("telefono") as string, direccion: f.get("direccion") as string }]); setShow(false); }}>
          <div className="space-y-3">
            <div><label className="block text-sm font-medium mb-1">Nombre / Razon social</label><input name="nombre" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">RUT</label><input name="rut" required placeholder="96.792.430-K" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Telefono</label><input name="telefono" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Direccion</label><input name="direccion" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div>
          </div>
          <button type="submit" className="mt-4 w-full bg-blue-700 text-white font-semibold py-3 rounded-lg">Agregar</button>
        </form>
      </Modal>
    </div>
  );
}
