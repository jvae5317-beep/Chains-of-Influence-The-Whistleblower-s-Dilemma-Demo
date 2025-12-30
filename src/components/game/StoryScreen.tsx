import { useState, useEffect } from 'react';
import { Scene, Choice, NPC } from '@/types/game';
import { CharacterCard } from './CharacterCard';
import { cn } from '@/lib/utils';

interface StoryScreenProps {
  scene: Scene;
  onChoice: (choice: Choice) => void;
}

export function StoryScreen({ scene, onChoice }: StoryScreenProps) {
  const [visibleParagraphs, setVisibleParagraphs] = useState<number>(0);
  const [visibleDialogue, setVisibleDialogue] = useState<number>(0);
  const [showChoices, setShowChoices] = useState(false);
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null);

  // Reset and animate content when scene changes
  useEffect(() => {
    setVisibleParagraphs(0);
    setVisibleDialogue(0);
    setShowChoices(false);

    const narrativeCount = scene.narrative.length;
    const dialogueCount = scene.dialogue?.length ?? 0;

    // Reveal narrative paragraphs
    let currentPara = 0;
    const paraInterval = setInterval(() => {
      currentPara++;
      setVisibleParagraphs(currentPara);
      if (currentPara >= narrativeCount) {
        clearInterval(paraInterval);
        
        // Then reveal dialogue
        let currentDialogue = 0;
        const dialogueInterval = setInterval(() => {
          currentDialogue++;
          setVisibleDialogue(currentDialogue);
          if (currentDialogue >= dialogueCount) {
            clearInterval(dialogueInterval);
            // Show choices after a brief pause
            setTimeout(() => setShowChoices(true), 400);
          }
        }, 600);

        if (dialogueCount === 0) {
          setTimeout(() => setShowChoices(true), 400);
        }
      }
    }, 800);

    return () => clearInterval(paraInterval);
  }, [scene.id]);

  const ambianceStyles = {
    calm: 'border-l-muted-foreground/30',
    tense: 'border-l-accent/50',
    urgent: 'border-l-destructive/50',
    dark: 'border-l-primary/30',
    hopeful: 'border-l-faction-reformists/50',
  };

  return (
    <div className="scene-transition space-y-8">
      {/* Scene Header */}
      <header className="space-y-2">
        <p className="text-muted-foreground text-sm tracking-widest uppercase">
          {scene.location}
        </p>
        <h1 className="font-narrative text-3xl md:text-4xl text-foreground text-glow">
          {scene.title}
        </h1>
      </header>

      {/* Speaker Card */}
      {scene.speaker && visibleParagraphs >= scene.narrative.length && (
        <div className="fade-in">
          <CharacterCard npc={scene.speaker} compact />
        </div>
      )}

      {/* Narrative Content */}
      <div className={cn(
        "space-y-4 border-l-2 pl-6",
        ambianceStyles[scene.ambiance]
      )}>
        {scene.narrative.slice(0, visibleParagraphs).map((paragraph, index) => (
          <p 
            key={index}
            className="font-narrative text-lg md:text-xl text-foreground/90 leading-relaxed fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Dialogue */}
      {scene.dialogue && visibleDialogue > 0 && (
        <div className="space-y-3 pl-4 border-l-2 border-primary/40">
          {scene.dialogue.slice(0, visibleDialogue).map((line, index) => (
            <p 
              key={index}
              className={cn(
                "font-narrative text-lg italic text-primary/90 fade-in",
                line.startsWith('"') && "not-italic font-medium"
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {line}
            </p>
          ))}
        </div>
      )}

      {/* Choices */}
      {showChoices && (
        <div className="space-y-3 pt-6 fade-in">
          <p className="text-muted-foreground text-sm tracking-wide uppercase mb-4">
            What do you do?
          </p>
          {scene.choices.map((choice, index) => (
            <button
              key={choice.id}
              onClick={() => onChoice(choice)}
              onMouseEnter={() => setHoveredChoice(choice.id)}
              onMouseLeave={() => setHoveredChoice(null)}
              className={cn(
                "choice-button w-full text-left p-4 rounded-lg",
                "border border-border/50 bg-card/50",
                "hover:border-primary/50 hover:bg-card",
                "transition-all duration-300",
                "group"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-3">
                <span className="text-primary font-mono text-sm opacity-50 group-hover:opacity-100 transition-opacity">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <p className="text-foreground group-hover:text-primary transition-colors">
                    {choice.text}
                  </p>
                  {choice.flavorText && hoveredChoice === choice.id && (
                    <p className="text-sm text-muted-foreground mt-1 italic fade-in">
                      {choice.flavorText}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
