import type { Lead, LeadDraft } from "../leads";

export interface LeadRepository {
  create(draft: LeadDraft): Promise<Lead>;
  list(limit?: number): Promise<readonly Lead[]>;
}
