import { Link } from 'react-router-dom';

// A plain, crawlable list of every public page on SaralBuy — supports
// discoverability and internal linking. Only real, existing routes are
// listed (no invented pages like Careers/Blog/Press, which don't exist
// yet); dynamic/auth-gated routes (product detail pages, account settings,
// chat) are omitted since they require a specific ID or a logged-in session
// and aren't meaningful sitemap entries on their own.
const SECTIONS = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Explore Requirements', to: '/product-listing' },
      { label: 'Post a Requirement', to: '/post-requirement' },
      { label: 'How It Works', to: '/how-it-works' },
      { label: 'Supplier Tools', to: '/supplier-tools' },
      { label: 'Buyer Tools', to: '/buyer-tools' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about-us' },
      { label: 'Contact Us', to: '/contact-us' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
  {
    title: 'Trust & Legal',
    links: [
      { label: 'Trust Center', to: '/trust-center' },
      { label: 'Terms of Use', to: '/terms' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Cookie Policy', to: '/privacy?policy=cookie-policy' },
      { label: 'DMCA / Copyright (IP & Takedown Policy)', to: '/terms?policy=ip-takedown-policy' },
      { label: 'Accessibility Statement', to: '/accessibility' },
    ],
  },
];

export default function Sitemap() {
  return (
    <div className="w-full max-w-4xl mx-auto py-14 px-4 min-h-screen">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Sitemap</h1>
      <p className="text-sm text-slate-500 mb-10">Every public page on SaralBuy, in one place.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {SECTIONS.map(section => (
          <div key={section.title}>
            <h2 className="text-xs font-black uppercase tracking-[0.15em] text-orange-600 mb-4">
              {section.title}
            </h2>
            <ul className="space-y-2.5">
              {section.links.map(link => (
                <li key={link.to + link.label}>
                  <Link to={link.to} className="text-sm text-slate-600 hover:text-orange-700 hover:underline underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
