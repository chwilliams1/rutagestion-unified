"use client";
import { useState, useEffect, useCallback } from "react";
import { vehicles, drivers, clients, defaultTrips, defaultExpenses, defaultServices, defaultInvoices, defaultMaintenance, defaultRates, defaultReports } from "./data";
import type { Vehicle, Driver, Client, Trip, Expense, ServiceRequest, Invoice, Maintenance, Rate, ServiceReport } from "./data";

function load<T>(key: string, fb: T): T {
  if (typeof window === "undefined") return fb;
  try { const s = localStorage.getItem("rgu_" + key); return s ? JSON.parse(s) : fb; } catch { return fb; }
}
function save<T>(key: string, d: T) { if (typeof window !== "undefined") localStorage.setItem("rgu_" + key, JSON.stringify(d)); }

function useStore<T>(key: string, defaults: T) {
  const [data, setData] = useState<T>(defaults);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setData(load(key, defaults)); setLoaded(true); }, [key]);
  const update = useCallback((fn: (p: T) => T) => { setData(p => { const n = fn(p); save(key, n); return n; }); }, [key]);
  return { data, update, loaded };
}

export function useVehicles() { return useStore<Vehicle[]>("vehicles", vehicles); }
export function useDrivers() { return useStore<Driver[]>("drivers", drivers); }
export function useClients() { return useStore<Client[]>("clients", clients); }
export function useTrips() { return useStore<Trip[]>("trips", defaultTrips); }
export function useExpenses() { return useStore<Expense[]>("expenses", defaultExpenses); }
export function useServices() { return useStore<ServiceRequest[]>("services", defaultServices); }
export function useInvoices() { return useStore<Invoice[]>("invoices", defaultInvoices); }
export function useMaintenance() { return useStore<Maintenance[]>("maintenance", defaultMaintenance); }
export function useRates() { return useStore<Rate[]>("rates", defaultRates); }
export function useReports() { return useStore<ServiceReport[]>("reports", defaultReports); }
export function genId() { return Math.random().toString(36).substring(2, 9); }
