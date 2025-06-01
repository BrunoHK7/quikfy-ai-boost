
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface AutoSaveOptions {
  data: any;
  key: string;
  debounceMs?: number;
  enabled?: boolean;
}

export const useAutoSave = ({ data, key, debounceMs = 3000, enabled = true }: AutoSaveOptions) => {
  const { user } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<string>('');
  const isInitialLoadRef = useRef(true);
  const isMountedRef = useRef(true);

  const saveData = useCallback(async (dataToSave: any) => {
    if (!user || !enabled || !isMountedRef.current) return;

    try {
      const dataString = JSON.stringify(dataToSave);
      
      // Evita salvar se os dados não mudaram
      if (dataString === lastSavedDataRef.current) return;

      // Evita salvar no carregamento inicial da página
      if (isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
        lastSavedDataRef.current = dataString;
        return;
      }

      const { error } = await supabase
        .from('carousel_projects')
        .upsert({
          user_id: user.id,
          title: `${key}_autosave`,
          content: dataString
        }, {
          onConflict: 'user_id,title',
          ignoreDuplicates: false
        });

      if (!error && isMountedRef.current) {
        lastSavedDataRef.current = dataString;
        console.log('✅ Auto-save realizado');
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error('❌ Erro no auto-save:', error);
      }
    }
  }, [user, key, enabled]);

  const loadSavedData = useCallback(async () => {
    if (!user || !enabled || !isMountedRef.current) return null;

    try {
      const { data: savedData, error } = await supabase
        .from('carousel_projects')
        .select('content, created_at')
        .eq('user_id', user.id)
        .eq('title', `${key}_autosave`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !savedData || !isMountedRef.current) return null;

      const parsedData = JSON.parse(savedData.content);
      lastSavedDataRef.current = savedData.content;
      return parsedData;
    } catch (error) {
      if (isMountedRef.current) {
        console.error('❌ Erro ao carregar dados salvos:', error);
      }
      return null;
    }
  }, [user, key, enabled]);

  // Auto-save estável sem re-execuções desnecessárias
  useEffect(() => {
    if (!enabled || !data || isInitialLoadRef.current || !isMountedRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        saveData(data);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debounceMs, enabled]); // Removido saveData das dependências para evitar re-execuções

  // Cleanup no unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { loadSavedData };
};
