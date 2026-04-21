import { z } from 'zod';

export const volunteerApplicationSchema = z.object({
  applicant_name: z.string().min(2, 'Name is required').max(120),
  applicant_email: z.email('Valid email required'),
  applicant_phone: z.string().max(30).optional().or(z.literal('')),
  willing_to_do: z.string().min(10, 'Tell us a little more (10+ characters)').max(2000),
  hours_per_week: z.string().max(60).optional().or(z.literal('')),
  availability: z.string().max(300).optional().or(z.literal('')),
  volunteer_need_id: z.string().uuid().nullable().optional(),
  organization_id: z.string().uuid().nullable().optional(),
});

export type VolunteerApplicationInput = z.infer<typeof volunteerApplicationSchema>;
