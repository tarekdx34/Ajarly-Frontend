import { Card } from "../ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Button } from "../ui/button";
import { HelpCircle, Search, Home, User } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Language, translations } from "../../lib/translations";

interface FAQPageProps {
  onNavigate: (page: string) => void;
  language?: Language;
}

export function FAQPage({ onNavigate, language = "en" }: FAQPageProps) {
  const t = translations[language].faq;
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      title: t.forRenters,
      icon: <User className="w-5 h-5" />,
      faqs: [
        {
          question: "How do I book a property on Ajarly?",
          answer: "Booking is simple! Browse properties, select your dates, click 'Book Now', and complete the secure payment process. You'll receive instant confirmation with all the details you need.",
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit and debit cards (Visa, Mastercard, American Express), as well as local Egyptian payment methods. All transactions are secure and encrypted.",
        },
        {
          question: "What is the cancellation policy?",
          answer: "Cancellation policies vary by property. Most hosts offer flexible cancellation up to 48 hours before check-in. You can view the specific policy on each property's listing page before booking.",
        },
        {
          question: "How do I contact a host?",
          answer: "Once you book a property, you can message the host directly through your dashboard. You'll also receive the host's contact information in your booking confirmation email.",
        },
        {
          question: "What if I have issues during my stay?",
          answer: "Contact your host first for immediate assistance. You can also reach our 24/7 support team through the Support page or by calling our hotline. We're here to help resolve any issues quickly.",
        },
        {
          question: "Can I modify my booking dates?",
          answer: "Yes! You can request to modify your booking dates through your dashboard. The host will need to approve any changes, and the new dates are subject to availability and pricing.",
        },
      ],
    },
    {
      title: t.forOwners,
      icon: <Home className="w-5 h-5" />,
      faqs: [
        {
          question: "How do I list my property on Ajarly?",
          answer: "Click 'Become a Host' in the navigation, create an account, and follow our simple 4-step listing process. Add photos, describe your property, set your pricing, and submit for approval. We typically review listings within 24 hours.",
        },
        {
          question: "How much does it cost to list a property?",
          answer: "Listing your property is completely FREE! We only charge a small service fee (10-15%) when you receive a confirmed booking. No upfront costs or monthly fees.",
        },
        {
          question: "When do I receive payment for bookings?",
          answer: "Payments are transferred to your account 24 hours after the guest's check-in date. This protects both you and the guest. You can track all earnings in your Host Dashboard.",
        },
        {
          question: "Can I set my own pricing and availability?",
          answer: "Absolutely! You have full control over your pricing, seasonal rates, minimum stay requirements, and calendar availability. You can update these anytime from your Host Dashboard.",
        },
        {
          question: "What happens if a guest cancels?",
          answer: "Your cancellation policy determines what happens. We recommend our 'Flexible' policy for more bookings, but you can choose 'Moderate' or 'Strict' policies. You'll receive partial or full payment based on when the cancellation occurs.",
        },
        {
          question: "How do I handle guest reviews?",
          answer: "After each stay, both you and the guest can leave reviews. Reviews are published after both parties submit theirs or after 14 days. Professional, honest responses to reviews help build trust with future guests.",
        },
        {
          question: "What support do hosts receive?",
          answer: "We provide 24/7 host support, professional photography assistance, pricing recommendations, and marketing tools to help your listing stand out. Our team is always here to help you succeed.",
        },
      ],
    },
    {
      title: t.general,
      icon: <HelpCircle className="w-5 h-5" />,
      faqs: [
        {
          question: "Which areas does Ajarly cover?",
          answer: "Ajarly specializes in coastal vacation rentals across Alexandria, Matrouh, and the North Coast of Egypt. We're constantly expanding to bring you more beautiful Mediterranean destinations.",
        },
        {
          question: "Is Ajarly available in Arabic?",
          answer: "Yes! Ajarly is a fully bilingual platform supporting both Arabic and English. You can switch languages using the toggle in the navigation bar. All listings and communications are available in both languages.",
        },
        {
          question: "How do you verify property listings?",
          answer: "Every property goes through our verification process before being published. We verify ownership, review photos, and ensure accuracy of amenities and descriptions. Properties that don't meet our standards are not approved.",
        },
        {
          question: "Are there any hidden fees?",
          answer: "No hidden fees! The total price shown at checkout includes all costs (nightly rate, cleaning fee, service fee, and taxes). What you see is what you pay.",
        },
        {
          question: "How do I report a problem or suspicious activity?",
          answer: "You can report any issues through the Support page or your dashboard. We take all reports seriously and investigate promptly to maintain a safe, trustworthy platform for everyone.",
        },
        {
          question: "Do you offer customer support?",
          answer: "Yes! We offer 24/7 customer support via phone, email, and live chat. Our dedicated team is here to help with any questions or issues you might have.",
        },
      ],
    },
  ];

  const filteredCategories = faqCategories.map((category) => ({
    ...category,
    faqs: category.faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00BFA6] to-[#00A890] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl opacity-90 mb-8">
            {t.subtitle}
          </p>
          
          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className={`absolute ${language === "ar" ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${language === "ar" ? "pr-12" : "pl-12"} h-14 text-lg bg-white`}
            />
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredCategories.length > 0 ? (
          <div className="space-y-12">
            {filteredCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#00BFA6] text-white rounded-lg">
                    {category.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-[#2B2B2B]">{category.title}</h2>
                </div>
                
                <Card className="p-6">
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`} className="border-b last:border-0">
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className="font-semibold text-[#2B2B2B]">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-gray-700 leading-relaxed pt-2">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#2B2B2B] mb-2">{t.noResults}</h3>
            <p className="text-gray-600 mb-6">{t.noResultsDesc}</p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              {t.clearSearch}
            </Button>
          </Card>
        )}

        {/* Still Need Help */}
        <div className="mt-16 text-center bg-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4">{t.stillNeedHelp}</h2>
          <p className="text-gray-700 mb-8">
            {t.stillNeedHelpDesc}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#00BFA6] hover:bg-[#00A890]"
              onClick={() => onNavigate("contact")}
            >
              {t.contactSupport}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => onNavigate("support")}
            >
              {t.reportIssue}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}