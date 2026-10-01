import { getAdminToken } from '@/lib/admin-session';
import { adminQuery } from '@/lib/neon-api';

export async function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<any[]> {
  const token = await getAdminToken();
  if (!token) throw new Error('Admin session is required');

  let query = strings[0] || '';
  for (let i = 0; i < values.length; i++) {
    query += `$${i + 1}${strings[i + 1] || ''}`;
  }

  const result = await adminQuery(token, query, values);
  return Array.isArray(result) ? result : [];
}
