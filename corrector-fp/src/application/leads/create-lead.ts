import type { LeadDraft } from "@domain/leads";
import type { LeadRepository, Mailer } from "@domain/ports";

export interface CreateLeadDeps {
  readonly leads: LeadRepository;
  readonly mailer: Mailer;
  readonly notifyTo: string;
  readonly notifyFrom: string;
}

export function makeCreateLead({ leads, mailer, notifyTo, notifyFrom }: CreateLeadDeps) {
  return async function createLead(draft: LeadDraft) {
    const lead = await leads.create(draft);

    await mailer.send({
      to: notifyTo,
      from: notifyFrom,
      subject: `Nuevo lead: ${lead.name} (${lead.businessType})`,
      text: [
        `Nuevo lead recibido en /cotizar`,
        ``,
        `Nombre: ${lead.name}`,
        `Email: ${lead.email}`,
        `Teléfono: ${lead.phone ?? "—"}`,
        `Negocio: ${lead.businessType}`,
        `Carga estimada: ${lead.estimatedLoadKw ?? "—"} kW`,
        `Ciudad: ${lead.city}`,
        `Mensaje: ${lead.message ?? "—"}`,
        ``,
        `ID: ${lead.id}`,
        `Recibido: ${lead.createdAt}`,
      ].join("\n"),
    });

    return lead;
  };
}
