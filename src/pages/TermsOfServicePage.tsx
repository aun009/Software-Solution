import React from 'react';

export const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-gray-300 relative overflow-hidden">
      {/* Background Gradient Blurs */}
      <div className="fixed inset-0 pointer-events-none -z-0">
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-violet-600/8 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-600/8 blur-[160px] rounded-full" />
        <div className="absolute top-[50%] left-[30%] w-[30%] h-[30%] bg-cyan-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 pt-36 md:pt-44 pb-24 px-5 md:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-blue-400 mb-4">Legal</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-5 leading-[1.05]">
              Terms of Service
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed">
              These Terms of Service govern your access to and use of SP Tech Solutions. By accessing or using our platform,
              you agree to be bound by these terms. Please read them carefully before using the service.
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
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">1. Acceptance of Terms</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  By accessing, browsing, or using the SP Tech Solutions website and any associated services, you acknowledge
                  that you have read, understood, and agree to be bound by these Terms of Service, along with our Privacy Policy
                  and Disclaimer. These terms apply to all visitors, users, and others who access or use the platform.
                </p>
                <p>
                  If you do not agree to any part of these terms, you must immediately discontinue use of the platform. We
                  reserve the right to modify these terms at any time. Your continued use of the platform following any changes
                  constitutes acceptance of the new terms.
                </p>
                <p>
                  If you are using the platform on behalf of a business, organization, or other entity, you represent that you
                  have the authority to bind that entity to these terms, and the terms "you" and "your" shall refer to that
                  entity.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">2. Platform Description</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  SP Tech Solutions is a software discovery and curation platform that helps users find, compare, and evaluate
                  AI tools and software products. The platform provides curated listings, descriptions, pricing information,
                  categories, ratings, and user reviews for third-party software products.
                </p>
                <p>
                  SP Tech Solutions is primarily an informational and directory service. While we make every effort to ensure
                  accuracy, we do not develop, own, or control the third-party software products listed on our platform. Product
                  availability, features, pricing, and terms are subject to change by their respective providers at any time.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">3. User Accounts</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  To access certain features of the platform, you may be required to create an account. When creating an
                  account, you agree to provide accurate, current, and complete information and to update your information
                  as necessary to keep it accurate.
                </p>
                <p>
                  You are responsible for safeguarding the password and credentials associated with your account. You agree
                  not to share your account credentials with others or allow unauthorized access to your account. You are
                  fully responsible for all activities that occur under your account.
                </p>
                <p>
                  SP Tech Solutions reserves the right to suspend or terminate accounts that violate these terms, engage in
                  fraudulent activity, or are inactive for an extended period. We will make reasonable efforts to notify you
                  before taking such action, except where immediate action is required for security reasons.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">4. Acceptable Use</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>You agree to use the platform only for lawful purposes. You agree NOT to:</p>
                <ul className="list-none space-y-3 pl-0">
                  {[
                    'Use the platform to scrape, crawl, or harvest data without written permission from SP Tech Solutions.',
                    'Attempt to gain unauthorized access to any part of the platform, other accounts, or connected systems.',
                    'Upload, transmit, or distribute malware, viruses, or other malicious code through the platform.',
                    'Submit false, misleading, or spam reviews, ratings, or content.',
                    'Impersonate any person or entity, or falsely claim an affiliation with any person or entity.',
                    'Use the platform to send unsolicited commercial communications or advertisements.',
                    'Interfere with or disrupt the platform\'s infrastructure, services, or other users\' access.',
                    'Reverse-engineer, decompile, or disassemble any part of the platform\'s software or technology.',
                    'Use automated tools (bots, scripts, etc.) to interact with the platform without prior authorization.',
                    'Violate any applicable local, national, or international law or regulation.',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">5. Intellectual Property</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  All content on SP Tech Solutions — including but not limited to text, graphics, logos, icons, images,
                  design elements, software, and code — is the property of SP Tech Solutions or its content suppliers and is
                  protected by applicable intellectual property laws.
                </p>
                <p>
                  Third-party software names, logos, and trademarks displayed on the platform belong to their respective
                  owners. Their inclusion on our platform does not imply endorsement by or affiliation with SP Tech Solutions,
                  unless explicitly stated otherwise.
                </p>
                <p>
                  You may not copy, reproduce, distribute, modify, create derivative works from, publicly display, or
                  otherwise exploit any content from the platform without prior written consent, except for personal,
                  non-commercial use as permitted by these terms.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">6. User-Generated Content</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  The platform may allow you to submit content such as reviews, ratings, comments, or feedback. By submitting
                  content, you grant SP Tech Solutions a worldwide, non-exclusive, royalty-free, perpetual license to use,
                  display, reproduce, and distribute your content on the platform and in marketing materials.
                </p>
                <p>
                  You represent that you own or have the necessary rights to the content you submit, and that your content
                  does not violate any third party's rights, including intellectual property, privacy, or publicity rights.
                </p>
                <p>
                  SP Tech Solutions reserves the right to remove, edit, or decline to publish any user-generated content that
                  violates these terms, is inappropriate, misleading, or harmful, at our sole discretion and without notice.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">7. Purchases and Transactions</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  If the platform facilitates purchases, subscriptions, or transactions for software products, all pricing
                  is displayed in the currency indicated at the time of purchase. Prices may vary based on region, currency
                  exchange rates, and promotional offers.
                </p>
                <p>
                  Payment processing is handled by secure third-party payment providers. SP Tech Solutions does not store
                  your full credit card or payment details on our servers. Refund and cancellation policies will be specified
                  at the point of purchase and may vary by product or service.
                </p>
                <p>
                  We reserve the right to modify pricing, discontinue products, or limit quantities at any time. Any applicable
                  taxes are the responsibility of the buyer unless otherwise stated.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">8. Third-Party Links and Services</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  The platform may contain links to third-party websites, services, or applications that are not owned or
                  controlled by SP Tech Solutions. We are not responsible for the content, privacy practices, or availability
                  of third-party services. Visiting external links is at your own risk.
                </p>
                <p>
                  Inclusion of any third-party link on our platform does not imply endorsement or recommendation.
                  We encourage you to review the terms and privacy policies of any third-party services you access through
                  our platform.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">9. Limitation of Liability</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  To the maximum extent permitted by applicable law, SP Tech Solutions and its founders, employees, agents,
                  and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive
                  damages, including but not limited to loss of profits, data, business opportunities, or goodwill,
                  arising out of or related to your use of the platform.
                </p>
                <p>
                  Our total liability for any claim arising from or related to these terms or the platform shall not exceed
                  the amount you paid to SP Tech Solutions (if any) in the twelve (12) months preceding the claim, or
                  ₹5,000 (INR), whichever is greater.
                </p>
                <p>
                  This limitation applies regardless of the legal theory on which the claim is based, including negligence,
                  breach of contract, or strict liability, and even if SP Tech Solutions has been advised of the possibility
                  of such damages.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">10. Indemnification</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  You agree to indemnify and hold harmless SP Tech Solutions, its founders, employees, agents, and affiliates
                  from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable legal
                  fees) arising out of or related to your use of the platform, your violation of these terms, or your
                  violation of any rights of any third party.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">11. Governing Law and Disputes</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  These Terms of Service shall be governed by and construed in accordance with the laws of India, without
                  regard to its conflict of law principles. Any disputes arising under or in connection with these terms
                  shall be subject to the exclusive jurisdiction of the courts located in India.
                </p>
                <p>
                  Before initiating formal legal proceedings, both parties agree to attempt to resolve disputes through
                  good-faith negotiation. If negotiation fails, the parties agree to seek resolution through mediation
                  before pursuing litigation.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">12. Contact</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  If you have questions about these Terms of Service, please contact us:
                </p>
                <ul className="list-none space-y-3 pl-0">
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2.5 shrink-0" />
                    <span>WhatsApp: <a href="https://wa.me/919552530324" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">+91 95525 30324</a></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2.5 shrink-0" />
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
