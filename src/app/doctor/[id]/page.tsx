import { permanentRedirect } from 'next/navigation';
import { fetchDoctor, isDoctorKey } from '@/library/api/server';
import { doctorPath } from '@/utils/doctorPath';

/**
 * Old profile URL (/doctor/<id>), kept so existing links and bookmarks still
 * work. Profiles now live at /doctors/<slug>.
 */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doctor = isDoctorKey(id) ? await fetchDoctor(id) : undefined;
  // Without the doctor's slug, /doctors/<id> still works and redirects on from there.
  permanentRedirect(doctor ? doctorPath(doctor.data) : `/doctors/${encodeURIComponent(id)}`);
}
