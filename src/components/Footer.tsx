import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Language, translations } from "../lib/translations";

interface FooterProps {
  onNavigate?: (page: string) => void;
  language?: Language;
}

export function Footer({ onNavigate, language = "en" }: FooterProps) {
  const t = translations[language].footer;
  const handleClick = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <footer className="bg-[#F9F6F1] border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-[#2B2B2B] mb-4">{t.aboutAjarly}</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={(e) => handleClick(e, "about")}
                  className="text-gray-600 hover:text-[#00BFA6] transition-colors text-left"
                >
                  {t.aboutUs}
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleClick(e, "faq")}
                  className="text-gray-600 hover:text-[#00BFA6] transition-colors text-left"
                >
                  {t.howItWorks}
                </button>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00BFA6] transition-colors">
                  {t.careers}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00BFA6] transition-colors">
                  {t.press}
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-[#2B2B2B] mb-4">{t.community}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00BFA6] transition-colors">
                  {t.blog}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00BFA6] transition-colors">
                  {t.events}
                </a>
              </li>
              <li>
                <button
                  onClick={(e) => handleClick(e, "properties")}
                  className="text-gray-600 hover:text-[#00BFA6] transition-colors text-left"
                >
                  {t.travelGuides}
                </button>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00BFA6] transition-colors">
                  {t.partnerships}
                </a>
              </li>
            </ul>
          </div>

          {/* Hosting */}
          <div>
            <h3 className="font-semibold text-[#2B2B2B] mb-4">{t.hosting}</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={(e) => handleClick(e, "register?role=owner")}
                  className="text-gray-600 hover:text-[#00BFA6] transition-colors text-left"
                >
                  {t.becomeHost}
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleClick(e, "faq")}
                  className="text-gray-600 hover:text-[#00BFA6] transition-colors text-left"
                >
                  {t.hostResources}
                </button>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00BFA6] transition-colors">
                  {t.communityForum}
                </a>
              </li>
              <li>
                <button
                  onClick={(e) => handleClick(e, "terms")}
                  className="text-gray-600 hover:text-[#00BFA6] transition-colors text-left"
                >
                  {t.responsibleHosting}
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-[#2B2B2B] mb-4">{t.support}</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={(e) => handleClick(e, "faq")}
                  className="text-gray-600 hover:text-[#00BFA6] transition-colors text-left"
                >
                  {t.helpCenterFaq}
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleClick(e, "support")}
                  className="text-gray-600 hover:text-[#00BFA6] transition-colors text-left"
                >
                  {t.reportIssue}
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleClick(e, "terms")}
                  className="text-gray-600 hover:text-[#00BFA6] transition-colors text-left"
                >
                  {t.cancellationPolicy}
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleClick(e, "contact")}
                  className="text-gray-600 hover:text-[#00BFA6] transition-colors text-left"
                >
                  {t.contactUs}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <p>© 2025 Ajarly. {t.allRightsReserved}</p>
            <span>•</span>
            <button
              onClick={(e) => handleClick(e, "privacy-policy")}
              className="hover:text-[#00BFA6] transition-colors"
            >
              {t.privacy}
            </button>
            <span>•</span>
            <button
              onClick={(e) => handleClick(e, "terms")}
              className="hover:text-[#00BFA6] transition-colors"
            >
              {t.terms}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-600 hover:text-[#00BFA6] transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-[#00BFA6] transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-[#00BFA6] transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="mailto:support@ajarly.com" className="text-gray-600 hover:text-[#00BFA6] transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}