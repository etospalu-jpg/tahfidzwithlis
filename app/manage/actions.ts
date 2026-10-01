'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/current-user';
import { getAdminToken } from '@/lib/admin-session';
import { adminMutate } from '@/lib/neon-api';

function clean(value: FormDataEntryValue | null) {
  return String(value || '').trim();
}

async function tokenOrThrow() {
  await getCurrentProfile();
  const token = await getAdminToken();
  if (!token) throw new Error('Admin session is required');
  return token;
}

export async function createTeacherAction(formData: FormData) {
  const token = await tokenOrThrow();
  const fullName = clean(formData.get('full_name'));
  if (!fullName) throw new Error('Nama guru wajib diisi.');

  await adminMutate(token, 'create_teacher', {
    full_name: fullName,
    employee_code: clean(formData.get('employee_code')),
    title: clean(formData.get('title')),
    specialization: clean(formData.get('specialization')),
    phone: clean(formData.get('phone')),
  });

  revalidatePath('/manage');
}

export async function createClassAction(formData: FormData) {
  const token = await tokenOrThrow();
  const name = clean(formData.get('name'));
  if (!name) throw new Error('Nama kelas wajib diisi.');

  await adminMutate(token, 'create_class', {
    name,
    grade: clean(formData.get('grade')),
    homeroom_name: clean(formData.get('homeroom_name')),
  });

  revalidatePath('/manage');
}

export async function createGroupAction(formData: FormData) {
  const token = await tokenOrThrow();
  const name = clean(formData.get('name'));
  if (!name) throw new Error('Nama halaqah wajib diisi.');

  await adminMutate(token, 'create_group', {
    name,
    teacher_id: clean(formData.get('teacher_id')),
    target_label: clean(formData.get('target_label')),
  });

  revalidatePath('/manage');
}

export async function createStudentAction(formData: FormData) {
  const token = await tokenOrThrow();
  const fullName = clean(formData.get('full_name'));
  if (!fullName) throw new Error('Nama siswa wajib diisi.');

  await adminMutate(token, 'create_student', {
    full_name: fullName,
    student_no: clean(formData.get('student_no')),
    gender: clean(formData.get('gender')),
    class_id: clean(formData.get('class_id')),
    tahfidz_group_id: clean(formData.get('tahfidz_group_id')),
    target_juz: Math.min(30, Math.max(1, Number(formData.get('target_juz') || 1))),
    current_juz: Math.min(30, Math.max(1, Number(formData.get('current_juz') || 30))),
    target_pages: Math.max(0, Number(formData.get('target_pages') || 20)),
    parent_name: clean(formData.get('parent_name')),
    parent_phone: clean(formData.get('parent_phone')),
    parent_email: clean(formData.get('parent_email')),
  });

  revalidatePath('/manage');
  revalidatePath('/students');
}

export async function updateStudentAction(formData: FormData) {
  const token = await tokenOrThrow();
  const id = clean(formData.get('id'));
  const fullName = clean(formData.get('full_name'));

  if (!id) throw new Error('ID siswa tidak tersedia.');
  if (!fullName) throw new Error('Nama siswa wajib diisi.');

  await adminMutate(token, 'update_student', {
    id,
    full_name: fullName,
    student_no: clean(formData.get('student_no')),
    gender: clean(formData.get('gender')),
    class_id: clean(formData.get('class_id')),
    tahfidz_group_id: clean(formData.get('tahfidz_group_id')),
    target_juz: Math.min(30, Math.max(1, Number(formData.get('target_juz') || 1))),
    current_juz: Math.min(30, Math.max(1, Number(formData.get('current_juz') || 30))),
    target_pages: Math.max(0, Number(formData.get('target_pages') || 0)),
    parent_name: clean(formData.get('parent_name')),
    parent_phone: clean(formData.get('parent_phone')),
    parent_email: clean(formData.get('parent_email')),
    status: clean(formData.get('status')) || 'active',
  });

  revalidatePath('/manage');
  revalidatePath('/students');
  revalidatePath(`/students/${id}`);
  redirect('/manage?updated=1');
}
