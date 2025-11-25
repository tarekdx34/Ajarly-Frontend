import { Button } from "../../ui/button";
import { Language } from "../../../lib/translations";

interface HostCTAProps {
  language: Language;
  onNavigate: (page: string) => void;
}

export function HostCTA({ language, onNavigate }: HostCTAProps) {
  return (
    <section className="bg-gradient-to-r from-[#00BFA6] to-[#00A890] rounded-3xl p-12 text-center text-white">
      <h2 className="text-3xl md:text-4xl font-semibold mb-4">
        {language === "ar" ? "كن مضيفاً اليوم" : "Become a Host Today"}
      </h2>
      <p className="text-xl mb-8 text-white/90">
        {language === "ar"
          ? "شارك مساحتك واكسب دخلاً إضافياً مع أجارلي"
          : "Share your space and earn extra income with Ajarly"}
      </p>
      <Button
        onClick={() => onNavigate("host-dashboard")}
        size="lg"
        className="bg-white text-[#00BFA6] hover:bg-gray-100"
      >
        {language === "ar" ? "ابدأ الآن" : "Get Started"}
      </Button>
    </section>
  );
}
