import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ArrowLeft, Mail, CheckCircle, Globe } from "lucide-react";
import { Card } from "../ui/card";
import { Language, translations } from "../../lib/translations";

interface ForgotPasswordPageProps {
  onNavigate: (page: string) => void;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export function ForgotPasswordPage({ onNavigate, language = "en", onLanguageChange }: ForgotPasswordPageProps) {
  const t = translations[language].forgotPassword;
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock password reset - in real app, would send reset email
    setIsSubmitted(true);
  };

  const toggleLanguage = () => {
    if (onLanguageChange) {
      onLanguageChange(language === "en" ? "ar" : "en");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Language Toggle - Fixed Top Right */}
      <button
        onClick={toggleLanguage}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-full shadow-lg transition-all hover:shadow-xl"
        title={language === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
      >
        <Globe className="w-4 h-4 text-[#00BFA6]" />
        <span className="font-medium text-sm">
          {language === "en" ? "العربية" : "EN"}
        </span>
      </button>

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          <div>
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-[#00BFA6] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="font-bold text-2xl text-[#2B2B2B]">Ajarly</span>
            </button>

            <button
              onClick={() => onNavigate("login")}
              className="flex items-center gap-2 text-gray-600 hover:text-[#00BFA6] mb-6 transition-colors"
            >
              <ArrowLeft className={`w-4 h-4 ${language === "ar" ? "rotate-180" : ""}`} />
              <span>{t.backToLogin}</span>
            </button>

            {!isSubmitted ? (
              <>
                <h2 className="text-3xl font-bold text-[#2B2B2B]">{t.title}</h2>
                <p className="mt-2 text-gray-600">
                  {t.subtitle}
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-[#2B2B2B] text-center">{t.checkEmail}</h2>
                <p className="mt-2 text-gray-600 text-center">
                  {t.emailSent} <span className="font-semibold">{email}</span>
                </p>
              </>
            )}
          </div>

          {!isSubmitted ? (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">{t.emailLabel}</Label>
                <div className="relative mt-1">
                  <div className={`absolute inset-y-0 ${language === "ar" ? "right-0 pr-3" : "left-0 pl-3"} flex items-center pointer-events-none`}>
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={language === "ar" ? "pr-10" : "pl-10"}
                    placeholder={t.emailPlaceholder}
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-[#00BFA6] hover:bg-[#00A890] text-white"
                  size="lg"
                >
                  {t.sendResetLink}
                </Button>
              </div>
            </form>
          ) : (
            <div className="mt-8 space-y-4">
              <Card className="p-4 bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-800">
                  {t.didntReceive}{" "}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="font-semibold text-[#00BFA6] hover:underline"
                  >
                    {t.tryAnother}
                  </button>
                </p>
              </Card>
              <Button
                onClick={() => onNavigate("login")}
                variant="outline"
                className="w-full"
                size="lg"
              >
                {t.backToLogin}
              </Button>
            </div>
          )}

          {!isSubmitted && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t.rememberPassword}{" "}
                <button
                  type="button"
                  onClick={() => onNavigate("login")}
                  className="font-medium text-[#00BFA6] hover:text-[#00A890]"
                >
                  {t.signIn}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:flex-1 relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1758983198369-7a424e3a482c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2FzdGFsJTIwc3Vuc2V0JTIwZWd5cHR8ZW58MXx8fHwxNzYxMTYxMzc5fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Egyptian Coast"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#00BFA6]/20 to-transparent" />
      </div>
    </div>
  );
}
