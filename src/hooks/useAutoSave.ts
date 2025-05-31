
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface AutoSaveOptions {
  data: any;
  key: string;
  debounceMs?: number;
  enabled?: boolean;
}

export const useAutoSave = ({ data, key, debounceMs = 2000, enabled = true }: AutoSaveOptions) => {
  const { user } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<string>('');

  const saveData = useCallback(async (dataToSave: any) => {
    if (!user || !enabled) return;

    try {
      const dataString = JSON.stringify(dataToSave);
      
      // Evita salvar se os dados não mudaram
      if (dataString === lastSavedDataRef.current) return;

      const { error } = await supabase
        .from('carousel_projects')
        .upsert({
          user_id: user.id,
          title: `${key}_autosave_${Date.now()}`,
          content: dataString
        }, {
          onConflict: 'user_id,title',
          ignoreDuplicates: false
        });

      if (!error) {
        lastSavedDataRef.current = dataString;
        console.log('✅ Auto-save realizado com sucesso');
      }
    } catch (error) {
      console.error('❌ Erro no auto-save:', error);
    }
  }, [user, key, enabled]);

  const loadSavedData = useCallback(async () => {
    if (!user || !enabled) return null;

    try {
      const { data: savedData, error } = await supabase
        .from('carousel_projects')
        .select('content, created_at')
        .eq('user_id', user.id)
        .like('title', `${key}_autosave_%`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !savedData) return null;

      const parsedData = JSON.parse(savedData.content);
      lastSavedDataRef.current = savedData.content;
      return parsedData;
    } catch (error) {
      console.error('❌ Erro ao carregar dados salvos:', error);
      return null;
    }
  }, [user, key, enabled]);

  // Auto-save com debounce
  useEffect(() => {
    if (!enabled || !data) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveData(data);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveData, debounceMs, enabled]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { loadSavedData };
};
