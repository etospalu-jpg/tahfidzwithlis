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
  const raw = await neonRpc<unknown>('admin_query_text', {
    p_token: token,
    p_sql: query,
    p_params: params,
  });

  if (Array.isArray(raw)) return raw;

  if (typeof raw === 'string') {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : parsed == null ? [] : [parsed];
  }

  if (raw && typeof raw === 'object') {
    const value =
      (raw as any).admin_query_text ??
      (raw as any).result ??
      (raw as any).data;

    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : parsed == null ? [] : [parsed];
    }

    if (Array.isArray(value)) return value;
    return [raw];
  }

  return [];
}


export type AdminProfile = {
  organization_id: string;
  institution_name: string;
  full_name: string;
  role: 'admin';
};

export type DashboardData = {
  summary: {
    students: number;
    sessions_month: number;
    avg_score: number | string;
    need_attention: number;
  };
  focus: any[];
  recent: any[];
  groups: any[];
};

export async function getAdminProfile(token: string) {
  return neonRpc<AdminProfile | null>('admin_profile', { p_token: token });
}

export async function getDashboardData(token: string) {
  return neonRpc<DashboardData>('dashboard_data', { p_token: token });
}
