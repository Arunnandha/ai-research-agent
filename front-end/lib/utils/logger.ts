type LogLevel = "debug" | "info" | "warn" | "error";

const formatMessage = (level: LogLevel, message: string): string => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};

export const log = (level: LogLevel, message: string): void => {
  const entry = formatMessage(level, message);
  console.log(entry);
};
