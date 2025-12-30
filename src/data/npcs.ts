import { NPC } from '@/types/game';

export const NPCS: Record<string, NPC> = {
  maria_santos: {
    id: 'maria_santos',
    name: 'Maria Santos',
    title: 'Investigative Journalist',
    faction: 'reformists',
    description: 'A fearless reporter with the Manila Tribune who has spent years documenting government corruption. Her sources are impeccable, but her idealism makes her a target.',
    disposition: 'friendly',
    personality: ['idealistic', 'tenacious', 'careful'],
  },
  governor_reyes: {
    id: 'governor_reyes',
    name: 'Governor Eduardo Reyes',
    title: 'Provincial Governor',
    faction: 'bloodlines',
    description: 'Third-generation politician whose family has controlled the province since martial law. Charming in public, ruthless in private. His land development deals have made him untouchable.',
    disposition: 'wary',
    personality: ['charismatic', 'calculating', 'ruthless'],
  },
  atty_cruz: {
    id: 'atty_cruz',
    name: 'Atty. Vicente Cruz',
    title: 'Political Fixer',
    faction: 'fixers',
    description: 'A lawyer who stopped practicing law decades ago to practice something more lucrative: making problems disappear. He knows where every body is buried because he dug most of the graves.',
    disposition: 'neutral',
    personality: ['pragmatic', 'secretive', 'opportunistic'],
  },
  director_mendoza: {
    id: 'director_mendoza',
    name: 'Director Ramon Mendoza',
    title: 'Bureau of Land Development',
    faction: 'administrators',
    description: 'A career bureaucrat who has survived six administrations by knowing when to look the other way. His signature appears on documents that have made many people very rich.',
    disposition: 'neutral',
    personality: ['cautious', 'meticulous', 'self-preserving'],
  },
  player: {
    id: 'player',
    name: 'You',
    title: 'Political Consultant',
    faction: 'fixers',
    description: 'A political consultant who has walked the line between factions for years. Known for discretion and results, you exist in the gray spaces where deals are made.',
    disposition: 'neutral',
    personality: ['adaptable', 'perceptive', 'pragmatic'],
  },
};
