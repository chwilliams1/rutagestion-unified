"use client";
import { gpsPositions, vehicles } from "@/lib/data";

export default function GpsPage() {
  const statusColor: Record<string, string> = { movimiento: "bg-green-500", detenido: "bg-amber-500", sin_senal: "bg-red-500" };
  const statusLabel: Record<string, string> = { movimiento: "En movimiento", detenido: "Detenido", sin_senal: "Sin senal" };
  const statusText: Record<string, string> = { movimiento: "text-green-700", detenido: "text-amber-700", sin_senal: "text-red-700" };
  return (
    <div>
      <h1 className="text-xl font-bold mb-6">GPS — Rastreo en tiempo real</h1>
      {/* Map placeholder */}
      <div className="bg-gray-200 rounded-xl h-64 md:h-80 relative mb-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #999 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        {gpsPositions.map(p => {
          const v = vehicles.find(x => x.id === p.vehicleId);
          const x = ((p.lng + 71.7) / 1.2) * 100;
          const y = ((p.lat + 34.2) / 1.2) * 100;
          return (
            <div key={p.vehicleId} className="absolute" style={{ left: `${Math.max(5, Math.min(90, x))}%`, top: `${Math.max(5, Math.min(90, y))}%` }}>
              <div className={`w-4 h-4 rounded-full ${statusColor[p.status]} border-2 border-white shadow-lg ${p.status === "movimiento" ? "animate-pulse" : ""}`} />
              <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white px-1.5 py-0.5 rounded text-[8px] font-bold whitespace-nowrap shadow">{v?.patente}</div>
            </div>
          );
        })}
        <div className="absolute bottom-2 left-2 bg-white/90 rounded-lg px-3 py-2 text-[10px] space-y-1">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500" /> En movimiento</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Detenido</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /> Sin senal</div>
        </div>
        <div className="absolute top-2 right-2 bg-blue-700 text-white rounded-lg px-3 py-1.5 text-[10px] font-bold">Traccar GPS</div>
      </div>
      {/* Vehicle list */}
      <div className="space-y-2">
        {gpsPositions.map(p => {
          const v = vehicles.find(x => x.id === p.vehicleId);
          return (<div key={p.vehicleId} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${statusColor[p.status]} ${p.status === "movimiento" ? "animate-pulse" : ""}`} />
              <div>
                <p className="font-bold text-sm">{v?.patente} — {v?.marca} {v?.modelo}</p>
                <p className="text-[10px] text-gray-400">{p.lat.toFixed(3)}, {p.lng.toFixed(3)} · {p.lastUpdate}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-xs font-bold ${statusText[p.status]}`}>{statusLabel[p.status]}</p>
              {p.speed > 0 && <p className="text-[10px] text-gray-500">{p.speed} km/h</p>}
            </div>
          </div>);
        })}
      </div>
    </div>
  );
}
