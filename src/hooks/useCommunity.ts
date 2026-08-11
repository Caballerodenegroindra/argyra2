'use client';

import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { getCommunityByOwner } from '@/services/communities';
import { watchImprovements } from '@/services/improvements';
import type { Community, Improvement } from '@/types';

/** Comunidad del usuario actual junto con sus avances en vivo. */
export function useCommunity() {
  const { account } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [improvements, setImprovements] = useState<Improvement[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!account) return;
    setLoading(true);
    setCommunity(await getCommunityByOwner(account.uid));
    setLoading(false);
  }, [account]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    if (!community) return;
    return watchImprovements(community.id, setImprovements);
  }, [community]);

  const progress = improvements.length
    ? Math.round(improvements.reduce((sum, i) => sum + i.progress, 0) / improvements.length)
    : 0;

  return { community, improvements, progress, loading, reload };
}
