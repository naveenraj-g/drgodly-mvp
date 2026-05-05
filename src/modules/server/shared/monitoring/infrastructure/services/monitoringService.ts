import { IMonitoringService } from "../../application/services/monitoringService.interface";

export class MonitoringService implements IMonitoringService {
  startSpan<T>(
    _options: { name: string; op?: string; attributes?: Record<string, any> },
    callback: () => T
  ): T {
    return callback();
  }

  instrumentServerAction<T>(
    _name: string,
    _options: Record<string, any>,
    callback: () => T
  ): Promise<T> {
    return Promise.resolve(callback());
  }

  report(error: any): string {
    console.error(error);
    return "";
  }

  setUser(_user: { id?: string; email?: string; username?: string }): void {}

  clearUser(): void {}
}
