import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getResourceCategories, getResources } from '@/lib/supabase/queries';
import { ResourceDirectory } from '@/components/resources/ResourceDirectory';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Resource directory · Carteret County Assist Hub',
  description:
    'Every service in the Carteret County and Surrounding Area Resource Aide, grouped by the kind of help you need. Bilingual: English and Spanish.',
};

export default async function ResourcesPage() {
  const supabase = await createClient();
  const [categories, resources] = await Promise.all([
    getResourceCategories(supabase),
    getResources(supabase),
  ]);

  return <ResourceDirectory categories={categories} resources={resources} />;
}
