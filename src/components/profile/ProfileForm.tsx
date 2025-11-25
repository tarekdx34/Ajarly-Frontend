// src/components/dashboard/renter/profile/ProfileForm.tsx
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { UserProfile, UpdateProfileRequest } from "../../../api";
import { Loader2 } from "lucide-react";

interface ProfileFormProps {
  profile: UserProfile;
  onSubmit: (data: UpdateProfileRequest) => Promise<void>;
  loading: boolean;
}

export function ProfileForm({ profile, onSubmit, loading }: ProfileFormProps) {
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    bio: profile.bio || '',
    governorate: profile.governorate || '',
    city: profile.city || ''
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Check if form has changes
    const changed = 
      formData.firstName !== profile.firstName ||
      formData.lastName !== profile.lastName ||
      formData.bio !== (profile.bio || '') ||
      formData.governorate !== (profile.governorate || '') ||
      formData.city !== (profile.city || '');
    
    setHasChanges(changed);
  }, [formData, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio || '',
      governorate: profile.governorate || '',
      city: profile.city || ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={profile.email}
          disabled
          className="mt-1 bg-gray-50"
        />
        <p className="text-xs text-gray-500 mt-1">
          Email cannot be changed
        </p>
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={profile.phoneNumber}
          disabled
          className="mt-1 bg-gray-50"
        />
        <p className="text-xs text-gray-500 mt-1">
          Phone number cannot be changed
        </p>
      </div>

      <div>
        <Label htmlFor="bio">About You</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell us about yourself..."
          className="mt-1"
          rows={4}
        />
        <p className="text-xs text-gray-500 mt-1">
        {(formData.bio?.length || 0)}/500 characters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="governorate">Governorate</Label>
          <Input
            id="governorate"
            value={formData.governorate}
            onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
            placeholder="e.g., Cairo"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="e.g., Nasr City"
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={!hasChanges || loading}
          className="bg-[#00BFA6] hover:bg-[#00A890]"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Changes
        </Button>

        {hasChanges && (
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}