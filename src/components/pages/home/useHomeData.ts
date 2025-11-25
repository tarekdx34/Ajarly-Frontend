import { useState, useEffect } from "react";
import api, { PropertyResponse, PopularLocation } from "../../../../api";

export function useHomeData() {
  const [featuredProperties, setFeaturedProperties] = useState<
    PropertyResponse[]
  >([]);
  const [popularLocations, setPopularLocations] = useState<PopularLocation[]>(
    []
  );
  const [governorates, setGovernorates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const propertiesResponse = await api.getProperties({
        page: 0,
        size: 8,
        sortBy: "averageRating",
        sortDirection: "DESC",
      });
      if (propertiesResponse?.content) {
        setFeaturedProperties(propertiesResponse.content);
      }

      const locationsResponse = await api.getPopularLocations(3);
      if (locationsResponse) {
        setPopularLocations(locationsResponse);
      }

      const governoratesResponse = await api.getGovernorates();
      if (governoratesResponse) {
        setGovernorates(governoratesResponse);
      }
    } catch (err: any) {
      console.error("Error loading home data:", err);
      setError(
        err?.message || "Failed to load properties. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const propertiesResponse = await api.getProperties({
        page: 0,
        size: 8,
        sortBy: "createdAt",
        sortDirection: "DESC",
      });
      if (propertiesResponse?.content) {
        setFeaturedProperties(propertiesResponse.content);
      }
    } catch (err) {
      console.error("Error refreshing:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHomeData();

    const handleFocus = () => {
      if (!loading) {
        handleRefresh();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  return {
    featuredProperties,
    popularLocations,
    governorates,
    loading,
    error,
    refreshing,
    handleRefresh,
  };
}
