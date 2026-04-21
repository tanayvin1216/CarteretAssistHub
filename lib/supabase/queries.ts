import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Sector, SubcommitteeLead, Organization, VolunteerNeed, SectorActivity } from '@/types/database';

type Client = SupabaseClient<Database>;

export async function getSectors(supabase: Client): Promise<Sector[]> {
  const { data, error } = await supabase
    .from('sectors')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('getSectors error', error);
    return [];
  }
  return data ?? [];
}

export async function getSectorBySlug(supabase: Client, slug: string): Promise<Sector | null> {
  const { data, error } = await supabase
    .from('sectors')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) {
    console.error('getSectorBySlug error', error);
    return null;
  }
  return data;
}

export async function getSubcommitteeLeads(supabase: Client, sectorId: string): Promise<SubcommitteeLead[]> {
  const { data, error } = await supabase
    .from('subcommittee_leads')
    .select('*')
    .eq('sector_id', sectorId)
    .order('display_order', { ascending: true });
  if (error) {
    console.error('getSubcommitteeLeads error', error);
    return [];
  }
  return data ?? [];
}

export async function getSectorActivities(supabase: Client, sectorId: string): Promise<SectorActivity[]> {
  const { data, error } = await supabase
    .from('sector_activities')
    .select('*')
    .eq('sector_id', sectorId)
    .eq('is_published', true)
    .order('scheduled_for', { ascending: true, nullsFirst: false });
  if (error) {
    console.error('getSectorActivities error', error);
    return [];
  }
  return data ?? [];
}

export async function getOrganizationsBySector(supabase: Client, sectorSlug: string): Promise<Organization[]> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .or(`sector_slug.eq.${sectorSlug},additional_sector_slugs.cs.{${sectorSlug}}`)
    .eq('is_active', true)
    .order('name');
  if (error) {
    console.error('getOrganizationsBySector error', error);
    return [];
  }
  return data ?? [];
}

export async function getAllOrganizations(supabase: Client): Promise<Organization[]> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('is_active', true)
    .order('name');
  if (error) {
    console.error('getAllOrganizations error', error);
    return [];
  }
  return data ?? [];
}

export async function getOrganization(supabase: Client, id: string): Promise<Organization | null> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle();
  if (error) {
    console.error('getOrganization error', error);
    return null;
  }
  return data;
}

export async function getVolunteerNeedsBySector(supabase: Client, sectorSlug: string): Promise<VolunteerNeed[]> {
  const { data, error } = await supabase
    .from('volunteer_needs')
    .select('*')
    .eq('sector_slug', sectorSlug)
    .eq('is_active', true)
    .order('posted_date', { ascending: false });
  if (error) {
    console.error('getVolunteerNeedsBySector error', error);
    return [];
  }
  return data ?? [];
}

export async function getAllVolunteerNeeds(supabase: Client): Promise<Array<VolunteerNeed & { organization?: Pick<Organization, 'id' | 'name' | 'town'> | null }>> {
  const { data, error } = await supabase
    .from('volunteer_needs')
    .select('*, organization:organizations(id, name, town)')
    .eq('is_active', true)
    .order('posted_date', { ascending: false });
  if (error) {
    console.error('getAllVolunteerNeeds error', error);
    return [];
  }
  return (data ?? []) as unknown as Array<VolunteerNeed & { organization?: Pick<Organization, 'id' | 'name' | 'town'> | null }>;
}

export async function countByStatus(supabase: Client) {
  const [{ count: orgCount }, { count: needCount }, { count: appCount }] = await Promise.all([
    supabase.from('organizations').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('volunteer_needs').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('volunteer_applications').select('*', { count: 'exact', head: true }),
  ]);
  return {
    organizations: orgCount ?? 0,
    volunteerNeeds: needCount ?? 0,
    applications: appCount ?? 0,
  };
}
