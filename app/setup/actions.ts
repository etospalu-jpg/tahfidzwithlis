'use server';

import { auth } from '@/lib/auth/server';
import { sql } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function finishSetupAction(formData: FormData) {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect('/auth/sign-in');

  const exists = await sql`select id from user_profiles where auth_user_id = ${session.user.id} limit 1`;
  if (exists.length) redirect('/dashboard');

  const count = await sql`select count(*)::int as count from user_profiles`;
  if (Number(count[0]?.count || 0) > 0) redirect('/auth/sign-in');

  const fullName = String(formData.get('full_name') || session.user.name || 'Administrator').trim();
  const institution = String(formData.get('institution') || 'TahfidzWithLis').trim();

  await sql`update organizations set name=${institution}, updated_at=now() where id='11111111-1111-4111-8111-111111111111'`;
  await sql`
    insert into user_profiles (auth_user_id,organization_id,full_name,role)
    values (${session.user.id},'11111111-1111-4111-8111-111111111111',${fullName},'super_admin')
  `;

  redirect('/dashboard');
}
