import { useState, useEffect } from "react";
import { X, Upload, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
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
import { Progress } from "../../ui/progress";
import { Badge } from "../../ui/badge";
import { Alert, AlertDescription } from "../../ui/alert";
import {
  usePropertyApi,
  PropertyFormData,
} from "../../../hooks/usePropertyApi";

interface AddPropertyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddPropertyForm({ onSuccess, onCancel }: AddPropertyFormProps) {
  const {
    loading,
    error: apiError,
    createProperty,
    uploadPropertyImages,
  } = usePropertyApi();

  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state
  const [formData, setFormData] = useState<PropertyFormData>({
    titleAr: "",
    titleEn: "",
    descriptionAr: "",
    descriptionEn: "",
    propertyType: "",
    rentalType: "",
    governorate: "",
    city: "",
    neighborhood: "",
    bedrooms: 1,
    bathrooms: 1,
    guestsCapacity: 2,
    areaSqm: 0,
    furnished: false,
    petsAllowed: false,
    pricePerNight: 0,
    cleaningFee: 0,
    minRentalDays: 1,
  });

  // Image upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Sync API error
  useEffect(() => {
    if (apiError) setError(apiError);
  }, [apiError]);

  // Cleanup previews
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isValidSize = file.size <= 10 * 1024 * 1024;
      return isImage && isValidSize;
    });

    if (validFiles.length !== files.length) {
      toast.error("Some files were skipped (must be images under 10MB)");
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);

    validFiles.forEach((file) => {
      const url = URL.createObjectURL(file);
      setPreviewUrls((prev) => [...prev, url]);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const validateStep = (currentStep: number): boolean => {
    setError(null);

    switch (currentStep) {
      case 1:
        if (!formData.titleAr || formData.titleAr.length < 10) {
          setError("Arabic title must be at least 10 characters");
          return false;
        }
        if (!formData.descriptionAr || formData.descriptionAr.length < 50) {
          setError("Arabic description must be at least 50 characters");
          return false;
        }
        if (!formData.propertyType) {
          setError("Please select a property type");
          return false;
        }
        break;
      case 2:
        if (!formData.governorate) {
          setError("Please select a governorate");
          return false;
        }
        if (!formData.city) {
          setError("Please enter a city");
          return false;
        }
        break;
      case 3:
        if (formData.pricePerNight <= 0) {
          setError("Price per night must be greater than 0");
          return false;
        }
        break;
      case 4:
        if (selectedFiles.length < 5) {
          setError("Please upload at least 5 photos");
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    setError(null);
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    try {
      toast.loading("Creating property...");

      const property = await createProperty(formData);

      if (selectedFiles.length > 0) {
        setUploadProgress(20);

        toast.loading(`Uploading ${selectedFiles.length} images...`);
        await uploadPropertyImages(property.propertyId, selectedFiles);

        setUploadProgress(100);
      }

      // ✅ Dismiss loading toasts
      toast.dismiss();

      // ✅ Show success
      toast.success("Property created successfully! Awaiting admin approval.", {
        duration: 3000,
      });

      // ✅ Close form and trigger reload
      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (err: any) {
      console.error("❌ Submit error:", err);
      toast.dismiss();
      toast.error(err.message || "Failed to create property");
      setError(err.message || "Failed to create property");
      setUploadProgress(0);
    }
  };

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#2B2B2B]">
          Add New Property
        </h2>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Step {step} of 4</span>
          <span className="text-sm text-gray-600">
            {(step / 4) * 100}% Complete
          </span>
        </div>
        <Progress value={(step / 4) * 100} className="h-2" />
        <div className="grid grid-cols-4 gap-2 mt-4">
          {["Basic Info", "Location", "Details & Pricing", "Photos"].map(
            (label, i) => (
              <div
                key={i}
                className={`text-center text-xs ${
                  step >= i + 1 ? "text-[#00BFA6] font-medium" : "text-gray-400"
                }`}
              >
                {label}
              </div>
            )
          )}
        </div>
      </div>

      {/* Errors */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form Steps */}
      <form className="space-y-6">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-[#2B2B2B]">Basic Information</h3>

            <div>
              <Label htmlFor="titleAr">Property Title (Arabic) *</Label>
              <Input
                id="titleAr"
                value={formData.titleAr}
                onChange={(e) => handleInputChange("titleAr", e.target.value)}
                placeholder="فيلا فاخرة على البحر"
                className="mt-1"
                dir="rtl"
              />
              <p className="text-xs text-gray-500 mt-1">Min 10 characters</p>
            </div>

            <div>
              <Label htmlFor="titleEn">Property Title (English)</Label>
              <Input
                id="titleEn"
                value={formData.titleEn}
                onChange={(e) => handleInputChange("titleEn", e.target.value)}
                placeholder="Luxury Beach Villa"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(v) => handleInputChange("propertyType", v)}
                >
                  <SelectTrigger id="propertyType" className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="chalet">Chalet</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="rentalType">Rental Type *</Label>
                <Select
                  value={formData.rentalType}
                  onValueChange={(v) => handleInputChange("rentalType", v)}
                >
                  <SelectTrigger id="rentalType" className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">Vacation</SelectItem>
                    <SelectItem value="long_term">Long Term</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="descriptionAr">Description (Arabic) *</Label>
              <Textarea
                id="descriptionAr"
                value={formData.descriptionAr}
                onChange={(e) =>
                  handleInputChange("descriptionAr", e.target.value)
                }
                placeholder="وصف تفصيلي للعقار..."
                rows={4}
                className="mt-1"
                dir="rtl"
              />
              <p className="text-xs text-gray-500 mt-1">Min 50 characters</p>
            </div>

            <div>
              <Label htmlFor="descriptionEn">Description (English)</Label>
              <Textarea
                id="descriptionEn"
                value={formData.descriptionEn}
                onChange={(e) =>
                  handleInputChange("descriptionEn", e.target.value)
                }
                placeholder="Detailed property description..."
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-[#2B2B2B]">Location</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="governorate">Governorate *</Label>
                <Select
                  value={formData.governorate}
                  onValueChange={(v) => handleInputChange("governorate", v)}
                >
                  <SelectTrigger id="governorate" className="mt-1">
                    <SelectValue placeholder="Select governorate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alexandria">Alexandria</SelectItem>
                    <SelectItem value="Matrouh">Matrouh</SelectItem>
                    <SelectItem value="North Coast">North Coast</SelectItem>
                    <SelectItem value="Red Sea">Red Sea</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="e.g., Marina"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="neighborhood">Neighborhood/Area</Label>
              <Input
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) =>
                  handleInputChange("neighborhood", e.target.value)
                }
                placeholder="e.g., Sidi Abdel Rahman"
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Step 3: Details & Pricing */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-[#2B2B2B]">Property Details</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) =>
                      handleInputChange("bedrooms", parseInt(e.target.value))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      handleInputChange("bathrooms", parseInt(e.target.value))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="guests">Max Guests *</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    value={formData.guestsCapacity}
                    onChange={(e) =>
                      handleInputChange(
                        "guestsCapacity",
                        parseInt(e.target.value)
                      )
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="area">Area (m²)</Label>
                  <Input
                    id="area"
                    type="number"
                    min="0"
                    value={formData.areaSqm}
                    onChange={(e) =>
                      handleInputChange("areaSqm", parseInt(e.target.value))
                    }
                    placeholder="120"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="furnished"
                    checked={formData.furnished}
                    onChange={(e) =>
                      handleInputChange("furnished", e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <Label htmlFor="furnished" className="cursor-pointer">
                    Furnished
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="pets"
                    checked={formData.petsAllowed}
                    onChange={(e) =>
                      handleInputChange("petsAllowed", e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <Label htmlFor="pets" className="cursor-pointer">
                    Pets Allowed
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-[#2B2B2B]">Pricing</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price per Night (EGP) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.pricePerNight}
                    onChange={(e) =>
                      handleInputChange(
                        "pricePerNight",
                        parseFloat(e.target.value)
                      )
                    }
                    placeholder="2000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cleaningFee">Cleaning Fee (EGP)</Label>
                  <Input
                    id="cleaningFee"
                    type="number"
                    min="0"
                    value={formData.cleaningFee}
                    onChange={(e) =>
                      handleInputChange(
                        "cleaningFee",
                        parseFloat(e.target.value)
                      )
                    }
                    placeholder="200"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="minDays">Min Rental Days</Label>
                  <Input
                    id="minDays"
                    type="number"
                    min="1"
                    value={formData.minRentalDays}
                    onChange={(e) =>
                      handleInputChange(
                        "minRentalDays",
                        parseInt(e.target.value)
                      )
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Photos */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-[#2B2B2B]">Photos</h3>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#00BFA6] transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Click to select photos or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  Upload at least 5 high-quality photos
                </p>
                <p className="text-xs text-gray-400 mt-2">Max 10MB per photo</p>
              </label>
            </div>

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${i + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {i === 0 && (
                      <Badge className="absolute top-2 left-2 bg-blue-500">
                        Cover
                      </Badge>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-600">
              Selected: {selectedFiles.length} photo(s){" "}
              {selectedFiles.length < 5 &&
                `(need ${5 - selectedFiles.length} more)`}
            </p>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Uploading images...</p>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={loading}
            >
              Previous
            </Button>
          )}

          {step < 4 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="bg-[#00BFA6] hover:bg-[#00A890]"
              disabled={loading}
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-[#00BFA6] hover:bg-[#00A890]"
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish Property"}
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
