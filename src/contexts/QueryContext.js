import React, { createContext, useContext } from 'react';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

const QueryContext = createContext(queryClient);

export const QueryProvider = ({ children }) => {
  return (
    <QueryContext.Provider value={queryClient}>
      {children}
    </QueryContext.Provider>
  );
};

export const useQueryClient = () => {
  const context = useContext(QueryContext);
  if (!context) {
    throw new Error('useQueryClient must be used within a QueryProvider');
  }
  return context;
}; 