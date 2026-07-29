import { Link } from 'react-router-dom';
import SaralBuyLogo from '/image/Logo/navbarLogo.png';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

// Footer link architecture — only real, existing pages. No invented items
// (Careers/Blog/Press/Live Chat/WhatsApp/social accounts) since none of
// those exist on SaralBuy yet; adding them as dead links or fake "coming
// soon" placeholders would be clutter, not information architecture.
// Deep-links into the legal hub (?policy=...) point at specific policies
// rather than duplicating their content here — see TermsAndPrivacy.jsx.
const FOOTER_SECTIONS = [
  {
    title: 'Company',
    links: [
      { label: 'How it works', to: '/how-it-works' },
      { label: 'About Us', to: '/about-us' },
      { label: 'Contact Us', to: '/contact-us' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
  {
    title: 'Marketplace',
    links: [
      { label: 'Explore Requirements', to: '/product-listing' },
      { label: 'Post an RFQ', to: '/post-requirement' },
      { label: 'Become a Supplier', to: '/supplier-tools' },
      { label: 'Buyer Tools', to: '/buyer-tools' },
    ],
  },
  {
    title: 'Trust & Security',
    links: [
      { label: 'Trust Center', to: '/trust-center' },
      { label: 'Security', to: '/terms?policy=information-security-policy' },
      { label: 'Data Protection', to: '/privacy?policy=data-retention-policy' },
      { label: 'Grievance Redressal', to: '/terms?policy=grievance-redressal-policy' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Use', to: '/terms' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Cookie Policy', to: '/privacy?policy=cookie-policy' },
      { label: 'Buyer Terms', to: '/terms?policy=buyer-terms' },
      { label: 'Supplier Terms', to: '/terms?policy=supplier-terms' },
      { label: 'Marketplace Rules', to: '/terms?policy=marketplace-rules' },
      { label: 'Acceptable Use Policy', to: '/terms?policy=acceptable-use-policy' },
      { label: 'Verification Policy', to: '/terms?policy=anti-fraud-verification-policy' },
      { label: 'Refund & Cancellation Policy', to: '/terms?policy=refund-cancellation-policy' },
      { label: 'Disclaimer', to: '/terms?policy=disclaimer' },
      { label: 'IP & Takedown Policy', to: '/terms?policy=ip-takedown-policy' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Support', to: '/contact-us' },
    ],
  },
];

const linkClass =
  'text-sm text-slate-600 hover:text-orange-700 hover:underline underline-offset-4 decoration-orange-300 decoration-2 transition-all';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200">
      <div className="max-w-[1600px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Company block */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-block transition-transform hover:scale-105 duration-300">
              <img
                src={SaralBuyLogo}
                alt="SaralBuy"
                className="h-20 w-auto object-contain mix-blend-darken -ml-4"
              />
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md font-medium">
              SaralBuy connects buyers of construction materials with verified suppliers.
              Post a requirement, receive quotes from multiple suppliers, and stay anonymous
              until you choose one.
            </p>
            <div className="flex flex-wrap gap-4 pt-1">
              <div className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-3.5 py-1.5 rounded-full">
                🚀 Trusted Suppliers
              </div>
              <div className="text-xs font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 px-3.5 py-1.5 rounded-full">
                🔒 100% Secure Sourcing
              </div>
            </div>
          </div>

          {/* Desktop: multi-column link grid */}
          <div className="hidden lg:grid lg:col-span-8 lg:grid-cols-5 gap-8">
            {FOOTER_SECTIONS.map(section => (
              <div key={section.title}>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-5">
                  {section.title}
                </h4>
                <ul className="space-y-3 font-semibold">
                  {section.links.map(link => (
                    <li key={link.label}><Link to={link.to} className={linkClass}>{link.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile/tablet: accordion sections, touch-friendly */}
          <div className="lg:hidden">
            <Accordion type="single" collapsible>
              {FOOTER_SECTIONS.map(section => (
                <AccordionItem key={section.title} value={section.title}>
                  <AccordionTrigger className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 py-4">
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-3 font-semibold pb-2">
                      {section.links.map(link => (
                        <li key={link.label}><Link to={link.to} className={linkClass}>{link.label}</Link></li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <div>© {year} SaralBuy. Serving builders, contractors & suppliers across Karnataka.</div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link to="/privacy" className="hover:text-orange-700">Privacy</Link>
            <Link to="/terms" className="hover:text-orange-700">Terms</Link>
            <Link to="/privacy?policy=cookie-policy" className="hover:text-orange-700">Cookies</Link>
            <Link to="/accessibility" className="hover:text-orange-700">Accessibility</Link>
            <Link to="/sitemap" className="hover:text-orange-700">Sitemap</Link>
            <Link to="/trust-center" className="hover:text-orange-700">Trust Center</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
