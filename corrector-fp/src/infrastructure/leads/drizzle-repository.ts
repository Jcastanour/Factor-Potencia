/**
 * Stub. Activar con `pnpm add drizzle-orm postgres` + schema en src/infrastructure/db/.
 */

import type { Lead, LeadDraft } from "@domain/leads";
import type { LeadRepository } from "@domain/ports";

export class DrizzleLeadRepository implements LeadRepository {
  async create(_draft: LeadDraft): Promise<Lead> {
    throw new Error("DrizzleLeadRepository not wired in v1");
  }
  async list(_limit?: number): Promise<readonly Lead[]> {
    throw new Error("DrizzleLeadRepository not wired in v1");
  }
}
