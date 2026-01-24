export interface Product {
  id: string;
  name: string;
  priceCents: number;
}

export interface LogisticsPreference {
  customerId: string;
  preferenceType: string;
  value: string;
}
