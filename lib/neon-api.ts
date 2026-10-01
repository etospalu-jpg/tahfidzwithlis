import { createClient } from '@neondatabase/neon-js';

const NEON_DATABASE_URL = 'https://ep-divine-fire-b52hjjer.c-7.us-east-2.aws.neon.tech/neondb';

const client = createClient(NEON_DATABASE_URL, {
  auth: { allowAnonymous: true },
});

export async function neonRpc<T = unknown>(
  fn: string,
  args: Record<string, unknown>
): Promise<T> {
  const { data, error } = await client.rpc(fn, args);
  if (error) throw new Error(error.message || `Neon RPC failed: ${fn}`);
  return data as T;
}

function normalizeJson<T>(raw: unknown): T {
  if (typeof raw === 'string') {
    return JSON.parse(raw) as T;
  }
  return raw as T;
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

export type ManageData = {
  teachers: any[];
  classes: any[];
  groups: any[];
  students: any[];
};

export type StudentDetailData = {
  student: any;
  sessions: any[];
  target: any;
  notes: any[];
};

export type StudentEditData = {
  student: any;
  classes: any[];
  groups: any[];
};

export async function getAdminProfile(token: string) {
  return normalizeJson<AdminProfile | null>(
    await neonRpc<unknown>('admin_profile', { p_token: token })
  );
}

export async function getDashboardData(token: string) {
  return normalizeJson<DashboardData>(
    await neonRpc<unknown>('dashboard_data', { p_token: token })
  );
}

export async function getStudentsList(token: string, term = '') {
  return normalizeJson<any[]>(
    await neonRpc<unknown>('students_list', { p_token: token, p_term: term })
  ) || [];
}

export async function getStudentDetail(token: string, studentId: string) {
  return normalizeJson<StudentDetailData | null>(
    await neonRpc<unknown>('student_detail', {
      p_token: token,
      p_student_id: studentId,
    })
  );
}

export type ReportsData = {
  summary: {
    students: number;
    sessions: number;
    avg_score: number | string;
    avg_target: number | string;
  };
  groups: any[];
  monthly: any[];
};

export async function getReportsData(token: string) {
  return normalizeJson<ReportsData>(
    await neonRpc<unknown>('reports_data', { p_token: token })
  );
}

export async function getSetoranFormData(token: string) {
  return normalizeJson<any[]>(
    await neonRpc<unknown>('setoran_form_data', { p_token: token })
  ) || [];
}

export async function getManageData(token: string) {
  return normalizeJson<ManageData>(
    await neonRpc<unknown>('manage_data', { p_token: token })
  );
}

export async function getStudentEditData(token: string, studentId: string) {
  return normalizeJson<StudentEditData | null>(
    await neonRpc<unknown>('student_edit_data', {
      p_token: token,
      p_student_id: studentId,
    })
  );
}

export async function adminMutate(
  token: string,
  action: string,
  payload: Record<string, unknown>
) {
  return normalizeJson<any>(
    await neonRpc<unknown>('admin_mutate', {
      p_token: token,
      p_action: action,
      p_payload: payload,
    })
  );
}


/**
 * Legacy compatibility only. Core application routes no longer use arbitrary SQL.
 * Kept temporarily so any stale module reference cannot break production builds.
 */
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
  const parsed = normalizeJson<any>(raw);
  if (Array.isArray(parsed)) return parsed;
  return parsed == null ? [] : [parsed];
}


export async function changeAdminPin(
  token: string,
  currentPin: string,
  newPin: string
) {
  return neonRpc<boolean>('change_admin_pin', {
    p_token: token,
    p_current_pin: currentPin,
    p_new_pin: newPin,
  });
}


export type AppPageBundle<T> = {
  profile: AdminProfile;
  data: T;
};

export async function getAppPage<T>(
  token: string,
  page: string,
  arg: string | null = null
) {
  return normalizeJson<AppPageBundle<T>>(
    await neonRpc<unknown>('app_page', {
      p_token: token,
      p_page: page,
      p_arg: arg,
    })
  );
}
