import { rateLimitRules, NotificationType } from "../domain/Notification";
import redisClient from "../infra/RedisClient";

export class NotificationService {
  private static getRateLimitRule(type: NotificationType) {
    return rateLimitRules.find((rule) => rule.type === type);
  }

  public static async canSendNotification(
    userEmail: string,
    type: NotificationType
  ): Promise<boolean> {
    const rule = this.getRateLimitRule(type);

    if (!rule) {
      console.log(`No rate limit rule found for type: ${type}`);
      return false;
    }

    const key = `notification:${userEmail}:${type}`;
    const notificationsAlreadySent = await redisClient.get(key);

    const parsedNotificationsAlreadySent = notificationsAlreadySent
      ? parseInt(notificationsAlreadySent, 10)
      : 0;

    if (parsedNotificationsAlreadySent >= rule.limit) {
      console.log(
        `Rate limit exceeded for ${type} notifications for user ${userEmail}.`
      );
      return false;
    }

    if (parsedNotificationsAlreadySent === 0) {
      await redisClient.set(key, 1, { EX: rule.duration });
    } else {
      await redisClient.incr(key);
    }
    return true;
  }
}
