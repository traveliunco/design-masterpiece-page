import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

type FavoriteType = 'city' | 'destination' | 'offer';

interface FavoriteItem {
  id: string;
  type: FavoriteType;
  nameAr: string;
  image?: string;
  countryId?: string;
  price?: number;
  destination?: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  favoriteCities: FavoriteItem[];
  favoriteDestinations: FavoriteItem[];
  favoriteOffers: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string, type: FavoriteType) => void;
  isFavorite: (id: string, type: FavoriteType) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  favoritesCount: number;
  citiesCount: number;
  destinationsCount: number;
  offersCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
const STORAGE_KEY = 'traveliun_favorites_v2';

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const syncedUserRef = useRef<string | null>(null);
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  // Sync from DB when user logs in - only once per user
  useEffect(() => {
    if (!user || syncedUserRef.current === user.id) return;
    syncedUserRef.current = user.id;
    const syncFromDB = async () => {
      const { data } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id);
      if (data && data.length > 0) {
        const dbFavs: FavoriteItem[] = data.map((f: any) => ({
          id: f.item_id,
          type: f.item_type as FavoriteType,
          nameAr: f.item_name || '',
          image: f.item_image || '',
          ...(f.item_data || {}),
        }));
        setFavorites(dbFavs);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dbFavs));
      } else {
        // Migrate localStorage favorites to DB
        if (favorites.length > 0) {
          const rows = favorites.map(f => ({
            user_id: user.id,
            item_id: f.id,
            item_type: f.type,
            item_name: f.nameAr,
            item_image: f.image || null,
            item_data: { countryId: f.countryId, price: f.price, destination: f.destination },
          }));
          await supabase.from('user_favorites').upsert(rows, { onConflict: 'user_id,item_id,item_type' });
        }
      }
    };
    syncFromDB();
  }, [user]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((item: FavoriteItem) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === item.id && f.type === item.type)) return prev;
      return [...prev, item];
    });
    if (user) {
      supabase.from('user_favorites').upsert({
        user_id: user.id,
        item_id: item.id,
        item_type: item.type,
        item_name: item.nameAr,
        item_image: item.image || null,
        item_data: { countryId: item.countryId, price: item.price, destination: item.destination },
      }, { onConflict: 'user_id,item_id,item_type' }).then();
    }
  }, [user]);

  const removeFavorite = useCallback((id: string, type: FavoriteType) => {
    setFavorites(prev => prev.filter(f => !(f.id === id && f.type === type)));
    if (user) {
      supabase.from('user_favorites').delete()
        .eq('user_id', user.id)
        .eq('item_id', id)
        .eq('item_type', type).then();
    }
  }, [user]);

  const isFavorite = (id: string, type: FavoriteType) => favorites.some(f => f.id === id && f.type === type);

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    if (isFavorite(item.id, item.type)) removeFavorite(item.id, item.type);
    else addFavorite(item);
  }, [favorites, user]);

  const favoriteCities = favorites.filter(f => f.type === 'city');
  const favoriteDestinations = favorites.filter(f => f.type === 'destination');
  const favoriteOffers = favorites.filter(f => f.type === 'offer');

  return (
    <FavoritesContext.Provider value={{
      favorites, favoriteCities, favoriteDestinations, favoriteOffers,
      addFavorite, removeFavorite, isFavorite, toggleFavorite,
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
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
};

export default FavoritesContext;
