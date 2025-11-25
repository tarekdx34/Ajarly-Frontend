import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Language, translations } from "../../lib/translations";
import { Globe, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import api from "../../../api";
import logo from "../../assets/Logo.svg";

interface RegisterPageProps {
  onNavigate: (page: string) => void;
  initialRole?: "renter" | "landlord" | "owner";
  onRegister?: (
    name: string,
    email: string,
    password: string,
    role: "renter" | "owner"
  ) => Promise<void>;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export function RegisterPage({
  onNavigate,
  initialRole = "renter",
  onRegisterSuccess,
  language = "en",
  onLanguageChange,
}: RegisterPageProps) {
  const t = translations[language].register;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    userType: initialRole,
  });

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!formData.firstName.trim()) {
      errors.firstName =
        language === "en" ? "First name is required" : "الاسم الأول مطلوب";
    }
    if (!formData.lastName.trim()) {
      errors.lastName =
        language === "en" ? "Last name is required" : "اسم العائلة مطلوب";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email =
        language === "en"
          ? "Invalid email format"
          : "صيغة البريد الإلكتروني غير صحيحة";
    }

    // Phone validation (Egyptian format)
    const phoneRegex = /^01[0125][0-9]{8}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber =
        language === "en"
          ? "Invalid Egyptian phone number (e.g., 01012345678)"
          : "رقم هاتف مصري غير صحيح (مثال: 01012345678)";
    }

    // Password validation
    if (formData.password.length < 8) {
      errors.password =
        language === "en"
          ? "Password must be at least 8 characters"
          : "يجب أن تكون كلمة المرور 8 أحرف على الأقل";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword =
        language === "en"
          ? "Passwords do not match"
          : "كلمات المرور غير متطابقة";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call API register
      const response = await api.register({
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        userType: formData.userType,
      });

      console.log("✅ Registration successful:", response);

      // Get user profile after successful registration
      const userProfile = await api.getProfile();

      console.log("✅ Profile fetched:", userProfile);

      // Create complete user object with all necessary data
      const completeUserData = {
        ...response,
        profile: userProfile,
        // Ensure these key properties are set
        name: `${userProfile.firstName || formData.firstName} ${
          userProfile.lastName || formData.lastName
        }`,
        email: userProfile.email || formData.email,
        userType: userProfile.userType || formData.userType,
        role: userProfile.userType || formData.userType, // Some components might use 'role'
        profilePhoto: userProfile.profilePhoto || null,
      };

      console.log("✅ Complete user data:", completeUserData);

      // Pass user data to parent component BEFORE navigation
      if (onRegisterSuccess) {
        onRegisterSuccess(completeUserData);
      }

      // Small delay to ensure state updates
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Navigate based on user type
      if (userProfile.userType === "landlord") {
        onNavigate("host-dashboard");
      } else {
        onNavigate("user-dashboard");
      }
    } catch (err: any) {
      console.error("❌ Registration error:", err);

      // Handle validation errors from backend
      if (err.data?.errors) {
        setValidationErrors(err.data.errors);
      }

      setError(
        language === "en"
          ? err.message || "Registration failed. Please try again."
          : err.message || "فشل التسجيل. حاول مرة أخرى."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
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

      {/* Left Side - Image */}
      <div className="hidden lg:block lg:flex-1 relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1729720281771-b790dfb6ec7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWFjaCUyMHZpbGxhfGVufDF8fHx8MTc2MTA5ODc1Nnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Luxury Villa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#00BFA6]/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white text-center">
            <h2 className="text-4xl font-bold mb-4">
              {language === "ar"
                ? "انضم إلى أجارلي اليوم"
                : "Join Ajarly Today"}
            </h2>
            <p className="text-xl text-white/90">
              {language === "ar"
                ? "ابدأ رحلتك إلى تجارب لا تُنسى"
                : "Start your journey to unforgettable experiences"}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          <div>
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity"
            >
              <div className="rounded-full flex items-center justify-center">
                <img src={logo} alt="Logo" className="w-34 h-34" />
              </div>
            </button>

            <h2 className="text-3xl font-bold text-[#2B2B2B]">
              {t.createAccount}
            </h2>
            <p className="mt-2 text-gray-600">
              {language === "ar"
                ? "ابدأ مغامرتك مع أجارلي"
                : "Start your adventure with Ajarly"}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* First Name */}
              <div>
                <Label htmlFor="firstName">
                  {language === "ar" ? "الاسم الأول" : "First Name"}
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className={`mt-1 ${
                    validationErrors.firstName ? "border-red-500" : ""
                  }`}
                  placeholder={language === "ar" ? "أحمد" : "Ahmed"}
                  disabled={isLoading}
                />
                {validationErrors.firstName && (
                  <p className="text-sm text-red-500 mt-1">
                    {validationErrors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <Label htmlFor="lastName">
                  {language === "ar" ? "اسم العائلة" : "Last Name"}
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className={`mt-1 ${
                    validationErrors.lastName ? "border-red-500" : ""
                  }`}
                  placeholder={language === "ar" ? "محمد" : "Mohamed"}
                  disabled={isLoading}
                />
                {validationErrors.lastName && (
                  <p className="text-sm text-red-500 mt-1">
                    {validationErrors.lastName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">{t.emailLabel}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`mt-1 ${
                    validationErrors.email ? "border-red-500" : ""
                  }`}
                  placeholder={t.emailPlaceholder}
                  disabled={isLoading}
                />
                {validationErrors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phoneNumber">
                  {language === "ar" ? "رقم الهاتف" : "Phone Number"}
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  className={`mt-1 ${
                    validationErrors.phoneNumber ? "border-red-500" : ""
                  }`}
                  placeholder="01012345678"
                  disabled={isLoading}
                />
                {validationErrors.phoneNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {validationErrors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">{t.passwordLabel}</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`mt-1 ${
                    validationErrors.password ? "border-red-500" : ""
                  }`}
                  placeholder={t.passwordPlaceholder}
                  disabled={isLoading}
                />
                {validationErrors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword">
                  {t.confirmPasswordLabel}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  className={`mt-1 ${
                    validationErrors.confirmPassword ? "border-red-500" : ""
                  }`}
                  placeholder={t.confirmPasswordPlaceholder}
                  disabled={isLoading}
                />
                {validationErrors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* User Type Selection */}
              <div>
                <Label className="mb-3 block">
                  {language === "ar" ? "أريد أن" : "I want to"}
                </Label>
                <RadioGroup
                  value={formData.userType}
                  onValueChange={(value) => handleChange("userType", value)}
                  className="flex gap-4"
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="renter" id="renter" />
                    <Label
                      htmlFor="renter"
                      className="font-normal cursor-pointer"
                    >
                      {t.asRenter}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="landlord" id="landlord" />
                    <Label
                      htmlFor="landlord"
                      className="font-normal cursor-pointer"
                    >
                      {t.asHost}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-[#00BFA6] focus:ring-[#00BFA6] border-gray-300 rounded mt-1"
                disabled={isLoading}
              />
              <label
                htmlFor="terms"
                className={`${
                  language === "ar" ? "mr-2" : "ml-2"
                } block text-sm text-gray-900`}
              >
                {t.agreeToTerms}{" "}
                <button
                  type="button"
                  onClick={() => onNavigate("terms")}
                  className="text-[#00BFA6] hover:text-[#00A890]"
                  disabled={isLoading}
                >
                  {t.termsAndConditions}
                </button>{" "}
                {t.and}{" "}
                <button
                  type="button"
                  onClick={() => onNavigate("privacy-policy")}
                  className="text-[#00BFA6] hover:text-[#00A890]"
                  disabled={isLoading}
                >
                  {t.privacyPolicy}
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                className="w-full bg-[#FF6B6B] hover:bg-[#FF5252] text-white"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {language === "ar"
                      ? "جاري إنشاء الحساب..."
                      : "Creating account..."}
                  </>
                ) : (
                  t.createAccountButton
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
              <Button type="button" variant="outline" className="w-full">
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
              <Button type="button" variant="outline" className="w-full">
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
              {t.alreadyHaveAccount}{" "}
              <button
                type="button"
                onClick={() => onNavigate("login")}
                className="font-medium text-[#00BFA6] hover:text-[#00A890]"
              >
                {t.signIn}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
