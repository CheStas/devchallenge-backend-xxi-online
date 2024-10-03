// By default, five conversation topics should be created:
// - Visa and Passport Services
// - Diplomatic Inquiries
// - Travel Advisories
// - Consular Assistance
// - Trade and Economic Cooperation.
const visaAndPassportCategory = {
  title: 'Visa and Passport Services',
  points: [
    'Visa Application Process',
    'Passport Renewal Procedures',
    'Visa Fee Payment Methods',
    'Passport Photo Requirements',
    'Visa Interview Preparation Tips',
  ],
};
const diplomaticInquiriesCategory = {
  title: 'Diplomatic Inquiries',
  points: [
    'Embassy Contact Information',
    'Diplomatic Immunity Details',
    'Protocol for Diplomatic Correspondence',
    'Diplomatic Pouch Regulations',
    'Consular Notification Procedures',
  ],
};
const travelAdvisoriesCategory = {
  title: 'Travel Advisories',
  points: [
    'Current Travel Warnings',
    'Health and Safety Precautions',
    'Local Laws and Customs',
    'Emergency Contact Numbers',
    'Travel Insurance Recommendations',
  ],
};
const consularAssistanceCategory = {
  title: 'Consular Assistance',
  points: [
    'Lost or Stolen Passport Assistance',
    'Emergency Evacuation Procedures',
    'Legal Assistance Abroad',
    'Medical Assistance Abroad',
    'Notarial Services',
  ],
};

const tradeAndEconomicCooperationCategory = {
  title: 'Trade and Economic Cooperation',
  points: [
    'Trade Agreement Details',
    'Investment Opportunities',
    'Export and Import Regulations',
    'Economic Development Programs',
    'Business Visa Information',
  ],
};

export const categoriesOnInit = [
  visaAndPassportCategory,
  diplomaticInquiriesCategory,
  travelAdvisoriesCategory,
  consularAssistanceCategory,
  tradeAndEconomicCooperationCategory,
];
