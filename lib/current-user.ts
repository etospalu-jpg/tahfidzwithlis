import { sql } from '@/lib/db';
import { requireAdminSession } from '@/lib/admin-session';

export async function getCurrentProfile() {
  await requireAdminSession();

  const rows = await sql`
    select id as organization_id, name as institution_name
    from organizations
    order by created_at asc
    limit 1
  `;

  if (!rows.length) throw new Error('Organization is not configured');

  return {
    profile: {
      organization_id: rows[0].organization_id,
      institution_name: rows[0].institution_name,
      full_name: 'Administrator',
      role: 'admin',
    },
  };
}
