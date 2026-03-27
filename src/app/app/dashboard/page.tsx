"use client";
import Link from "next/link";
import { formatCLP, vehicles as defaultV, getClient } from "@/lib/data";
import { useVehicles, useTrips, useExpenses, useInvoices, useServices, useDrivers } from "@/lib/store";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#1e40af", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

export default function Dashboard() {
  const { data: vehs, loaded: l1 } = useVehicles();
  const { data: trips, loaded: l2 } = useTrips();
  const { data: expenses, loaded: l3 } = useExpenses();
  const { data: invoices } = useInvoices();
  const { data: services } = useServices();
  const { data: drvs } = useDrivers();
  if (!l1 || !l2 || !l3) return <div className="text-center py-20 text-gray-400">Cargando...</div>;

  const ingreso = trips.filter(t => t.estado === "completado" || t.estado === "facturado").reduce((s, t) => s + t.valor, 0);
  const gasto = expenses.reduce((s, e) => s + e.monto, 0);
  const margen = ingreso - gasto;
  const margenPct = ingreso > 0 ? Math.round((margen / ingreso) * 100) : 0;
  const vencido = invoices.filter(f => f.estado === "vencida").reduce((s, f) => s + f.monto, 0);

  const barData = vehs.map(v => {
    const ing = trips.filter(t => t.vehicleId === v.id && (t.estado === "completado" || t.estado === "facturado")).reduce((s, t) => s + t.valor, 0);
    const gas = expenses.filter(e => e.vehicleId === v.id).reduce((s, e) => s + e.monto, 0);
    return { name: v.patente, Ingresos: ing, Gastos: gas };
  });
  const pieMap: Record<string, number> = {};
  expenses.forEach(e => { pieMap[e.tipo] = (pieMap[e.tipo] || 0) + e.monto; });
  const pieData = Object.entries(pieMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">Marzo 2026 — Transportes Duarte</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { l: "Ingresos mes", v: formatCLP(ingreso), c: "text-gray-900" },
          { l: "Gastos mes", v: formatCLP(gasto), c: "text-red-600" },
          { l: "Margen", v: formatCLP(margen), c: "text-green-600", s: `${margenPct}%` },
          { l: "Vencido", v: formatCLP(vencido), c: "text-amber-600" },
        ].map(s => (
          <div key={s.l} className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase">{s.l}</p>
            <p className={`text-xl font-extrabold mt-1 ${s.c}`}>{s.v}</p>
            {s.s && <p className="text-xs text-gray-400">{s.s} del ingreso</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-blue-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-blue-700">{vehs.filter(v => v.estado === "activo").length}</p><p className="text-[10px] text-blue-600">Activos</p></div>
        <div className="bg-amber-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-amber-700">{vehs.filter(v => v.estado === "mantencion").length}</p><p className="text-[10px] text-amber-600">Mantencion</p></div>
        <div className="bg-green-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-green-700">{trips.filter(t => t.fecha === "2026-03-27").length}</p><p className="text-[10px] text-green-600">Viajes hoy</p></div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="font-bold text-gray-900 text-sm mb-3">Ingresos vs Gastos por equipo</h3>
          <div className="h-56"><ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ left: -15 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 9 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => formatCLP(Number(v))} />
              <Bar dataKey="Ingresos" fill="#3b82f6" radius={[4, 4, 0, 0]} /><Bar dataKey="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="font-bold text-gray-900 text-sm mb-3">Gastos por tipo</h3>
          <div className="h-56"><ResponsiveContainer width="100%" height="100%">
            <PieChart><Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false} fontSize={9}>
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie><Tooltip formatter={(v) => formatCLP(Number(v))} /></PieChart>
          </ResponsiveContainer></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 mb-6">
        <div className="p-4 border-b border-gray-50 flex justify-between"><h2 className="font-bold text-sm">Rentabilidad por equipo</h2><Link href="/app/equipos" className="text-xs text-blue-600">Ver todos</Link></div>
        {vehs.map(v => {
          const ing = trips.filter(t => t.vehicleId === v.id && (t.estado === "completado" || t.estado === "facturado")).reduce((s, t) => s + t.valor, 0);
          const gas = expenses.filter(e => e.vehicleId === v.id).reduce((s, e) => s + e.monto, 0);
          const m = ing - gas; const p = ing > 0 ? Math.round((m / ing) * 100) : 0;
          return (<div key={v.id} className="px-4 py-3 flex justify-between border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${v.estado === "activo" ? "bg-green-500" : v.estado === "mantencion" ? "bg-amber-500" : "bg-gray-300"}`} /><div><p className="text-sm font-medium">{v.patente} — {v.marca} {v.modelo}</p><p className="text-[10px] text-gray-400">{v.tipo} {v.ano}</p></div></div>
            <div className="text-right"><p className={`font-bold text-sm ${m >= 0 ? "text-green-600" : "text-red-600"}`}>{formatCLP(m)}</p><p className="text-[10px] text-gray-400">{p}%</p></div>
          </div>);
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="p-4 border-b border-gray-50 flex justify-between"><h2 className="font-bold text-sm">Viajes recientes</h2><Link href="/app/viajes" className="text-xs text-blue-600">Ver todos</Link></div>
          {trips.slice(0, 4).map(t => {
            const cl = getClient(t.clienteId); const v = vehs.find(x => x.id === t.vehicleId);
            const ec: Record<string, string> = { programado: "bg-blue-100 text-blue-700", en_curso: "bg-amber-100 text-amber-700", completado: "bg-green-100 text-green-700", facturado: "bg-purple-100 text-purple-700" };
            return (<div key={t.id} className="px-4 py-3 flex justify-between border-b border-gray-50 last:border-0">
              <div><p className="text-sm font-medium">{cl?.nombre || t.clienteId}</p><p className="text-[10px] text-gray-500">{t.origen} → {t.destino} · {v?.patente}</p></div>
              <div className="text-right"><p className="font-bold text-sm">{formatCLP(t.valor)}</p><span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${ec[t.estado]}`}>{t.estado.replace("_", " ")}</span></div>
            </div>);
          })}
        </div>
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="p-4 border-b border-gray-50 flex justify-between"><h2 className="font-bold text-sm">Servicios activos</h2><Link href="/app/servicios" className="text-xs text-blue-600">Ver todos</Link></div>
          {services.filter(s => s.estado !== "completada").slice(0, 3).map(s => {
            const cl = getClient(s.clienteId);
            const ec: Record<string, string> = { nueva: "bg-blue-100 text-blue-700", asignada: "bg-amber-100 text-amber-700", en_curso: "bg-green-100 text-green-700", completada: "bg-purple-100 text-purple-700" };
            return (<div key={s.id} className="px-4 py-3 border-b border-gray-50 last:border-0">
              <div className="flex justify-between"><p className="text-sm font-medium">{s.codigo}</p><span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${ec[s.estado]}`}>{s.estado.replace("_", " ")}</span></div>
              <p className="text-[10px] text-gray-500">{cl?.nombre} · {s.tipo} · {s.direccion}</p>
            </div>);
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="p-4 border-b border-gray-50"><h2 className="font-bold text-sm">Alertas</h2></div>
        {[
          { c: "bg-red-100", t: "text-red-600", title: "Factura vencida — Cencosud", desc: "Factura #1044 por $350.000 vencida hace 3 dias" },
          { c: "bg-amber-100", t: "text-amber-600", title: "MMNN-78 en mantencion", desc: "Scania R500 lleva 4 dias en taller" },
          { c: "bg-blue-100", t: "text-blue-600", title: "Revision tecnica RRXX-12", desc: "Vence en 15 dias (11 abril)" },
          { c: "bg-red-100", t: "text-red-600", title: "Resolucion 154 SII", desc: "Nuevas guias de despacho en 34 dias" },
          { c: "bg-amber-100", t: "text-amber-600", title: "SOAP vencido TTPP-34", desc: "Vencio el 15 de marzo 2026" },
        ].map(a => (
          <div key={a.title} className="px-4 py-3 flex items-start gap-3 border-b border-gray-50 last:border-0">
            <span className={`w-5 h-5 ${a.c} rounded-full flex items-center justify-center shrink-0 mt-0.5`}><span className={`text-[10px] font-bold ${a.t}`}>!</span></span>
            <div><p className="text-sm font-medium">{a.title}</p><p className="text-[10px] text-gray-500">{a.desc}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
