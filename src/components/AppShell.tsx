"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Truck, Users, FileText, Route, Wrench, Building2, Receipt, FileSpreadsheet, DollarSign, MapPin, Settings, Calendar, ClipboardList, Calculator, Tag, ChevronRight, Menu, X, Home, CircleDollarSign } from "lucide-react";

// Navegación simplificada: solo 4 secciones principales con sub-items
const menuGroups = [
  {
    label: "Mi Flota",
    icon: Truck,
    color: "text-blue-600",
    bg: "bg-blue-50",
    items: [
      { href: "/app/equipos", name: "Camiones y Gruas", icon: Truck, desc: "Ver todos mis vehiculos" },
      { href: "/app/conductores", name: "Conductores", icon: Users, desc: "Mis choferes" },
      { href: "/app/mantenciones", name: "Mantenciones", icon: Settings, desc: "Historial y proximas" },
      { href: "/app/documentos", name: "Documentos", icon: FileText, desc: "Permisos, SOAP, revision" },
      { href: "/app/gps", name: "Ubicacion GPS", icon: MapPin, desc: "Donde estan mis camiones" },
    ],
  },
  {
    label: "Trabajo",
    icon: Route,
    color: "text-amber-600",
    bg: "bg-amber-50",
    items: [
      { href: "/app/viajes", name: "Viajes y Fletes", icon: Route, desc: "Programar y controlar" },
      { href: "/app/servicios", name: "Servicios de Grua", icon: Wrench, desc: "Solicitudes de izaje" },
      { href: "/app/reportes", name: "Partes de Hora", icon: ClipboardList, desc: "Reportes de trabajo" },
      { href: "/app/clientes", name: "Clientes", icon: Building2, desc: "Empresas que me contratan" },
      { href: "/app/cotizador", name: "Hacer Cotizacion", icon: Calculator, desc: "Calcular precio de un flete" },
      { href: "/app/tarifas", name: "Mis Tarifas", icon: Tag, desc: "Precios por hora y km" },
    ],
  },
  {
    label: "Plata",
    icon: CircleDollarSign,
    color: "text-green-600",
    bg: "bg-green-50",
    items: [
      { href: "/app/gastos", name: "Gastos", icon: Receipt, desc: "Bencina, peajes, reparaciones" },
      { href: "/app/facturacion", name: "Facturas", icon: FileSpreadsheet, desc: "Cobrar y ver pagos" },
      { href: "/app/liquidaciones", name: "Sueldos", icon: DollarSign, desc: "Liquidaciones de choferes" },
    ],
  },
];

// Mobile: solo 4 tabs simples
const mobileMainTabs = [
  { href: "/app/dashboard", name: "Inicio", icon: Home },
  { href: "/app/equipos", name: "Flota", icon: Truck },
  { href: "/app/viajes", name: "Viajes", icon: Route },
  { href: "/app/gastos", name: "Plata", icon: CircleDollarSign },
];

// Todos los hrefs para detectar active states
const allHrefs = menuGroups.flatMap(g => g.items.map(i => i.href));

