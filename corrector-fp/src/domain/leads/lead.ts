export type BusinessType =
  | "panaderia"
  | "carniceria"
  | "supermercado"
  | "lavanderia"
  | "taller-mecanico"
  | "papeleria"
  | "restaurante"
  | "salon-belleza"
  | "ferreteria"
  | "otro";

export interface Lead {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly businessType: BusinessType;
  readonly estimatedLoadKw?: number;
  readonly city: string;
  readonly message?: string;
  readonly createdAt: string; // ISO-8601
}

export type LeadDraft = Omit<Lead, "id" | "createdAt">;
