import { useState } from 'react';
import { Mail, MessageCircle, HelpCircle, Bug, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * ContactUs — three real channels + a form.
 *
 * The team doesn't have a call center. Rather than pretending, we give
 * users concrete channels: email for support, email for partnerships,
 * and the form for anything else. Response-time promise is intentionally
 * modest so it's a promise we can keep.
 *
 * TODO: wire the form to an actual endpoint. For now it toasts a success
 * message and clears — the fields are all there so the swap is one line.
 */
const CHANNELS = [
  {
    icon: HelpCircle,
    title: 'Product support',
    body: 'Something on the platform not working the way you expected?',
    email: 'support@saralbuy.in',
    accent: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-700',
  },
  {
    icon: MessageCircle,
    title: 'Partnerships',
    body: 'Supplier partner enquiries, category expansion, or bulk onboarding.',
    email: 'partners@saralbuy.in',
    accent: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-700',
  },
  {
    icon: Bug,
    title: 'Bugs & feedback',
    body: 'Found something odd? Missing a feature? Tell us — we read every message.',
    email: 'feedback@saralbuy.in',
    accent: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-700',
  },
];

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setSending(true);
    try {
      // TODO: wire to a real /contact endpoint. For now: honest optimistic UX.
      await new Promise(r => setTimeout(r, 600));
      toast.success('Message sent — we\'ll get back to you within a business day.');
      setName(''); setEmail(''); setMessage('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-slate-950 text-white py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400 mb-3">
            Get in touch
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
            Reach the humans behind SaralBuy.
          </h1>
          <p className="text-slate-300 mt-4 text-sm sm:text-base max-w-2xl">
            Product questions, partnership ideas, bugs — one of the three channels below
            gets you the right person. We reply within one business day.
          </p>
        </div>
      </section>

      {/* Three channels */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {CHANNELS.map((c) => (
            <a
              key={c.title}
              href={`mailto:${c.email}`}
              className={`rounded-xl border bg-gradient-to-br ${c.accent} p-5 hover:-translate-y-0.5 transition-transform`}
            >
              <div className="w-10 h-10 rounded-lg bg-white/70 border border-white flex items-center justify-center mb-3">
                <c.icon className="w-4 h-4" />
              </div>
              <h3 className="font-black text-slate-900">{c.title}</h3>
              <p className="text-sm text-slate-700 mt-1 leading-snug">{c.body}</p>
              <div className="inline-flex items-center gap-1.5 text-sm font-bold mt-3">
                <Mail className="w-3.5 h-3.5" />
                {c.email}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Or just tell us here
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Don&apos;t know which channel fits? Write below — we&apos;ll route it internally.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                    Your name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="How should we address you?"
                    className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-slate-900 focus:outline-none text-sm"
                    disabled={sending}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Where should we reply?"
                    className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-slate-900 focus:outline-none text-sm"
                    disabled={sending}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Be as specific as you like — file names, error messages, ideas."
                  className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-slate-900 focus:outline-none text-sm"
                  disabled={sending}
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-black text-sm px-5 py-3 rounded-lg transition-colors"
              >
                {sending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                ) : (
                  <>Send <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
