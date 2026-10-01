import { auth } from '@/lib/auth/server';
import { sql } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function getCurrentProfile() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect('/auth/sign-in');

  const rows = await sql`
    select up.*, o.name as institution_name
    from user_profiles up
    join organizations o on o.id=up.organization_id
    where up.auth_user_id=\${session.user.id}
    limit 1
  `;

  if (!rows.length) redirect('/setup');
  return { session, profile: rows[0] };
}
