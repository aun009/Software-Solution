import React from 'react';

export const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-gray-300 relative overflow-hidden">
      {/* Background Gradient Blurs */}
      <div className="fixed inset-0 pointer-events-none -z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-600/8 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-purple-600/8 blur-[160px] rounded-full" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 pt-36 md:pt-44 pb-24 px-5 md:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-blue-400 mb-4">Legal</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-5 leading-[1.05]">
              Privacy Policy
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed">
              This Privacy Policy explains how SP Tech Solutions collects, uses, stores, and protects your personal information
              when you use our platform. We are committed to maintaining the trust and confidence of our users.
            </p>
            <div className="mt-6 flex items-center gap-3 text-[13px] text-gray-500">
              <span>Last updated: April 2026</span>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <span>Effective immediately</span>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-10">

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">1. Information We Collect</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  When you create an account on SP Tech Solutions, we collect information such as your name, email address,
                  and any profile details you choose to provide. This information is used to identify you on the platform,
                  personalize your experience, and enable account-related features like saved preferences and purchase history.
                </p>
                <p>
                  We also collect technical data automatically when you browse the platform. This includes your IP address,
                  browser type and version, operating system, device type, screen resolution, referring URLs, pages viewed,
                  time spent on pages, click patterns, and general geographic location derived from your IP address. This data
                  helps us understand how users interact with the platform so we can improve performance, fix bugs, and enhance
                  the user experience.
                </p>
                <p>
                  If you contact us through our support channels (including WhatsApp, email, or any in-app messaging), we may
                  retain the content of those communications along with your contact details to resolve your inquiry and improve
                  our support processes.
                </p>
                <p>
                  When you leave reviews, ratings, or comments on software listings, that content is collected and displayed
                  publicly on the platform. Your display name (or username) will be associated with your review.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">2. How We Use Your Information</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>We use the information we collect for the following purposes:</p>
                <ul className="list-none space-y-3 pl-0">
                  {[
                    'To create and manage your user account, including authentication and access control.',
                    'To personalize your browsing experience by recommending relevant software tools and categories.',
                    'To process any transactions, subscriptions, or purchases you make through the platform.',
                    'To communicate with you about account updates, security alerts, and service-related announcements.',
                    'To respond to your support inquiries, feedback, and questions in a timely manner.',
                    'To analyze usage patterns and trends to improve platform functionality, design, and performance.',
                    'To detect, prevent, and address technical issues, fraud, abuse, and security vulnerabilities.',
                    'To comply with legal obligations and enforce our Terms of Service.',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">3. Data Sharing and Third Parties</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  SP Tech Solutions does not sell, rent, or trade your personal information to third parties for marketing
                  purposes. We value your trust and treat your data with the utmost respect and care.
                </p>
                <p>
                  We may share limited data with trusted third-party service providers who assist us in operating the platform.
                  These include hosting providers (such as Vercel and cloud infrastructure services), authentication services
                  (such as Supabase or Firebase), analytics tools (such as Google Analytics), and payment processors. These
                  providers are contractually obligated to handle your data securely and only for the purposes we specify.
                </p>
                <p>
                  We may disclose your information if required to do so by law, regulation, legal process, or governmental
                  request. We may also disclose information to protect the rights, property, or safety of SP Tech Solutions,
                  our users, or the public, and to enforce our Terms of Service.
                </p>
                <p>
                  In the event of a merger, acquisition, or sale of assets, your personal information may be transferred as
                  part of the transaction. We will notify you through the platform or by email before your information becomes
                  subject to a different privacy policy.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">4. Cookies and Tracking Technologies</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  SP Tech Solutions uses cookies and similar tracking technologies (such as local storage and session storage)
                  to maintain your login session, remember your preferences, and collect analytics data about how you use
                  the platform.
                </p>
                <p>
                  Essential cookies are required for the platform to function correctly. These include session cookies for
                  authentication and security tokens. You cannot opt out of these cookies without losing access to core features.
                </p>
                <p>
                  Analytics cookies help us understand traffic patterns, popular features, and areas for improvement. These
                  cookies collect aggregated, anonymized data. You can manage cookie preferences through your browser settings,
                  although disabling cookies may affect certain platform functionality.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">5. Data Security</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  We implement industry-standard security measures to protect your personal information from unauthorized
                  access, alteration, disclosure, or destruction. These measures include encrypted data transmission (SSL/TLS),
                  secure authentication protocols, regular security audits, and access controls limiting data access to
                  authorized personnel only.
                </p>
                <p>
                  Despite our efforts, no method of electronic transmission or storage is 100% secure. We cannot guarantee
                  absolute security but are committed to taking all reasonable precautions to safeguard your data. If we become
                  aware of a security breach that affects your personal information, we will notify you promptly in accordance
                  with applicable laws.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">6. Data Retention</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  We retain your personal data for as long as your account is active or as needed to provide you with our
                  services. If you choose to close your account, we will delete or anonymize your personal information within
                  a reasonable timeframe, unless retention is required by law for compliance, audit, accounting, or dispute
                  resolution purposes.
                </p>
                <p>
                  Aggregated, anonymized data that cannot be used to identify you may be retained indefinitely for analytics
                  and platform improvement purposes.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">7. Your Rights</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
                <ul className="list-none space-y-3 pl-0">
                  {[
                    'Right to access the personal data we hold about you.',
                    'Right to request correction of inaccurate or incomplete personal data.',
                    'Right to request deletion of your personal data (subject to legal retention requirements).',
                    'Right to restrict or object to processing of your personal data in certain circumstances.',
                    'Right to data portability, allowing you to receive your data in a structured format.',
                    'Right to withdraw consent at any time, where processing is based on your consent.',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  To exercise any of these rights, please contact us through the support channels available on the platform.
                  We will respond to your request within 30 days.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">8. Children's Privacy</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  SP Tech Solutions is not directed to children under the age of 13 (or the applicable age of digital consent
                  in your jurisdiction). We do not knowingly collect personal information from children. If we learn that we
                  have inadvertently collected data from a child, we will take steps to delete it promptly. If you believe a
                  child has provided us with personal data, please contact us immediately.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">9. Changes to This Policy</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal
                  requirements, or for other operational reasons. When we make material changes, we will update the "Last
                  updated" date at the top of this page and, where appropriate, notify you via email or a prominent notice
                  on the platform.
                </p>
                <p>
                  Your continued use of SP Tech Solutions after any changes to this Privacy Policy constitutes your acceptance
                  of the updated terms.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">10. Contact Us</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal
                  data, please reach out to us through:
                </p>
                <ul className="list-none space-y-3 pl-0">
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0" />
                    <span>WhatsApp: <a href="https://wa.me/919552530324" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">+91 95525 30324</a></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0" />
                    <span>Website: <a href="/" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">SP Tech Solutions</a></span>
                  </li>
                </ul>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};
