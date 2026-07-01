import Hero from './Hero';
import ProofStrip from './ProofStrip';
import TrustedBrands from './TrustedBrands';
import B2BProductGrid from './B2BProductGrid';
import LiveSourcingBoard from './LiveSourcingBoard';
import HowItWorks from './HowItWorks';
import FirstVisitWelcome from './FirstVisitWelcome';

/**
 * Landing page — the front door.
 *
 * Section order matters: everything above the fold or in the first scroll
 * answers "is this real?" before we ask for anything. Proof first, then the
 * live market, then category directory, then "how it works" as the closer.
 *
 *   1. Hero              — dark, industrial, pain-first headline
 *   2. ProofStrip        — live numbers + activity ticker (the market pulse)
 *   3. TrustedBrands     — supplier confidence strip (real brand names)
 *   4. LiveSourcingBoard — actual live RFQs (moved up — proof of activity)
 *   5. B2BProductGrid    — category directory (browse mode)
 *   6. HowItWorks        — the closer for anyone still hesitating
 *   7. FirstVisitWelcome — soft onboarding for new visitors (once per browser)
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
      <TrustedBrands />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <main className="space-y-16">
          <LiveSourcingBoard onOpenAuth={triggerAuth} />
          <B2BProductGrid onOpenAuth={triggerAuth} />
        </main>
      </div>

      <HowItWorks onOpenAuth={triggerAuth} />

      <FirstVisitWelcome onOpenAuth={triggerAuth} />
    </div>
  );
}
