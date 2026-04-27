export interface Device {
  readonly id: string;
  readonly name: string;
  readonly apiKeyHash: string; // bcrypt hash
  readonly location?: string;
  readonly ownerEmail?: string;
  readonly createdAt: string; // ISO-8601
}
