export interface Vehicle { id: string; patente: string; tipo: "camion" | "grua" | "furgon"; marca: string; modelo: string; ano: number; estado: "activo" | "mantencion" | "inactivo"; capacidad?: string; }
export interface Driver { id: string; nombre: string; rut: string; telefono: string; sueldoBase: number; bonoPorViaje: number; bonoPorKm: number; }
export interface Client { id: string; nombre: string; rut: string; telefono: string; direccion: string; }
export interface Trip { id: string; fecha: string; clienteId: string; origen: string; destino: string; vehicleId: string; driverId: string; estado: "programado" | "en_curso" | "completado" | "facturado"; valor: number; km: number; }
export interface Expense { id: string; fecha: string; vehicleId: string; tipo: "combustible" | "peaje" | "mantencion" | "neumaticos" | "seguro" | "otro"; monto: number; descripcion: string; }
export interface ServiceRequest { id: string; codigo: string; clienteId: string; driverId: string; vehicleId: string; tipo: string; descripcion: string; fecha: string; direccion: string; estado: "nueva" | "asignada" | "en_curso" | "completada"; }
export interface Invoice { id: string; numero: number; fecha: string; clienteId: string; monto: number; estado: "emitida" | "pagada" | "vencida"; }
export interface DocRecord { id: string; vehicleId: string; tipo: string; fechaVencimiento: string; }
export interface GpsPosition { vehicleId: string; lat: number; lng: number; speed: number; status: "movimiento" | "detenido" | "sin_senal"; lastUpdate: string; }

