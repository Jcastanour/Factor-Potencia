export type EventSeverity = "info" | "warn" | "error";

export type EventType =
  | "stage-engaged"
  | "stage-disengaged"
  | "fp-out-of-band"
  | "self-test"
  | "boot"
  | "anomaly";

export interface DomainEvent {
  readonly id: string;
  readonly deviceId: string;
  readonly ts: string; // ISO-8601
  readonly type: EventType;
  readonly severity: EventSeverity;
  readonly message: string;
  readonly data?: Record<string, unknown>;
}

export type DomainEventDraft = Omit<DomainEvent, "id">;
