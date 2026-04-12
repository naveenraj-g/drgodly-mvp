"use client";

import * as Sentry from "@sentry/nextjs";

type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

interface LogMeta {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
}

/**
 * Client-safe Sentry logger wrapper.
 * Automatically uses console logging in dev or when Sentry is disabled.
 */
export const clientLogger = {
  /**
   * Generic logging function for any level.
   */
  log: (level: LogLevel, message: string, meta?: LogMeta) => {
    if (process.env.NODE_ENV !== "production" || !Sentry.logger) {
      console[level === "fatal" ? "error" : level](
        `[${level.toUpperCase()}] ${message}`,
        meta ?? ""
      );
      return;
    }

    try {
      switch (level) {
        case "trace":
          Sentry.logger.trace(message, meta?.extra);
          break;
        case "debug":
          Sentry.logger.debug(message, meta?.extra);
          break;
        case "info":
          Sentry.logger.info(message, meta?.extra);
          break;
        case "warn":
          Sentry.logger.warn(message, meta?.extra);
          break;
        case "error":
          Sentry.logger.error(message, meta?.extra);
          break;
        case "fatal":
          Sentry.logger.fatal(message, meta?.extra);
          break;
        default:
          Sentry.logger.info(message, meta?.extra);
      }
    } catch (err) {
      console.error("Sentry clientLogger failed:", err);
    }
  },

  /**
   * Structured template-based logger using Sentry.logger.fmt
   * Example:
   * clientLogger.fmtError(clientLogger.fmt`Payment failed for order ${order.id}`, { userId })
   */
  fmt:
    Sentry.logger?.fmt ??
    ((strings: TemplateStringsArray, ...values: any[]) =>
      strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "")),

  trace: (msg: string, meta?: LogMeta) => clientLogger.log("trace", msg, meta),
  debug: (msg: string, meta?: LogMeta) => clientLogger.log("debug", msg, meta),
  info: (msg: string, meta?: LogMeta) => clientLogger.log("info", msg, meta),
  warn: (msg: string, meta?: LogMeta) => clientLogger.log("warn", msg, meta),
  error: (msg: string, meta?: LogMeta) => clientLogger.log("error", msg, meta),
  fatal: (msg: string, meta?: LogMeta) => clientLogger.log("fatal", msg, meta),
};