export const vehicles: Vehicle[] = [
  { id: "v1", patente: "RRXX-12", tipo: "camion", marca: "Mercedes-Benz", modelo: "Actros 2645", ano: 2021, estado: "activo" },
  { id: "v2", patente: "TTPP-34", tipo: "camion", marca: "Volvo", modelo: "FH 460", ano: 2020, estado: "activo" },
  { id: "v3", patente: "KKLL-56", tipo: "grua", marca: "Liebherr", modelo: "LTM 1060", ano: 2019, estado: "activo", capacidad: "60 ton" },
  { id: "v4", patente: "MMNN-78", tipo: "camion", marca: "Scania", modelo: "R500", ano: 2022, estado: "mantencion" },
  { id: "v5", patente: "JJHH-90", tipo: "furgon", marca: "Hyundai", modelo: "HD78", ano: 2023, estado: "activo" },
];
export const drivers: Driver[] = [
  { id: "d1", nombre: "Pedro Gonzalez", rut: "12.345.678-9", telefono: "+56 9 1234 5678", sueldoBase: 550000, bonoPorViaje: 15000, bonoPorKm: 50 },
  { id: "d2", nombre: "Miguel Torres", rut: "13.456.789-0", telefono: "+56 9 2345 6789", sueldoBase: 520000, bonoPorViaje: 15000, bonoPorKm: 50 },
  { id: "d3", nombre: "Roberto Diaz", rut: "14.567.890-1", telefono: "+56 9 3456 7890", sueldoBase: 580000, bonoPorViaje: 18000, bonoPorKm: 55 },
  { id: "d4", nombre: "Luis Morales", rut: "15.678.901-2", telefono: "+56 9 4567 8901", sueldoBase: 500000, bonoPorViaje: 12000, bonoPorKm: 45 },
];
export const clients: Client[] = [
  { id: "c1", nombre: "Sodimac S.A.", rut: "96.792.430-K", telefono: "+56 2 2738 1000", direccion: "Av. Presidente Eduardo Frei 3092, Renca" },
  { id: "c2", nombre: "Cencosud S.A.", rut: "93.834.000-5", telefono: "+56 2 2299 0000", direccion: "Av. Kennedy 9001, Las Condes" },
  { id: "c3", nombre: "Arauco S.A.", rut: "76.123.456-7", telefono: "+56 2 2461 7200", direccion: "Av. El Golf 150, Las Condes" },
  { id: "c4", nombre: "CMPC S.A.", rut: "90.222.000-3", telefono: "+56 2 2441 2000", direccion: "Agustinas 1343, Santiago" },
  { id: "c5", nombre: "Copec S.A.", rut: "99.555.000-1", telefono: "+56 2 2461 7000", direccion: "Isidora Goyenechea 2915, Las Condes" },
];
export const defaultTrips: Trip[] = [
  { id: "t1", fecha: "2026-03-27", clienteId: "c1", origen: "Santiago", destino: "Rancagua", vehicleId: "v1", driverId: "d1", estado: "completado", valor: 450000, km: 87 },
  { id: "t2", fecha: "2026-03-27", clienteId: "c2", origen: "Valparaiso", destino: "Santiago", vehicleId: "v2", driverId: "d2", estado: "en_curso", valor: 380000, km: 120 },
  { id: "t3", fecha: "2026-03-26", clienteId: "c3", origen: "Santiago", destino: "Talca", vehicleId: "v1", driverId: "d1", estado: "facturado", valor: 680000, km: 257 },
  { id: "t4", fecha: "2026-03-26", clienteId: "c4", origen: "Rancagua", destino: "Concepcion", vehicleId: "v4", driverId: "d3", estado: "facturado", valor: 1200000, km: 390 },
  { id: "t5", fecha: "2026-03-25", clienteId: "c5", origen: "Santiago", destino: "Los Andes", vehicleId: "v5", driverId: "d4", estado: "facturado", valor: 280000, km: 85 },
  { id: "t6", fecha: "2026-03-25", clienteId: "c2", origen: "Santiago", destino: "Vina del Mar", vehicleId: "v2", driverId: "d2", estado: "completado", valor: 320000, km: 115 },
  { id: "t7", fecha: "2026-03-28", clienteId: "c1", origen: "Santiago", destino: "San Fernando", vehicleId: "v1", driverId: "d1", estado: "programado", valor: 520000, km: 140 },
  { id: "t8", fecha: "2026-03-28", clienteId: "c4", origen: "Santiago", destino: "Talcahuano", vehicleId: "v3", driverId: "d3", estado: "programado", valor: 1500000, km: 510 },
  { id: "t9", fecha: "2026-03-24", clienteId: "c2", origen: "Santiago", destino: "Rancagua", vehicleId: "v5", driverId: "d4", estado: "facturado", valor: 350000, km: 87 },
  { id: "t10", fecha: "2026-03-24", clienteId: "c4", origen: "Rancagua", destino: "Santiago", vehicleId: "v1", driverId: "d1", estado: "facturado", valor: 290000, km: 87 },
];
export const defaultExpenses: Expense[] = [
  { id: "g1", fecha: "2026-03-27", vehicleId: "v1", tipo: "combustible", monto: 120000, descripcion: "Copec Ruta 5 Sur - 180 lts diesel" },
  { id: "g2", fecha: "2026-03-27", vehicleId: "v2", tipo: "combustible", monto: 95000, descripcion: "Shell Lo Espejo - 140 lts diesel" },
  { id: "g3", fecha: "2026-03-27", vehicleId: "v1", tipo: "peaje", monto: 18500, descripcion: "Peajes Ruta 5 Santiago-Rancagua" },
  { id: "g4", fecha: "2026-03-26", vehicleId: "v1", tipo: "combustible", monto: 185000, descripcion: "Copec Talca - 275 lts diesel" },
  { id: "g5", fecha: "2026-03-26", vehicleId: "v4", tipo: "combustible", monto: 280000, descripcion: "Petrobras Rancagua - 410 lts diesel" },
  { id: "g6", fecha: "2026-03-26", vehicleId: "v4", tipo: "peaje", monto: 45000, descripcion: "Peajes Rancagua-Concepcion" },
  { id: "g7", fecha: "2026-03-25", vehicleId: "v5", tipo: "combustible", monto: 45000, descripcion: "Copec Los Andes - 65 lts diesel" },
  { id: "g8", fecha: "2026-03-25", vehicleId: "v2", tipo: "peaje", monto: 12000, descripcion: "Peajes Ruta 68 Santiago-Vina" },
  { id: "g9", fecha: "2026-03-24", vehicleId: "v4", tipo: "mantencion", monto: 350000, descripcion: "Cambio aceite + filtros - Taller MecaniCar" },
  { id: "g10", fecha: "2026-03-23", vehicleId: "v1", tipo: "neumaticos", monto: 890000, descripcion: "2 neumaticos Michelin 315/80 R22.5" },
  { id: "g11", fecha: "2026-03-20", vehicleId: "v3", tipo: "seguro", monto: 180000, descripcion: "Seguro RC mensual grua" },
  { id: "g12", fecha: "2026-03-27", vehicleId: "v2", tipo: "combustible", monto: 110000, descripcion: "Copec Casablanca - 160 lts diesel" },
];
export const defaultServices: ServiceRequest[] = [
  { id: "s1", codigo: "SRV-001", clienteId: "c1", driverId: "d3", vehicleId: "v3", tipo: "izaje", descripcion: "Izaje de estructura metalica en obra", fecha: "2026-03-27", direccion: "Av. Matta 520, Santiago", estado: "en_curso" },
  { id: "s2", codigo: "SRV-002", clienteId: "c3", driverId: "d3", vehicleId: "v3", tipo: "montaje", descripcion: "Montaje de transformador electrico", fecha: "2026-03-28", direccion: "Ruta 5 km 120, Rancagua", estado: "asignada" },
  { id: "s3", codigo: "SRV-003", clienteId: "c4", driverId: "", vehicleId: "", tipo: "descarga", descripcion: "Descarga de contenedor 40 pies", fecha: "2026-03-29", direccion: "Puerto San Antonio", estado: "nueva" },
  { id: "s4", codigo: "SRV-004", clienteId: "c5", driverId: "d3", vehicleId: "v3", tipo: "traslado", descripcion: "Traslado de generador industrial", fecha: "2026-03-25", direccion: "Parque Industrial Quilicura", estado: "completada" },
];
export const defaultInvoices: Invoice[] = [
  { id: "f1", numero: 1045, fecha: "2026-03-26", clienteId: "c3", monto: 680000, estado: "pagada" },
  { id: "f2", numero: 1046, fecha: "2026-03-26", clienteId: "c4", monto: 1200000, estado: "emitida" },
  { id: "f3", numero: 1047, fecha: "2026-03-25", clienteId: "c5", monto: 280000, estado: "pagada" },
  { id: "f4", numero: 1044, fecha: "2026-03-24", clienteId: "c2", monto: 350000, estado: "vencida" },
  { id: "f5", numero: 1043, fecha: "2026-03-24", clienteId: "c4", monto: 290000, estado: "pagada" },
];
export const docRecords: DocRecord[] = [
  { id: "dc1", vehicleId: "v1", tipo: "Permiso Circulacion", fechaVencimiento: "2027-03-31" },
  { id: "dc2", vehicleId: "v1", tipo: "SOAP", fechaVencimiento: "2027-03-31" },
  { id: "dc3", vehicleId: "v1", tipo: "Revision Tecnica", fechaVencimiento: "2026-04-11" },
  { id: "dc4", vehicleId: "v1", tipo: "Certificado Gases", fechaVencimiento: "2026-04-11" },
  { id: "dc5", vehicleId: "v2", tipo: "Permiso Circulacion", fechaVencimiento: "2027-03-31" },
  { id: "dc6", vehicleId: "v2", tipo: "SOAP", fechaVencimiento: "2026-03-15" },
  { id: "dc7", vehicleId: "v2", tipo: "Revision Tecnica", fechaVencimiento: "2026-08-20" },
  { id: "dc8", vehicleId: "v2", tipo: "Certificado Gases", fechaVencimiento: "2026-08-20" },
  { id: "dc9", vehicleId: "v3", tipo: "Permiso Circulacion", fechaVencimiento: "2027-03-31" },
  { id: "dc10", vehicleId: "v3", tipo: "SOAP", fechaVencimiento: "2027-03-31" },
  { id: "dc11", vehicleId: "v3", tipo: "Revision Tecnica", fechaVencimiento: "2026-06-15" },
  { id: "dc12", vehicleId: "v3", tipo: "Certificado Gases", fechaVencimiento: "2026-06-15" },
  { id: "dc13", vehicleId: "v4", tipo: "Permiso Circulacion", fechaVencimiento: "2027-03-31" },
  { id: "dc14", vehicleId: "v4", tipo: "SOAP", fechaVencimiento: "2027-03-31" },
  { id: "dc15", vehicleId: "v4", tipo: "Revision Tecnica", fechaVencimiento: "2026-05-01" },
  { id: "dc16", vehicleId: "v4", tipo: "Certificado Gases", fechaVencimiento: "2026-05-01" },
  { id: "dc17", vehicleId: "v5", tipo: "Permiso Circulacion", fechaVencimiento: "2027-03-31" },
  { id: "dc18", vehicleId: "v5", tipo: "SOAP", fechaVencimiento: "2027-03-31" },
  { id: "dc19", vehicleId: "v5", tipo: "Revision Tecnica", fechaVencimiento: "2026-12-01" },
  { id: "dc20", vehicleId: "v5", tipo: "Certificado Gases", fechaVencimiento: "2026-12-01" },
];
export const gpsPositions: GpsPosition[] = [
  { vehicleId: "v1", lat: -33.437, lng: -70.650, speed: 72, status: "movimiento", lastUpdate: "2026-03-27 15:30" },
  { vehicleId: "v2", lat: -33.048, lng: -71.612, speed: 0, status: "detenido", lastUpdate: "2026-03-27 15:28" },
  { vehicleId: "v3", lat: -33.459, lng: -70.655, speed: 15, status: "movimiento", lastUpdate: "2026-03-27 15:31" },
  { vehicleId: "v4", lat: -34.170, lng: -70.740, speed: 0, status: "sin_senal", lastUpdate: "2026-03-26 09:15" },
  { vehicleId: "v5", lat: -33.440, lng: -70.630, speed: 45, status: "movimiento", lastUpdate: "2026-03-27 15:29" },
];

export function formatCLP(n: number): string { return "$" + n.toLocaleString("es-CL"); }
export function getVehicle(id: string) { return vehicles.find(v => v.id === id); }
export function getDriver(id: string) { return drivers.find(d => d.id === id); }
export function getClient(id: string) { return clients.find(c => c.id === id); }
