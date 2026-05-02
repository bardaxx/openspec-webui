export const DEFAULT_HOST = '127.0.0.1';

export function resolveHost(host?: string): string {
  return host ?? DEFAULT_HOST;
}

export function normalizeBrowserUrl(serverUrl: string): string {
  return serverUrl.replace('//0.0.0.0', '//localhost');
}
