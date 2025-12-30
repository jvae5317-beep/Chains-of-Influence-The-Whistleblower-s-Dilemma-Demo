import { useState, useCallback, useEffect } from 'react';
import { GameState, Scene, Choice, ChoiceEffect, FavorDebt, GameSave, INITIAL_GAME_STATE } from '@/types/game';
import { SCENES } from '@/data/scenes';
import { DOCUMENTS } from '@/data/documents';
import { supabase } from '@/integrations/supabase/client';

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentSaveId, setCurrentSaveId] = useState<string | null>(null);

  // Track playtime
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        playtimeSeconds: prev.playtimeSeconds + 1,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  const getCurrentScene = useCallback((): Scene | null => {
    return SCENES[gameState.currentScene] ?? null;
  }, [gameState.currentScene]);

  const applyEffect = useCallback((effect: ChoiceEffect, state: GameState): GameState => {
    const newState = { ...state };

    switch (effect.type) {
      case 'faction':
        newState.factionReputation = {
          ...newState.factionReputation,
          [effect.target]: Math.max(-100, Math.min(100, 
            newState.factionReputation[effect.target as keyof typeof newState.factionReputation] + (effect.value as number)
          )),
        };
        break;

      case 'resource':
        newState.resources = {
          ...newState.resources,
          [effect.target]: Math.max(0, Math.min(100, 
            newState.resources[effect.target as keyof typeof newState.resources] + (effect.value as number)
          )),
        };
        break;

      case 'flag':
        newState.gameFlags = {
          ...newState.gameFlags,
          [effect.target]: effect.value as boolean | string | number,
        };
        break;

      case 'favor_gain':
        const favorData = effect.value as FavorDebt;
        newState.favorDebts = {
          ...newState.favorDebts,
          owedToPlayer: [...newState.favorDebts.owedToPlayer, favorData],
        };
        break;

      case 'favor_debt':
        const debtData = effect.value as FavorDebt;
        newState.favorDebts = {
          ...newState.favorDebts,
          owedByPlayer: [...newState.favorDebts.owedByPlayer, debtData],
        };
        break;
    }

    return newState;
  }, []);

  const makeChoice = useCallback((choice: Choice) => {
    setGameState(prev => {
      let newState = { ...prev };

      // Apply all effects
      for (const effect of choice.effects) {
        newState = applyEffect(effect, newState);
      }

      // Unlock any documents from current scene
      const currentScene = SCENES[prev.currentScene];
      if (currentScene?.documents) {
        const newDocs = currentScene.documents.filter(
          docId => !newState.unlockedDocuments.includes(docId)
        );
        newState.unlockedDocuments = [...newState.unlockedDocuments, ...newDocs];
      }

      // Record the choice
      newState.choicesMade = [
        ...newState.choicesMade,
        { sceneId: prev.currentScene, choiceId: choice.id },
      ];

      // Move to next scene
      newState.currentScene = choice.nextScene;

      return newState;
    });
  }, [applyEffect]);

  const newGame = useCallback(() => {
    setGameState(INITIAL_GAME_STATE);
    setCurrentSaveId(null);
  }, []);

  const saveGame = useCallback(async (slotNumber: number, saveName: string): Promise<boolean> => {
    if (!userId) return false;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('game_saves')
        .upsert({
          user_id: userId,
          slot_number: slotNumber,
          save_name: saveName,
          current_scene: gameState.currentScene,
          choices_made: JSON.parse(JSON.stringify(gameState.choicesMade)),
          faction_reputation: JSON.parse(JSON.stringify(gameState.factionReputation)),
          favor_debts: JSON.parse(JSON.stringify({
            owed_by_player: gameState.favorDebts.owedByPlayer,
            owed_to_player: gameState.favorDebts.owedToPlayer,
          })),
          resources: JSON.parse(JSON.stringify(gameState.resources)),
          unlocked_documents: JSON.parse(JSON.stringify(gameState.unlockedDocuments)),
          game_flags: JSON.parse(JSON.stringify(gameState.gameFlags)),
          playtime_seconds: gameState.playtimeSeconds,
        })
        .select()
        .single();

      if (error) throw error;
      setCurrentSaveId(data.id);
      return true;
    } catch (err) {
      console.error('Save failed:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userId, gameState]);

  const loadGame = useCallback(async (saveId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('game_saves')
        .select('*')
        .eq('id', saveId)
        .single();

      if (error) throw error;

      const favorDebts = data.favor_debts as unknown as { owed_by_player?: FavorDebt[], owed_to_player?: FavorDebt[] };
      
      setGameState({
        currentScene: data.current_scene,
        choicesMade: data.choices_made as unknown as { sceneId: string; choiceId: string }[],
        factionReputation: data.faction_reputation as unknown as GameState['factionReputation'],
        favorDebts: {
          owedByPlayer: favorDebts.owed_by_player ?? [],
          owedToPlayer: favorDebts.owed_to_player ?? [],
        },
        resources: data.resources as unknown as GameState['resources'],
        unlockedDocuments: data.unlocked_documents as unknown as string[],
        gameFlags: data.game_flags as unknown as Record<string, boolean | string | number>,
        playtimeSeconds: data.playtime_seconds,
      });
      setCurrentSaveId(data.id);
      return true;
    } catch (err) {
      console.error('Load failed:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSaves = useCallback(async (): Promise<GameSave[]> => {
    if (!userId) return [];
    
    try {
      const { data, error } = await supabase
        .from('game_saves')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      return data.map(save => {
        const favorDebts = save.favor_debts as unknown as { owed_by_player?: FavorDebt[], owed_to_player?: FavorDebt[] };
        return {
          id: save.id,
          userId: save.user_id,
          saveName: save.save_name,
          slotNumber: save.slot_number,
          currentScene: save.current_scene,
          choicesMade: save.choices_made as unknown as { sceneId: string; choiceId: string }[],
          factionReputation: save.faction_reputation as unknown as GameState['factionReputation'],
          favorDebts: {
            owedByPlayer: favorDebts.owed_by_player ?? [],
            owedToPlayer: favorDebts.owed_to_player ?? [],
          },
          resources: save.resources as unknown as GameState['resources'],
          unlockedDocuments: save.unlocked_documents as unknown as string[],
          gameFlags: save.game_flags as unknown as Record<string, boolean | string | number>,
          playtimeSeconds: save.playtime_seconds,
          createdAt: save.created_at,
          updatedAt: save.updated_at,
        };
      });
    } catch (err) {
      console.error('Failed to get saves:', err);
      return [];
    }
  }, [userId]);

  const getDocument = useCallback((docId: string) => {
    return DOCUMENTS[docId] ?? null;
  }, []);

  return {
    gameState,
    getCurrentScene,
    makeChoice,
    newGame,
    saveGame,
    loadGame,
    getSaves,
    getDocument,
    isLoading,
    userId,
    currentSaveId,
  };
}
