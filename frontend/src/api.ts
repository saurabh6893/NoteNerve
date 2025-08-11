export async function getBackendHealth(): Promise<string> {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/health`);
  if (!res.ok) {
    throw new Error(`Backend error: ${res.status}`);
  }
  return res.text();
}
