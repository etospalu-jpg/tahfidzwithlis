'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@/lib/db';
import { getCurrentProfile } from '@/lib/current-user';

function clean(value: FormDataEntryValue | null) {
  return String(value || '').trim();
}

function nullable(value: FormDataEntryValue | null) {
  const v = clean(value);
  return v || null;
}

export async function createTeacherAction(formData: FormData) {
  const { profile } = await getCurrentProfile();
  const fullName = clean(formData.get('full_name'));
  if (!fullName) throw new Error('Nama guru wajib diisi.');

  await sql`
    insert into teachers (
      organization_id, employee_code, full_name, title, specialization, phone
    ) values (
      ${profile.organization_id},
      ${nullable(formData.get('employee_code'))},
      ${fullName},
      ${nullable(formData.get('title'))},
      ${nullable(formData.get('specialization'))},
      ${nullable(formData.get('phone'))}
    )
  `;

  revalidatePath('/manage');
}

export async function createClassAction(formData: FormData) {
  const { profile } = await getCurrentProfile();
  const name = clean(formData.get('name'));
  if (!name) throw new Error('Nama kelas wajib diisi.');

  const period = await sql`
    select id from academic_periods
    where organization_id=${profile.organization_id} and is_active=true
    order by start_date desc
    limit 1
  `;

  await sql`
    insert into classes (
      organization_id, period_id, name, grade, homeroom_name
    ) values (
      ${profile.organization_id},
      ${period[0]?.id || null},
      ${name},
      ${nullable(formData.get('grade'))},
      ${nullable(formData.get('homeroom_name'))}
    )
  `;

  revalidatePath('/manage');
}

export async function createGroupAction(formData: FormData) {
  const { profile } = await getCurrentProfile();
  const name = clean(formData.get('name'));
  if (!name) throw new Error('Nama halaqah wajib diisi.');

  const period = await sql`
    select id from academic_periods
    where organization_id=${profile.organization_id} and is_active=true
    order by start_date desc
    limit 1
  `;

  await sql`
    insert into tahfidz_groups (
      organization_id, period_id, name, teacher_id, target_label
    ) values (
      ${profile.organization_id},
      ${period[0]?.id || null},
      ${name},
      ${nullable(formData.get('teacher_id'))},
      ${nullable(formData.get('target_label'))}
    )
  `;

  revalidatePath('/manage');
}

export async function createStudentAction(formData: FormData) {
  const { profile } = await getCurrentProfile();
  const fullName = clean(formData.get('full_name'));
  if (!fullName) throw new Error('Nama siswa wajib diisi.');

  const targetJuz = Math.min(30, Math.max(1, Number(formData.get('target_juz') || 1)));
  const currentJuz = Math.min(30, Math.max(1, Number(formData.get('current_juz') || 30)));
  const targetPages = Math.max(0, Number(formData.get('target_pages') || 20));

  const inserted = await sql`
    insert into students (
      organization_id, student_no, full_name, gender, class_id, tahfidz_group_id,
      target_juz, current_juz, target_pages,
      parent_name, parent_phone, parent_email, status
    ) values (
      ${profile.organization_id},
      ${nullable(formData.get('student_no'))},
      ${fullName},
      ${nullable(formData.get('gender'))},
      ${nullable(formData.get('class_id'))},
      ${nullable(formData.get('tahfidz_group_id'))},
      ${targetJuz},
      ${currentJuz},
      ${targetPages},
      ${nullable(formData.get('parent_name'))},
      ${nullable(formData.get('parent_phone'))},
      ${nullable(formData.get('parent_email'))},
      'active'
    )
    returning id
  `;

  const period = await sql`
    select id from academic_periods
    where organization_id=${profile.organization_id} and is_active=true
    order by start_date desc
    limit 1
  `;

  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth()+1, 0));
  const startDate = start.toISOString().slice(0,10);
  const endDate = end.toISOString().slice(0,10);

  await sql`
    insert into memorization_targets (
      student_id, period_id, target_type, start_date, end_date, juz_no, surah_name, target_pages, status
    ) values (
      ${inserted[0].id},
      ${period[0]?.id || null},
      'monthly',
      ${startDate},
      ${endDate},
      ${currentJuz},
      'Target Bulanan',
      ${targetPages},
      'active'
    )
  `;

  revalidatePath('/manage');
  revalidatePath('/students');
}

export async function updateStudentAction(formData: FormData) {
  const { profile } = await getCurrentProfile();
  const id = clean(formData.get('id'));
  if (!id) throw new Error('ID siswa tidak tersedia.');

  const fullName = clean(formData.get('full_name'));
  if (!fullName) throw new Error('Nama siswa wajib diisi.');

  await sql`
    update students set
      student_no=${nullable(formData.get('student_no'))},
      full_name=${fullName},
      gender=${nullable(formData.get('gender'))},
      class_id=${nullable(formData.get('class_id'))},
      tahfidz_group_id=${nullable(formData.get('tahfidz_group_id'))},
      target_juz=${Math.min(30,Math.max(1,Number(formData.get('target_juz')||1)))},
      current_juz=${Math.min(30,Math.max(1,Number(formData.get('current_juz')||30)))},
      target_pages=${Math.max(0,Number(formData.get('target_pages')||0))},
      parent_name=${nullable(formData.get('parent_name'))},
      parent_phone=${nullable(formData.get('parent_phone'))},
      parent_email=${nullable(formData.get('parent_email'))},
      status=${clean(formData.get('status')) || 'active'},
      updated_at=now()
    where id=${id} and organization_id=${profile.organization_id}
  `;

  revalidatePath('/manage');
  revalidatePath('/students');
  revalidatePath(`/students/${id}`);
  redirect('/manage?updated=1');
}
