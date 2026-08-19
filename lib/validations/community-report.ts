import { z } from 'zod';

export const REPORT_TYPES = ['listing_issue', 'unmet_need', 'other'] as const;

export type ReportType = (typeof REPORT_TYPES)[number];

export const communityReportSchema = z.object({
  report_type: z.enum(REPORT_TYPES, { message: 'Pick what you\'re reporting' }),
  sector_slug: z.string().max(60).optional().or(z.literal('')),
  // The organization select renders an empty option ("Not sure / not listed"),
  // so '' is a legitimate value here. Validating it as a bare uuid rejected the
  // whole form — and because the field only renders for listing_issue reports,
  // the resulting error had nowhere to surface: the submit button just did
  // nothing. Accept '' explicitly; the form maps it to null before insert.
  organization_id: z
    .union([z.string().uuid(), z.literal('')])
    .nullable()
    .optional(),
  details: z.string().min(20, 'Tell us a little more (20+ characters)').max(2000),
  reporter_name: z.string().max(120).optional().or(z.literal('')),
  reporter_email: z.email('Valid email required').optional().or(z.literal('')),
  reporter_phone: z.string().max(30).optional().or(z.literal('')),
});

export type CommunityReportInput = z.infer<typeof communityReportSchema>;
