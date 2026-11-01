import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import type { Settings } from '../types';
import { DEFAULT_SETTINGS } from '../types';

interface SettingsContextValue {
  settings: Settings;
  loading: boolean;
  reload: () => Promise<void>;
  updateSettings: (patch: Partial<Settings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (!error && data) {
        setSettings({ ...DEFAULT_SETTINGS, ...data } as Settings);
      }
    } catch {
      // keep defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const updateSettings = useCallback(async (patch: Partial<Settings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('settings').upsert({ id: 1, ...next });
      } catch {
        // ignore
      }
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, reload, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
