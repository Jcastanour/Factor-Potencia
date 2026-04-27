import type { MailMessage, Mailer } from "@domain/ports";
import { createLogger } from "@shared/logger";

const log = createLogger("ConsoleMailer");

export class ConsoleMailer implements Mailer {
  async send(message: MailMessage): Promise<{ id: string }> {
    const id = `console_${Date.now().toString(36)}`;
    const banner = "─".repeat(60);
    log.info(
      [
        "",
        banner,
        `📧 Email simulado (no enviado a un servidor real)`,
        `   To:      ${message.to}`,
        `   From:    ${message.from}`,
        `   Subject: ${message.subject}`,
        `   ID:      ${id}`,
        banner,
        message.text,
        banner,
      ].join("\n"),
    );
    return { id };
  }
}
