'use server';

import { auth } from '@/lib/auth/server';
import { sql } from '@/lib/db';
import { redirect } from 'next/navigation';

function score(formData: FormData, key: string) {
  const value = Number(formData.get(key));
  if (!Number.isFinite(value) || value < 0 || value > 100) throw new Error('Nilai harus berada pada rentang 0–100.');
  return Math.round(value);
}

export async function saveSetoranAction(formData: FormData) {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect('/auth/sign-in');

  const profiles = await sql`select * from user_profiles where auth_user_id=\${session.user.id} and is_active=true limit 1`;
  if (!profiles.length) redirect('/setup');
  const profile:any = profiles[0];

  const studentId = String(formData.get('student_id') || '');
  const student = await sql`
    select s.id,s.organization_id,g.teacher_id
    from students s
    left join tahfidz_groups g on g.id=s.tahfidz_group_id
    where s.id=\${studentId} and s.organization_id=\${profile.organization_id} and s.status='active'
    limit 1`;
  if (!student.length) throw new Error('Siswa tidak ditemukan.');

  const sessionType = String(formData.get('session_type') || 'new');
  const allowedTypes = ['new','murajaah','tasmi','exam'];
  if (!allowedTypes.includes(sessionType)) throw new Error('Jenis setoran tidak valid.');

  const status = String(formData.get('status') || 'lancar');
  const allowedStatus = ['belum_lancar','cukup','lancar','sangat_lancar','mutqin','perlu_murajaah'];
  if (!allowedStatus.includes(status)) throw new Error('Status hafalan tidak valid.');

  const sessionDate = String(formData.get('session_date') || '');
  const juz = Number(formData.get('juz_no') || 30);
  const surah = String(formData.get('surah_name') || '').trim();
  const startAyah = Number(formData.get('start_ayah') || 0) || null;
  const endAyah = Number(formData.get('end_ayah') || 0) || null;
  const pages = Number(formData.get('pages') || 0);
  const fluency = score(formData,'fluency');
  const tajwid = score(formData,'tajwid');
  const makhraj = score(formData,'makhraj');
  const accuracy = score(formData,'accuracy');
  const murajaahScoreRaw = String(formData.get('murajaah_score') || '').trim();
  const murajaahScore = murajaahScoreRaw ? score(formData,'murajaah_score') : null;
  const mistakes = Math.max(0, Number(formData.get('mistakes_count') || 0));
  const notes = String(formData.get('notes') || '').trim();

  if (!sessionDate || !surah || juz < 1 || juz > 30) throw new Error('Data setoran belum lengkap.');

  await sql`
    insert into memorization_sessions (
      organization_id,student_id,teacher_id,session_date,session_type,juz_no,surah_name,start_ayah,end_ayah,pages,
      fluency,tajwid,makhraj,accuracy,murajaah_score,status,mistakes_count,notes,created_by_auth_user_id
    ) values (
      \${profile.organization_id},\${studentId},\${student[0].teacher_id || null},\${sessionDate},\${sessionType},\${juz},\${surah},
      \${startAyah},\${endAyah},\${pages},\${fluency},\${tajwid},\${makhraj},\${accuracy},\${murajaahScore},
      \${status},\${mistakes},\${notes || null},\${session.user.id}
    )`;

  await sql`
    insert into audit_events (organization_id,actor_auth_user_id,action,entity_type,entity_id,metadata)
    values (\${profile.organization_id},\${session.user.id},'create_memorization_session','student',\${studentId},jsonb_build_object('surah',\${surah},'type',\${sessionType}))`;

  redirect(`/students/\${studentId}?saved=1`);
}
