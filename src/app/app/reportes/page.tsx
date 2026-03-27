"use client";
import { useState } from "react";
import { formatCLP, getClient, getDriver, getVehicle } from "@/lib/data";
import { useReports, useServices, useDrivers, genId } from "@/lib/store";
import Modal from "@/components/Modal";

export default function ReportesPage() {
  const { data: reports, update: setR, loaded } = useReports();
  const { data: svcs } = useServices();
  const { data: drvs } = useDrivers();
  const [show, setShow] = useState(false);
  if (!loaded) return <div className="text-center py-20 text-gray-400">Cargando...</div>;

  const totalHoras = reports.reduce((s, r) => s + r.horas + r.horasExtra, 0);
  const totalMonto = reports.reduce((s, r) => s + r.monto, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-4"><h1 className="text-xl font-bold">Reportes de Servicio ({reports.length})</h1><button onClick={() => setShow(true)} className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">+ Nuevo reporte</button></div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center"><p className="text-2xl font-extrabold text-blue-700">{reports.length}</p><p className="text-[10px] text-gray-500">Reportes</p></div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center"><p className="text-2xl font-extrabold text-amber-700">{totalHoras}</p><p className="text-[10px] text-gray-500">Horas totales</p></div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center"><p className="text-2xl font-extrabold text-green-700">{formatCLP(totalMonto)}</p><p className="text-[10px] text-gray-500">Monto total</p></div>
      </div>

      <div className="space-y-3">{reports.map(r => {
        const svc = svcs.find(s => s.id === r.serviceRequestId);
        const cl = svc ? (getClient(svc.clienteId)) : null;
        const drv = getDriver(r.driverId) || drvs.find(d => d.id === r.driverId);
        const v = svc ? getVehicle(svc.vehicleId) : null;
        return (<div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2"><p className="font-bold">{svc?.codigo || "—"}</p><span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">Reporte</span></div>
              <p className="text-sm text-gray-700 mt-0.5">{cl?.nombre || "—"}</p>
              <p className="text-xs text-gray-400">👤 {drv?.nombre || "—"} · 🏗️ {v?.patente || "—"} · {r.fecha}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-extrabold">{formatCLP(r.monto)}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">{r.descripcion}</p>
          <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-lg p-3 text-center">
            <div><p className="text-[10px] text-gray-500">Horas</p><p className="font-bold text-sm">{r.horas}</p></div>
            <div><p className="text-[10px] text-gray-500">Hrs extra</p><p className="font-bold text-sm text-amber-600">{r.horasExtra}</p></div>
            <div><p className="text-[10px] text-gray-500">Valor/hora</p><p className="font-bold text-sm">{formatCLP(r.valorHora)}</p></div>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="flex-1 bg-gray-50 text-gray-600 text-xs font-semibold py-2 rounded-lg">Descargar PDF</button>
            <button onClick={() => setR(p => p.filter(x => x.id !== r.id))} className="px-3 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 text-xs py-2 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        </div>);
      })}</div>

      <Modal open={show} onClose={() => setShow(false)} title="Nuevo reporte de servicio">
        <form onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); const hrs = parseFloat(f.get("horas") as string); const hrsE = parseFloat(f.get("horasExtra") as string) || 0; const vh = parseInt(f.get("valorHora") as string); setR(p => [{ id: genId(), serviceRequestId: f.get("serviceRequestId") as string, driverId: f.get("driverId") as string, fecha: f.get("fecha") as string, horas: hrs, horasExtra: hrsE, valorHora: vh, monto: Math.round((hrs + hrsE * 1.5) * vh), descripcion: f.get("descripcion") as string }, ...p]); setShow(false); }}>
          <div className="space-y-3">
            <div><label className="block text-sm font-medium mb-1">Solicitud de servicio</label><select name="serviceRequestId" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm">{svcs.map(s => <option key={s.id} value={s.id}>{s.codigo} — {s.tipo}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Conductor</label><select name="driverId" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm">{drvs.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Fecha</label><input name="fecha" type="date" required defaultValue="2026-03-27" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div>
            <div className="grid grid-cols-3 gap-3"><div><label className="block text-sm font-medium mb-1">Horas</label><input name="horas" type="number" step="0.5" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div><div><label className="block text-sm font-medium mb-1">Hrs extra</label><input name="horasExtra" type="number" step="0.5" defaultValue="0" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div><div><label className="block text-sm font-medium mb-1">$/hora</label><input name="valorHora" type="number" required defaultValue="85000" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div></div>
            <div><label className="block text-sm font-medium mb-1">Descripcion</label><textarea name="descripcion" required rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" /></div>
          </div>
          <button type="submit" className="mt-4 w-full bg-blue-700 text-white font-semibold py-3 rounded-lg">Crear reporte</button>
        </form>
      </Modal>
    </div>
  );
}
