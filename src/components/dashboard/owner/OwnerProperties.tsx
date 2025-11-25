// src/components/dashboard/owner/OwnerProperties.tsx - WITH EDIT FUNCTIONALITY
import { useState } from "react";
import { Language, translations } from "../../../lib/translations";
import {
  Home,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Image as ImageIcon,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import api, { PropertyResponse } from "../../../../api";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { PropertyCard } from "../../PropertyCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";

interface OwnerPropertiesProps {
  properties: PropertyResponse[];
  onPropertyDeleted: () => void;
  onEditProperty?: (property: PropertyResponse) => void;
  onNavigate?: (page: string, propertyId?: string) => void;
  language: Language;
}

interface EditFormData {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  propertyType: string;
  rentalType: "both" | "vacation" | "long_term";
  governorate: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  guestsCapacity: number;
  pricePerNight: number;
  pricePerMonth?: number;
  furnished: boolean;
  petsAllowed: boolean;
}

export function OwnerProperties({
  properties,
  onPropertyDeleted,
  onEditProperty,
  onNavigate,
  language,
}: OwnerPropertiesProps) {
  const t = translations[language];
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] =
    useState<PropertyResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedPropertyImages, setSelectedPropertyImages] = useState<any[]>(
    []
  );

  // ✅ NEW: Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<PropertyResponse | null>(
    null
  );
  const [editFormData, setEditFormData] = useState<EditFormData | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleDeleteClick = (property: PropertyResponse) => {
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;

    try {
      setDeleting(true);
      await api.deleteProperty(propertyToDelete.propertyId);
      toast.success("Property deleted successfully");
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
      setTimeout(() => onPropertyDeleted(), 500);
    } catch (error: any) {
      console.error("❌ Delete error:", error);
      toast.error(error.message || "Failed to delete property");
    } finally {
      setDeleting(false);
    }
  };

  // ✅ NEW: Edit functionality
  const handleEditClick = (property: PropertyResponse) => {
    setPropertyToEdit(property);

    // ✅ FIX: Map old rental types to valid backend values
    let validRentalType = property.rentalType;
    if (validRentalType === "daily" || validRentalType === "short_term") {
      validRentalType = "vacation";
    } else if (!["both", "vacation", "long_term"].includes(validRentalType)) {
      validRentalType = "vacation"; // default fallback
    }

    // Initialize form with current property data - ALL fields
    setEditFormData({
      titleAr: property.titleAr || "",
      titleEn: property.titleEn || "",
      descriptionAr: property.descriptionAr || "",
      descriptionEn: property.descriptionEn || "",
      propertyType: property.propertyType || "apartment",
      rentalType: validRentalType as "both" | "vacation" | "long_term",
      governorate: property.governorate || "",
      city: property.city || "",
      bedrooms: property.bedrooms || 1,
      bathrooms: property.bathrooms || 1,
      guestsCapacity: property.guestsCapacity || 1,
      pricePerNight: property.pricePerNight || 0,
      pricePerMonth: property.pricePerMonth || undefined,
      furnished: property.furnished ?? false,
      petsAllowed: property.petsAllowed ?? false,
    });

    setEditDialogOpen(true);
  };

  const handleEditFormChange = (field: keyof EditFormData, value: any) => {
    if (!editFormData) return;

    setEditFormData({
      ...editFormData,
      [field]: value,
    });
  };

  const handleUpdateProperty = async () => {
    if (!propertyToEdit || !editFormData) return;

    // ✅ Validate required fields
    if (!editFormData.titleEn || !editFormData.titleAr) {
      toast.error("Title is required in both languages");
      return;
    }

    if (!editFormData.descriptionEn || !editFormData.descriptionAr) {
      toast.error("Description is required in both languages");
      return;
    }

    // ✅ Check authentication
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    try {
      setUpdating(true);

      // ✅ Prepare complete payload matching backend expectations
      const updatePayload = {
        titleAr: editFormData.titleAr.trim(),
        titleEn: editFormData.titleEn.trim(),
        descriptionAr: editFormData.descriptionAr.trim(),
        descriptionEn: editFormData.descriptionEn.trim(),
        propertyType: editFormData.propertyType,
        rentalType: editFormData.rentalType,
        governorate: editFormData.governorate.trim(),
        city: editFormData.city.trim(),
        bedrooms: Number(editFormData.bedrooms),
        bathrooms: Number(editFormData.bathrooms),
        guestsCapacity: Number(editFormData.guestsCapacity),
        pricePerNight: Number(editFormData.pricePerNight),
        furnished: Boolean(editFormData.furnished),
        petsAllowed: Boolean(editFormData.petsAllowed),
        // Include optional fields if they have values
        ...(editFormData.pricePerMonth && {
          pricePerMonth: Number(editFormData.pricePerMonth),
        }),
      };

      const updatedProperty = await api.updateProperty(
        propertyToEdit.propertyId,
        updatePayload
      );

      toast.success("Property updated successfully!");

      setEditDialogOpen(false);
      setPropertyToEdit(null);
      setEditFormData(null);

      // Refresh the properties list
      setTimeout(() => onPropertyDeleted(), 500);
    } catch (error: any) {
      console.error("❌ Update error:", error);
      console.error("❌ Error details:", {
        status: error.status,
        message: error.message,
        data: error.data,
      });

      // Better error handling
      if (error.status === 401 || error.status === 403) {
        toast.error("Authentication failed. Please log in again.");
      } else if (error.status === 400) {
        const errorMsg = error.data?.message || error.message || "Invalid data";
        toast.error(`Validation error: ${errorMsg}`);
      } else if (error.message.includes("Validation failed")) {
        toast.error("Please check all required fields are filled correctly");
      } else {
        toast.error(error.message || "Failed to update property");
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleViewImages = async (property: PropertyResponse) => {
    try {
      const images = await api.getPropertyImages(property.propertyId);
      setSelectedPropertyImages(images);
      setImageDialogOpen(true);
    } catch (error) {
      toast.error("Failed to load images");
    }
  };

  const handleViewProperty = (propertyId: number) => {
    if (onNavigate) {
      onNavigate("property-details", String(propertyId));
    } else {
      console.error("❌ onNavigate not provided!");
      toast.error("Navigation not available");
    }
  };

  const handleCardNavigate = (page: string, id?: string) => {
    if (page === "property-details" && id && onNavigate) {
      onNavigate("property-details", id);
    }
  };

  const getStatusBadge = (property: PropertyResponse) => {
    const status = property.status || property.approvalStatus || "inactive";
    const statusConfig: Record<string, { label: string; className: string }> = {
      active: {
        label: t.hostDashboard.active,
        className: "bg-green-100 text-green-700",
      },
      pending_approval: {
        label: t.hostDashboard.pending,
        className: "bg-yellow-100 text-yellow-700",
      },
      inactive: {
        label: t.admin.inactive,
        className: "bg-gray-100 text-gray-700",
      },
      rejected: {
        label: t.admin.rejected,
        className: "bg-red-100 text-red-700",
      },
    };
    const config = statusConfig[status] || statusConfig.inactive;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPropertyImages = (property: PropertyResponse) => {
    if (property.coverImage && Array.isArray(property.images)) {
      return property.images.map((img: any) =>
        typeof img === "string" ? img : img.imageUrl || img
      );
    }
    if (property.coverImage) return [property.coverImage];
    return [];
  };

  const normalizeProperty = (property: PropertyResponse): PropertyResponse => {
    return {
      ...property,
      titleEn: property.titleEn || property.titleAr || "Untitled Property",
      titleAr: property.titleAr || property.titleAr || "عقار بدون عنوان",
      averageRating: property.averageRating || 0,
      totalReviews: property.totalReviews || 0,
      pricePerNight: property.pricePerNight || 0,
      city: property.city || "Unknown",
      governorate: property.governorate || "Unknown",
    };
  };

  if (!properties || !Array.isArray(properties)) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: Invalid properties data</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div dir={language === "ar" ? "rtl" : "ltr"}>
        <div
          className={`flex items-center justify-between mb-6 ${
            language === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <h2 className="text-2xl font-semibold text-[#2B2B2B]">
            {t.hostDashboard.myProperties}
          </h2>
        </div>
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center">
            <Home className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {t.hostDashboard.noProperties}
            </h3>
            <p className="text-gray-500 mb-6">
              {t.hostDashboard.addFirstProperty}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"}>
      <div
        className={`flex items-center justify-between mb-6 ${
          language === "ar" ? "flex-row-reverse" : ""
        }`}
      >
        <h2 className="text-2xl font-semibold text-[#2B2B2B]">
          {t.hostDashboard.myProperties} ({properties.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => {
          const images = getPropertyImages(property);
          const normalizedProperty = normalizeProperty(property);

          return (
            <div key={property.propertyId} className="relative">
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                {getStatusBadge(property)}
                {images.length > 1 && (
                  <Badge
                    className={`bg-black/70 text-white cursor-pointer hover:bg-black ${
                      language === "ar" ? "flex-row-reverse" : ""
                    }`}
                    onClick={() => handleViewImages(property)}
                  >
                    <ImageIcon
                      className={`w-3 h-3 ${
                        language === "ar" ? "ml-1" : "mr-1"
                      }`}
                    />
                    {images.length}
                  </Badge>
                )}
              </div>

              <div className="absolute top-3 right-3 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/90 backdrop-blur-sm hover:bg-white"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleViewProperty(property.propertyId)}
                      className={language === "ar" ? "flex-row-reverse" : ""}
                    >
                      <Eye
                        className={`w-4 h-4 ${
                          language === "ar" ? "ml-2" : "mr-2"
                        }`}
                      />
                      {t.nav.viewDetails}
                    </DropdownMenuItem>
                    {images.length > 0 && (
                      <DropdownMenuItem
                        onClick={() => handleViewImages(property)}
                        className={language === "ar" ? "flex-row-reverse" : ""}
                      >
                        <ImageIcon
                          className={`w-4 h-4 ${
                            language === "ar" ? "ml-2" : "mr-2"
                          }`}
                        />
                        {t.hostDashboard.viewImages} ({images.length})
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleEditClick(property)}
                      className={language === "ar" ? "flex-row-reverse" : ""}
                    >
                      <Edit
                        className={`w-4 h-4 ${
                          language === "ar" ? "ml-2" : "mr-2"
                        }`}
                      />
                      {t.hostDashboard.edit}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteClick(property)}
                      className={`text-red-600 ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Trash2
                        className={`w-4 h-4 ${
                          language === "ar" ? "ml-2" : "mr-2"
                        }`}
                      />
                      {t.hostDashboard.delete}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <PropertyCard
                property={normalizedProperty}
                onNavigate={handleCardNavigate}
                language={language} // ✅ USE THE PROP
                showFavorite={false}
              />
            </div>
          );
        })}
      </div>

      {/* ✅ NEW: Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.hostDashboard.edit} Property</DialogTitle>
            <DialogDescription>
              Update your property information
            </DialogDescription>
          </DialogHeader>

          {editFormData && (
            <div className="space-y-4">
              {/* Title English */}
              <div>
                <Label htmlFor="titleEn">
                  Title (English) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="titleEn"
                  value={editFormData.titleEn}
                  onChange={(e) =>
                    handleEditFormChange("titleEn", e.target.value)
                  }
                  placeholder="Luxury Apartment..."
                  required
                />
              </div>

              {/* Title Arabic */}
              <div>
                <Label htmlFor="titleAr">
                  Title (Arabic) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="titleAr"
                  value={editFormData.titleAr}
                  onChange={(e) =>
                    handleEditFormChange("titleAr", e.target.value)
                  }
                  placeholder="شقة فاخرة..."
                  dir="rtl"
                  required
                />
              </div>

              {/* Description English */}
              <div>
                <Label htmlFor="descriptionEn">
                  Description (English) <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="descriptionEn"
                  value={editFormData.descriptionEn}
                  onChange={(e) =>
                    handleEditFormChange("descriptionEn", e.target.value)
                  }
                  rows={3}
                  placeholder="Amazing apartment with..."
                  required
                />
              </div>

              {/* Description Arabic */}
              <div>
                <Label htmlFor="descriptionAr">
                  Description (Arabic) <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="descriptionAr"
                  value={editFormData.descriptionAr}
                  onChange={(e) =>
                    handleEditFormChange("descriptionAr", e.target.value)
                  }
                  rows={3}
                  dir="rtl"
                  placeholder="شقة رائعة مع..."
                  required
                />
              </div>

              {/* Rental Type Selection */}
              <div>
                <Label htmlFor="rentalType">
                  Rental Type <span className="text-red-500">*</span>
                </Label>
                <select
                  id="rentalType"
                  value={editFormData.rentalType}
                  onChange={(e) =>
                    handleEditFormChange("rentalType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BFA6]"
                  required
                >
                  <option value="vacation">Vacation Rental (Short-term)</option>
                  <option value="long_term">Long-term Rental</option>
                  <option value="both">Both (Vacation & Long-term)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {editFormData.rentalType === "vacation" &&
                    "Ideal for tourists and short stays"}
                  {editFormData.rentalType === "long_term" &&
                    "Monthly or yearly rentals"}
                  {editFormData.rentalType === "both" &&
                    "Flexible for any rental duration"}
                </p>
              </div>

              {/* Property Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">
                    Bedrooms <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={editFormData.bedrooms}
                    onChange={(e) =>
                      handleEditFormChange(
                        "bedrooms",
                        parseInt(e.target.value) || 0
                      )
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bathrooms">
                    Bathrooms <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    value={editFormData.bathrooms}
                    onChange={(e) =>
                      handleEditFormChange(
                        "bathrooms",
                        parseInt(e.target.value) || 0
                      )
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="guestsCapacity">
                    Guests Capacity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="guestsCapacity"
                    type="number"
                    min="1"
                    value={editFormData.guestsCapacity}
                    onChange={(e) =>
                      handleEditFormChange(
                        "guestsCapacity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="pricePerNight">
                    Price Per Night (EGP){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pricePerNight"
                    type="number"
                    min="0"
                    value={editFormData.pricePerNight}
                    onChange={(e) =>
                      handleEditFormChange(
                        "pricePerNight",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="governorate">
                    Governorate <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="governorate"
                    value={editFormData.governorate}
                    onChange={(e) =>
                      handleEditFormChange("governorate", e.target.value)
                    }
                    placeholder="Alexandria"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="city">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={editFormData.city}
                    onChange={(e) =>
                      handleEditFormChange("city", e.target.value)
                    }
                    placeholder="Miami"
                    required
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editFormData.furnished}
                    onChange={(e) =>
                      handleEditFormChange("furnished", e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <span>Furnished</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editFormData.petsAllowed}
                    onChange={(e) =>
                      handleEditFormChange("petsAllowed", e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <span>Pets Allowed</span>
                </label>
              </div>
            </div>
          )}

          <DialogFooter className={language === "ar" ? "flex-row-reverse" : ""}>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={updating}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProperty}
              disabled={updating}
              className="bg-[#00BFA6] hover:bg-[#00a890]"
            >
              <Save className="w-4 h-4 mr-2" />
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.hostDashboard.deleteConfirm}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.hostDashboard.deleteConfirmDesc}
              {propertyToDelete?.titleEn || propertyToDelete?.titleAr}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter
            className={language === "ar" ? "flex-row-reverse" : ""}
          >
            <AlertDialogCancel disabled={deleting}>
              {t.hostDashboard.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? t.hostDashboard.deleting : t.hostDashboard.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Images Dialog */}
      <AlertDialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t.hostDashboard.propertyImages}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {selectedPropertyImages.map((image, index) => (
              <div
                key={image.imageId || index}
                className="relative aspect-video"
              >
                <img
                  src={image.imageUrl}
                  alt={`Property image ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                {image.isCover && (
                  <Badge
                    className={`absolute top-2 ${
                      language === "ar" ? "right-2" : "left-2"
                    } bg-[#00BFA6]`}
                  >
                    {t.hostDashboard.cover}
                  </Badge>
                )}
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.hostDashboard.close}</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
