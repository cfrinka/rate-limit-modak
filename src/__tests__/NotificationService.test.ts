import { NotificationService } from "../services/NotificationService";
import redisMock from "redis-mock";

const redisClientMock = redisMock.createClient();
jest.mock("../infra/RedisClient");

describe("NotificationService", () => {
  beforeEach(() => {
    new Promise(() => redisClientMock.flushDb);
  });

  it("should send notification", async () => {
    const email = "user@example.com";
    const type = "news";

    const apiReturn = await NotificationService.canSendNotification(
      email,
      type
    );

    expect(apiReturn).toBe(true);
  });

  it("should not send notification", async () => {
    const email = "user@example.com";
    const type = "news";
    const key = `notification:${email}:${type}`;

    redisClientMock.set(key, 1, { EX: 100 });

    const apiReturn = await NotificationService.canSendNotification(
      email,
      type
    );

    expect(apiReturn).toBe(false);
  });
});
