import { createClient } from '@/lib/supabase/server';
import { getAllOrganizations } from '@/lib/supabase/queries';
import { buildDirectoryPdf, type DirectoryLocale } from '@/lib/pdf/directory';

// Generated on request against live data, so the printed booklet can never
// drift from the site the way a checked-in file would. The CDN holds it for an
// hour, which is plenty — listings change on a human timescale.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const lang = new URL(request.url).searchParams.get('lang');
  const locale: DirectoryLocale = lang === 'es' ? 'es' : 'en';

  const supabase = await createClient();
  const organizations = await getAllOrganizations(supabase);

  const bytes = await buildDirectoryPdf(organizations, locale);
  const filename =
    locale === 'es'
      ? 'carteret-assist-hub-directorio.pdf'
      : 'carteret-assist-hub-directory.pdf';

  return new Response(bytes as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
