import { NPC } from '@/types/game';
import { cn } from '@/lib/utils';
import { User, Shield, Skull, Handshake, Heart } from 'lucide-react';

interface CharacterCardProps {
  npc: NPC;
  compact?: boolean;
  showRelationship?: boolean;
  relationshipValue?: number;
}

const factionIcons = {
  administrators: Shield,
  bloodlines: Skull,
  fixers: Handshake,
  reformists: Heart,
};

const factionLabels = {
  administrators: 'The Administrators',
  bloodlines: 'The Bloodlines',
  fixers: 'The Fixers',
  reformists: 'The Reformists',
};

export function CharacterCard({ npc, compact = false, showRelationship = false, relationshipValue = 0 }: CharacterCardProps) {
  const FactionIcon = factionIcons[npc.faction];

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/30">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          `faction-${npc.faction}`
        )}>
          <User className="w-5 h-5" />
        </div>
        <div>
          <p className="font-medium text-foreground">{npc.name}</p>
          <p className="text-sm text-muted-foreground">{npc.title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-lg bg-card border border-border/50 space-y-4">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={cn(
          "w-16 h-16 rounded-lg flex items-center justify-center",
          `faction-${npc.faction}`
        )}>
          <User className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-xl text-foreground">{npc.name}</h3>
          <p className="text-muted-foreground">{npc.title}</p>
          <div className={cn(
            "inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded text-xs border",
            `faction-${npc.faction}`
          )}>
            <FactionIcon className="w-3 h-3" />
            <span>{factionLabels[npc.faction]}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="font-narrative text-foreground/80 leading-relaxed">
        {npc.description}
      </p>

      {/* Personality Traits */}
      <div className="flex flex-wrap gap-2">
        {npc.personality.map((trait) => (
          <span 
            key={trait}
            className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground"
          >
            {trait}
          </span>
        ))}
      </div>

      {/* Relationship Meter */}
      {showRelationship && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Relationship</span>
            <span>{relationshipValue > 0 ? '+' : ''}{relationshipValue}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                relationshipValue >= 0 ? "bg-faction-reformists" : "bg-destructive"
              )}
              style={{ 
                width: `${Math.abs(relationshipValue)}%`,
                marginLeft: relationshipValue < 0 ? 'auto' : 0,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
