// src/contexts/FavoritesContext.tsx - FINAL VERSION
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api, { FavoriteResponse, PropertyResponse } from "../../api";
import { toast } from "sonner";

interface FavoritesContextType {
  favorites: FavoriteResponse[];
  loading: boolean;
  isFavorite: (propertyId: number) => boolean;
  addToFavorites: (property: PropertyResponse, notes?: string) => Promise<void>;
  removeFromFavorites: (propertyId: number) => Promise<void>;
  toggleFavorite: (property: PropertyResponse) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      console.log("🔐 Auth token found, loading favorites...");
      loadFavoritesFromAPI();
    } else {
      console.log("⚠️ No auth token found");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleAuthChange = (e: StorageEvent) => {
      if (e.key === "authToken") {
        if (e.newValue) {
          console.log("🔐 User logged in");
          loadFavoritesFromAPI();
        } else {
          console.log("🚪 User logged out");
          setFavorites([]);
          setLoading(false);
        }
      }
    };

    window.addEventListener("storage", handleAuthChange);
    return () => window.removeEventListener("storage", handleAuthChange);
  }, []);

  const loadFavoritesFromAPI = async () => {
    try {
      setLoading(true);
      console.log("📡 API Request: GET /favorites");

      const response = await api.getFavorites({ page: 0, size: 100 });

      console.log("📥 API Response:", response);
      console.log("📥 Response type:", typeof response);
      console.log("📥 Is Array?", Array.isArray(response));

      // ✅ Handle both response formats
      let favoritesData: FavoriteResponse[] = [];

      if (Array.isArray(response)) {
        // Direct array response
        favoritesData = response;
        console.log("✅ Direct array format detected");
      } else if (response && Array.isArray(response.content)) {
        // Paginated response
        favoritesData = response.content;
        console.log("✅ Paginated format detected");
      } else {
        console.error("❌ Invalid API response structure:", response);
      }

      setFavorites(favoritesData);
      console.log("✅ Loaded favorites:", favoritesData.length);
      console.log(
        "✅ Favorites IDs:",
        favoritesData.map((f) => f.property.propertyId)
      );
    } catch (error: any) {
      console.error("❌ API Error:", {
        message: error.message,
        status: error.status,
        data: error.data,
        response: error.response,
      });

      if (error?.response?.status === 401 || error?.response?.status === 403) {
        toast.error("Please login to view favorites");
        setFavorites([]);
      } else {
        toast.error("Failed to load favorites");
      }
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (propertyId: number): boolean => {
    const result = favorites.some(
      (fav) => fav.property.propertyId === propertyId
    );
    console.log(
      `🔍 isFavorite(${propertyId}):`,
      result,
      "| Total favorites:",
      favorites.length
    );
    return result;
  };

  const addToFavorites = async (property: PropertyResponse, notes?: string) => {
    const propertyId = property.propertyId;

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("➕ ADD TO FAVORITES STARTED");
    console.log("Property ID:", propertyId);
    console.log("Property Title:", property.titleEn);
    console.log("Current favorites count:", favorites.length);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Check if already favorite
    if (isFavorite(propertyId)) {
      console.log("⚠️ Already in favorites - STOPPING");
      toast.info("Already in favorites");
      return;
    }

    // Create temporary favorite for optimistic update
    const tempFavorite: FavoriteResponse = {
      favoriteId: Date.now(),
      property: property,
      notes: notes,
      createdAt: new Date().toISOString(),
    };

    console.log("🔄 Optimistic update - adding temp favorite");
    setFavorites((prev) => {
      const newFavorites = [...prev, tempFavorite];
      console.log("📊 New favorites count:", newFavorites.length);
      return newFavorites;
    });

    try {
      console.log("📡 API Request: POST /favorites");
      console.log("Request body:", { propertyId, notes });

      const newFavorite = await api.addFavorite(propertyId, notes);

      console.log("📥 API Response:", newFavorite);
      console.log("✅ SUCCESS - Favorite added");

      // Replace temp with real data
      setFavorites((prev) =>
        prev.map((fav) =>
          fav.favoriteId === tempFavorite.favoriteId ? newFavorite : fav
        )
      );

      toast.success("Added to favorites!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    } catch (apiError: any) {
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.error("❌ API ERROR");
      console.error("Status:", apiError?.status);
      console.error("Message:", apiError?.message);
      console.error("Data:", apiError?.data);
      console.error("Full error:", apiError);
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      const errorMsg = apiError?.message?.toLowerCase() || "";
      const errorData = apiError?.data?.message?.toLowerCase() || "";

      const isAlreadyExists =
        apiError?.status === 400 &&
        (errorMsg.includes("already") || errorData.includes("already"));

      if (isAlreadyExists) {
        console.log("⚠️ Already exists in backend - syncing...");
        toast.info("Already in favorites");
        await loadFavoritesFromAPI();
      } else {
        console.log("❌ Real error - rolling back");
        setFavorites((prev) =>
          prev.filter((fav) => fav.favoriteId !== tempFavorite.favoriteId)
        );

        const errorMessage =
          apiError?.data?.message ||
          apiError?.message ||
          "Failed to add to favorites";
        toast.error(errorMessage);
      }
    }
  };

  const removeFromFavorites = async (propertyId: number) => {
    if (!isFavorite(propertyId)) {
      console.log("⚠️ Not in favorites - STOPPING");
      return;
    }

    console.log("➖ Removing property", propertyId, "from favorites");

    const previousFavorites = favorites;
    setFavorites((prev) =>
      prev.filter((fav) => fav.property.propertyId !== propertyId)
    );

    try {
      console.log("📡 API Request: DELETE /favorites/" + propertyId);
      await api.removeFavorite(propertyId);

      toast.success("Removed from favorites");
      console.log("✅ Removed successfully");
    } catch (apiError: any) {
      console.error("❌ Remove error:", apiError);

      if (apiError?.status === 404) {
        console.log("⚠️ Already removed from API");
        return;
      }

      setFavorites(previousFavorites);
      toast.error("Failed to remove from favorites");
    }
  };

  const toggleFavorite = async (property: PropertyResponse) => {
    const propertyId = property.propertyId;
    const currentState = isFavorite(propertyId);

    console.log("🔄 TOGGLE FAVORITE");
    console.log("Property ID:", propertyId);
    console.log("Current state:", currentState ? "FAVORITED" : "NOT FAVORITED");
    console.log("Action:", currentState ? "REMOVE" : "ADD");

    try {
      if (currentState) {
        await removeFromFavorites(propertyId);
      } else {
        await addToFavorites(property);
      }
    } catch (error: any) {
      console.error("❌ Toggle error:", error);
    }
  };

  const refreshFavorites = async () => {
    console.log("🔄 Manual refresh favorites");
    await loadFavoritesFromAPI();
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        isFavorite,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
