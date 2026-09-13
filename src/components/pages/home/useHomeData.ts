import { useState, useEffect } from "react";
import api, {
  PropertyResponse,
  PopularLocation,
  formatApiError,
  isOfflineError,
} from "../../../../api";
import {
  MOCK_PROPERTIES,
  MOCK_POPULAR_LOCATIONS,
  MOCK_GOVERNORATES,
} from "../../../lib/mockData";

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
  const [usingSampleData, setUsingSampleData] = useState(false);
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

      setUsingSampleData(false);
    } catch (err: any) {
      console.error("Error loading home data:", err);

      if (isOfflineError(err)) {
        // Backend is unreachable — show sample listings instead of an
        // empty, broken-looking homepage.
        setFeaturedProperties(MOCK_PROPERTIES);
        setPopularLocations(MOCK_POPULAR_LOCATIONS);
        setGovernorates(MOCK_GOVERNORATES);
        setUsingSampleData(true);
        setError(null);
      } else {
        setUsingSampleData(false);
        setError(formatApiError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const propertiesResponse = await api.getProperties({
        page: 0,
        size: 50,
        sortBy: "createdAt",
        sortDirection: "DESC",
      });
      if (propertiesResponse?.content) {
        // Filter for featured properties only
        const featured = propertiesResponse.content.filter(
          (property) => property.isFeatured === true
        );
        setFeaturedProperties(featured);

        console.log("📌 Featured properties loaded:", featured.length);
      }

      const locationsResponse = await api.getPopularLocations(3);
      if (locationsResponse) {
        setPopularLocations(locationsResponse);
      }

      const governoratesResponse = await api.getGovernorates();
      if (governoratesResponse) {
        setGovernorates(governoratesResponse);
      }

      setUsingSampleData(false);
    } catch (err) {
      console.error("Error refreshing:", err);
      if (isOfflineError(err)) {
        setFeaturedProperties(MOCK_PROPERTIES);
        setPopularLocations(MOCK_POPULAR_LOCATIONS);
        setGovernorates(MOCK_GOVERNORATES);
        setUsingSampleData(true);
      }
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
    usingSampleData,
    refreshing,
    handleRefresh,
    reload: loadHomeData,
  };
}
