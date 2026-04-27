import { z } from "zod";

export const businessTypes = [
  "panaderia",
  "carniceria",
  "supermercado",
  "lavanderia",
  "taller-mecanico",
  "papeleria",
  "restaurante",
  "salon-belleza",
  "ferreteria",
  "otro",
] as const;

export const leadFormSchema = z.object({
  name: z.string().min(2, "Nombre muy corto").max(120),
  email: z.email("Email inválido"),
  phone: z
    .string()
    .max(40)
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : undefined)),
  businessType: z.enum(businessTypes),
  estimatedLoadKw: z
    .union([z.number(), z.string()])
    .optional()
    .transform((v) => {
      if (v === undefined || v === "") return undefined;
      const n = typeof v === "number" ? v : Number(v);
      return Number.isFinite(n) && n >= 0 ? n : undefined;
    }),
  city: z.string().min(2, "Ciudad requerida").max(80),
  message: z
    .string()
    .max(1000)
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : undefined)),
});

export type LeadFormValues = z.input<typeof leadFormSchema>;
export type LeadFormParsed = z.output<typeof leadFormSchema>;

export const businessTypeLabels: Record<(typeof businessTypes)[number], string> = {
  panaderia: "Panadería",
  carniceria: "Carnicería",
  supermercado: "Supermercado",
  lavanderia: "Lavandería",
  "taller-mecanico": "Taller mecánico",
  papeleria: "Papelería",
  restaurante: "Restaurante",
  "salon-belleza": "Salón de belleza",
  ferreteria: "Ferretería",
  otro: "Otro",
};
