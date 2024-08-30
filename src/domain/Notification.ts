export type NotificationType = "news" | "marketing" | "status";

export interface RateLimitRule {
  type: NotificationType;
  limit: number;
  duration: number; // seconds
}

export const rateLimitRules: RateLimitRule[] = [
  { type: "status", limit: 2, duration: 60 },
  { type: "marketing", limit: 3, duration: 3600 },
  { type: "news", limit: 1, duration: 86400 },
];
