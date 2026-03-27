"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Truck, Users, FileText, Route, Wrench, Building2, Receipt, FileSpreadsheet, DollarSign, MapPin } from "lucide-react";

const sections = [
  { label: "GENERAL", items: [{ href: "/app/dashboard", name: "Dashboard", icon: LayoutDashboard }] },
  { label: "FLOTA", items: [
    { href: "/app/equipos", name: "Equipos", icon: Truck },
    { href: "/app/conductores", name: "Conductores", icon: Users },
    { href: "/app/documentos", name: "Documentos", icon: FileText },
  ]},
  { label: "OPERACIONES", items: [
    { href: "/app/viajes", name: "Viajes", icon: Route },
    { href: "/app/servicios", name: "Servicios", icon: Wrench },
    { href: "/app/clientes", name: "Clientes", icon: Building2 },
  ]},
  { label: "FINANZAS", items: [
    { href: "/app/gastos", name: "Gastos", icon: Receipt },
    { href: "/app/facturacion", name: "Facturacion", icon: FileSpreadsheet },
    { href: "/app/liquidaciones", name: "Liquidaciones", icon: DollarSign },
  ]},
  { label: "TRACKING", items: [{ href: "/app/gps", name: "GPS", icon: MapPin }] },
];

const mobileNav = [
  { href: "/app/dashboard", name: "Inicio", icon: LayoutDashboard },
  { href: "/app/equipos", name: "Flota", icon: Truck },
  { href: "/app/viajes", name: "Ops", icon: Route },
  { href: "/app/gastos", name: "Finanzas", icon: Receipt },
  { href: "/app/gps", name: "GPS", icon: MapPin },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="hidden md:flex md:flex-col md:w-60 bg-white border-r border-gray-200 fixed h-full z-40">
        <div className="p-4 border-b border-gray-100">
          <Link href="/app/dashboard" className="flex items-center gap-2">
            <Truck className="w-7 h-7 text-blue-700" />
            <span className="font-bold text-blue-900">RutaGestion</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {sections.map(s => (
            <div key={s.label}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1">{s.label}</p>
              {s.items.map(item => {
                const active = path === item.href;
                return (
                  <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}>
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">CD</div>
            <div><div className="text-sm font-medium text-gray-900">Charles D.</div><div className="text-[10px] text-gray-400">Transportes Duarte</div></div>
          </div>
        </div>
      </aside>
      <main className="flex-1 md:ml-60 pb-20 md:pb-0">
        <header className="md:hidden bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between sticky top-0 z-30">
          <Link href="/app/dashboard" className="flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-700" />
            <span className="font-bold text-blue-900 text-sm">RutaGestion</span>
          </Link>
          <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">CD</div>
        </header>
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-5 h-16">
          {mobileNav.map(item => {
            const active = path === item.href || (item.href !== "/app/dashboard" && path.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${active ? "text-blue-700" : "text-gray-400"}`}>
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
