import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type FavoriteType = 'city' | 'destination' | 'offer';

interface FavoriteItem {
  id: string;
  type: FavoriteType;
  nameAr: string;
  image?: string;
  // For cities
  countryId?: string;
  // For offers
  price?: number;
  destination?: string;
}

interface FavoritesContextType {
  // All favorites
  favorites: FavoriteItem[];
  // By type
  favoriteCities: FavoriteItem[];
  favoriteDestinations: FavoriteItem[];
  favoriteOffers: FavoriteItem[];
  // Actions
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string, type: FavoriteType) => void;
  isFavorite: (id: string, type: FavoriteType) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  // Counts
  favoritesCount: number;
  citiesCount: number;
  destinationsCount: number;
  offersCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'traveliun_favorites_v2';

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      // Migrate from old format
      const oldStored = localStorage.getItem('traveliun_favorites');
      if (oldStored) {
        const oldFavs = JSON.parse(oldStored);
        return oldFavs.map((f: any) => ({ ...f, type: 'city' as FavoriteType }));
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const favoriteCities = favorites.filter(f => f.type === 'city');
  const favoriteDestinations = favorites.filter(f => f.type === 'destination');
  const favoriteOffers = favorites.filter(f => f.type === 'offer');

  const addFavorite = (item: FavoriteItem) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === item.id && f.type === item.type)) return prev;
      return [...prev, item];
    });
  };

  const removeFavorite = (id: string, type: FavoriteType) => {
    setFavorites(prev => prev.filter(f => !(f.id === id && f.type === type)));
  };

  const isFavorite = (id: string, type: FavoriteType) => {
    return favorites.some(f => f.id === id && f.type === type);
  };

  const toggleFavorite = (item: FavoriteItem) => {
    if (isFavorite(item.id, item.type)) {
      removeFavorite(item.id, item.type);
    } else {
      addFavorite(item);
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      favoriteCities,
      favoriteDestinations,
      favoriteOffers,
      addFavorite,
      removeFavorite,
      isFavorite,
      toggleFavorite,
      favoritesCount: favorites.length,
      citiesCount: favoriteCities.length,
      destinationsCount: favoriteDestinations.length,
      offersCount: favoriteOffers.length,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;
