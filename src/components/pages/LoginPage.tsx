import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Language, translations } from "../../lib/translations";
import { Globe, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import api from "../../../api";
import logo from "../../assets/Logo.svg";

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLogin?: (email: string, password: string) => Promise<void>;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export function LoginPage({
  onNavigate,
  onLogin,
  language = "en",
  onLanguageChange,
}: LoginPageProps) {
  const t = translations[language].login;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (onLogin) {
        await onLogin(email, password);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        language === "en"
          ? err.message || "Invalid email or password. Please try again."
          : err.message ||
              "البريد الإلكتروني أو كلمة المرور غير صحيحة. حاول مرة أخرى."
      );
    } finally {
      setIsLoading(false);
    }
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
        title={
          language === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"
        }
      >
        <Globe className="w-4 h-4 text-[#00BFA6]" />
        <span className="font-medium text-sm">
          {language === "en" ? "العربية" : "EN"}
        </span>
      </button>

      {/* Left Side - Form */}
      <div className="flex-1 flex justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          <div>
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity"
            >
              <img src={logo} alt="Logo" className="w-34 h-34" />
            </button>

            <h2 className="text-3xl font-bold text-[#2B2B2B]">
              {t.welcomeBack}
            </h2>
            <p className="mt-2 text-gray-600">{t.subtitle}</p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">{t.emailLabel}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  placeholder={t.emailPlaceholder}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password">{t.passwordLabel}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder={t.passwordPlaceholder}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#00BFA6] focus:ring-[#00BFA6] border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember-me"
                  className={`${
                    language === "ar" ? "mr-2" : "ml-2"
                  } block text-sm text-gray-900`}
                >
                  {language === "ar" ? "تذكرني" : "Remember me"}
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => onNavigate("forgot-password")}
                  className="font-medium text-[#00BFA6] hover:text-[#00A890]"
                  disabled={isLoading}
                >
                  {t.forgotPassword}
                </button>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-[#00BFA6] hover:bg-[#00A890] text-white"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {language === "ar"
                      ? "جاري تسجيل الدخول..."
                      : "Signing in..."}
                  </>
                ) : (
                  t.loginButton
                )}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {language === "ar" ? "أو تابع مع" : "Or continue with"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600">
              {t.noAccount}{" "}
              <button
                type="button"
                onClick={() => onNavigate("register")}
                className="font-medium text-[#00BFA6] hover:text-[#00A890]"
                disabled={isLoading}
              >
                {t.signUp}
              </button>
            </p>
          </form>
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
