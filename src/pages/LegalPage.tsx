import React from 'react';
import { ShieldCheck, FileText, AlertTriangle } from 'lucide-react';

const legalSections = [
  {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    icon: ShieldCheck,
    content: [
      'SP Tech Solutions values your privacy and only collects data required to run and improve the platform. This may include account details, product preferences, support messages, and technical usage analytics.',
      'We use your data to provide secure authentication, improve recommendations in the software store, and respond to your support requests. We do not sell personal information to third parties.',
      'Third-party services (such as payment, hosting, analytics, or login providers) may process limited data on our behalf under their own privacy terms. By using this website, you agree to this processing for service delivery and platform safety.',
      'You may request data correction or deletion by contacting our team through the support channel listed on the site. We retain data only for as long as needed to deliver services, legal compliance, and security monitoring.',
    ],
  },
  {
    id: 'terms-of-service',
    title: 'Terms of Service',
    icon: FileText,
    content: [
      'By using SP Tech Solutions, you agree to use the platform responsibly and in compliance with applicable laws. You must not misuse the platform, scrape restricted data, or attempt unauthorized access.',
      'Tool listings, pricing information, descriptions, and ratings are provided for guidance and may change over time. We try to keep all information updated, but we cannot guarantee third-party accuracy at all times.',
      'Accounts, subscriptions, and purchases (if applicable) are subject to availability and verification. We reserve the right to suspend abusive activity to protect users and maintain platform integrity.',
      'Continued use of the service after updates to these terms means you accept the revised terms. If you disagree with any part of the terms, please discontinue use of the platform.',
    ],
  },
  {
    id: 'disclaimer',
    title: 'Disclaimer',
    icon: AlertTriangle,
    content: [
      'SP Tech Solutions is an informational software discovery platform. We do not own every third-party tool listed and are not liable for external services, outages, pricing changes, or policy updates by those providers.',
      'Any business, technical, or productivity outcomes from using listed tools depend on your own implementation and workflow. No result, revenue, or performance guarantee is implied.',
      'All content is provided "as is" for general information. Users should evaluate each tool independently before purchase or business adoption.',
      'If you identify inaccurate information in a listing, please contact us so we can review and correct it quickly.',
    ],
  },
];

export const LegalPage = () => {
  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 md:mb-16">
          <p className="inline-block text-[11px] font-black uppercase tracking-[0.28em] text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-5">
            Legal
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-4">
            Privacy, Terms and Disclaimer
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto">
            This page outlines how SP Tech Solutions handles your data, platform usage terms, and important legal disclaimers.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {legalSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:text-blue-700 hover:border-blue-200 transition-colors"
            >
              {section.title}
            </a>
          ))}
        </div>

        <div className="space-y-10">
          {legalSections.map((section) => {
            const Icon = section.icon;
            return (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-sm shadow-sm p-6 md:p-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-4">
                  {section.content.map((paragraph) => (
                    <p key={paragraph} className="text-gray-700 leading-7 md:leading-8">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
