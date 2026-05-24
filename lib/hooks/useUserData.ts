'use client';

import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Brand, Transaction, IntegrationSource, UserProfile } from '../types';
import { createOrUpdateUserProfile, getUserDataRecord, updateUserBrands, addTransaction, updateIntegrations, type UserDataRecord } from '../firebase/firestore';
import { INITIAL_BRANDS, INITIAL_INTEGRATIONS } from '../data';

const USER_DATA_QUERY_KEY = (uid: string) => ['user-data', uid] as const;
const EMPTY_TRANSACTIONS: Transaction[] = [];

export function useUserData(uid: string | null) {
  const queryClient = useQueryClient();
  const userDataQuery = useQuery({
    queryKey: uid ? USER_DATA_QUERY_KEY(uid) : ['user-data', 'anonymous'],
    queryFn: async () => {
      if (!uid) {
        return null;
      }

      return getUserDataRecord(uid);
    },
    enabled: Boolean(uid),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const record = userDataQuery.data;
  const brands = record?.brands ?? INITIAL_BRANDS;
  const transactions = record?.transactions ?? EMPTY_TRANSACTIONS;
  const integrations = record?.integrations ?? INITIAL_INTEGRATIONS;
  const profile = record?.profile ?? null;
  const loading = uid ? userDataQuery.isLoading : false;

  const saveBrands = useCallback(async (updatedBrands: Brand[]) => {
    if (!uid) return;
    queryClient.setQueryData<UserDataRecord>(USER_DATA_QUERY_KEY(uid), (current) => current ? { ...current, brands: updatedBrands } : current);
    await updateUserBrands(uid, updatedBrands);
  }, [uid, queryClient]);

  const saveTransaction = useCallback(async (tx: Transaction) => {
    if (!uid) return;
    queryClient.setQueryData<UserDataRecord>(USER_DATA_QUERY_KEY(uid), (current) => current ? { ...current, transactions: [tx, ...current.transactions] } : current);
    await addTransaction(uid, tx);
  }, [uid, queryClient]);

  const saveIntegrations = useCallback(async (updated: IntegrationSource[]) => {
    if (!uid) return;
    queryClient.setQueryData<UserDataRecord>(USER_DATA_QUERY_KEY(uid), (current) => current ? { ...current, integrations: updated } : current);
    await updateIntegrations(uid, updated);
  }, [uid, queryClient]);

  const saveProfile = useCallback(async (updated: UserProfile) => {
    if (!uid) return;
    queryClient.setQueryData<UserDataRecord>(USER_DATA_QUERY_KEY(uid), (current) => current ? { ...current, profile: updated } : current);
    await createOrUpdateUserProfile(uid, updated);
  }, [uid, queryClient]);

  return { brands, transactions, integrations, profile, loading, saveBrands, saveTransaction, saveIntegrations, saveProfile };
}
