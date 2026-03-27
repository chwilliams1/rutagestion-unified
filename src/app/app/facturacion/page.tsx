"use client";
import { useState } from "react";
import { formatCLP, getClient } from "@/lib/data";
import { useInvoices, useClients } from "@/lib/store";

export default function FacturacionPage() {
  const { data: invs, update: setI, loaded } = useInvoices();
  const { data: clients } = useClients();
  const [filtro, setFiltro] = useState("todas");
  if (!loaded) return <div className="text-center py-20 text-gray-400">Cargando...</div>;
  const filtered = filtro === "todas" ? invs : invs.filter(f => f.estado === filtro);
  const totE = invs.filter(f => f.estado === "emitida").reduce((s, f) => s + f.monto, 0);
  const totP = invs.filter(f => f.estado === "pagada").reduce((s, f) => s + f.monto, 0);
  const totV = invs.filter(f => f.estado === "vencida").reduce((s, f) => s + f.monto, 0);
  const ec: Record<string, string> = { emitida: "bg-blue-100 text-blue-700", pagada: "bg-green-100 text-green-700", vencida: "bg-red-100 text-red-700" };
  return (
    <div>
      <div className="flex justify-between items-center mb-4"><h1 className="text-xl font-bold">Facturacion</h1></div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[{ l: "Por cobrar", v: totE, c: "text-blue-700", f: "emitida" }, { l: "Pagadas", v: totP, c: "text-green-700", f: "pagada" }, { l: "Vencidas", v: totV, c: "text-red-700", f: "vencida" }].map(s => (
          <button key={s.f} onClick={() => setFiltro(filtro === s.f ? "todas" : s.f)} className={`rounded-xl p-4 text-center border transition ${filtro === s.f ? `border-current bg-opacity-10` : "border-gray-100 bg-white"}`}>
            <p className="text-[10px] text-gray-500">{s.l}</p><p className={`text-lg font-extrabold ${s.c}`}>{formatCLP(s.v)}</p>
            <p className="text-[9px] text-gray-400">{invs.filter(f => f.estado === s.f).length} facturas</p>
          </button>
        ))}
      </div>
      <div className="space-y-2">{filtered.map(f => {
        const cl = getClient(f.clienteId) || clients.find(c => c.id === f.clienteId);
        return (<div key={f.id} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex justify-between items-start">
            <div><div className="flex items-center gap-2"><p className="font-bold">#{f.numero}</p><span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${ec[f.estado]}`}>{f.estado}</span></div><p className="text-sm text-gray-700 mt-0.5">{cl?.nombre || "—"}</p><p className="text-xs text-gray-400">{f.fecha}</p></div>
            <p className="text-xl font-extrabold">{formatCLP(f.monto)}</p>
          </div>
          <div className="mt-3 flex gap-2">
            {f.estado === "emitida" && <button onClick={() => setI(p => p.map(x => x.id === f.id ? { ...x, estado: "pagada" } : x))} className="flex-1 bg-green-50 text-green-700 text-xs font-semibold py-2 rounded-lg">Marcar pagada</button>}
            {f.estado === "vencida" && <button className="flex-1 bg-amber-50 text-amber-700 text-xs font-semibold py-2 rounded-lg">Enviar recordatorio</button>}
            <button className="flex-1 bg-gray-50 text-gray-600 text-xs font-semibold py-2 rounded-lg">Ver PDF</button>
          </div>
        </div>);
      })}</div>
    </div>
  );
}
