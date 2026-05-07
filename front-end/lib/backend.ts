const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost:3001";

export const triggerPipelineRun = async (): Promise<{ success: boolean; error?: string }> => {
  const res = await fetch(`${BACKEND_API_URL}/api/run`, { method: "POST" });
  return res.json();
};

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
};
