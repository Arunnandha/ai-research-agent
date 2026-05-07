import path from "node:path";

// Vercel's serverless filesystem is read-only except /tmp
const DATA_ROOT = process.env.VERCEL ? "/tmp" : process.cwd();

export const DATA_DIR = path.join(DATA_ROOT, "data");
export const REPORTS_DIR = path.join(DATA_ROOT, "data", "reports");
