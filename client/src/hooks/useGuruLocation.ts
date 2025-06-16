import { useQuery } from '@tanstack/react-query';
import type { GuruLocation } from '@shared/schema';

export function useGuruLocation() {
  const { data: location, isLoading, error } = useQuery<GuruLocation>({
    queryKey: ['/api/guru-location'],
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  return {
    location,
    isLoading,
    error
  };
}
