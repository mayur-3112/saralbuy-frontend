import Hero from './Hero';
import ProofStrip from './ProofStrip';
import LiveSourcingBoard from './LiveSourcingBoard';
import FirstVisitWelcome from './FirstVisitWelcome';

/**
 * Landing page — the front door.
 *
 * Every section must earn its place. If a section can't tell the truth
 * with today's data, it doesn't ship. TrustedBrands was removed here —
 * "verified suppliers carrying brands you already trust" was a claim
 * we can't back up yet (0 verified suppliers, no brand relationships).
 * It'll come back when it can be true.
 *
 *   1. Hero              — light, pain-first headline + category carousel
 *   2. ProofStrip        — live numbers + activity ticker (self-hides empty tiles)
 *   3. LiveSourcingBoard — actual live RFQs (proof of activity)
 *   4. FirstVisitWelcome — soft onboarding for new visitors (once per browser)
 */
export default function LandingPage() {
  const triggerAuth = (roleType) => {
    localStorage.setItem('auth_default_role', roleType);
    window.dispatchEvent(new Event('session-expired'));
  };

  return (
    <div className="bg-white min-h-screen text-slate-800 font-sans">
      <Hero onOpenAuth={triggerAuth} />
      <ProofStrip />

      <div className="max-w-[1440px] mx-auto px-4 py-12">
        <main className="space-y-16">
          <LiveSourcingBoard onOpenAuth={triggerAuth} />
        </main>
      </div>

      <FirstVisitWelcome onOpenAuth={triggerAuth} />
    </div>
  );
}
