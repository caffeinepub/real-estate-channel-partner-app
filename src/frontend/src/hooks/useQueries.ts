import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Property, Lead, Commission, UserProfile, ProjectStage, TransactionType } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetProperties() {
  const { actor, isFetching } = useActor();

  return useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProperties();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPropertiesByProjectStage(projectStage: ProjectStage) {
  const { actor, isFetching } = useActor();

  return useQuery<Property[]>({
    queryKey: ['properties', 'projectStage', projectStage],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPropertiesByProjectStage(projectStage);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPropertiesByTransactionType(transactionType: TransactionType) {
  const { actor, isFetching } = useActor();

  return useQuery<Property[]>({
    queryKey: ['properties', 'transactionType', transactionType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPropertiesByTransactionType(transactionType);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveProperty(propertyId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetQubeYardsBalance() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['qubeYardsBalance'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getQubeYardsBalance();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLeads() {
  const { actor, isFetching } = useActor();

  return useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeads();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddLead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addLead(customerName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['qubeYardsBalance'] });
    },
  });
}

export function useGetCommissions() {
  const { actor, isFetching } = useActor();

  return useQuery<Commission[]>({
    queryKey: ['commissions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCommissions();
    },
    enabled: !!actor && !isFetching,
  });
}
