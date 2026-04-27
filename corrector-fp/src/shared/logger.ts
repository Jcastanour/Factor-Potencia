type Level = "debug" | "info" | "warn" | "error";

function emit(level: Level, scope: string, message: string, data?: unknown) {
  const ts = new Date().toISOString();
  const head = `[${ts}] ${level.toUpperCase()} ${scope}:`;
  if (data !== undefined) {
    console[level === "debug" ? "log" : level](head, message, data);
  } else {
    console[level === "debug" ? "log" : level](head, message);
  }
}

export function createLogger(scope: string) {
  return {
    debug: (msg: string, data?: unknown) => emit("debug", scope, msg, data),
    info: (msg: string, data?: unknown) => emit("info", scope, msg, data),
    warn: (msg: string, data?: unknown) => emit("warn", scope, msg, data),
    error: (msg: string, data?: unknown) => emit("error", scope, msg, data),
  };
}

export type Logger = ReturnType<typeof createLogger>;
