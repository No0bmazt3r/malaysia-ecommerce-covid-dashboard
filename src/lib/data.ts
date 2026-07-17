import Papa from "papaparse";
import { Order } from "./types";
let cachedData: Order[] | null = null;

export async function loadDataset(): Promise<Order[]> {
  if (cachedData) return cachedData;
  const res = await fetch("/data/malaysia_ecommerce_covid_clean.csv");
  const text = await res.text();
  return new Promise((resolve, reject) => {
    Papa.parse<Order>(text, {
      header: true, skipEmptyLines: true, dynamicTyping: true,
      complete: (results) => { cachedData = results.data; resolve(results.data); },
      error: (err: Error) => reject(err),
    });
  });
}
export function uniqueValues<T extends keyof Order>(data: Order[], field: T): Order[T][] {
  return Array.from(new Set(data.map((d) => d[field]))).sort() as Order[T][];
}
