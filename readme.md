# Notification Rate Limitation

This document provides an overview of the implemented rate limitation for the notification service. The goal is to restrict the number of email messages each user can receive based on the type of notification.

## Stack
This project uses NodeJS, Redis and Express

## Project Structure

### `/src/domain`

The domain folder contains the types, interfaces, and rules of the application. It includes:

- Allowed types of notifications
- Interface for creating a rate limit rule
- Existing rate limit rules in the project

### `/src/infra`

The infra folder contains files necessary for rate limitation to function, specifically:

- **RedisClient.ts**: Responsible for initializing the Redis client and logging any errors.

### `/src/services`

The services folder includes:

- **NotificationService.ts**: Handles receiving the request to send a notification, validating if the notification is allowed, and either permitting or denying its sending. The logic is as follows:

  1. Receives notification request from endpoint.
  2. Checks the user email and notification type.
  3. Verifies the rate limit rule for the specified notification type.
  4. Checks the Redis key for the user and notification type.
  5. Increments the Redis key by one.
  6. Validates the key against the rate limit rule.
  7. Returns `true` if the key is valid; `false` otherwise.

  This folder also contains the **EmailService** file, responsible for sending the emails. The service is called only when the notificationService returns true.

### `app.ts`

Located in the root of the file structure, **app.ts** manages the service calls and API responses. It performs the following checks:

1. Ensures all necessary parameters are sent by the requester. Returns a `400` status with a message if any parameter is missing.
2. Checks the rate limit using the `NotificationService.canSendNotification` method, which takes the user email and notification type as inputs. It returns a boolean indicating whether the notification can be sent.
3. If the boolean is `true`, it attempts to send the email. If successful, a `200` status code with a success message is returned. If unsuccessful, a `500` status code with an error message is returned and logged.
4. If the boolean is `false`, a `429` status code with a "Rate limit exceeded" message is returned.

## Summary

This rate limitation service ensures that users do not receive excessive notifications based on predefined rules, providing better control and management of email traffic.
