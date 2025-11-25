import { Card } from "../ui/card";
import { FileText, Users, Home, CreditCard, Scale, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

interface TermsConditionsPageProps {
  onNavigate: (page: string) => void;
}

export function TermsConditionsPage({ onNavigate }: TermsConditionsPageProps) {
  const lastUpdated = "October 23, 2025";

  const sections = [
    {
      icon: <Users className="w-6 h-6 text-[#00BFA6]" />,
      title: "User Accounts",
      content: [
        {
          subtitle: "Account Registration",
          text: "You must be at least 18 years old to create an account. You agree to provide accurate, current information and maintain the security of your account credentials. You're responsible for all activities under your account.",
        },
        {
          subtitle: "Account Types",
          text: "Ajarly offers two account types: Renter (for guests) and Owner (for property hosts). You may hold both types of accounts but must comply with the respective terms for each role.",
        },
        {
          subtitle: "Account Suspension",
          text: "We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or pose safety risks to other users. You'll be notified of suspension reasons when possible.",
        },
      ],
    },
    {
      icon: <Home className="w-6 h-6 text-[#00BFA6]" />,
      title: "Property Listings (For Hosts)",
      content: [
        {
          subtitle: "Listing Accuracy",
          text: "Hosts must provide accurate, honest descriptions of their properties. Photos must represent the actual property. Misleading information may result in listing removal and account suspension.",
        },
        {
          subtitle: "Property Requirements",
          text: "Properties must meet basic safety and habitability standards. Hosts are responsible for obtaining necessary licenses, permits, and insurance. Properties must comply with local laws and regulations.",
        },
        {
          subtitle: "Pricing and Availability",
          text: "Hosts set their own prices and availability. Once a booking is confirmed, hosts must honor the agreed terms. Calendar must be kept up-to-date to avoid double bookings.",
        },
        {
          subtitle: "Host Responsibilities",
          text: "Hosts must respond to booking requests within 24 hours, provide clean and safe accommodations, respect guest privacy, and deliver all amenities listed in the property description.",
        },
      ],
    },
    {
      icon: <CreditCard className="w-6 h-6 text-[#00BFA6]" />,
      title: "Bookings and Payments",
      content: [
        {
          subtitle: "Booking Process",
          text: "Guests can book properties through our platform. Bookings are confirmed once payment is processed. You'll receive a confirmation email with booking details and host contact information.",
        },
        {
          subtitle: "Payment Terms",
          text: "Full payment is required at booking. Ajarly holds payment until 24 hours after check-in, then releases it to the host. This protects both parties in case of issues.",
        },
        {
          subtitle: "Service Fees",
          text: "Ajarly charges a service fee on each booking (typically 10-15% for hosts, 5-10% for guests). These fees cover platform operations, payment processing, customer support, and insurance.",
        },
        {
          subtitle: "Currency and Taxes",
          text: "All prices are listed in Egyptian Pounds (EGP). Applicable taxes are included in the total price shown at checkout. Hosts are responsible for reporting and paying taxes on their rental income.",
        },
      ],
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-[#00BFA6]" />,
      title: "Cancellations and Refunds",
      content: [
        {
          subtitle: "Guest Cancellations",
          text: "Cancellation policies vary by property (Flexible, Moderate, or Strict). The policy is clearly stated on each listing. Refund amounts depend on when you cancel relative to check-in date.",
        },
        {
          subtitle: "Host Cancellations",
          text: "Hosts who cancel confirmed bookings may face penalties including fees, calendar blocking, and account suspension. Guests receive full refunds for host-initiated cancellations.",
        },
        {
          subtitle: "Extenuating Circumstances",
          text: "Full refunds may be granted for circumstances beyond your control (natural disasters, serious illness, government restrictions). Documentation is required for such claims.",
        },
        {
          subtitle: "Refund Processing",
          text: "Approved refunds are processed within 5-10 business days. Refunds are issued to the original payment method. Service fees may be non-refundable depending on cancellation timing.",
        },
      ],
    },
    {
      icon: <Scale className="w-6 h-6 text-[#00BFA6]" />,
      title: "Prohibited Activities",
      content: [
        {
          subtitle: "General Prohibitions",
          text: "Users may not: engage in fraud or misrepresentation, discriminate against others, violate laws or regulations, interfere with platform operations, or misuse other users' information.",
        },
        {
          subtitle: "Property Use",
          text: "Guests must: use properties for intended residential purposes only, respect maximum occupancy limits, follow house rules, avoid parties without host permission, and leave properties in good condition.",
        },
        {
          subtitle: "Content Guidelines",
          text: "All user-generated content (reviews, messages, photos) must be appropriate, respectful, and relevant. No hate speech, harassment, explicit content, or spam is allowed.",
        },
      ],
    },
    {
      icon: <FileText className="w-6 h-6 text-[#00BFA6]" />,
      title: "Liability and Disputes",
      content: [
        {
          subtitle: "Platform Role",
          text: "Ajarly is a marketplace connecting guests and hosts. We don't own, manage, or control properties. We're not a party to rental agreements between users. Transactions occur directly between guests and hosts.",
        },
        {
          subtitle: "Limited Liability",
          text: "Ajarly is not liable for: property condition or accuracy of listings, guest or host behavior, property damage, personal injury, or losses arising from bookings. We provide the platform 'as is' without warranties.",
        },
        {
          subtitle: "Insurance",
          text: "We strongly recommend both hosts and guests obtain appropriate insurance coverage. Ajarly offers optional host protection insurance through third-party providers.",
        },
        {
          subtitle: "Dispute Resolution",
          text: "Users should first attempt to resolve disputes directly. If unsuccessful, contact our support team for mediation. For legal disputes, Egyptian law governs these terms and disputes will be resolved in Egyptian courts.",
        },
      ],
    },
  ];

  const additionalTerms = [
    {
      title: "Intellectual Property",
      text: "All Ajarly content, trademarks, and branding are owned by Ajarly. Users may not use our intellectual property without permission. User-generated content remains owned by users but grants Ajarly a license to use it for platform operations.",
    },
    {
      title: "Privacy",
      text: "Your use of Ajarly is subject to our Privacy Policy, which explains how we collect, use, and protect your personal information. By using our services, you consent to our privacy practices.",
    },
    {
      title: "Communications",
      text: "By creating an account, you agree to receive transactional communications via email and SMS. You can opt out of marketing communications but will still receive essential booking-related messages.",
    },
    {
      title: "Changes to Terms",
      text: "We may update these Terms & Conditions periodically. Significant changes will be communicated via email or platform notifications. Continued use after changes constitute acceptance of new terms.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00BFA6] to-[#00A890] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Scale className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl opacity-90">
            Please read these terms carefully before using Ajarly's services
          </p>
          <p className="text-sm opacity-75 mt-4">Last Updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#2B2B2B] mb-4">Agreement to Terms</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Welcome to Ajarly! These Terms and Conditions ("Terms") govern your use of our vacation rental platform 
            connecting guests with property owners across Egypt's Mediterranean coast. By accessing or using Ajarly, 
            you agree to be bound by these Terms.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            If you do not agree with any part of these Terms, you may not use our services. These Terms constitute 
            a legally binding agreement between you and Ajarly. Please read them carefully.
          </p>
        </Card>

        {/* Main Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={index} className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#F9F6F1] rounded-lg">{section.icon}</div>
                <h2 className="text-3xl font-bold text-[#2B2B2B]">{section.title}</h2>
              </div>
              <div className="space-y-6">
                {section.content.map((item, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-xl text-[#2B2B2B] mb-2">{item.subtitle}</h3>
                    <p className="text-gray-700 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {/* Additional Terms */}
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-[#2B2B2B] mb-6">Additional Terms</h2>
            <div className="space-y-6">
              {additionalTerms.map((term, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-xl text-[#2B2B2B] mb-2">{term.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{term.text}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Governing Law */}
          <Card className="p-8 bg-blue-50 border-blue-200">
            <h2 className="text-2xl font-bold text-[#2B2B2B] mb-4">Governing Law and Jurisdiction</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by the laws of the Arab Republic of Egypt. Any disputes arising from these 
              Terms or your use of Ajarly will be subject to the exclusive jurisdiction of Egyptian courts. For 
              international users, local consumer protection laws may also apply.
            </p>
          </Card>

          {/* Contact Information */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-[#2B2B2B] mb-4">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> legal@ajarly.com</p>
              <p><strong>Phone:</strong> +20 123 456 7890</p>
              <p><strong>Address:</strong> 123 Corniche Road, Alexandria, Egypt 21500</p>
            </div>
          </Card>

          {/* Acceptance */}
          <Card className="p-8 bg-green-50 border-green-200">
            <h2 className="text-2xl font-bold text-[#2B2B2B] mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By creating an account, making a booking, listing a property, or otherwise using Ajarly's services, 
              you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions 
              and our Privacy Policy. These documents together form the complete agreement between you and Ajarly.
            </p>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4">Have Questions?</h2>
          <p className="text-gray-700 mb-8">
            Our legal team and support staff are here to help clarify any terms or address your concerns.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#00BFA6] hover:bg-[#00A890]"
              onClick={() => onNavigate("contact")}
            >
              Contact Us
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => onNavigate("privacy-policy")}
            >
              Read Privacy Policy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
