"use client";
import { formatCLP } from "@/lib/data";
import { useDrivers, useTrips } from "@/lib/store";

export default function LiquidacionesPage() {
  const { data: drvs, loaded: l1 } = useDrivers();
  const { data: trips, loaded: l2 } = useTrips();
  if (!l1 || !l2) return <div className="text-center py-20 text-gray-400">Cargando...</div>;
  const liqs = drvs.map(d => {
    const vjs = trips.filter(t => t.driverId === d.id && (t.estado === "completado" || t.estado === "facturado"));
    const km = vjs.reduce((s, t) => s + t.km, 0);
    const bViaje = vjs.length * d.bonoPorViaje;
    const bKm = km * d.bonoPorKm;
    const col = 22 * 3500; const mov = 22 * 2500;
    const bruto = d.sueldoBase + bViaje + bKm + col + mov;
    const afp = Math.round(bruto * 0.1144); const salud = Math.round(bruto * 0.07); const ces = Math.round(bruto * 0.006);
    const desc = afp + salud + ces;
    return { ...d, vjs: vjs.length, km, bViaje, bKm, col, mov, bruto, afp, salud, ces, desc, liq: bruto - desc };
  });
  return (
    <div>
      <div className="flex justify-between items-center mb-4"><div><h1 className="text-xl font-bold">Liquidaciones</h1><p className="text-sm text-gray-500">Marzo 2026</p></div><button className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">Generar PDFs</button></div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center"><p className="text-[10px] text-gray-500">Total bruto</p><p className="text-xl font-extrabold">{formatCLP(liqs.reduce((s, l) => s + l.bruto, 0))}</p></div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center"><p className="text-[10px] text-gray-500">Total liquido</p><p className="text-xl font-extrabold text-green-600">{formatCLP(liqs.reduce((s, l) => s + l.liq, 0))}</p></div>
      </div>
      <div className="space-y-4">{liqs.map(l => (
        <div key={l.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center">
            <div><p className="font-bold">{l.nombre}</p><p className="text-xs text-gray-400">RUT: {l.rut} · {l.telefono}</p></div>
            <div className="text-right"><p className="text-[10px] text-gray-500">Liquido</p><p className="text-xl font-extrabold text-green-600">{formatCLP(l.liq)}</p></div>
          </div>
          <div className="p-4 space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Haberes</p>
            {[["Sueldo base", l.sueldoBase], [`Bono viaje (${l.vjs} x ${formatCLP(l.bonoPorViaje)})`, l.bViaje], [`Bono km (${l.km.toLocaleString()} x ${formatCLP(l.bonoPorKm)})`, l.bKm], ["Colacion (22 dias)", l.col], ["Movilizacion (22 dias)", l.mov]].map(([lb, val]) => (
              <div key={lb as string} className="flex justify-between text-sm"><span className="text-gray-600">{lb}</span><span className="font-medium">{formatCLP(val as number)}</span></div>
            ))}
            <div className="flex justify-between text-sm font-bold border-t border-gray-100 pt-1"><span>Total haberes</span><span>{formatCLP(l.bruto)}</span></div>
            <p className="text-[10px] font-bold text-gray-400 uppercase mt-3">Descuentos</p>
            {[["AFP (11.44%)", l.afp], ["Salud (7%)", l.salud], ["Seg. Cesantia (0.6%)", l.ces]].map(([lb, val]) => (
              <div key={lb as string} className="flex justify-between text-sm"><span className="text-gray-600">{lb}</span><span className="font-medium text-red-600">-{formatCLP(val as number)}</span></div>
            ))}
            <div className="flex justify-between text-sm font-bold border-t border-gray-100 pt-1"><span>Total descuentos</span><span className="text-red-600">-{formatCLP(l.desc)}</span></div>
          </div>
          <div className="px-4 pb-4"><button className="w-full bg-gray-50 text-gray-600 text-sm font-semibold py-2.5 rounded-lg">Descargar PDF</button></div>
        </div>
      ))}</div>
    </div>
  );
}
