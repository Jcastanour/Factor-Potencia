import { promises as fs } from "node:fs";
import path from "node:path";

import type { Lead, LeadDraft } from "@domain/leads";
import type { LeadRepository } from "@domain/ports";
import { createLogger } from "@shared/logger";

const log = createLogger("InMemoryLeadRepository");

let counter = 0;
const nextId = () =>
  `lead_${Date.now().toString(36)}_${(counter++).toString(36)}`;

interface Options {
  readonly jsonlPath?: string;
}

/**
 * Repo in-memory con append opcional a leads.jsonl para no perder datos en reload.
 * No relee al iniciar (lista vacía); el JSONL es para inspección humana / migración.
 */
export class InMemoryLeadRepository implements LeadRepository {
  private readonly leads: Lead[] = [];
  private readonly jsonlPath?: string;

  constructor(opts: Options = {}) {
    this.jsonlPath = opts.jsonlPath;
  }

  async create(draft: LeadDraft): Promise<Lead> {
    const lead: Lead = {
      id: nextId(),
      createdAt: new Date().toISOString(),
      ...draft,
    };
    this.leads.unshift(lead);
    if (this.jsonlPath) {
      try {
        const abs = path.resolve(this.jsonlPath);
        await fs.mkdir(path.dirname(abs), { recursive: true });
        await fs.appendFile(abs, JSON.stringify(lead) + "\n", "utf8");
      } catch (err) {
        log.warn("could not append lead to jsonl", { err: String(err) });
      }
    }
    return lead;
  }

  async list(limit?: number): Promise<readonly Lead[]> {
    return limit ? this.leads.slice(0, limit) : this.leads.slice();
  }
}
