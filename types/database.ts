/**
 * Hand-authored Database type. Keep in sync with Supabase migrations.
 * FoodAssist tables (organizations, volunteer_needs, volunteer_applications,
 * profiles) are included because AssistHub reads/writes them too.
 */

export type Database = {
  public: {
    Tables: {
      sectors: {
        Row: Sector;
        Insert: Omit<Sector, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Sector>;
      };
      subcommittee_leads: {
        Row: SubcommitteeLead;
        Insert: Omit<SubcommitteeLead, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<SubcommitteeLead>;
      };
      sector_activities: {
        Row: SectorActivity;
        Insert: Omit<SectorActivity, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<SectorActivity>;
      };
      organizations: {
        Row: Organization;
        Insert: Omit<Organization, 'id' | 'created_at' | 'last_updated'> & {
          id?: string;
          created_at?: string;
          last_updated?: string;
        };
        Update: Partial<Organization>;
      };
      volunteer_needs: {
        Row: VolunteerNeed;
        Insert: Omit<VolunteerNeed, 'id' | 'posted_date'> & {
          id?: string;
          posted_date?: string;
        };
        Update: Partial<VolunteerNeed>;
      };
      volunteer_applications: {
        Row: VolunteerApplication;
        Insert: Omit<VolunteerApplication, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<VolunteerApplication>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'> & { created_at?: string };
        Update: Partial<Profile>;
      };
    };
  };
};

export interface Sector {
  id: string;
  slug: string;
  name: string;
  name_es: string | null;
  short_description: string | null;
  short_description_es: string | null;
  description: string | null;
  description_es: string | null;
  accent_color: string;
  numeral: string;
  display_order: number;
  status: 'forming' | 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface SubcommitteeLead {
  id: string;
  sector_id: string;
  name: string;
  role: 'lead' | 'co-lead' | 'member';
  email: string | null;
  phone: string | null;
  affiliation: string | null;
  bio: string | null;
  display_order: number;
  created_at: string;
}

export interface SectorActivity {
  id: string;
  sector_id: string;
  title: string;
  title_es: string | null;
  description: string | null;
  description_es: string | null;
  scheduled_for: string | null;
  location: string | null;
  is_published: boolean;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  address: string;
  town: string;
  zip: string;
  contact_name: string | null;
  phone: string;
  email: string | null;
  website: string | null;
  facebook: string | null;
  assistance_types: string[];
  who_served: string[] | null;
  cost: string;
  num_meals_available: number | null;
  operating_hours: Record<string, { open: string; close: string; closed?: boolean }> | null;
  hours_notes: string | null;
  donations_accepted: string[] | null;
  storage_capacity: Record<string, unknown> | null;
  comments: string | null;
  last_updated: string;
  updated_by: string | null;
  is_active: boolean;
  spanish_available: boolean;
  created_at: string;
  sector_id: string | null;
  sector_slug: string | null;
  additional_sector_slugs: string[];
  mission: string | null;
  mission_es: string | null;
  is_featured: boolean;
  display_order: number | null;
}

export interface VolunteerNeed {
  id: string;
  organization_id: string;
  title: string;
  title_es: string | null;
  description: string;
  description_es: string | null;
  needed_date: string | null;
  needed_skills: string[] | null;
  time_commitment: string | null;
  is_active: boolean;
  posted_date: string;
  contact_email: string | null;
  sector_slug: string | null;
}

export interface VolunteerApplication {
  id: string;
  volunteer_need_id: string | null;
  organization_id: string | null;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string | null;
  willing_to_do: string;
  hours_per_week: string | null;
  availability: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'contacted';
  review_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'organization' | 'public';
  organization_id: string | null;
  created_at: string;
}
