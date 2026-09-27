// Shared ingestion flow: pick/shoot → store files → AI analysis → save garment
// → queue white-bg enhancement. Saves immediately; enhancement patches in later.
import { router } from 'expo-router';
import React from 'react';
import { toast } from '@/components/sorbet';
import { friendlyError, isConfigured } from '@/services/gemini/client';
import { analyzeGarment } from '@/services/gemini/analyzeGarment';
import { queueEnhancement } from '@/services/gemini/enhanceGarment';
import { pickImage, PickSource, storeGarmentPhoto } from '@/services/images';
import { useProfileStore } from '@/store/useProfileStore';
import { entitlementSnapshot } from '@/store/useSubscriptionStore';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { Garment } from '@/types';
import { uid } from '@/utils';

export type IngestPhase = 'idle' | 'picking' | 'analyzing' | 'done';

export function useIngestGarment() {
  const [phase, setPhase] = React.useState<IngestPhase>('idle');
  const [lastAdded, setLastAdded] = React.useState<Garment | null>(null);

  const ingest = React.useCallback(async (source: PickSource): Promise<Garment | null> => {
    const { limits } = entitlementSnapshot();
    if (useWardrobeStore.getState().garments.length >= limits.closetPieces) {
      if (useProfileStore.getState().onboardingCompleted) router.push('/paywall?reason=closet' as never);
      else toast(`free closet holds ${limits.closetPieces} pieces — that’s plenty to start`, 'lemon', 'hanger');
      return null;
    }
    setPhase('picking');
    const picked = await pickImage(source);
    if (!picked) {
      setPhase('idle');
      return null;
    }
    setPhase('analyzing');
    try {
      const id = uid();
      const { originalUri, thumbUri } = await storeGarmentPhoto(picked, id);

      let garment: Garment;
      if (isConfigured()) {
        const a = await analyzeGarment(originalUri);
        if (!a.isClothing) {
          toast("that doesn't look like clothes 👀 try another shot", 'punch', 'x');
          setPhase('idle');
          return null;
        }
        garment = {
          id, category: a.category, name: a.name, colors: a.colors, styleTags: a.styleTags,
          warmth: a.warmth, formality: a.formality, description: a.description,
          originalUri, thumbUri, createdAt: Date.now(), isArchived: false,
        };
      } else {
        garment = {
          id, category: 'top', name: 'new item', colors: [], styleTags: [],
          warmth: 3, formality: 2, description: 'untagged item — add a gemini key for auto-tagging',
          originalUri, thumbUri, createdAt: Date.now(), isArchived: false,
        };
        toast('saved! ai tagging is off — add a key in .env', 'lemon', 'sparkle');
      }

      await useWardrobeStore.getState().add(garment);
      queueEnhancement(garment.id);
      setLastAdded(garment);
      setPhase('done');
      return garment;
    } catch (e) {
      toast(friendlyError(e), 'punch', 'x');
      setPhase('idle');
      return null;
    }
  }, []);

  return { phase, lastAdded, ingest, reset: () => setPhase('idle') };
}
