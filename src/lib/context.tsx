'use client';

import React, { createContext, useContext, useReducer, ReactNode, Dispatch, useEffect } from 'react';
import type { OperationalRecord } from '@/lib/types';
import type { AnalyzeEmissionPatternsOutput, GenerateReductionRecommendationsOutput } from '@/ai/types';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { format } from 'date-fns';

// State and Action Types
interface AppState {
  operationalData: OperationalRecord[];
  analysis: AnalyzeEmissionPatternsOutput | null;
  recommendations: GenerateReductionRecommendationsOutput | null;
  loading: {
    analysis: boolean;
    recommendations: boolean;
    data: boolean;
  };
  error: string | null;
}

type Action =
  | { type: 'ADD_RECORD'; payload: OperationalRecord }
  | { type: 'DELETE_RECORD'; payload: string }
  | { type: 'SET_ANALYSIS_LOADING'; payload: boolean }
  | { type: 'SET_ANALYSIS_RESULT'; payload: AnalyzeEmissionPatternsOutput | null }
  | { type: 'SET_RECOMMENDATIONS_LOADING'; payload: boolean }
  | { type: 'SET_RECOMMENDATIONS_RESULT'; payload: GenerateReductionRecommendationsOutput | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_OPERATIONAL_DATA'; payload: OperationalRecord[] }
  | { type: 'SET_DATA_LOADING'; payload: boolean };


const initialState: AppState = {
  operationalData: [],
  analysis: null,
  recommendations: null,
  loading: {
    analysis: false,
    recommendations: false,
    data: true,
  },
  error: null,
};

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_OPERATIONAL_DATA':
        return { ...state, operationalData: action.payload };
    case 'SET_DATA_LOADING':
        return { ...state, loading: { ...state.loading, data: action.payload } };
    case 'ADD_RECORD':
      // This will be handled by Firestore real-time updates
      return state;
    case 'DELETE_RECORD':
      // This will be handled by Firestore real-time updates
      return state;
    case 'SET_ANALYSIS_LOADING':
      return { ...state, loading: { ...state.loading, analysis: action.payload } };
    case 'SET_ANALYSIS_RESULT':
      return { ...state, analysis: action.payload, loading: { ...state.loading, analysis: false } };
    case 'SET_RECOMMENDATIONS_LOADING':
        return { ...state, loading: { ...state.loading, recommendations: action.payload } };
    case 'SET_RECOMMENDATIONS_RESULT':
        return { ...state, recommendations: action.payload, loading: { ...state.loading, recommendations: false } };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: { analysis: false, recommendations: false, data: false } };
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{ state: AppState; dispatch: Dispatch<Action> } | undefined>(
  undefined
);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { firestore, user, isUserLoading } = useFirebase();

  const operationalDataQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, 'users', user.uid, 'operationalData');
  }, [firestore, user?.uid]);

  const { data: operationalData, isLoading: isDataLoading, error: dataError } = useCollection<OperationalRecord>(operationalDataQuery);

  useEffect(() => {
    dispatch({ type: 'SET_DATA_LOADING', payload: isUserLoading || isDataLoading });
  }, [isUserLoading, isDataLoading]);

  useEffect(() => {
    if (operationalData) {
      const processedData = operationalData.map(record => {
        const dateValue = record.date as any;
        if (dateValue && typeof dateValue.toDate === 'function') {
          return { ...record, date: format(dateValue.toDate(), 'yyyy-MM-dd') };
        }
        return record;
      });
      dispatch({ type: 'SET_OPERATIONAL_DATA', payload: processedData });
    } else {
      // On logout or if there's no data, ensure we dispatch an empty array
      dispatch({ type: 'SET_OPERATIONAL_DATA', payload: [] });
    }
  }, [operationalData]);

  useEffect(() => {
    if (dataError) {
      dispatch({ type: 'SET_ERROR', payload: dataError.message });
    }
  }, [dataError]);


  const value = { state, dispatch };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
