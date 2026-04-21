import { createClient } from '@/lib/supabase/server';
import { getAllVolunteerNeeds, getSectors } from '@/lib/supabase/queries';
import { VolunteerBrowse } from '@/components/volunteer/VolunteerBrowse';

export const revalidate = 300;

export default async function VolunteerPage() {
  const supabase = await createClient();
  const [needs, sectors] = await Promise.all([
    getAllVolunteerNeeds(supabase),
    getSectors(supabase),
  ]);
  return <VolunteerBrowse needs={needs} sectors={sectors} />;
}
