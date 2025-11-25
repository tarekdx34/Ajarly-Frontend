// src/hooks/usePropertyApi.ts
import { useState } from "react";
import api from "../../api";

export interface PropertyFormData {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  propertyType: string;
  rentalType: string;
  governorate: string;
  city: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  guestsCapacity: number;
  areaSqm: number;
  furnished: boolean;
  petsAllowed: boolean;
  pricePerNight: number;
  cleaningFee: number;
  minRentalDays: number;
}

export const usePropertyApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a new property
   */
  const createProperty = async (formData: PropertyFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Map form data to API request format
      const requestData = {
        titleAr: formData.titleAr,
        titleEn: formData.titleEn || formData.titleAr, // Fallback to Arabic if English not provided
        descriptionAr: formData.descriptionAr,
        descriptionEn: formData.descriptionEn || formData.descriptionAr,
        propertyType: formData.propertyType,
        rentalType: formData.rentalType,
        governorate: formData.governorate,
        city: formData.city,
        neighborhood: formData.neighborhood,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        guestsCapacity: formData.guestsCapacity,
        areaSqm: formData.areaSqm || undefined,
        furnished: formData.furnished,
        petsAllowed: formData.petsAllowed,
        pricePerNight: formData.pricePerNight,
        cleaningFee: formData.cleaningFee || undefined,
        minRentalDays: formData.minRentalDays || 1,
      };

      console.log("📤 Creating property:", requestData);

      const response = await api.createProperty(requestData);

      console.log("✅ Property created:", response);

      return response;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create property";
      console.error("❌ Create property error:", err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Upload images for a property
   */
  const uploadPropertyImages = async (propertyId: number, files: File[]) => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        `📤 Uploading ${files.length} images for property ${propertyId}`
      );

      const response = await api.uploadPropertyImages(propertyId, files);

      console.log("✅ Images uploaded:", response);

      return response;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to upload images";
      console.error("❌ Upload images error:", err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get all properties for the current user
   */
  const getMyProperties = async (page = 0, size = 20) => {
    try {
      setLoading(true);
      setError(null);

      console.log("📤 Fetching my properties...");

      const response = await api.getMyProperties({ page, size });

      console.log("✅ Properties loaded:", response);

      // Extract content from paginated response
      return response.content || response;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load properties";
      console.error("❌ Load properties error:", err);
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing property
   */
  const updateProperty = async (
    propertyId: number,
    formData: Partial<PropertyFormData>
  ) => {
    try {
      setLoading(true);
      setError(null);

      console.log("📤 Updating property:", propertyId, formData);

      const response = await api.updateProperty(propertyId, formData);

      console.log("✅ Property updated:", response);

      return response;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update property";
      console.error("❌ Update property error:", err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a property
   */
  const deleteProperty = async (propertyId: number) => {
    try {
      setLoading(true);
      setError(null);

      console.log("📤 Deleting property:", propertyId);

      await api.deleteProperty(propertyId);

      console.log("✅ Property deleted:", propertyId);

      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete property";
      console.error("❌ Delete property error:", err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a property image
   */
  const deletePropertyImage = async (imageId: number) => {
    try {
      setLoading(true);
      setError(null);

      console.log("📤 Deleting image:", imageId);

      await api.deletePropertyImage(imageId);

      console.log("✅ Image deleted:", imageId);

      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete image";
      console.error("❌ Delete image error:", err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Set an image as cover
   */
  const setCoverImage = async (imageId: number) => {
    try {
      setLoading(true);
      setError(null);

      console.log("📤 Setting cover image:", imageId);

      const response = await api.setCoverImage(imageId);

      console.log("✅ Cover image set:", response);

      return response;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to set cover image";
      console.error("❌ Set cover image error:", err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createProperty,
    uploadPropertyImages,
    getMyProperties,
    updateProperty,
    deleteProperty,
    deletePropertyImage,
    setCoverImage,
  };
};
