/**
 * Validación tipada de variables de entorno.
 * Todo lector de env debe importar desde aquí — nunca process.env directo.
 */

import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  TELEMETRY_SOURCE: z
    .enum(["simulated", "in-memory", "hybrid", "postgres"])
    .default("hybrid"),

  MAILER: z.enum(["console", "resend"]).default("console"),

  DEMO_DEVICE_ID: z.string().min(1).default("demo-device"),
  DEMO_DEVICE_API_KEY: z.string().min(8).default("demo-key-change-me-please"),

  LEAD_NOTIFY_EMAIL: z.string().email().default("equipo@example.com"),
  LEAD_FROM_EMAIL: z.string().email().default("onboarding@resend.dev"),

  RESEND_API_KEY: z.string().optional(),
  DATABASE_URL: z.string().optional(),

  LEADS_JSONL_PATH: z.string().default("tmp/leads.jsonl"),
});

export type AppEnv = z.infer<typeof schema>;

let cached: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${issues}`);
  }
  cached = parsed.data;
  return cached;
}
