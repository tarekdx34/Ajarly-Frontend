import { Card } from "../ui/card";
import { Shield, Lock, Eye, Database, Mail } from "lucide-react";
import { Button } from "../ui/button";

interface PrivacyPolicyPageProps {
  onNavigate: (page: string) => void;
}

export function PrivacyPolicyPage({ onNavigate }: PrivacyPolicyPageProps) {
  const lastUpdated = "October 23, 2025";

  const sections = [
    {
      icon: <Database className="w-6 h-6 text-[#00BFA6]" />,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "When you create an account, we collect your name, email address, phone number, and payment information. Property owners also provide business details and property information.",
        },
        {
          subtitle: "Usage Data",
          text: "We automatically collect information about how you use our platform, including pages visited, search queries, bookings made, and device information (IP address, browser type, operating system).",
        },
        {
          subtitle: "Communications",
          text: "We store messages exchanged between guests and hosts through our platform, as well as any communications you have with our support team.",
        },
      ],
    },
    {
      icon: <Eye className="w-6 h-6 text-[#00BFA6]" />,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Delivery",
          text: "We use your information to process bookings, facilitate payments, enable communication between users, and provide customer support.",
        },
        {
          subtitle: "Platform Improvement",
          text: "We analyze usage data to improve our services, develop new features, and enhance user experience. This includes personalizing search results and recommendations.",
        },
        {
          subtitle: "Communications",
          text: "We send transactional emails (booking confirmations, payment receipts) and may send promotional content about new features and offers. You can opt out of marketing emails anytime.",
        },
        {
          subtitle: "Safety and Security",
          text: "We use your information to prevent fraud, enforce our terms of service, and maintain the safety and security of our platform for all users.",
        },
      ],
    },
    {
      icon: <Shield className="w-6 h-6 text-[#00BFA6]" />,
      title: "Information Sharing",
      content: [
        {
          subtitle: "With Other Users",
          text: "When you book a property, we share necessary information with the host (name, contact details). Hosts' information is shared with confirmed guests.",
        },
        {
          subtitle: "Service Providers",
          text: "We work with trusted third-party service providers for payment processing, email delivery, cloud hosting, and analytics. These partners only access information necessary to perform their services.",
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose information when required by law, to enforce our policies, or to protect the rights, property, and safety of Ajarly, our users, or others.",
        },
        {
          subtitle: "Business Transfers",
          text: "If Ajarly is involved in a merger, acquisition, or sale of assets, your information may be transferred. We'll notify you before your information becomes subject to different privacy practices.",
        },
      ],
    },
    {
      icon: <Lock className="w-6 h-6 text-[#00BFA6]" />,
      title: "Data Security",
      content: [
        {
          subtitle: "Protection Measures",
          text: "We implement industry-standard security measures including SSL encryption, secure servers, regular security audits, and access controls to protect your personal information.",
        },
        {
          subtitle: "Payment Security",
          text: "All payment information is encrypted and processed through PCI-DSS compliant payment processors. We never store complete credit card numbers on our servers.",
        },
        {
          subtitle: "Account Security",
          text: "You're responsible for maintaining the confidentiality of your password. We recommend using strong passwords and enabling two-factor authentication when available.",
        },
      ],
    },
  ];

  const rights = [
    "Access your personal information and request a copy of data we hold about you",
    "Correct inaccurate or incomplete information in your account",
    "Request deletion of your account and personal data (subject to legal obligations)",
    "Object to or restrict certain processing of your information",
    "Export your data in a portable format",
    "Opt out of marketing communications at any time",
    "Lodge a complaint with your local data protection authority",
  ];

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00BFA6] to-[#00A890] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl opacity-90">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-sm opacity-75 mt-4">Last Updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <Card className="p-8 mb-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            At Ajarly, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            By using Ajarly's services, you agree to the collection and use of information in accordance with this policy. 
            If you have any questions about our privacy practices, please contact us at{" "}
            <a href="mailto:privacy@ajarly.com" className="text-[#00BFA6] hover:underline font-medium">
              privacy@ajarly.com
            </a>
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

          {/* Your Rights */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#F9F6F1] rounded-lg">
                <Mail className="w-6 h-6 text-[#00BFA6]" />
              </div>
              <h2 className="text-3xl font-bold text-[#2B2B2B]">Your Rights</h2>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              Under Egyptian law and international data protection regulations, you have the following rights:
            </p>
            <ul className="space-y-3">
              {rights.map((right, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#00BFA6] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-700">{right}</p>
                </li>
              ))}
            </ul>
            <p className="text-gray-700 mt-6">
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:privacy@ajarly.com" className="text-[#00BFA6] hover:underline font-medium">
                privacy@ajarly.com
              </a>
            </p>
          </Card>

          {/* Cookies */}
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-[#2B2B2B] mb-6">Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Ajarly uses cookies and similar tracking technologies to enhance your experience, analyze usage patterns, 
              and deliver personalized content. Cookies are small data files stored on your device.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use both session cookies (deleted when you close your browser) and persistent cookies (remain on your device 
              for a set period). You can control cookie settings through your browser preferences, though disabling cookies 
              may affect platform functionality.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Third-party services we use (Google Analytics, payment processors) may also use cookies. Please review their 
              privacy policies for more information.
            </p>
          </Card>

          {/* Children's Privacy */}
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-[#2B2B2B] mb-6">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Ajarly is not intended for users under 18 years of age. We do not knowingly collect personal information 
              from children. If you believe we have inadvertently collected information from a child, please contact us 
              immediately so we can delete it.
            </p>
          </Card>

          {/* Changes to Policy */}
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-[#2B2B2B] mb-6">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
              We'll notify you of significant changes via email or a prominent notice on our platform. Your continued use 
              of Ajarly after changes take effect constitutes acceptance of the updated policy.
            </p>
          </Card>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center bg-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4">Questions About Privacy?</h2>
          <p className="text-gray-700 mb-8">
            If you have any questions or concerns about our privacy practices, we're here to help.
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
              onClick={() => onNavigate("terms")}
            >
              Read Terms & Conditions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
