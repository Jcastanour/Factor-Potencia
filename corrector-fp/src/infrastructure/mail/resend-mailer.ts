/**
 * Stub. Activar con `pnpm add resend` + RESEND_API_KEY.
 */

import type { MailMessage, Mailer } from "@domain/ports";

export class ResendMailer implements Mailer {
  async send(_message: MailMessage): Promise<{ id: string }> {
    throw new Error("ResendMailer not wired in v1 — set MAILER=console");
  }
}
