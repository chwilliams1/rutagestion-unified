"use client";
import { docRecords, vehicles } from "@/lib/data";

export default function DocumentosPage() {
  const today = new Date("2026-03-27");
  const grouped = vehicles.map(v => ({
    vehicle: v,
    docs: docRecords.filter(d => d.vehicleId === v.id).map(d => {
      const exp = new Date(d.fechaVencimiento);
      const diff = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const estado = diff < 0 ? "vencido" : diff <= 30 ? "por_vencer" : "vigente";
      return { ...d, diff, estado };
    }),
  }));
  const badge: Record<string, string> = { vigente: "bg-green-100 text-green-700", por_vencer: "bg-amber-100 text-amber-700", vencido: "bg-red-100 text-red-700" };
  const label: Record<string, string> = { vigente: "Vigente", por_vencer: "Por vencer", vencido: "Vencido" };
  const emoji: Record<string, string> = { camion: "🚛", grua: "🏗️", furgon: "🚐" };
  return (
    <div>
      <div className="flex justify-between items-center mb-6"><h1 className="text-xl font-bold">Documentos</h1><button className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">+ Subir documento</button></div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[{ l: "Vigentes", c: "text-green-700", n: grouped.flatMap(g => g.docs).filter(d => d.estado === "vigente").length },
          { l: "Por vencer", c: "text-amber-700", n: grouped.flatMap(g => g.docs).filter(d => d.estado === "por_vencer").length },
          { l: "Vencidos", c: "text-red-700", n: grouped.flatMap(g => g.docs).filter(d => d.estado === "vencido").length }].map(s => (
          <div key={s.l} className="bg-white rounded-xl border border-gray-100 p-3 text-center"><p className={`text-2xl font-extrabold ${s.c}`}>{s.n}</p><p className="text-[10px] text-gray-500">{s.l}</p></div>
        ))}
      </div>
      <div className="space-y-4">{grouped.map(g => (
        <div key={g.vehicle.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 flex items-center gap-2">
            <span className="text-lg">{emoji[g.vehicle.tipo]}</span>
            <div><p className="font-bold text-sm">{g.vehicle.patente} — {g.vehicle.marca} {g.vehicle.modelo}</p></div>
          </div>
          <div className="divide-y divide-gray-50">
            {g.docs.map(d => (
              <div key={d.id} className="px-4 py-3 flex items-center justify-between">
                <div><p className="text-sm font-medium">{d.tipo}</p><p className="text-[10px] text-gray-400">Vence: {d.fechaVencimiento}</p></div>
                <div className="text-right">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badge[d.estado]}`}>{label[d.estado]}</span>
                  <p className="text-[10px] text-gray-500 mt-0.5">{d.diff > 0 ? `${d.diff} dias` : `${Math.abs(d.diff)} dias vencido`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}</div>
    </div>
  );
}
