import { Link } from 'react-router-dom';
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Honest accessibility statement — no formal WCAG audit has been performed,
// so this doesn't claim a conformance level (e.g. "WCAG 2.1 AA compliant").
// It describes what's actually true: the interactive components are built
// on Radix UI primitives (Accordion, Tabs, Dialog, etc.), which ship with
// keyboard navigation and ARIA semantics out of the box, and gives a real
// channel to report a problem.
export default function AccessibilityStatement() {
  return (
    <div className="w-full max-w-3xl mx-auto py-14 px-4 min-h-screen">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/trust-center">Trust Center</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Accessibility Statement</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Accessibility Statement</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: July 29, 2026</p>

      <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
        <p>
          SaralBuy aims to be usable by as many people as possible, including people who use a
          keyboard, a screen reader, or other assistive technology. This statement describes where
          we stand today, plainly.
        </p>

        <div>
          <h2 className="text-base font-black text-slate-900 mb-2">What we do today</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Interactive components (menus, tabs, accordions, dialogs) are built on Radix UI primitives, which provide keyboard navigation, focus management, and ARIA semantics by default.</li>
            <li>Interactive elements show a visible focus state for keyboard navigation.</li>
            <li>Pages use semantic HTML headings and landmark structure rather than purely visual markup.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-black text-slate-900 mb-2">What we haven&apos;t formally verified yet</h2>
          <p>
            We have not conducted a formal WCAG conformance audit, and we do not claim a specific
            conformance level (such as WCAG 2.1 AA) at this time. Accessibility is an ongoing
            process, and we are working to review and improve it as the platform grows.
          </p>
        </div>

        <div>
          <h2 className="text-base font-black text-slate-900 mb-2">Reporting an issue</h2>
          <p>
            If you encounter an accessibility barrier using SaralBuy, please{' '}
            <Link to="/contact-us" className="text-orange-600 font-semibold hover:underline">contact us</Link>{' '}
            with details of the page and the issue. We&apos;ll look into it.
          </p>
        </div>
      </div>
    </div>
  );
}
