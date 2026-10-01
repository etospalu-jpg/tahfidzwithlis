'use server';

import { getAdminToken } from '@/lib/admin-session';
import { adminMutate } from '@/lib/neon-api';
import { getCurrentProfile } from '@/lib/current-user';
import { redirect } from 'next/navigation';

function score(formData: FormData, key: string) {
  const value = Number(formData.get(key));
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error('Nilai harus berada pada rentang 0–100.');
  }
  return Math.round(value);
}

export async function saveSetoranAction(formData: FormData) {
  await getCurrentProfile();
  const token = await getAdminToken();
  if (!token) throw new Error('Admin session is required');

  const studentId = String(formData.get('student_id') || '');
  const sessionType = String(formData.get('session_type') || 'new');
  const status = String(formData.get('status') || 'lancar');
  const sessionDate = String(formData.get('session_date') || '');
  const juz = Number(formData.get('juz_no') || 30);
  const surah = String(formData.get('surah_name') || '').trim();
  const startAyah = String(formData.get('start_ayah') || '').trim();
  const endAyah = String(formData.get('end_ayah') || '').trim();
  const pages = Number(formData.get('pages') || 0);
  const mistakes = Math.max(0, Number(formData.get('mistakes_count') || 0));
  const notes = String(formData.get('notes') || '').trim();
  const murajaahScoreRaw = String(formData.get('murajaah_score') || '').trim();

  const allowedTypes = ['new','murajaah','tasmi','exam'];
  const allowedStatus = ['belum_lancar','cukup','lancar','sangat_lancar','mutqin','perlu_murajaah'];

  if (!studentId) throw new Error('Siswa tidak ditemukan.');
  if (!allowedTypes.includes(sessionType)) throw new Error('Jenis setoran tidak valid.');
  if (!allowedStatus.includes(status)) throw new Error('Status hafalan tidak valid.');
  if (!sessionDate || !surah || juz < 1 || juz > 30) {
    throw new Error('Data setoran belum lengkap.');
  }

  await adminMutate(token, 'save_setoran', {
    student_id: studentId,
    session_date: sessionDate,
    session_type: sessionType,
    juz_no: juz,
    surah_name: surah,
    start_ayah: startAyah,
    end_ayah: endAyah,
    pages,
    fluency: score(formData,'fluency'),
    tajwid: score(formData,'tajwid'),
    makhraj: score(formData,'makhraj'),
    accuracy: score(formData,'accuracy'),
    murajaah_score: murajaahScoreRaw ? score(formData,'murajaah_score') : '',
    status,
    mistakes_count: mistakes,
    notes,
  });

  redirect(`/students/${studentId}?saved=1`);
}
