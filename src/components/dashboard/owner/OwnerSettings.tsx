// src/components/dashboard/OwnerSettings.tsx
import { useState } from "react";
import { Language, translations } from "../../../lib/translations";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "../../../hooks/useProfile";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import type {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "../../../../api";

interface OwnerSettingsProps {
  profile: UserProfile | null;
  language: Language;
}

export function OwnerSettings({
  profile: initialProfile,
  language,
}: OwnerSettingsProps) {
  const t = translations[language];
  const { profile, updateProfile, uploadAvatar, changePassword } = useProfile();
  const [activeSection, setActiveSection] = useState<
    "profile" | "business" | "security"
  >("profile");
  const [uploading, setUploading] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState<UpdateProfileRequest>({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    bio: profile?.bio || "",
    governorate: profile?.governorate || "",
    city: profile?.city || "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile(profileForm);
      toast.success("Profile updated successfully!");
    } catch (error) {
      // Error is handled by useProfile hook
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await changePassword(passwordForm);
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      // Error is handled by useProfile hook
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    try {
      setUploading(true);
      await uploadAvatar(file);
    } catch (error) {
      // Error is handled by useProfile hook
    } finally {
      setUploading(false);
    }
  };

  if (!profile) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#00BFA6] mx-auto" />
      </div>
    );
  }

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"}>
      <h2
        className={`text-2xl font-semibold text-[#2B2B2B] mb-6 ${
          language === "ar" ? "text-right" : "text-left"
        }`}
      >
        {t.hostDashboard.accountSettings}
      </h2>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveSection("profile")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeSection === "profile"
              ? "border-[#00BFA6] text-[#00BFA6] font-semibold"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          {t.hostDashboard.profile}
        </button>
        <button
          onClick={() => setActiveSection("business")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeSection === "business"
              ? "border-[#00BFA6] text-[#00BFA6] font-semibold"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          {t.hostDashboard.businessInfo}{" "}
        </button>
        <button
          onClick={() => setActiveSection("security")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeSection === "security"
              ? "border-[#00BFA6] text-[#00BFA6] font-semibold"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          {t.hostDashboard.security}
        </button>
      </div>

      {/* Profile Section */}
      {activeSection === "profile" && (
        <Card className="p-6 max-w-2xl">
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                  {profile.profilePhoto ? (
                    <img
                      src={profile.profilePhoto}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-gray-500">
                      {profile.firstName?.charAt(0)}
                      {profile.lastName?.charAt(0)}
                    </div>
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-[#00BFA6] text-white p-2 rounded-full cursor-pointer hover:bg-[#00A890] transition-colors"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              <div className={language === "ar" ? "text-right" : "text-left"}>
                <h3 className="font-semibold text-[#2B2B2B]">
                  {t.hostDashboard.profilePhoto}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {t.hostDashboard.uploadPhoto}
                </p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3
                className={`font-semibold text-[#2B2B2B] ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t.hostDashboard.personalInformation}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">
                    {t.hostDashboard.firstName} *
                  </Label>
                  <Input
                    id="firstName"
                    value={profileForm.firstName}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        firstName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">{t.hostDashboard.lastName} *</Label>{" "}
                  <Input
                    id="lastName"
                    value={profileForm.lastName}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        lastName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">{t.hostDashboard.emailAddress}</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t.hostDashboard.emailCannotChange}
                </p>
              </div>

              <div>
                <Label htmlFor="phone">{t.hostDashboard.phoneNumber}</Label>
                <Input
                  id="phone"
                  value={profile.phoneNumber}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t.hostDashboard.phoneCannotChange}
                </p>
              </div>

              <div>
                <Label htmlFor="bio">{t.hostDashboard.bio}</Label>
                <Textarea
                  id="bio"
                  value={profileForm.bio}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, bio: e.target.value })
                  }
                  rows={3}
                  placeholder={t.hostDashboard.bioPlaceholder}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3
                className={`font-semibold text-[#2B2B2B] ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t.hostDashboard.location}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="governorate">
                    {t.hostDashboard.governorate}
                  </Label>{" "}
                  <Input
                    id="governorate"
                    value={profileForm.governorate}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        governorate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="city">{t.hostDashboard.city}</Label>{" "}
                  <Input
                    id="city"
                    value={profileForm.city}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, city: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full md:w-auto">
              {t.hostDashboard.saveChanges}
            </Button>
          </form>
        </Card>
      )}

      {/* Business Info Section */}
      {activeSection === "business" && (
        <Card className="p-6 max-w-2xl">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3
                className={`font-semibold text-[#2B2B2B] ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t.hostDashboard.businessInformation}
              </h3>

              <div>
                <Label htmlFor="businessName">
                  {t.hostDashboard.businessName}
                </Label>{" "}
                <Input
                  id="businessName"
                  defaultValue={`${profile.firstName} ${profile.lastName}`}
                  placeholder="Your business name"
                />
              </div>

              <div>
                <Label htmlFor="businessType">
                  {t.hostDashboard.businessType}
                </Label>{" "}
                <Select defaultValue="individual">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">
                      {t.hostDashboard.individualHost}
                    </SelectItem>
                    <SelectItem value="company">
                      {t.hostDashboard.propertyManagement}
                    </SelectItem>
                    <SelectItem value="agency">
                      {t.hostDashboard.realEstateAgency}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="taxId">{t.hostDashboard.taxId}</Label>
                <Input id="taxId" placeholder="Enter your tax ID" />
              </div>
            </div>
            <div className="space-y-4">
              <h3
                className={`font-semibold text-[#2B2B2B] ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t.hostDashboard.contactPreferences}
              </h3>

              <div>
                <Label htmlFor="whatsapp">{t.hostDashboard.whatsapp}</Label>
                <Input id="whatsapp" placeholder="+20 123 456 7890" />
                <p className="text-xs text-gray-500 mt-1">
                  {t.hostDashboard.whatsappContact}
                </p>
              </div>
              <div>
                <Label htmlFor="website">{t.hostDashboard.website}</Label>{" "}
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
            <Button className="w-full md:w-auto">
              {t.hostDashboard.saveBusiness}
            </Button>{" "}
          </div>
        </Card>
      )}

      {/* Security Section */}
      {activeSection === "security" && (
        <Card className="p-6 max-w-2xl">
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div className="space-y-4">
              <h3
                className={`font-semibold text-[#2B2B2B] ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t.hostDashboard.changePassword}
              </h3>
              <div>
                <Label htmlFor="currentPassword">
                  {t.hostDashboard.currentPassword} *
                </Label>{" "}
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      oldPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="newPassword">
                  {t.hostDashboard.newPassword} *
                </Label>{" "}
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t.hostDashboard.mustBe6Chars}
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">
                  {t.hostDashboard.confirmPassword} *
                </Label>{" "}
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button type="submit" className="w-full md:w-auto">
              {t.hostDashboard.changePassword}
            </Button>
          </form>

          {/* Account Status */}
          <div className="mt-8 pt-8 border-t space-y-4">
            <h3
              className={`font-semibold text-[#2B2B2B] ${
                language === "ar" ? "text-right" : "text-left"
              }`}
            >
              {t.hostDashboard.accountStatus}
            </h3>
            <div
              className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg ${
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <div className={language === "ar" ? "text-right" : "text-left"}>
                <p className="font-medium text-sm">
                  {t.hostDashboard.emailVerification}
                </p>
                <p className="text-xs text-gray-600">
                  {profile.emailVerified
                    ? t.hostDashboard.verified
                    : t.hostDashboard.notVerified}
                </p>
              </div>
              {!profile.emailVerified && (
                <Button variant="outline" size="sm">
                  {t.hostDashboard.verifyEmail}
                </Button>
              )}
            </div>

            <div
              className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg ${
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <div className={language === "ar" ? "text-right" : "text-left"}>
                <p className="font-medium text-sm">
                  {t.hostDashboard.phoneVerification}
                </p>
                <p className="text-xs text-gray-600">
                  {profile.phoneVerified
                    ? t.hostDashboard.verified
                    : t.hostDashboard.notVerified}
                </p>
              </div>
              {!profile.phoneVerified && (
                <Button variant="outline" size="sm">
                  {t.hostDashboard.verifyPhone}
                </Button>
              )}
            </div>

            <div
              className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg ${
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <div className={language === "ar" ? "text-right" : "text-left"}>
                <p className="font-medium text-sm">
                  {t.hostDashboard.nationalIdVerification}
                </p>
                <p className="text-xs text-gray-600">
                  {profile.nationalIdVerified
                    ? t.hostDashboard.verified
                    : t.hostDashboard.notVerified}
                </p>
              </div>
              {!profile.nationalIdVerified && (
                <Button variant="outline" size="sm">
                  {t.hostDashboard.submitId}
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
