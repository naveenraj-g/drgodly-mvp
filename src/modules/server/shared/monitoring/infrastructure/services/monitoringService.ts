import * as Sentry from "@sentry/nextjs";

import { IMonitoringService } from "../../application/services/monitoringService.interface";

export class MonitoringService implements IMonitoringService {
  startSpan<T>(
    options: { name: string; op?: string; attributes?: Record<string, any> },
    callback: () => T
  ): T {
    return Sentry.startSpan(options, callback);
  }

  instrumentServerAction<T>(
    name: string,
    options: Record<string, any>,
    callback: () => T
  ): Promise<T> {
    return Sentry.withServerActionInstrumentation(name, options, callback);
  }

  report(error: any): string {
    return Sentry.captureException(error);
  }

  setUser(user: { id?: string; email?: string; username?: string }): void {
    Sentry.setUser(user);
  }

  clearUser(): void {
    Sentry.setUser(null);
  }
}
