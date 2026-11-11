interface Window {
  __lovableEvents?: {
    track?: (event: string, properties?: Record<string, unknown>) => string | null;
  };
}
