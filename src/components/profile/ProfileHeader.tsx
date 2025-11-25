// src/components/dashboard/renter/profile/ProfileHeader.tsx
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { UserProfile } from "../../../api";
import { Calendar, Shield, Phone, Mail } from "lucide-react";

interface ProfileHeaderProps {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const getInitials = () => {
    return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  };

  const getMemberSince = () => {
    const date = new Date(profile.createdAt);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="flex items-start gap-6 pb-6 border-b">
      <Avatar className="w-24 h-24">
        <AvatarImage src={profile.profilePhoto} alt={`${profile.firstName} ${profile.lastName}`} />
        <AvatarFallback className="bg-[#00BFA6] text-white text-2xl">
          {getInitials()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-semibold text-[#2B2B2B]">
            {profile.firstName} {profile.lastName}
          </h2>
          {profile.nationalIdVerified && (
            <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200">
              <Shield className="w-3 h-3" />
              Verified
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Member since {getMemberSince()}</span>
          </div>

          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            <span>{profile.email}</span>
            {profile.emailVerified && (
              <Badge variant="outline" className="ml-1 text-xs">Verified</Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            <span>{profile.phoneNumber}</span>
            {profile.phoneVerified && (
              <Badge variant="outline" className="ml-1 text-xs">Verified</Badge>
            )}
          </div>
        </div>

        {profile.bio && (
          <p className="mt-3 text-sm text-gray-700">{profile.bio}</p>
        )}

        {(profile.governorate || profile.city) && (
          <p className="mt-2 text-sm text-gray-600">
            📍 {profile.city}, {profile.governorate}
          </p>
        )}
      </div>
    </div>
  );
}