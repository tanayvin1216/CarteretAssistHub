import Link from 'next/link';

export const metadata = {
  title: 'About · Carteret Assist Hub',
  description: 'A project of the Carteret County Community Service Committee.',
};

export default function AboutPage() {
  return (
    <div>
      <section className="bg-sand border-b border-divider">
        <div className="container-readable max-w-3xl py-12 md:py-16">
          <h1 className="text-3xl md:text-5xl font-bold text-ink leading-tight mb-4">
            About Assist Hub
          </h1>
          <p className="text-base md:text-lg text-body-text leading-relaxed max-w-2xl">
            A single directory of the people and organizations taking care of Carteret County, NC.
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-readable max-w-3xl py-12 md:py-16 space-y-6 text-[17px] text-body-text leading-[1.75]">
          <p>
            Assist Hub is a county-wide directory of the non-profits, committees, and volunteers
            working on every kind of community need — from food and housing to veterans and the
            coast. It&apos;s a project of the Carteret County Community Service Committee,
            organized alongside the county Democratic Party and a growing roster of local
            non-profit partners.
          </p>

          <div className="bg-sand border-l-4 border-primary rounded-r-lg p-5 my-8">
            <p className="text-[15px] text-ink leading-relaxed">
              The hub is organized into <strong>thirteen sectors</strong>. Each sector is a
              volunteer subcommittee that curates the organizations listed there — keeping the
              directory current, onboarding new non-profits, and posting volunteer opportunities
              as they come up.
            </p>
          </div>

          <p>
            Our sister site,{' '}
            <a
              href="https://food-assist-v2.vercel.app/"
              className="text-primary font-semibold underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Food Assist
            </a>
            , is a standalone directory focused on the food-insecurity sector. Both sites share
            the same database — an organization enters its information once and appears in both
            places. No duplicate updates, no syncing.
          </p>

          <p>
            If you run a Carteret County non-profit and would like to be listed, or if you&apos;d
            like to help lead a subcommittee, reach out to the community-service committee.
          </p>

          <div className="pt-8 flex items-center gap-4 flex-wrap">
            <Link
              href="/sectors"
              className="inline-flex items-center gap-2 h-11 px-5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-500 transition-colors"
            >
              Browse sectors
            </Link>
            <Link
              href="/get-help"
              className="inline-flex items-center gap-2 h-11 px-5 bg-surface border border-divider text-ink text-sm font-semibold rounded-lg hover:bg-sand transition-colors"
            >
              Find help
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
