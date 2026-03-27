"use client";
import { getClient, getVehicle, getDriver, docRecords, vehicles } from "@/lib/data";
import { useTrips, useServices, useMaintenance } from "@/lib/store";

interface CalEvent { id: string; fecha: string; titulo: string; tipo: string; color: string; }

export default function CalendarioPage() {
  const { data: trips, loaded: l1 } = useTrips();
  const { data: svcs } = useServices();
  const { data: mants } = useMaintenance();
  if (!l1) return <div className="text-center py-20 text-gray-400">Cargando...</div>;

  const events: CalEvent[] = [];

  // Viajes
  trips.forEach(t => {
    const cl = getClient(t.clienteId);
    events.push({ id: "t-" + t.id, fecha: t.fecha, titulo: `🚛 Viaje: ${cl?.nombre || "—"} (${t.origen}→${t.destino})`, tipo: "viaje", color: "bg-blue-100 text-blue-700 border-blue-200" });
  });

  // Servicios
  svcs.forEach(s => {
    const cl = getClient(s.clienteId);
    events.push({ id: "s-" + s.id, fecha: s.fecha, titulo: `🏗️ ${s.codigo}: ${s.tipo} — ${cl?.nombre || "—"}`, tipo: "servicio", color: "bg-amber-100 text-amber-700 border-amber-200" });
  });

  // Mantenciones programadas
  mants.filter(m => m.proximaFecha).forEach(m => {
    const v = getVehicle(m.vehicleId);
    events.push({ id: "m-" + m.id, fecha: m.proximaFecha!, titulo: `🔧 Mantencion: ${v?.patente} — ${m.descripcion}`, tipo: "mantencion", color: "bg-green-100 text-green-700 border-green-200" });
  });

  // Documentos por vencer
  const today = new Date("2026-03-27");
  docRecords.forEach(d => {
    const exp = new Date(d.fechaVencimiento);
    const diff = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 30 && diff >= -7) {
      const v = vehicles.find(x => x.id === d.vehicleId);
      events.push({ id: "d-" + d.id, fecha: d.fechaVencimiento, titulo: `📄 ${d.tipo} ${v?.patente} ${diff < 0 ? "(VENCIDO)" : `(${diff} dias)`}`, tipo: "documento", color: diff < 0 ? "bg-red-100 text-red-700 border-red-200" : "bg-amber-100 text-amber-700 border-amber-200" });
    }
  });

  events.sort((a, b) => a.fecha.localeCompare(b.fecha));

  // Group by date
  const grouped: Record<string, CalEvent[]> = {};
  events.forEach(e => { if (!grouped[e.fecha]) grouped[e.fecha] = []; grouped[e.fecha].push(e); });
  const dates = Object.keys(grouped).sort();

  const dayNames = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  // Mini calendar for March 2026
  const daysInMonth = 31;
  const firstDay = new Date("2026-03-01").getDay(); // Sunday = 0
  const eventDates = new Set(events.map(e => e.fecha));

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Calendario</h1>

      {/* Mini calendar */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <p className="font-bold text-center mb-3">Marzo 2026</p>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {dayNames.map(d => <div key={d} className="font-bold text-gray-400 py-1">{d}</div>)}
          {Array.from({ length: firstDay }).map((_, i) => <div key={"e" + i} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `2026-03-${String(day).padStart(2, "0")}`;
            const hasEvent = eventDates.has(dateStr);
            const isToday = day === 27;
            return (
              <div key={day} className={`py-1.5 rounded-lg text-xs font-medium ${isToday ? "bg-blue-700 text-white" : hasEvent ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-600"}`}>
                {day}
                {hasEvent && !isToday && <div className="w-1 h-1 bg-blue-500 rounded-full mx-auto mt-0.5" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {[{ l: "Viajes", c: "bg-blue-500" }, { l: "Servicios", c: "bg-amber-500" }, { l: "Mantenciones", c: "bg-green-500" }, { l: "Documentos", c: "bg-red-500" }].map(x => (
          <div key={x.l} className="flex items-center gap-1.5 text-xs text-gray-600"><div className={`w-2.5 h-2.5 rounded-full ${x.c}`} />{x.l}</div>
        ))}
      </div>

      {/* Events by date */}
      <div className="space-y-4">
        {dates.map(date => {
          const d = new Date(date + "T12:00:00");
          const dayName = dayNames[d.getDay()];
          const day = d.getDate();
          const month = monthNames[d.getMonth()];
          const isToday = date === "2026-03-27";
          return (
            <div key={date}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center text-xs font-bold ${isToday ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-700"}`}>
                  <span className="text-[9px]">{dayName}</span><span>{day}</span>
                </div>
                <p className="text-sm text-gray-500">{day} {month}{isToday ? " — Hoy" : ""}</p>
              </div>
              <div className="space-y-1.5 ml-12">
                {grouped[date].map(e => (
                  <div key={e.id} className={`px-3 py-2 rounded-lg border text-sm ${e.color}`}>{e.titulo}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
