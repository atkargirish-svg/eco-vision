export type OperationalRecord = {
  id: string;
  date: string; // YYYY-MM-DD
  electricity_kwh: number;
  fuel_type: 'diesel' | 'coal' | 'natural_gas' | 'propane' | 'none';
  fuel_amount: number;
  production_units: number;
  production_hours: number;
  thermal_image_description?: string;
  acoustic_analysis_summary?: string;
};

export const EMISSION_FACTORS = {
  electricityKgCo2PerKWh: 0.82,
  dieselKgCo2PerLiter: 2.68,
  coalKgCo2PerKg: 2.42,
  naturalGasKgCo2PerM3: 2.0,
  propaneKgCo2PerLiter: 1.53,
};
