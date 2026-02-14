/**
 * Logger utility for consistent logging across the application
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogOptions {
  context?: string;
  data?: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private enabledLevels = new Set<LogLevel>(["info", "warn", "error"]);

  constructor() {
    if (this.isDevelopment) {
      this.enabledLevels.add("debug");
    }
  }

  /**
   * Log debug message (only in development)
   */
  debug(message: string, options?: LogOptions): void {
    this.log("debug", message, options);
  }

  /**
   * Log info message
   */
  info(message: string, options?: LogOptions): void {
    this.log("info", message, options);
  }

  /**
   * Log warning message
   */
  warn(message: string, options?: LogOptions): void {
    this.log("warn", message, options);
  }

  /**
   * Log error message
   */
  error(message: string, options?: LogOptions): void {
    this.log("error", message, options);
  }

  /**
   * Log error with Error object
   */
  errorWithStack(message: string, error: Error, options?: LogOptions): void {
    this.log("error", message, {
      ...options,
      data: {
        ...(typeof options?.data === "object" ? options.data : {}),
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
      },
    });
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, options?: LogOptions): void {
    if (!this.enabledLevels.has(level)) return;

    const prefix = options?.context ? `[${options.context}]` : "";
    const fullMessage = `${prefix} ${message}`;

    const logMethod = level === "debug" ? "log" : level;

    if (options?.data) {
      console[logMethod](fullMessage, options.data);
    } else {
      console[logMethod](fullMessage);
    }
  }

  /**
   * Group logs together
   */
  group(label: string, callback: () => void): void {
    if (!this.isDevelopment) return;

    console.group(label);
    callback();
    console.groupEnd();
  }

  /**
   * Time a function execution
   */
  time<T>(label: string, callback: () => T): T {
    if (!this.isDevelopment) return callback();

    console.time(label);
    const result = callback();
    console.timeEnd(label);
    return result;
  }

  /**
   * Create a scoped logger with context
   */
  createScoped(context: string): ScopedLogger {
    return new ScopedLogger(this, context);
  }
}

/**
 * Scoped logger with pre-set context
 */
class ScopedLogger {
  constructor(
    private logger: Logger,
    private context: string,
  ) {}

  debug(message: string, data?: unknown): void {
    this.logger.debug(message, { context: this.context, data });
  }

  info(message: string, data?: unknown): void {
    this.logger.info(message, { context: this.context, data });
  }

  warn(message: string, data?: unknown): void {
    this.logger.warn(message, { context: this.context, data });
  }

  error(message: string, data?: unknown): void {
    this.logger.error(message, { context: this.context, data });
  }

  errorWithStack(message: string, error: Error, data?: unknown): void {
    this.logger.errorWithStack(message, error, { context: this.context, data });
  }
}

/**
 * Global logger instance
 */
export const logger = new Logger();

/**
 * Create a scoped logger for a specific module
 */
export function createLogger(context: string): ScopedLogger {
  return logger.createScoped(context);
}
