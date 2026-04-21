import Link from 'next/link';

export const metadata = {
  title: 'About · Carteret Assist Hub',
  description: 'A project of the Carteret County Community Service Committee.',
};

export default function AboutPage() {
  return (
    <div>
      <section className="bg-ivory border-b border-rule/40">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-24 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-text mb-3">
              · About the Hub
            </p>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-[-0.02em] text-ink">
              A single index of where Carteret County takes care of its own.
            </h1>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24 space-y-10 text-body-text text-base md:text-[17px] leading-[1.8]">
          <p>
            Carteret Assist Hub is a county-wide directory of the non-profits, committees, and
            volunteers working on every kind of community need — from food and housing to veterans
            and the coast. It&apos;s a project of the Carteret County Community Service Committee,
            organized alongside the county Democratic Party and a growing roster of local non-profit
            partners.
          </p>
          <p>
            The hub is organized into <strong className="font-display text-ink">thirteen sectors</strong>.
            Each sector is a volunteer subcommittee that curates the organizations listed there —
            keeping the directory current, onboarding new non-profits, and posting volunteer
            opportunities as they come up.
          </p>
          <p>
            Our sister site, <Link href="https://github.com/tanayvin1216/FoodAssist_V2" className="underline hover:text-ink">Food Assist</Link>,
            is a standalone directory focused on the food-insecurity sector. Both sites share the
            same database — an organization enters its information once and appears in both places.
          </p>
          <p>
            If you run a Carteret County non-profit and would like to be listed, or if you&apos;d
            like to help lead a subcommittee, reach out to the community-service committee.
          </p>
        </div>
      </section>
    </div>
  );
}
