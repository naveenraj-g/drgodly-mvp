export interface IMonitoringService {
  startSpan<T>(
    options: { name: string; op?: string; attributes?: Record<string, any> },
    callback: () => T
  ): T;
  instrumentServerAction<T>(
    name: string,
    options: Record<string, any>,
    callback: () => T
  ): Promise<T>;
  report(error: any): string;
  setUser(user: { id?: string; email?: string; username?: string }): void;
  clearUser(): void;
}
