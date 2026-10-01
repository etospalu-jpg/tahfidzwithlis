import { createClient } from '@neondatabase/neon-js';

const NEON_DATABASE_URL = 'https://ep-divine-fire-b52hjjer.c-7.us-east-2.aws.neon.tech/neondb';

const client = createClient(NEON_DATABASE_URL, {
  auth: {
    allowAnonymous: true,
  },
});

export async function neonRpc<T = unknown>(
  fn: string,
  args: Record<string, unknown>
): Promise<T> {
  const { data, error } = await client.rpc(fn, args);
  if (error) {
    throw new Error(error.message || `Neon RPC failed: ${fn}`);
  }
  return data as T;
}

export async function loginWithPin(pin: string) {
  return neonRpc<string | null>('admin_login', { p_pin: pin });
}

export async function validateAdminToken(token: string) {
  return neonRpc<boolean>('admin_validate', { p_token: token });
}

export async function logoutAdminToken(token: string) {
  return neonRpc<boolean>('admin_logout', { p_token: token });
}

export async function adminQuery(
  token: string,
  query: string,
  params: unknown[]
) {
  return neonRpc<any[]>('admin_query', {
    p_token: token,
    p_sql: query,
    p_params: params,
  });
}
