// contexts/FaunaPediaContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { SearchFilters, Species } from '../types/species';

// Debug: Tambahkan console.log
console.log('🦎 FaunaPediaContext imported');

interface FaunaPediaState {
  species: Species[];
  favorites: string[];
  searchQuery: string;
  filters: SearchFilters;
  loading: boolean;
  error: string | null;
}

type FaunaPediaAction =
  | { type: 'SET_SPECIES'; payload: Species[] }
  | { type: 'ADD_FAVORITE'; payload: string }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'SET_FAVORITES'; payload: string[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: SearchFilters }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: FaunaPediaState = {
  species: [],
  favorites: [],
  searchQuery: '',
  filters: {},
  loading: false,
  error: null,
};

const faunaPediaReducer = (state: FaunaPediaState, action: FaunaPediaAction): FaunaPediaState => {
  switch (action.type) {
    case 'SET_SPECIES':
      return { ...state, species: action.payload };
    case 'ADD_FAVORITE':
      return { ...state, favorites: [...state.favorites, action.payload] };
    case 'REMOVE_FAVORITE':
      return { ...state, favorites: state.favorites.filter(id => id !== action.payload) };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

interface FaunaPediaContextType {
  state: FaunaPediaState;
  dispatch: React.Dispatch<FaunaPediaAction>;
  toggleFavorite: (speciesId: string) => Promise<void>;
  isFavorite: (speciesId: string) => boolean;
  getFilteredSpecies: () => Species[];
}

const FaunaPediaContext = createContext<FaunaPediaContextType | undefined>(undefined);

export function FaunaPediaProvider({ children }: { children: React.ReactNode }) {
  console.log('🦎 FaunaPediaProvider rendered'); // Debug log
  
  const [state, dispatch] = useReducer(faunaPediaReducer, initialState);

  // Load favorites from storage
  useEffect(() => {
    loadFavorites();
  }, []);

  // Save favorites to storage
  useEffect(() => {
    if (state.favorites.length > 0) {
      saveFavorites();
    }
  }, [state.favorites]);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('faunapedia_favorites');
      if (stored) {
        dispatch({ type: 'SET_FAVORITES', payload: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async () => {
    try {
      await AsyncStorage.setItem('faunapedia_favorites', JSON.stringify(state.favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = async (speciesId: string) => {
    if (state.favorites.includes(speciesId)) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: speciesId });
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: speciesId });
    }
  };

  const isFavorite = (speciesId: string) => {
    return state.favorites.includes(speciesId);
  };

  const getFilteredSpecies = () => {
    let filtered = [...state.species];

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(species =>
        species.name.toLowerCase().includes(query) ||
        species.latin_name.toLowerCase().includes(query) ||
        species.animal_type.toLowerCase().includes(query)
      );
    }

    if (state.filters.animalType) {
      filtered = filtered.filter(species => 
        species.animal_type.toLowerCase() === state.filters.animalType?.toLowerCase()
      );
    }

    if (state.filters.habitat) {
      filtered = filtered.filter(species => 
        species.habitat.toLowerCase().includes(state.filters.habitat?.toLowerCase() || '')
      );
    }

    if (state.filters.conservationStatus) {
      filtered = filtered.filter(species => 
        species.conservation_status === state.filters.conservationStatus
      );
    }

    return filtered;
  };

  const value = {
    state,
    dispatch,
    toggleFavorite,
    isFavorite,
    getFilteredSpecies,
  };

  return (
    <FaunaPediaContext.Provider value={value}>
      {children}
    </FaunaPediaContext.Provider>
  );
}

export function useFaunaPedia() {
  console.log('🦎 useFaunaPedia called'); // Debug log
  const context = useContext(FaunaPediaContext);
  
  console.log('🦎 Context value:', context); // Debug log
  
  if (context === undefined) {
    console.error('🚨 Context is undefined! Provider not found!');
    throw new Error('useFaunaPedia must be used within a FaunaPediaProvider');
  }
  return context;
}
