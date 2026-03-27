"use client";
import { useState } from "react";
import { formatCLP } from "@/lib/data";
import { useRates } from "@/lib/store";

export default function CotizadorPage() {
  const { data: rates, loaded } = useRates();
  const [modo, setModo] = useState<"flete" | "grua">("flete");
  const [km, setKm] = useState(200);
  const [consumo, setConsumo] = useState(3.5);
  const [precioDiesel, setPrecioDiesel] = useState(680);
  const [peajes, setPeajes] = useState(25000);
  const [horasViaje, setHorasViaje] = useState(4);
  const [costoChofer, setCostoChofer] = useState(4500);
  const [margen, setMargen] = useState(30);
  // Grua
  const [horas, setHoras] = useState(4);
  const [tarifaId, setTarifaId] = useState(rates[0]?.id || "");
  const [margenGrua, setMargenGrua] = useState(25);

  if (!loaded) return <div className="text-center py-20 text-gray-400">Cargando...</div>;

  const fmt = formatCLP;

  // Flete
  const litros = km / consumo;
  const costoComb = Math.round(litros * precioDiesel);
  const costoOp = Math.round(horasViaje * costoChofer);
  const desgaste = Math.round(km * 85);
  const costoTotal = costoComb + peajes + costoOp + desgaste;
  const precioMin = Math.round(costoTotal / (1 - margen / 100));
  const ganancia = precioMin - costoTotal;

  // Grua
  const tarifa = rates.find(r => r.id === tarifaId);
  const valorHoraGrua = tarifa?.valorHora || 85000;
  const minHoras = tarifa?.minimoHoras || 4;
  const horasEfectivas = Math.max(horas, minHoras);
  const costoBaseGrua = horasEfectivas * valorHoraGrua;
  const precioGrua = Math.round(costoBaseGrua / (1 - margenGrua / 100));
  const gananciaGrua = precioGrua - costoBaseGrua;

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Cotizador</h1>
      <p className="text-sm text-gray-500 mb-6">Calcula el precio de un servicio para enviar al cliente</p>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setModo("flete")} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${modo === "flete" ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-600"}`}>🚛 Flete / Viaje</button>
        <button onClick={() => setModo("grua")} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${modo === "grua" ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-600"}`}>🏗️ Servicio Grua</button>
      </div>

      {modo === "flete" ? (
        <>
          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4 mb-6">
            <h2 className="font-bold text-sm">Datos del flete</h2>
            {[
              { l: "Distancia", v: `${km} km`, val: km, set: setKm, min: 10, max: 1000, step: 10 },
              { l: "Rendimiento", v: `${consumo} km/lt`, val: consumo, set: setConsumo, min: 1, max: 8, step: 0.1 },
              { l: "Precio diesel", v: fmt(precioDiesel) + "/lt", val: precioDiesel, set: setPrecioDiesel, min: 500, max: 1000, step: 10 },
              { l: "Peajes", v: fmt(peajes), val: peajes, set: setPeajes, min: 0, max: 100000, step: 1000 },
              { l: "Horas viaje", v: `${horasViaje} hrs`, val: horasViaje, set: setHorasViaje, min: 1, max: 24, step: 0.5 },
              { l: "Costo chofer", v: fmt(costoChofer) + "/hr", val: costoChofer, set: setCostoChofer, min: 2000, max: 10000, step: 100 },
              { l: "Margen", v: `${margen}%`, val: margen, set: setMargen, min: 5, max: 60, step: 1 },
            ].map(s => (
              <div key={s.l}><label className="flex justify-between text-sm text-gray-600 mb-1"><span>{s.l}</span><span className="font-bold">{s.v}</span></label>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={e => s.set(+e.target.value)} className="w-full accent-blue-700" /></div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
            <div className="p-4">
              <h2 className="font-bold text-sm mb-3">Desglose</h2>
              {[["⛽ Combustible", costoComb], ["🛣️ Peajes", peajes], ["👤 Operador", costoOp], ["🔧 Desgaste", desgaste]].map(([l, v]) => (
                <div key={l as string} className="flex justify-between text-sm py-1"><span className="text-gray-600">{l}</span><span className="font-medium">{fmt(v as number)}</span></div>
              ))}
              <div className="flex justify-between text-sm font-bold border-t border-gray-100 pt-2 mt-2"><span>Costo total</span><span className="text-red-600">{fmt(costoTotal)}</span></div>
            </div>
            <div className="bg-blue-900 p-4 grid grid-cols-3 gap-4 text-center text-white">
              <div><p className="text-[10px] text-blue-300">Precio minimo</p><p className="text-xl font-extrabold text-amber-400">{fmt(precioMin)}</p></div>
              <div><p className="text-[10px] text-blue-300">Ganancia</p><p className="text-xl font-extrabold text-green-400">{fmt(ganancia)}</p></div>
              <div><p className="text-[10px] text-blue-300">$/km</p><p className="text-xl font-extrabold">{fmt(Math.round(precioMin / km))}</p></div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4 mb-6">
            <h2 className="font-bold text-sm">Datos del servicio</h2>
            <div><label className="block text-sm font-medium mb-1">Tarifa</label>
              <select value={tarifaId} onChange={e => setTarifaId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm">
                {rates.filter(r => r.activa && r.valorHora > 0).map(r => <option key={r.id} value={r.id}>{r.nombre} — {fmt(r.valorHora)}/hr (min {r.minimoHoras}h)</option>)}
              </select>
            </div>
            <div><label className="flex justify-between text-sm text-gray-600 mb-1"><span>Horas estimadas</span><span className="font-bold">{horas} hrs</span></label>
              <input type="range" min={1} max={24} step={0.5} value={horas} onChange={e => setHoras(+e.target.value)} className="w-full accent-blue-700" />
              {horas < minHoras && <p className="text-[10px] text-amber-600 mt-1">Minimo cobrable: {minHoras} horas</p>}
            </div>
            <div><label className="flex justify-between text-sm text-gray-600 mb-1"><span>Margen</span><span className="font-bold text-green-600">{margenGrua}%</span></label>
              <input type="range" min={5} max={60} step={1} value={margenGrua} onChange={e => setMargenGrua(+e.target.value)} className="w-full accent-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
            <div className="p-4">
              <h2 className="font-bold text-sm mb-3">Desglose</h2>
              <div className="flex justify-between text-sm py-1"><span className="text-gray-600">Tarifa: {tarifa?.nombre || "—"}</span><span>{fmt(valorHoraGrua)}/hr</span></div>
              <div className="flex justify-between text-sm py-1"><span className="text-gray-600">Horas cobrables</span><span>{horasEfectivas} hrs</span></div>
              <div className="flex justify-between text-sm font-bold border-t border-gray-100 pt-2 mt-2"><span>Costo base</span><span>{fmt(costoBaseGrua)}</span></div>
            </div>
            <div className="bg-blue-900 p-4 grid grid-cols-2 gap-4 text-center text-white">
              <div><p className="text-[10px] text-blue-300">Precio al cliente</p><p className="text-2xl font-extrabold text-amber-400">{fmt(precioGrua)}</p></div>
              <div><p className="text-[10px] text-blue-300">Tu ganancia</p><p className="text-2xl font-extrabold text-green-400">{fmt(gananciaGrua)}</p></div>
            </div>
          </div>
        </>
      )}

      <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition text-sm">
        📱 Enviar cotizacion por WhatsApp
      </button>
    </div>
  );
}
