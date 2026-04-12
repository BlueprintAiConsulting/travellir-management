'use client';

import { createContext, useContext, useEffect, useReducer } from 'react';
import { Property, Vendor } from './types';
import { INITIAL_PROPERTIES, INITIAL_VENDORS } from './data';

interface AppState {
  properties: Property[];
  vendors: Vendor[];
}

type Action =
  | { type: 'ADD_PROPERTY'; payload: Property }
  | { type: 'UPDATE_PROPERTY'; payload: Property }
  | { type: 'DELETE_PROPERTY'; id: string }
  | { type: 'ADD_VENDOR'; payload: Vendor }
  | { type: 'UPDATE_VENDOR'; payload: Vendor }
  | { type: 'DELETE_VENDOR'; id: string }
  | { type: 'LOAD'; payload: AppState };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD':
      return action.payload;
    case 'ADD_PROPERTY':
      return { ...state, properties: [...state.properties, action.payload] };
    case 'UPDATE_PROPERTY':
      return {
        ...state,
        properties: state.properties.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_PROPERTY':
      return {
        ...state,
        properties: state.properties.filter((p) => p.id !== action.id),
        vendors: state.vendors.map((v) => ({
          ...v,
          assignedPropertyIds: v.assignedPropertyIds.filter(
            (id) => id !== action.id
          ),
        })),
      };
    case 'ADD_VENDOR':
      return { ...state, vendors: [...state.vendors, action.payload] };
    case 'UPDATE_VENDOR':
      return {
        ...state,
        vendors: state.vendors.map((v) =>
          v.id === action.payload.id ? action.payload : v
        ),
      };
    case 'DELETE_VENDOR':
      return {
        ...state,
        vendors: state.vendors.filter((v) => v.id !== action.id),
        properties: state.properties.map((p) => ({
          ...p,
          assignedVendorIds: p.assignedVendorIds.filter(
            (id) => id !== action.id
          ),
        })),
      };
    default:
      return state;
  }
}

const STORAGE_KEY = 'travellir_data';

const defaultState: AppState = {
  properties: INITIAL_PROPERTIES,
  vendors: INITIAL_VENDORS,
};

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue>({
  state: defaultState,
  dispatch: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        dispatch({ type: 'LOAD', payload: JSON.parse(stored) });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppState() {
  return useContext(AppContext);
}
