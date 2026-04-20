import React from 'react';

export const DisclaimerPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-gray-300 relative overflow-hidden">
      {/* Background Gradient Blurs */}
      <div className="fixed inset-0 pointer-events-none -z-0">
        <div className="absolute top-[-15%] left-[10%] w-[50%] h-[50%] bg-amber-600/6 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[10%] w-[45%] h-[45%] bg-blue-600/8 blur-[160px] rounded-full" />
        <div className="absolute top-[45%] right-[-5%] w-[30%] h-[30%] bg-rose-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 pt-36 md:pt-44 pb-24 px-5 md:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-blue-400 mb-4">Legal</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-5 leading-[1.05]">
              Disclaimer
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed">
              This Disclaimer outlines the limitations and responsibilities associated with using SP Tech Solutions.
              Please read this page carefully before relying on any information provided on the platform.
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
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">1. General Information Purpose</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  The information provided on SP Tech Solutions is for general informational and educational purposes only.
                  Our platform serves as a curated directory and discovery tool for AI software, SaaS products, and technology
                  solutions. The listings, descriptions, feature comparisons, pricing details, and editorial content are
                  intended to help users make informed decisions but should not be treated as professional advice.
                </p>
                <p>
                  While we make every reasonable effort to ensure the information on our platform is accurate, complete, and
                  up to date, we make no warranties or representations of any kind — express or implied — about the completeness,
                  accuracy, reliability, suitability, or availability of the information, products, or services contained on
                  the platform. Any reliance you place on such information is strictly at your own risk.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">2. Third-Party Products and Services</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  SP Tech Solutions is a discovery and curation platform. We do not develop, own, operate, or control the
                  third-party software products, tools, and services listed in our directory. Each listed product is the sole
                  property and responsibility of its respective developer, publisher, or provider.
                </p>
                <p>
                  We are not responsible for and do not guarantee the performance, functionality, uptime, security, customer
                  support, or any other aspect of third-party products. Software features, pricing plans, subscription terms,
                  free trial availability, refund policies, and service levels are set by the respective third-party providers
                  and may change at any time without notice to SP Tech Solutions.
                </p>
                <p>
                  Before purchasing, subscribing to, or relying on any third-party software listed on our platform, you should
                  independently verify all product details directly with the provider. SP Tech Solutions shall not be held
                  liable for any losses, damages, or disputes arising from your use of or interactions with any third-party
                  product or service discovered through our platform.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">3. No Guarantees of Results</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  SP Tech Solutions does not guarantee any specific results, outcomes, or benefits from using the tools and
                  software listed on our platform. Any descriptions of potential benefits, use cases, or productivity gains
                  are based on general industry knowledge and publicly available information, and your actual experience may
                  vary significantly.
                </p>
                <p>
                  Business outcomes, revenue generation, time savings, efficiency improvements, or any other results depend
                  entirely on your individual circumstances, implementation quality, technical expertise, business model,
                  market conditions, and many other factors beyond our control. No representation is made that the use of
                  any listed product will lead to specific financial or operational outcomes.
                </p>
                <p>
                  Testimonials, reviews, ratings, and success stories shared on the platform reflect individual user experiences
                  and should not be interpreted as guaranteed outcomes. Past performance or user satisfaction with a product is
                  not indicative of future results.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">4. Pricing and Availability</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  Product pricing displayed on SP Tech Solutions is gathered from publicly available sources, official product
                  websites, and provider APIs at the time of listing or last update. Prices are shown for reference purposes
                  and may not reflect real-time pricing, regional variations, promotional offers, bundle discounts, or
                  enterprise pricing arrangements.
                </p>
                <p>
                  Currency conversions (e.g., USD to INR) are approximate and based on exchange rates at the time of listing.
                  Actual charges at the point of purchase may differ. Free tier availability, trial periods, and feature
                  limitations are subject to change by the product provider at any time.
                </p>
                <p>
                  SP Tech Solutions is not responsible for discrepancies between displayed pricing and the actual pricing
                  offered by the product provider. Always confirm pricing directly on the official product website before
                  making a purchase decision.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">5. Affiliate and Commercial Relationships</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  SP Tech Solutions may participate in affiliate programs or have commercial relationships with some of the
                  software providers listed on the platform. This means we may earn a referral commission or fee when you
                  click on certain links and subsequently make a purchase or sign up for a service.
                </p>
                <p>
                  We are committed to transparency. Affiliate relationships do not influence our editorial independence,
                  ratings methodology, or product rankings. We strive to present honest, unbiased information regardless of
                  any commercial arrangement. All listed products, whether affiliated or not, are held to the same standards
                  of quality and relevance.
                </p>
                <p>
                  Affiliate commissions help fund the ongoing operation of SP Tech Solutions, allowing us to continue curating,
                  testing, and reviewing tools for the benefit of our users. We appreciate your support.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">6. Reviews, Ratings, and User Content</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  Reviews, ratings, and comments published on SP Tech Solutions represent the personal opinions and experiences
                  of individual users. They are not endorsed, verified, or guaranteed by SP Tech Solutions. We do not fact-check
                  every user review and cannot ensure the accuracy of user-submitted content.
                </p>
                <p>
                  While we implement measures to detect and remove fake, spam, or abusive reviews, some inaccurate content may
                  occasionally appear on the platform. If you encounter misleading or inappropriate reviews, please report them
                  to us so we can investigate and take appropriate action.
                </p>
                <p>
                  SP Tech Solutions shall not be liable for decisions made based on user-generated reviews or ratings. You
                  should use reviews as one of many factors in your evaluation process, not as the sole basis for a decision.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">7. External Links</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  SP Tech Solutions contains links to external websites, resources, and third-party services. These links are
                  provided for your convenience and reference. We do not control, endorse, or assume responsibility for the
                  content, privacy practices, terms of service, or availability of any linked external websites.
                </p>
                <p>
                  Clicking on external links will take you away from the SP Tech Solutions platform. We recommend reviewing the
                  privacy policies and terms of any external websites you visit. SP Tech Solutions shall not be liable for any
                  loss, damage, or harm resulting from your use of external websites accessed through our platform.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">8. Limitation of Liability</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  In no event shall SP Tech Solutions, its founders, team members, contributors, or affiliates be liable for
                  any direct, indirect, incidental, special, consequential, or exemplary damages — including but not limited to
                  damages for loss of profits, goodwill, data, or other intangible losses — resulting from:
                </p>
                <ul className="list-none space-y-3 pl-0">
                  {[
                    'Your use of or inability to use the platform or any listed product.',
                    'Any unauthorized access to or alteration of your transmissions or data.',
                    'Statements or conduct of any third party on the platform.',
                    'Inaccurate, outdated, or incomplete product information.',
                    'Service interruptions, downtime, or technical failures.',
                    'Any other matter relating to the platform.',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  This limitation applies whether the alleged liability is based on contract, tort, negligence, strict liability,
                  or any other basis, even if SP Tech Solutions has been advised of the possibility of such damages.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">9. Information Accuracy</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  SP Tech Solutions endeavors to keep all content on the platform accurate and up to date. However, due to the
                  rapidly evolving nature of the software and AI industry, some information may become outdated between updates.
                  Product features, pricing, integrations, supported platforms, and availability may change without prior notice.
                </p>
                <p>
                  If you discover inaccurate, outdated, or misleading information on any listing, we encourage you to report
                  it to our team through the contact channels listed on the website. We will review and correct verified
                  inaccuracies promptly.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">10. No Professional Advice</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  Nothing on SP Tech Solutions constitutes professional, legal, financial, investment, or technical advice.
                  The content is for informational purposes only. Before making significant business decisions, technology
                  investments, or software purchases, you should consult with qualified professionals who can evaluate your
                  specific needs and circumstances.
                </p>
                <p>
                  SP Tech Solutions is not a licensed advisor, consultant, or agent for any third-party product or service.
                  Our team provides editorial curation and general guidance, not personalized recommendations.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">11. Changes to This Disclaimer</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  SP Tech Solutions reserves the right to update or modify this Disclaimer at any time without prior notice.
                  When we make material changes, we will update the "Last updated" date at the top of this page. Your continued
                  use of the platform after any modifications constitutes your acceptance of the updated Disclaimer.
                </p>
                <p>
                  We recommend reviewing this page periodically to stay informed about any changes.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">12. Contact Us</h2>
              <div className="space-y-4 text-[15px] leading-[1.85]">
                <p>
                  If you have questions or concerns about this Disclaimer, or if you wish to report inaccurate content on the
                  platform, please contact us:
                </p>
                <ul className="list-none space-y-3 pl-0">
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5 shrink-0" />
                    <span>WhatsApp: <a href="https://wa.me/919552530324" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">+91 95525 30324</a></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5 shrink-0" />
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
