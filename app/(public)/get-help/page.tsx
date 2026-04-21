import { createClient } from '@/lib/supabase/server';
import { getSectors } from '@/lib/supabase/queries';
import { GetHelpClient } from '@/components/get-help/GetHelpClient';

export const revalidate = 300;

export default async function GetHelpPage() {
  const supabase = await createClient();
  const sectors = await getSectors(supabase);

  const { data: orgsData } = await supabase
    .from('organizations')
    .select('id, name, town, sector_slug, spanish_available, phone, website, additional_sector_slugs')
    .eq('is_active', true)
    .order('name');

  const orgs = (orgsData ?? []) as Array<{
    id: string;
    name: string;
    town: string;
    sector_slug: string | null;
    spanish_available: boolean;
    phone: string;
    website: string | null;
    additional_sector_slugs: string[];
  }>;

  return <GetHelpClient sectors={sectors} organizations={orgs} />;
}
