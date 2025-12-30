import { GameState } from '@/types/game';
import { cn } from '@/lib/utils';
import { 
  Zap, Eye, Scale, Shield, Skull, Handshake, Heart,
  ChevronRight, Clock
} from 'lucide-react';

interface StatusDashboardProps {
  gameState: GameState;
  collapsed?: boolean;
  onToggle?: () => void;
}

const factionConfig = {
  administrators: { icon: Shield, label: 'Administrators', color: 'text-faction-administrators' },
  bloodlines: { icon: Skull, label: 'Bloodlines', color: 'text-faction-bloodlines' },
  fixers: { icon: Handshake, label: 'Fixers', color: 'text-faction-fixers' },
  reformists: { icon: Heart, label: 'Reformists', color: 'text-faction-reformists' },
};

const resourceConfig = {
  influence: { icon: Zap, label: 'Influence', color: 'text-resource-influence' },
  exposure: { icon: Eye, label: 'Exposure', color: 'text-resource-exposure' },
  morality: { icon: Scale, label: 'Morality', color: 'text-resource-morality' },
};

function formatPlaytime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function StatusDashboard({ gameState, collapsed = false, onToggle }: StatusDashboardProps) {
  if (collapsed) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-0 top-1/2 -translate-y-1/2 p-2 bg-card border border-border/50 rounded-l-lg hover:bg-secondary transition-colors z-40"
      >
        <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180" />
      </button>
    );
  }

  return (
    <aside className="w-72 bg-card/50 border-l border-border/50 p-6 space-y-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
          Status
        </h2>
        {onToggle && (
          <button onClick={onToggle} className="p-1 hover:bg-muted rounded">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Playtime */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>{formatPlaytime(gameState.playtimeSeconds)}</span>
      </div>

      {/* Resources */}
      <section className="space-y-4">
        <h3 className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
          Resources
        </h3>
        <div className="space-y-3">
          {Object.entries(resourceConfig).map(([key, config]) => {
            const value = gameState.resources[key as keyof typeof gameState.resources];
            const Icon = config.icon;
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className={cn("w-4 h-4", config.color)} />
                    <span className="text-foreground/80">{config.label}</span>
                  </div>
                  <span className={cn("font-mono", config.color)}>{value}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      key === 'influence' && "bg-resource-influence",
                      key === 'exposure' && "bg-resource-exposure",
                      key === 'morality' && "bg-resource-morality"
                    )}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Faction Reputation */}
      <section className="space-y-4">
        <h3 className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
          Factions
        </h3>
        <div className="space-y-3">
          {Object.entries(factionConfig).map(([key, config]) => {
            const value = gameState.factionReputation[key as keyof typeof gameState.factionReputation];
            const Icon = config.icon;
            const displayValue = value > 0 ? `+${value}` : value.toString();
            return (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={cn("w-4 h-4", config.color)} />
                  <span className="text-sm text-foreground/80">{config.label}</span>
                </div>
                <span className={cn(
                  "font-mono text-sm",
                  value > 0 && "text-faction-reformists",
                  value < 0 && "text-destructive",
                  value === 0 && "text-muted-foreground"
                )}>
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Favor Debts */}
      {(gameState.favorDebts.owedByPlayer.length > 0 || gameState.favorDebts.owedToPlayer.length > 0) && (
        <section className="space-y-4">
          <h3 className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
            Utang na Loob
          </h3>
          
          {gameState.favorDebts.owedToPlayer.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-faction-reformists">Owed to you:</p>
              {gameState.favorDebts.owedToPlayer.map((debt) => (
                <div 
                  key={debt.id}
                  className="p-2 rounded bg-faction-reformists/10 border border-faction-reformists/20 text-xs"
                >
                  <p className="font-medium text-foreground">{debt.npcName}</p>
                  <p className="text-muted-foreground">{debt.description}</p>
                </div>
              ))}
            </div>
          )}

          {gameState.favorDebts.owedByPlayer.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-destructive">You owe:</p>
              {gameState.favorDebts.owedByPlayer.map((debt) => (
                <div 
                  key={debt.id}
                  className="p-2 rounded bg-destructive/10 border border-destructive/20 text-xs"
                >
                  <p className="font-medium text-foreground">{debt.npcName}</p>
                  <p className="text-muted-foreground">{debt.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Choices Made Count */}
      <section className="pt-4 border-t border-border/30">
        <p className="text-xs text-muted-foreground">
          Choices made: <span className="text-foreground">{gameState.choicesMade.length}</span>
        </p>
      </section>
    </aside>
  );
}