function findGroupForPath(path: string) {
  return menuGroups.find(g => g.items.some(i => path.startsWith(i.href)));
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(findGroupForPath(path)?.label || null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* === DESKTOP SIDEBAR === */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200 fixed h-full z-40">
        <div className="p-5 border-b border-gray-100">
          <Link href="/app/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-700 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-blue-900 text-base leading-tight">RutaGestion</p>
              <p className="text-[10px] text-gray-400">Transportes Duarte</p>
            </div>
          </Link>
        </div>

        {/* Dashboard link - always visible */}
        <div className="px-3 pt-3">
          <Link href="/app/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${path === "/app/dashboard" ? "bg-blue-700 text-white shadow-md shadow-blue-200" : "text-gray-700 hover:bg-gray-50"}`}>
            <LayoutDashboard className="w-5 h-5" />
            Resumen del dia
          </Link>
          <Link href="/app/calendario" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition mt-1 ${path === "/app/calendario" ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-50"}`}>
            <Calendar className="w-4 h-4" />
            Calendario
          </Link>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-2 overflow-y-auto">
          {menuGroups.map(group => {
            const isExpanded = expandedGroup === group.label;
            const hasActive = group.items.some(i => path.startsWith(i.href));
            return (
              <div key={group.label}>
                <button
                  onClick={() => setExpandedGroup(isExpanded ? null : group.label)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${hasActive ? `${group.bg} ${group.color}` : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <group.icon className="w-5 h-5" />
                    {group.label}
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                </button>
                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
                    {group.items.map(item => {
                      const active = path === item.href;
                      return (
                        <Link key={item.href} href={item.href} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${active ? "bg-white font-semibold text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-white/50"}`}>
                          <item.icon className="w-4 h-4 shrink-0" />
                          <div className="min-w-0">
                            <p className="truncate">{item.name}</p>
                            {!active && <p className="text-[10px] text-gray-400 truncate">{item.desc}</p>}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold">CD</div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Charles Duarte</p>
              <p className="text-[10px] text-gray-400">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        {/* Mobile header */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between sticky top-0 z-30">
          <Link href="/app/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-blue-900 text-sm">RutaGestion</span>
          </Link>
          <button onClick={() => setMobileMenuOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </header>

        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>

      {/* === MOBILE BOTTOM TABS === */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-bottom">
        <div className="grid grid-cols-4 h-16">
          {mobileMainTabs.map(item => {
            const active = item.href === "/app/dashboard"
              ? path === "/app/dashboard"
              : item.href === "/app/equipos"
                ? ["/app/equipos", "/app/conductores", "/app/mantenciones", "/app/documentos", "/app/gps"].some(h => path.startsWith(h))
                : item.href === "/app/viajes"
                  ? ["/app/viajes", "/app/servicios", "/app/reportes", "/app/clientes", "/app/cotizador", "/app/tarifas", "/app/calendario"].some(h => path.startsWith(h))
                  : ["/app/gastos", "/app/facturacion", "/app/liquidaciones"].some(h => path.startsWith(h));
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center gap-1 transition ${active ? "text-blue-700" : "text-gray-400"}`}>
                <item.icon className={`w-6 h-6 ${active ? "stroke-[2.5]" : ""}`} />
                <span className="text-[11px] font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* === MOBILE FULL MENU (hamburger) === */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold">CD</div>
                <div>
                  <p className="font-bold text-gray-900">Charles Duarte</p>
                  <p className="text-xs text-gray-400">Transportes Duarte</p>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Quick actions */}
            <div className="p-4">
              <Link href="/app/dashboard" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition mb-2 ${path === "/app/dashboard" ? "bg-blue-700 text-white" : "bg-gray-50 text-gray-700"}`}>
                <LayoutDashboard className="w-5 h-5" />
                Resumen del dia
              </Link>
              <Link href="/app/calendario" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${path === "/app/calendario" ? "bg-blue-50 text-blue-700" : "text-gray-600"}`}>
                <Calendar className="w-5 h-5" />
                Calendario
              </Link>
            </div>

            {/* Menu groups */}
            <div className="px-4 pb-8 space-y-4">
              {menuGroups.map(group => (
                <div key={group.label}>
                  <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg ${group.bg}`}>
                    <group.icon className={`w-5 h-5 ${group.color}`} />
                    <p className={`font-bold text-sm ${group.color}`}>{group.label}</p>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {group.items.map(item => {
                      const active = path === item.href;
                      return (
                        <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${active ? "bg-white shadow-sm font-semibold text-gray-900" : "text-gray-600"}`}>
                          <item.icon className="w-5 h-5 shrink-0 text-gray-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">{item.name}</p>
                            <p className="text-[11px] text-gray-400">{item.desc}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
