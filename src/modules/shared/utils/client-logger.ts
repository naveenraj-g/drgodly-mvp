"use client";

type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

interface LogMeta {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
}

export const clientLogger = {
  log: (level: LogLevel, message: string, meta?: LogMeta) => {
    console[level === "fatal" || level === "trace" ? "error" : level](
      `[${level.toUpperCase()}] ${message}`,
      meta ?? ""
    );
  },

  fmt: (strings: TemplateStringsArray, ...values: any[]) =>
    strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), ""),

  trace: (msg: string, meta?: LogMeta) => clientLogger.log("trace", msg, meta),
  debug: (msg: string, meta?: LogMeta) => clientLogger.log("debug", msg, meta),
  info: (msg: string, meta?: LogMeta) => clientLogger.log("info", msg, meta),
  warn: (msg: string, meta?: LogMeta) => clientLogger.log("warn", msg, meta),
  error: (msg: string, meta?: LogMeta) => clientLogger.log("error", msg, meta),
  fatal: (msg: string, meta?: LogMeta) => clientLogger.log("fatal", msg, meta),
};
